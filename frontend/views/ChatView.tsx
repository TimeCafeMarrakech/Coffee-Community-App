import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Mic, MicOff } from 'lucide-react';
import { GoogleGenAI, Chat, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { menuItems } from '../data';
import { Product } from '../types';

interface ChatViewProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onRequestService: (service: string, table: string) => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

// --- Audio Helper Functions ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- AI Configuration ---
const SYSTEM_INSTRUCTION = `You are Ammi Driss, a jolly, polite, and hospitable Moroccan virtual waiter and storyteller at TIME Coffee in Marrakech. 
You can take orders directly from customers and add items to their cart using the 'add_to_cart' tool.
Menu: Oat Milk Latte (45 MAD), Iced Lavender Latte (55 MAD), Cortado (35 MAD), Ceremonial Iced Matcha (65 MAD), Strawberry Matcha Latte (70 MAD), Butter Croissant (25 MAD), Opéra Cake Slice (55 MAD), Valrhona Fudge Brownie (40 MAD).
You can also request table service (like bringing water, calling a human waiter, or cleaning the table) using the 'request_table_service' tool. Always ask for their table number if they haven't provided it before requesting the service.
Keep your answers concise, warm, and infused with Moroccan charm (use words like 'Marhaba', 'Khoya', 'Bessaha').`;

const addToCartDeclaration: FunctionDeclaration = {
  name: 'add_to_cart',
  description: 'Add a specific product from the menu to the user\'s shopping cart.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      productName: {
        type: Type.STRING,
        description: 'The exact name of the product to add (e.g., "Oat Milk Latte", "Butter Croissant").'
      },
      quantity: {
        type: Type.INTEGER,
        description: 'The number of items to add.'
      }
    },
    required: ['productName', 'quantity'],
  },
};

const requestTableServiceDeclaration: FunctionDeclaration = {
  name: 'request_table_service',
  description: 'Request a service to the customer\'s table, such as bringing water, calling a waiter, or cleaning the table.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      serviceType: {
        type: Type.STRING,
        description: 'The type of service requested (e.g., "water", "waiter", "clean", "top-up").'
      },
      tableNumber: {
        type: Type.STRING,
        description: 'The table number of the customer.'
      }
    },
    required: ['serviceType', 'tableNumber'],
  },
};

export const ChatView: React.FC<ChatViewProps> = ({ isOpen, onClose, onAddToCart, onRequestService }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const liveSessionRef = useRef<any>(null);

  // Helper to process tool calls
  const handleToolCall = (name: string, args: any) => {
    if (name === 'add_to_cart') {
      const searchTerm = args.productName.toLowerCase();
      const product = menuItems.find(p => p.name.toLowerCase().includes(searchTerm));
      
      if (product) {
        const qty = args.quantity || 1;
        onAddToCart(product, qty);
        return `Success: Added ${qty} ${product.name} to the cart.`;
      } else {
        return `Error: Product '${args.productName}' not found on the menu.`;
      }
    } else if (name === 'request_table_service') {
      onRequestService(args.serviceType, args.tableNumber);
      return `Success: Requested ${args.serviceType} for Table ${args.tableNumber}. A staff member will be there shortly.`;
    }
    return 'Error: Unknown function.';
  };

  // Initialize Text Chat
  useEffect(() => {
    if (isOpen && !chatInstance) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
        const newChat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { 
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ functionDeclarations: [addToCartDeclaration, requestTableServiceDeclaration] }]
          }
        });
        setChatInstance(newChat);
        setMessages([
          {
            id: 'welcome',
            text: "Marhaba! I am Ammi Driss, your virtual waiter. Welcome to TIME! How can I help you today, my friend? Want to hear a story, order some delicious coffee, or need some water for your table?",
            isUser: false
          }
        ]);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    }
  }, [isOpen, chatInstance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceChat();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendText = async () => {
    if (!input.trim() || !chatInstance || isVoiceActive) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userText, isUser: true }]);
    setIsLoading(true);

    try {
      let response = await chatInstance.sendMessage({ message: userText });

      // Handle potential function calls in text chat
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          const result = handleToolCall(fc.name, fc.args);
          // Send the result back to the model so it can generate a final text response
          response = await chatInstance.sendMessage({ 
            message: `[System: Tool ${fc.name} executed. Result: ${result}. Please confirm this with the user.]` 
          });
        }
      }

      if (response.text) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: response.text, isUser: false }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: "Oh, my apologies! My old ears didn't catch that. Could you repeat?", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const stopVoiceChat = () => {
    if (liveSessionRef.current) {
      const { sessionPromise, inputAudioContext, outputAudioContext, stream, scriptProcessor, source, sources } = liveSessionRef.current;
      
      if (sessionPromise) {
          sessionPromise.then((session: any) => session.close()).catch(() => {});
      }
      if (scriptProcessor && source) {
          try {
            source.disconnect(scriptProcessor);
            scriptProcessor.disconnect(inputAudioContext.destination);
          } catch (e) {}
      }
      if (sources) {
          for (const s of sources.values()) {
              try { s.stop(); } catch(e) {}
          }
          sources.clear();
      }
      if (inputAudioContext) inputAudioContext.close();
      if (outputAudioContext) outputAudioContext.close();
      if (stream) stream.getTracks().forEach((track: any) => track.stop());
      
      liveSessionRef.current = null;
    }
    setIsVoiceActive(false);
  };

  const startVoiceChat = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveSessionRef.current = { stream }; // Store immediately to allow stopping

      let nextStartTime = 0;
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);
      const sources = new Set<AudioBufferSourceNode>();

      const ai = new GoogleGenAI({apiKey: process.env.API_KEY, vertexai: true});

      let currentInputTranscription = '';
      let currentOutputTranscription = '';
      let scriptProcessor: ScriptProcessorNode;
      let source: MediaStreamAudioSourceNode;

      const sessionPromise = ai.live.connect({
        model: 'gemini-live-2.5-flash-native-audio',
        callbacks: {
          onopen: () => {
            setIsVoiceActive(true);
            source = inputAudioContext.createMediaStreamSource(stream);
            scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            liveSessionRef.current = {
              sessionPromise,
              inputAudioContext,
              outputAudioContext,
              stream,
              scriptProcessor,
              source,
              sources
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Tool Calls (Virtual Waiter adding to cart or requesting service)
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                const result = handleToolCall(fc.name, fc.args);
                sessionPromise.then((session) => {
                  session.sendToolResponse({
                    functionResponses: {
                      id: fc.id,
                      name: fc.name,
                      response: { result: result },
                    }
                  });
                });
              }
            }

            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              currentInputTranscription += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const fullInput = currentInputTranscription;
              const fullOutput = currentOutputTranscription;

              if (fullInput || fullOutput) {
                setMessages(prev => {
                  const newMsgs = [...prev];
                  if (fullInput) newMsgs.push({ id: Date.now().toString() + '-in', text: fullInput, isUser: true });
                  if (fullOutput) newMsgs.push({ id: Date.now().toString() + '-out', text: fullOutput, isUser: false });
                  return newMsgs;
                });
              }
              currentInputTranscription = '';
              currentOutputTranscription = '';
            }

            // Handle Audio Playback
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                outputAudioContext,
                24000,
                1,
              );
              const audioSource = outputAudioContext.createBufferSource();
              audioSource.buffer = audioBuffer;
              audioSource.connect(outputNode);
              audioSource.addEventListener('ended', () => {
                sources.delete(audioSource);
              });

              audioSource.start(nextStartTime);
              nextStartTime = nextStartTime + audioBuffer.duration;
              sources.add(audioSource);
            }

            if (message.serverContent?.interrupted) {
              for (const s of sources.values()) {
                s.stop();
                sources.delete(s);
              }
              nextStartTime = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            stopVoiceChat();
          },
          onclose: () => {
            stopVoiceChat();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Zephyr'}},
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ functionDeclarations: [addToCartDeclaration, requestTableServiceDeclaration] }],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
      });

    } catch (err) {
      console.error("Failed to start voice chat", err);
      stopVoiceChat();
    }
  };

  const toggleVoiceChat = async () => {
    if (isVoiceActive) {
      stopVoiceChat();
    } else {
      await startVoiceChat();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-base flex flex-col"
        >
          {/* Header */}
          <header className="bg-walnut text-pure px-6 pt-12 pb-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1533628635777-112b2239b1c7?auto=format&fit=crop&w=100&q=80" 
                  alt="Ammi Driss" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-saffron"
                />
                {isVoiceActive && (
                  <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-terracotta"></span>
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg leading-tight">Ammi Driss</h2>
                <p className="text-saffron text-xs font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  {isVoiceActive ? 'Listening...' : 'Online'}
                </p>
              </div>
            </div>
            <button onClick={() => { stopVoiceChat(); onClose(); }} className="p-2 bg-pure/10 rounded-full hover:bg-pure/20 transition-colors">
              <X size={20} />
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-linen">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.isUser 
                    ? 'bg-terracotta text-pure rounded-tr-sm' 
                    : 'bg-pure text-walnut shadow-sm border border-walnut/5 rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && !isVoiceActive && (
              <div className="flex justify-start">
                <div className="bg-pure text-walnut shadow-sm border border-walnut/5 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-saffron" />
                  <span className="text-xs text-walnut/60">Ammi Driss is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-pure border-t border-walnut/5 pb-safe">
            <div className="flex items-center gap-2 bg-linen rounded-full p-1 border border-walnut/10">
              <button 
                onClick={toggleVoiceChat}
                className={`p-2.5 rounded-full transition-all ${isVoiceActive ? 'bg-terracotta text-pure animate-pulse shadow-md' : 'bg-walnut/10 text-walnut hover:bg-walnut/20'}`}
              >
                {isVoiceActive ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                placeholder={isVoiceActive ? "Speak to Ammi Driss..." : "Ask Ammi Driss..."}
                disabled={isVoiceActive}
                className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none text-walnut placeholder:text-walnut/40 disabled:opacity-50"
              />
              <button 
                onClick={handleSendText}
                disabled={!input.trim() || isLoading || isVoiceActive}
                className="p-2.5 bg-walnut text-saffron rounded-full disabled:opacity-50 transition-opacity"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
