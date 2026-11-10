import React from 'react';

export const TOPICS = [
  { label: 'All', emoji: '✨', tags: null },
  { label: 'NYC', emoji: '🗽', tags: ['NYC', 'NYC Living', 'nyc'] },
  { label: 'Brooklyn', emoji: '🌉', tags: ['Brooklyn', 'brooklyn'] },
  { label: 'Seller Tips', emoji: '🏷️', tags: ['Sellers', 'Seller Tips', 'Selling Tips', 'selling tips', 'selling', 'pricing'] },
  { label: 'Buyer Tips', emoji: '🛍️', tags: ['Buyers', 'Thrifting Tips'] },
  { label: 'Guides', emoji: '📖', tags: ['guide', 'Guide', 'Tips', 'tips'] },
  { label: 'Sustainability', emoji: '🌱', tags: ['Sustainability'] },
  { label: 'Community', emoji: '🤝', tags: ['Community'] },
];

export default function TopicChips({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {TOPICS.map((topic) => (
        <button
          key={topic.label}
          onClick={() => onChange(topic.label)}
          className={`no-min-tap shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
            active === topic.label
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-card text-foreground border-border hover:border-primary hover:text-primary'
          }`}
        >
          <span className="mr-1.5">{topic.emoji}</span>{topic.label}
        </button>
      ))}
    </div>
  );
}