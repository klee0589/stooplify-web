import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Loader2, User, Send, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SellerMessageView({ sale, sellerEmail }) {
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('messageSoundEnabled') !== 'false');
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const queryClient = useQueryClient();
  const notificationSound = useRef(null);

  useEffect(() => {
    // Initialize notification sound
    notificationSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGi78OScTgwOUKXh8LJnHQU2jdXwyHkqBSl+zPLaizsKGGS57OihUBELTKXh8LdnHwU7k9nzw3csBS2AzvLZizYIGWm87+SaUBEMUKnh8LFoHQU3jtXwxXkrBSl9y/LajDsKGGO57Oeha');
  }, []);

  const { data: allMessages = [], isLoading } = useQuery({
    queryKey: ['sellerMessages', sale.id],
    queryFn: async () => {
      const messages = await base44.entities.Message.filter({
        yard_sale_id: sale.id,
      }, '-created_date');
      return messages.filter(m => m.recipient_email === sellerEmail || m.sender_email === sellerEmail);
    },
    enabled: !!sale.id && !!sellerEmail,
  });

  // Real-time subscription for messages
  useEffect(() => {
    if (!sale.id || !sellerEmail) return;

    const unsubscribe = base44.entities.Message.subscribe((event) => {
      // Only update if the message is related to this sale and seller
      if (event.data?.yard_sale_id === sale.id && 
          (event.data?.recipient_email === sellerEmail || event.data?.sender_email === sellerEmail)) {
        
        // Play notification sound for incoming messages (not sent by current seller)
        if (event.data?.sender_email !== sellerEmail && soundEnabled && notificationSound.current) {
          notificationSound.current.play().catch(() => {});
        }
        
        queryClient.invalidateQueries({ queryKey: ['sellerMessages', sale.id] });
        queryClient.invalidateQueries({ queryKey: ['unreadMessages', sellerEmail] });
      }
    });

    return unsubscribe;
  }, [sale.id, sellerEmail, soundEnabled, queryClient]);

  // Group messages by buyer
  const conversations = allMessages.reduce((acc, msg) => {
    const buyerEmail = msg.sender_email === sellerEmail ? msg.recipient_email : msg.sender_email;
    if (!acc[buyerEmail]) {
      acc[buyerEmail] = [];
    }
    acc[buyerEmail].push(msg);
    return acc;
  }, {});

  const buyerEmails = Object.keys(conversations);

  const markAsReadMutation = useMutation({
    mutationFn: async (messageIds) => {
      // Mark all messages as read
      await Promise.all(
        messageIds.map(id => base44.entities.Message.update(id, { read: true }))
      );
    },
    onSuccess: () => {
      // Invalidate all message-related queries
      queryClient.invalidateQueries({ queryKey: ['sellerMessages', sale.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages', sellerEmail] });
      queryClient.refetchQueries({ queryKey: ['unreadMessages', sellerEmail] });
      queryClient.invalidateQueries({ queryKey: ['allMessages', sellerEmail] });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!userScrolled && messagesContainerRef.current && selectedBuyer) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [allMessages, userScrolled, selectedBuyer]);

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

  const sendReplyMutation = useMutation({
    mutationFn: async ({ buyerEmail, content }) => {
      return await base44.entities.Message.create({
        yard_sale_id: sale.id,
        sender_email: sellerEmail,
        recipient_email: buyerEmail,
        content,
        read: false,
      });
    },
    onSuccess: (newMessage) => {
      setReplyText('');
      // Optimistically update the cache
      queryClient.setQueryData(['sellerMessages', sale.id], (old = []) => [newMessage, ...old]);
      // Invalidate and refetch both seller's and buyer's unread counts
      queryClient.invalidateQueries({ queryKey: ['unreadMessages', sellerEmail] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages', newMessage.recipient_email] });
      queryClient.refetchQueries({ queryKey: ['unreadMessages', newMessage.recipient_email] });
      queryClient.invalidateQueries({ queryKey: ['allMessages', sellerEmail] });
      setUserScrolled(false); // Auto-scroll to new message
      toast.success('Reply sent!');
    },
    onError: () => {
      toast.error('Failed to send reply');
    },
  });

  const handleReply = (buyerEmail) => {
    if (!replyText.trim()) return;
    sendReplyMutation.mutate({ buyerEmail, content: replyText });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (buyerEmails.length === 0) {
    return (
      <div className="text-center py-4">
        <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2E3A59] dark:text-white">Conversations</h3>
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={soundEnabled ? 'Disable sound' : 'Enable sound'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      {buyerEmails.map((buyerEmail) => {
        const messages = conversations[buyerEmail];
        const lastMessage = messages[0];
        const unreadCount = messages.filter(m => !m.read && m.sender_email !== sellerEmail).length;

        return (
          <motion.div
            key={buyerEmail}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => {
                const wasOpening = selectedBuyer !== buyerEmail;
                setSelectedBuyer(selectedBuyer === buyerEmail ? null : buyerEmail);
                setUserScrolled(false); // Reset scroll state when opening
                // Mark unread messages as read when opening conversation
                if (wasOpening) {
                  const unreadMessages = messages.filter(m => !m.read && m.recipient_email === sellerEmail);
                  if (unreadMessages.length > 0) {
                    markAsReadMutation.mutate(unreadMessages.map(m => m.id));
                  }
                }
              }}
              className="w-full flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left border border-gray-200 dark:border-gray-600 shadow-sm"
            >
              <div className="w-8 h-8 bg-[#14B8FF]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-[#14B8FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm text-[#2E3A59] dark:text-white truncate">
                    {buyerEmail}
                  </p>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#FF6F61] text-white text-xs font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {lastMessage.content}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(lastMessage.created_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </button>

            <AnimatePresence>
              {selectedBuyer === buyerEmail && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl mt-2 border border-gray-200 dark:border-gray-700 shadow-md">
                    <div 
                      ref={messagesContainerRef}
                      onScroll={handleScroll}
                      className="space-y-2 max-h-48 overflow-y-auto mb-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-2 border border-gray-200 dark:border-gray-700"
                    >
                      {[...messages].reverse().map((msg) => {
                        const isOwn = msg.sender_email === sellerEmail;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                                isOwn
                                  ? 'bg-[#14B8FF] text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                            >
                              <p className="text-xs">{msg.content}</p>
                              <p className={`text-xs mt-0.5 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                                {new Date(msg.created_date).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Reply Input */}
                    <div className="flex gap-2">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="rounded-xl resize-none text-sm"
                        rows={2}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleReply(buyerEmail);
                          }
                        }}
                      />
                      <Button
                        onClick={() => handleReply(buyerEmail)}
                        disabled={!replyText.trim() || sendReplyMutation.isPending}
                        className="bg-[#14B8FF] hover:bg-[#0da3e6] self-end"
                        size="sm"
                      >
                        {sendReplyMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}