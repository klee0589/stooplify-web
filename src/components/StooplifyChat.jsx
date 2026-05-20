import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function StooplifyChat() {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const bottomRef = useRef(null);

  // Show hint bubble after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 4000);
    return () => clearTimeout(t);
  }, []);

  // Start conversation on first open
  useEffect(() => {
    if (!open || conversation) return;
    const start = async () => {
      const conv = await base44.agents.createConversation({
        agent_name: 'stooplify_assistant',
        metadata: { name: 'Support Chat' }
      });
      setConversation(conv);
      setMessages(conv.messages || []);
    };
    start();
  }, [open]);

  // Subscribe to live updates
  useEffect(() => {
    if (!conversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
      setSending(false);
    });
    return unsub;
  }, [conversation?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending || !conversation) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Hint bubble */}
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[9998] bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-[200px] text-center cursor-pointer"
            onClick={() => { setOpen(true); setShowBubble(false); }}
          >
            👋 Need help? Ask me anything!
            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 z-[9999] w-[340px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
            style={{ height: '480px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#14B8FF] rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🏷️</div>
                <div>
                  <p className="text-white font-semibold text-sm">Stooplify Assistant</p>
                  <p className="text-white/80 text-xs">Ask me anything · Hablo español</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && !sending && (
                <div className="text-center text-gray-400 text-sm mt-8">
                  <p className="text-2xl mb-2">👋</p>
                  <p>Hi! How can I help you today?</p>
                  <p className="text-xs mt-1">¡También hablo español!</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#14B8FF] text-white rounded-br-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-bl-sm">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm rounded-xl px-3 py-2 outline-none border-none placeholder-gray-400"
                disabled={sending || !conversation}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending || !conversation}
                className="w-9 h-9 bg-[#14B8FF] rounded-xl flex items-center justify-center disabled:opacity-40 transition-opacity"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setOpen(!open); setShowBubble(false); }}
        className="fixed bottom-20 right-4 z-[9998] w-14 h-14 bg-[#14B8FF] rounded-full shadow-lg flex items-center justify-center"
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-6 h-6 text-white" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MessageCircle className="w-6 h-6 text-white" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>
    </>
  );
}