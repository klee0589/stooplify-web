import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User as UserIcon, Loader2, MessageCircle, X, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTranslation } from '../components/translations';
import ReactMarkdown from 'react-markdown';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const t = useTranslation(language);

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
        }
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user || !isOpen) return;

    const initChat = async () => {
      try {
        const conversations = await base44.agents.listConversations({
          agent_name: 'support_assistant'
        });
        
        if (conversations.length > 0) {
          const conv = await base44.agents.getConversation(conversations[0].id);
          setConversation(conv);
          setMessages(conv.messages || []);
        } else {
          const newConv = await base44.agents.createConversation({
            agent_name: 'support_assistant',
            metadata: {
              name: language === 'es' ? 'Chat de Soporte' : 'Support Chat',
              language: language
            }
          });
          setConversation(newConv);
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initChat();
  }, [user, isOpen, language]);

  useEffect(() => {
    if (!conversation?.id) return;

    const unsubscribe = base44.agents.subscribeToConversation(
      conversation.id,
      (data) => {
        setMessages(data.messages || []);
        setIsLoading(false);
        
        // Update unread count if minimized or closed
        if (isMinimized || !isOpen) {
          const lastMessage = data.messages?.[data.messages.length - 1];
          if (lastMessage?.role === 'assistant') {
            setUnreadCount(prev => prev + 1);
          }
        }
        
        scrollToBottom();
      }
    );

    return unsubscribe;
  }, [conversation?.id, isMinimized, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversation || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: userMessage
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpen = () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpen}
            className="fixed z-50 w-16 h-16 bg-[#14B8FF] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#0da3e6] transition-colors"
            style={{ 
              bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
              right: 'calc(1.5rem + env(safe-area-inset-right))'
            }}
          >
            <MessageCircle className="w-7 h-7" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ 
              marginBottom: 'calc(env(safe-area-inset-bottom))',
              marginRight: 'calc(env(safe-area-inset-right))'
            }}
          >
            {/* Header */}
            <div className="bg-[#14B8FF] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'es' ? 'Chat de Soporte' : 'Support Chat'}
                  </h3>
                  <p className="text-xs text-white/80">
                    {language === 'es' ? 'Siempre en línea' : 'Always online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={isMinimized ? handleMaximize : handleMinimize}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <Bot className="w-12 h-12 text-[#14B8FF] mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {language === 'es' 
                          ? '¡Hola! ¿Cómo puedo ayudarte?'
                          : 'Hi! How can I help you?'}
                      </p>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-[#14B8FF]/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-[#14B8FF]" />
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                          msg.role === 'user'
                            ? 'bg-[#14B8FF] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <ReactMarkdown
                            className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                            components={{
                              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc ml-3 mb-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-3 mb-1">{children}</ol>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-7 h-7 rounded-full bg-[#14B8FF]/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-[#14B8FF]" />
                      </div>
                      <div className="bg-gray-100 rounded-xl px-3 py-2">
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-3 bg-gray-50">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={language === 'es' ? 'Escribe...' : 'Type...'}
                      className="flex-1 text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="bg-[#14B8FF] hover:bg-[#0da3e6]"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}