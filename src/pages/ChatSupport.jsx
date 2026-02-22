import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User as UserIcon, Loader2, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { useTranslation } from '../components/translations';
import ReactMarkdown from 'react-markdown';

export default function ChatSupport() {
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
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
    const initChat = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          
          // Load or create conversation
          const conversations = await base44.agents.listConversations({
            agent_name: 'support_assistant'
          });
          
          if (conversations.length > 0) {
            // Load most recent conversation
            const conv = await base44.agents.getConversation(conversations[0].id);
            setConversation(conv);
            setMessages(conv.messages || []);
          } else {
            // Create new conversation
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
        } else {
          // Redirect to login
          base44.auth.redirectToLogin();
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast.error('Failed to load chat');
      }
    };

    initChat();
  }, [language]);

  // Subscribe to conversation updates
  useEffect(() => {
    if (!conversation?.id) return;

    const unsubscribe = base44.agents.subscribeToConversation(
      conversation.id,
      (data) => {
        setMessages(data.messages || []);
        setIsLoading(false);
        scrollToBottom();
      }
    );

    return unsubscribe;
  }, [conversation?.id]);

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

  const handleNewChat = async () => {
    try {
      const newConv = await base44.agents.createConversation({
        agent_name: 'support_assistant',
        metadata: {
          name: language === 'es' ? 'Chat de Soporte' : 'Support Chat',
          language: language
        }
      });
      setConversation(newConv);
      setMessages([]);
      toast.success(language === 'es' ? 'Nueva conversación iniciada' : 'New conversation started');
    } catch (error) {
      console.error('Failed to create new chat:', error);
      toast.error('Failed to create new chat');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-pulse">
          <MessageCircle className="w-12 h-12 text-[#14B8FF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SEO 
        title={language === 'es' ? 'Chat de Soporte - Stooplify' : 'Support Chat - Stooplify'}
        description={language === 'es' ? 'Obtén ayuda con Stooplify' : 'Get help with Stooplify'}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {language === 'es' ? 'Chat de Soporte' : 'Support Chat'}
            </h1>
            <p className="text-gray-600 mt-2">
              {language === 'es' 
                ? 'Pregúntame cualquier cosa sobre Stooplify'
                : 'Ask me anything about Stooplify'}
            </p>
          </div>
          <Button
            onClick={handleNewChat}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {language === 'es' ? 'Nuevo Chat' : 'New Chat'}
          </Button>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Messages Area */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Bot className="w-16 h-16 text-[#14B8FF] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#2E3A59] mb-2">
                    {language === 'es' ? '¡Hola! ¿Cómo puedo ayudarte?' : 'Hi! How can I help you?'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'es' 
                      ? 'Pregúntame sobre ventas de garaje, cómo listar artículos, o cualquier otra cosa.'
                      : 'Ask me about yard sales, how to list items, or anything else.'}
                  </p>
                </motion.div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[#14B8FF]/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-[#14B8FF]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#14B8FF] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <ReactMarkdown
                        className="prose prose-sm max-w-none"
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          a: ({ children, href }) => (
                            <a href={href} className="text-[#14B8FF] underline" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#FF6F61]/10 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-5 h-5 text-[#FF6F61]" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-[#14B8FF]/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-[#14B8FF]" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'es' ? 'Escribe tu mensaje...' : 'Type your message...'}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-[#14B8FF] hover:bg-[#0da3e6]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { 
              en: 'Find Sales', 
              es: 'Buscar Ventas',
              question: language === 'es' 
                ? '¿Cómo puedo encontrar ventas de garaje cerca de mí?'
                : 'How can I find yard sales near me?'
            },
            { 
              en: 'List a Sale', 
              es: 'Publicar Venta',
              question: language === 'es'
                ? '¿Cómo publico una venta de garaje?'
                : 'How do I list a yard sale?'
            },
            { 
              en: 'Pricing', 
              es: 'Precios',
              question: language === 'es'
                ? '¿Cuánto cuesta listar una venta?'
                : 'How much does it cost to list a sale?'
            },
            { 
              en: 'Help', 
              es: 'Ayuda',
              question: language === 'es'
                ? '¿Cómo funciona Stooplify?'
                : 'How does Stooplify work?'
            },
          ].map((action, idx) => (
            <Button
              key={idx}
              variant="outline"
              onClick={() => {
                setInput(action.question);
              }}
              className="text-sm"
              disabled={isLoading}
            >
              {language === 'es' ? action.es : action.en}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}