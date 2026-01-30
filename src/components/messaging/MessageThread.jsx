import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle, Loader2, Volume2, VolumeX } from 'lucide-react';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

export default function MessageThread({ yardSale, seller }) {
  const [user, setUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('messageSoundEnabled') !== 'false');
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const queryClient = useQueryClient();
  const notificationSound = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    checkAuth();
    
    // Initialize notification sound
    notificationSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGi78OScTgwOUKXh8LJnHQU2jdXwyHkqBSl+zPLaizsKGGS57OihUBELTKXh8LdnHwU7k9nzw3csBS2AzvLZizYIGWm87+SaUBEMUKnh8LFoHQU3jtXwxXkrBSl9y/LajDsKGGO57Oeha');
  }, []);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', yardSale.id, user?.email],
    queryFn: async () => {
      if (!user) return [];
      
      const allMessages = await base44.entities.Message.filter({
        yard_sale_id: yardSale.id,
      }, '-created_date');
      
      // Filter messages for current conversation
      return allMessages.filter(m => 
        (m.sender_email === user.email && m.recipient_email === seller.email) ||
        (m.sender_email === seller.email && m.recipient_email === user.email)
      );
    },
    enabled: !!user && !!yardSale.id && !!seller.email,
  });

  // Real-time subscription for messages
  useEffect(() => {
    if (!user || !yardSale.id || !seller.email) return;

    const unsubscribe = base44.entities.Message.subscribe((event) => {
      // Only update if the message is part of this conversation
      if (event.data?.yard_sale_id === yardSale.id &&
          ((event.data?.sender_email === user.email && event.data?.recipient_email === seller.email) ||
           (event.data?.sender_email === seller.email && event.data?.recipient_email === user.email))) {
        
        // Play notification sound for incoming messages (not sent by current user)
        if (event.data?.sender_email !== user.email && soundEnabled && notificationSound.current) {
          notificationSound.current.play().catch(() => {});
        }
        
        queryClient.invalidateQueries({ queryKey: ['messages', yardSale.id, user?.email] });
      }
    });

    return unsubscribe;
  }, [user, yardSale.id, seller.email, soundEnabled, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!userScrolled && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, userScrolled]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setUserScrolled(!isAtBottom);
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('messageSoundEnabled', newValue);
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      return await base44.entities.Message.create({
        yard_sale_id: yardSale.id,
        sender_email: user.email,
        recipient_email: seller.email,
        content,
        read: false,
      });
    },
    onSuccess: (newMessage) => {
      setMessageText('');
      // Optimistically update the cache
      queryClient.setQueryData(['messages', yardSale.id, user?.email], (old = []) => [newMessage, ...old]);
      // Invalidate and refetch seller's unread count so their badge updates immediately
      queryClient.invalidateQueries({ queryKey: ['unreadMessages', seller.email] });
      queryClient.refetchQueries({ queryKey: ['unreadMessages', seller.email] });
      setUserScrolled(false); // Auto-scroll to new message
      toast.success('Message sent!');
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  const handleSend = () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText);
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Sign in to message the seller
        </p>
        <Button onClick={() => base44.auth.redirectToLogin()}>
          Sign In
        </Button>
      </div>
    );
  }

  if (user.email === seller.email) {
    return null; // Don't show messaging to the seller on their own listing
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#14B8FF]" />
          <h3 className="text-lg font-semibold text-[#2E3A59] dark:text-white">
            Message Seller
          </h3>
        </div>
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={soundEnabled ? 'Disable sound' : 'Enable sound'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="space-y-3 mb-4 max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700"
      >
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No messages yet. Start the conversation!
          </p>
        ) : (
          <AnimatePresence>
            {[...messages].reverse().map((message) => {
              const isOwn = message.sender_email === user.email;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-[#14B8FF] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                      {new Date(message.created_date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setMessageText("Is this still available?")}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Is this available?
        </button>
        <button
          onClick={() => setMessageText("What time is best to visit?")}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          What time is best?
        </button>
        <button
          onClick={() => setMessageText("Can you hold this for me?")}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Can you hold this?
        </button>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Ask a question..."
          className="rounded-xl resize-none"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          onClick={handleSend}
          disabled={!messageText.trim() || sendMessageMutation.isPending}
          className="bg-[#14B8FF] hover:bg-[#0da3e6] self-end"
        >
          {sendMessageMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}