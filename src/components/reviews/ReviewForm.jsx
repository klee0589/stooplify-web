import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ReviewForm({ onSubmit, isSubmitting, type = 'sale' }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit({ rating, comment: comment.trim() });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-[#2E3A59] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Leave a Review
      </h3>

      <div className="mb-4">
        <Label className="text-[#2E3A59] font-medium mb-2 block">Your Rating *</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-[#F5A623] text-[#F5A623]'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <Label className="text-[#2E3A59] font-medium mb-2 block">Your Review</Label>
        <Textarea
          placeholder={`Share your experience at this ${type}...`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="rounded-xl border-gray-200 min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="w-full bg-[#FF6F61] hover:bg-[#e55a4d] rounded-xl py-5"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </Button>
    </motion.form>
  );
}