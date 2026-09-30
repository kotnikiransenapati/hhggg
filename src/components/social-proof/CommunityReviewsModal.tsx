import React, { useState } from 'react';
import { CommunityReview } from '../../types';
import { socialProofService } from '../../services/socialProofService';

interface CommunityReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityReviewsModal: React.FC<CommunityReviewsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reviews, setReviews] = useState<CommunityReview[]>(socialProofService.getCommunityReviews());
  const [filterState, setFilterState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const handleUpvote = (id: string) => {
    const updated = socialProofService.upvoteReview(id);
    setReviews([...updated]);
  };

  const filteredReviews = reviews.filter((rev) => {
    if (filterState !== 'all' && rev.customerState.toLowerCase() !== filterState.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        rev.customerName.toLowerCase().includes(q) ||
        rev.purchasedItemName.toLowerCase().includes(q) ||
        rev.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">Verified Consumer Stories &amp; Lab Audits</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                100% Escrow Inspected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Feedback from certified doorstep deliveries. Every review is tied to a real batch consignment.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer border border-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Filters & Search Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by produce, grower, or keyword..."
            className="flex-1 min-w-[200px] px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
          />

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value="all">All States</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="gujarat">Gujarat</option>
            <option value="goa">Goa</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No verified reviews found matching your search.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3"
              >
                {/* Reviewer Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{rev.customerName}</span>
                        <span className="text-[10px] text-slate-400">({rev.customerState})</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-800 font-medium block">
                        Harvested Lot: {rev.harvestLotNumber} · {rev.purchasedItemName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-amber-500 text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.dateStr}</span>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Footer Badges & Upvoting */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {rev.photoVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                        <span>0.00 ppm Lab Verified</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpvote(rev.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      rev.userUpvoted
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span>▲ Helpful</span>
                    <span className="text-slate-400 tabular-nums">({rev.helpfulnessUpvotes})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
