import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Loader2, User, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SellerMessageView({ sale, sellerEmail }) {
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

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
      // Invalidate message-related queries with specific keys
      queryClient.invalidateQueries({ queryKey: ['sellerMessages', sale.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages', sellerEmail] });
    },
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerMessages', sale.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages', sellerEmail] });
      setReplyText('');
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
                setSelectedBuyer(selectedBuyer === buyerEmail ? null : buyerEmail);
                // Mark unread messages as read when opening conversation
                if (selectedBuyer !== buyerEmail) {
                  const unreadMessages = messages.filter(m => !m.read && m.recipient_email === sellerEmail);
                  if (unreadMessages.length > 0) {
                    markAsReadMutation.mutate(unreadMessages.map(m => m.id));
                  }
                }
              }}
              className="w-full flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
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
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl mt-2">
                    <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                      {messages.reverse().map((msg) => {
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