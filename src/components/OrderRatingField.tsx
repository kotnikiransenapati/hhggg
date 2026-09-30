import React, { useState } from 'react';

interface OrderRatingFieldProps {
  orderId: string;
  initialRating?: number;
  initialComment?: string;
  ratedAt?: string;
  onSaveRating: (orderId: string, rating: number, comment?: string) => void;
}

const QUALITY_TAGS = [
  '🌱 Crisp & Crunchy',
  '❄️ Chilled & Fresh',
  '🍯 Natural Heirloom Sweetness',
  '📦 Eco Crates Intact',
  '⏱️ Timely Delivery',
  '✨ 100% Residue-Free Taste',
];

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'Poor Freshness (Bruised or wilting)',
  2: 'Fair (Lacks typical farm crispness)',
  3: 'Good (Standard organic quality)',
  4: 'Very Good & Crisp (Noticeably fresher)',
  5: 'Exceptional (Peak farm gate vitality!)',
};

export const OrderRatingField: React.FC<OrderRatingFieldProps> = ({
  orderId,
  initialRating = 0,
  initialComment = '',
  ratedAt,
  onSaveRating,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(initialComment);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(!initialRating);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const activeStars = hoverRating > 0 ? hoverRating : rating;

  const handleSelectStar = (star: number) => {
    setRating(star);
    // If not editing comment, auto-save the rating immediately for fast one-tap UX
    if (!isEditing) {
      onSaveRating(orderId, star, comment);
      triggerSavedNotice();
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (rating === 0) return;
    const fullComment = [
      comment.trim(),
      selectedTags.length > 0 ? `Highlights: ${selectedTags.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    onSaveRating(orderId, rating, fullComment);
    setIsEditing(false);
    triggerSavedNotice();
  };

  const triggerSavedNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  // If already rated and not actively editing
  if (rating > 0 && !isEditing) {
    return (
      <div className="mt-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`text-[18px] transition-transform ${
                    s <= rating ? 'text-amber-400 fill-current' : 'text-slate-200'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="font-bold text-amber-950">
              {rating}/5 • {RATING_DESCRIPTIONS[rating]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {ratedAt && <span className="text-[11px] text-slate-500">Rated {ratedAt}</span>}
            <button
              onClick={() => setIsEditing(true)}
              className="text-amber-800 hover:text-amber-950 font-semibold underline text-[11px] cursor-pointer"
            >
              Update Rating
            </button>
          </div>
        </div>

        {comment && (
          <p className="mt-1.5 text-slate-700 bg-white/70 p-2 rounded-lg border border-amber-100 text-[11px] leading-relaxed">
            "{comment}"
          </p>
        )}

        {savedNotice && (
          <div className="mt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1 animate-fadeIn">
            <span>✓</span> Rating recorded! Farmer collective trust score updated.
          </div>
        )}
      </div>
    );
  }

  // Interactive input state
  return (
    <div className="mt-3 p-3.5 rounded-xl bg-surface-container-low border border-amber-200/80 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">⭐</span>
          <div>
            <span className="font-bold text-on-surface text-xs block">
              Rate Harvest Produce Quality
            </span>
            <span className="text-outline text-[11px]">
              How crisp and flavorful was this batch? Directly impacts farmer escrow bonuses.
            </span>
          </div>
        </div>

        {activeStars > 0 && (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full self-start sm:self-auto">
            {RATING_DESCRIPTIONS[activeStars]}
          </span>
        )}
      </div>

      {/* 5-Star Interactive Selector */}
      <div className="flex items-center gap-1 my-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleSelectStar(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${star} out of 5 stars`}
            className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
          >
            <span
              className={`text-2xl transition-colors ${
                star <= activeStars ? 'text-amber-400 drop-shadow-xs' : 'text-slate-200 hover:text-amber-200'
              }`}
            >
              ★
            </span>
          </button>
        ))}
        <span className="ml-2 text-xs font-bold text-on-surface">
          {rating > 0 ? `${rating} of 5 Stars` : 'Tap to rate'}
        </span>
      </div>

      {/* Feedback Quality Tags */}
      {rating > 0 && (
        <div className="mt-2.5 pt-2 border-t border-surface-container">
          <span className="text-[11px] text-outline font-medium block mb-1.5">
            What stood out about this harvest lot? (Optional)
          </span>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {QUALITY_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                      : 'bg-white border-surface-container text-on-surface-variant hover:bg-slate-50'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Comment text box */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add comments on crispness, flavor, cold-chain condition, or note to grower..."
            rows={2}
            className="w-full text-xs p-2.5 rounded-lg border border-surface-container bg-white text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-outline">
              Zero-residue certified harvests reward top-rated collectives with +3% escrow bonus.
            </span>
            <div className="flex items-center gap-2">
              {initialRating > 0 && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-outline hover:text-on-surface font-medium cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={rating === 0}
                className="px-4 py-1.5 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-on-primary-container disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                Submit Quality Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {savedNotice && (
        <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1 animate-fadeIn">
          <span>✓</span> Rating saved successfully!
        </div>
      )}
    </div>
  );
};
