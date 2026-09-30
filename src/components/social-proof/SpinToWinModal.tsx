import React, { useState } from 'react';
import { couponAttributionService, SPIN_WHEEL_REWARDS } from '../../services/couponAttributionService';

interface SpinToWinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: (couponCode: string) => void;
  onApplyDirectly?: (couponCode: string) => void;
}

export const SpinToWinModal: React.FC<SpinToWinModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
  onApplyDirectly,
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [wonReward, setWonReward] = useState<{
    label: string;
    couponCode: string;
    discountDescription: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;

    setWonReward(null);
    setIsSpinning(true);
    const { reward, index, uniqueCoupon } = couponAttributionService.spinReward();

    // 6 segments = 60 deg each. Pointer is at 12 o'clock (270 deg / top)
    const segmentAngle = 360 / SPIN_WHEEL_REWARDS.length;
    // Align wheel so top pointer lands precisely in the center of segment
    const targetSegmentOffset = 360 - index * segmentAngle - segmentAngle / 2;
    const totalRotation = rotationDegrees + 2160 + targetSegmentOffset - (rotationDegrees % 360);

    setRotationDegrees(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonReward({
        label: reward.label,
        couponCode: uniqueCoupon,
        discountDescription: reward.discountDescription,
      });
      onRewardClaimed(uniqueCoupon);
    }, 4500);
  };

  const copyCoupon = () => {
    if (wonReward) {
      navigator.clipboard?.writeText(wonReward.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyAndClose = () => {
    if (wonReward) {
      if (onApplyDirectly) {
        onApplyDirectly(wonReward.couponCode);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden text-center relative p-5 sm:p-7 space-y-4 max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors z-30 font-bold"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
            <span>🎰</span>
            <span>Harvest Lucky Wheel</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Spin to Win Grower Rewards!
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            100% win rate! Single-origin discount vouchers valid across all farm categories.
          </p>
        </div>

        {/* The Wheel Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-2 flex items-center justify-center select-none">
          {/* Wheel Pointer Pin at Top */}
          <div className="absolute -top-3 z-30 flex flex-col items-center drop-shadow-md">
            <div className="w-5 h-5 rounded-full bg-rose-600 shadow-md flex items-center justify-center border-2 border-white">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[14px] border-t-rose-600 -mt-1"></div>
          </div>

          {/* Outer Golden Studded Frame */}
          <div className="absolute inset-0 rounded-full border-[7px] border-amber-400 shadow-xl bg-amber-950/5 pointer-events-none z-10">
            {/* 12 perimeter indicator studs positioned proportionally */}
            {[...Array(12)].map((_, i) => {
              const rad = (i * 30 * Math.PI) / 180;
              // Circle center at 50%, radius ~48%
              const x = 50 + 47 * Math.cos(rad);
              const y = 50 + 47 * Math.sin(rad);
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-amber-200 border border-amber-600 shadow-2xs -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                />
              );
            })}
          </div>

          {/* Rotating Wheel Graphic */}
          <div
            className="w-[90%] h-[90%] rounded-full overflow-hidden shadow-inner relative"
            style={{
              transform: `rotate(${rotationDegrees}deg)`,
              transition: isSpinning ? 'transform 4.5s cubic-bezier(0.12, 0.8, 0.15, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {SPIN_WHEEL_REWARDS.map((item, idx) => {
                const angle = 360 / SPIN_WHEEL_REWARDS.length;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                const midAngle = startAngle + angle / 2;

                return (
                  <g key={item.couponCode}>
                    <path d={pathData} fill={item.color} stroke="#ffffff" strokeWidth="1.2" />
                    {/* Rotated text readable along radius */}
                    <text
                      x="50"
                      y="16"
                      fill="#ffffff"
                      fontSize="3.6"
                      fontWeight="800"
                      textAnchor="middle"
                      transform={`rotate(${midAngle}, 50, 50)`}
                      style={{
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                        letterSpacing: '-0.1px',
                      }}
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Wheel Center Leaf Hub */}
            <div className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 border-2 border-white shadow-xl flex items-center justify-center font-bold text-amber-950">
              <span className="material-symbols-outlined text-[19px] text-emerald-950">eco</span>
            </div>
          </div>
        </div>

        {/* Won State or Spin Button */}
        {wonReward ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl animate-bounce">🎉</span>
              <h4 className="font-black text-emerald-900 text-base">
                Winner: {wonReward.label}!
              </h4>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              {wonReward.discountDescription}
            </p>

            <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-300 shadow-2xs">
              <span className="font-mono font-black text-emerald-900 text-sm tracking-wider">
                {wonReward.couponCode}
              </span>
              <button
                type="button"
                onClick={copyCoupon}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleSpin}
                className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-100/50 text-emerald-900 font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">refresh</span>
                <span>Spin Again</span>
              </button>
              <button
                type="button"
                onClick={handleApplyAndClose}
                className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
                <span>Apply to Basket</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 disabled:opacity-60 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            {isSpinning ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Decelerating onto harvest prize...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">casino</span>
                <span>SPIN THE LUCKY HARVEST WHEEL</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
