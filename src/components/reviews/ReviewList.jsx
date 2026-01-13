import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";

export default function ReviewList({ reviews, onHelpful, currentUserEmail }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {averageRating}
            </div>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? 'fill-[#F5A623] text-[#F5A623]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = (count / reviews.length) * 100;
              return (
                <div key={rating} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#F5A623] h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#2E3A59]">
                    {review.created_by?.split('@')[0] || 'Anonymous'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? 'fill-[#F5A623] text-[#F5A623]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review.attended && (
                      <span className="text-xs text-green-600 font-medium">✓ Verified Attendee</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.created_date), { addSuffix: true })}
              </span>
            </div>

            {review.comment && (
              <p className="text-gray-700 mb-3">{review.comment}</p>
            )}

            {onHelpful && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onHelpful(review.id)}
                className="text-gray-600 hover:text-[#FF6F61]"
                disabled={review.created_by === currentUserEmail}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful {review.helpful_count > 0 && `(${review.helpful_count})`}
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}