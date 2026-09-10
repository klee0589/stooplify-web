import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';

export default function SaleReviewsSection({ reviews, user, canReview, onHelpful, onAttend, onSubmit, isSubmitting, t }) {
  const alreadyReviewed = user && reviews.some((r) => r.created_by === user.email);
  const card = 'bg-card border border-border rounded-2xl p-6 shadow-card text-center';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t('reviewsAndRatings')}</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReviewList reviews={reviews} onHelpful={onHelpful} currentUserEmail={user?.email} />
        </div>
        <div className="lg:col-span-1">
          {!user ? (
            <div className={card}>
              <p className="text-muted-foreground mb-4">{t('signInToReview')}</p>
              <Button onClick={() => base44.auth.redirectToLogin()} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">{t('signIn')}</Button>
            </div>
          ) : alreadyReviewed ? (
            <div className={card}><p className="text-muted-foreground">{t('youAlreadyReviewed')}</p></div>
          ) : !canReview ? (
            <div className={card}>
              <p className="text-muted-foreground mb-4">{t('markAttendingToReview')}</p>
              <Button onClick={onAttend} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">{t('imAttending')}</Button>
            </div>
          ) : (
            <ReviewForm onSubmit={onSubmit} isSubmitting={isSubmitting} type="sale" />
          )}
        </div>
      </div>
    </motion.div>
  );
}