import React from 'react';
import { ProduceItem } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: ProduceItem[];
  onRemoveFromWishlist: (itemId: string) => void;
  onMoveToCart: (item: ProduceItem) => void;
  onMoveAllToCart: () => void;
  onClearWishlist: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
  onMoveAllToCart,
  onClearWishlist,
}) => {
  if (!isOpen) return null;

  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
                <span className="material-symbols-outlined text-[22px]">favorite</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Saved Produce</h3>
                <p className="text-xs text-slate-500">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} · Reserved from Dawn Harvest
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                  <span className="material-symbols-outlined text-3xl">favorite_border</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Your wishlist is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
                  Tap the heart icon on any morning-cut crop to save it for quick reordering or harvest notifications.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Explore Today's Harvest
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span>Saved Crops ({wishlist.length})</span>
                  <button
                    onClick={onClearWishlist}
                    className="text-rose-600 hover:text-rose-700 font-semibold hover:underline cursor-pointer"
                  >
                    Clear Wishlist
                  </button>
                </div>

                <div className="space-y-3">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all flex items-center gap-3.5 group"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            {item.badge}
                          </span>
                          <button
                            onClick={() => onRemoveFromWishlist(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                            title="Remove from Wishlist"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs truncate mt-1 group-hover:text-emerald-800 transition-colors">
                          {item.name}
                        </h4>

                        <p className="text-[11px] text-slate-500 truncate">
                          {item.farmer} · {item.origin}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                          <span className="text-xs font-extrabold text-slate-900">
                            ₹{item.price} <span className="text-[10px] text-slate-400 font-normal">/{item.unit}</span>
                          </span>

                          <button
                            onClick={() => onMoveToCart(item)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
                            <span>Move to Basket</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-6 bg-white border-t border-slate-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Estimated Harvest Value
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">₹{totalValue}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  94.1% Direct Grower Payout
                </span>
              </div>

              <button
                onClick={onMoveAllToCart}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                <span>Move All to Basket ({wishlist.length} items)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
