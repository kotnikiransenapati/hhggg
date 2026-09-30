import React from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/40 flex flex-col">
        <div className="p-4 bg-inverse-surface text-inverse-on-surface flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
            <span className="font-label-md font-bold uppercase tracking-wider text-xs">Live Polyhouse Feed • Nashik Cam 02 (Block 4)</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuByq6tVnOwcYtobxIPFRTO6xxfK1eiAEymtvthLYWRGO9Hlvu1ID8tJWdeNaSFnEdf_NbLRplxF9C2DXc0-6eYxKOSuP6VfAQ_Nvxr959iBRR6uTadVueSE_rN3Ik_DTh-SdKLm6FrkMKPv-DrhvUO3LU-5RBO-zWA5l39waIZawBLZC7AxbCf9NJ-LyenqmTrz6KbRhQ712BbWtaUQkGBepf9JfQkvw4MnpjpyXghLvIo3m5_27_lnEw"
            alt="Live camera reel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5">
            <span className="material-symbols-outlined text-red-500 text-[14px]">fiber_manual_record</span>
            <span>REC: 07:15:32 AM • 24 FPS</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h4 className="font-headline-sm font-bold text-white text-base">San Marzano Vine Harvesting Reel</h4>
            <p className="text-white/80 text-xs mt-1">
              Field crew plucking Grade A+ clusters at optimal brix sweetness before morning dispatch.
            </p>
          </div>
        </div>

        <div className="p-4 bg-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-4">
            <span>Ambient Field Temp: <strong>18.5°C</strong></span>
            <span>Solar Inverter Status: <strong>3.2 kW Output</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-primary text-on-primary font-semibold rounded-lg hover:bg-on-primary-fixed-variant transition-colors cursor-pointer"
          >
            Done Viewing
          </button>
        </div>
      </div>
    </div>
  );
};
