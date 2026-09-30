import React, { useState } from 'react';

interface VendorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VendorOnboardingModal: React.FC<VendorOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [collectiveName, setCollectiveName] = useState<string>('Konkan Coast Organic Producers Co-op');
  const [leadFarmer, setLeadFarmer] = useState<string>('Mahadev Sawant');
  const [fssaiDocUploaded, setFssaiDocUploaded] = useState<boolean>(true);
  const [pdfExtractorRunning, setPdfExtractorRunning] = useState<boolean>(false);
  const [extractedItemsCount, setExtractedItemsCount] = useState<number>(0);

  if (!isOpen) return null;

  const handleSimulatePdfExtract = () => {
    setPdfExtractorRunning(true);
    setTimeout(() => {
      setPdfExtractorRunning(false);
      setExtractedItemsCount(14);
      setStep(4);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Multi-Vendor Onboarding
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Grower Collective KYC &amp; Catalog</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Stepper Header */}
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 border-b pb-3">
          <span className={step >= 1 ? 'text-emerald-700' : ''}>1. Collective Info</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-emerald-700' : ''}>2. Soil &amp; FSSAI</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-emerald-700' : ''}>3. PDF Extractor</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-emerald-700' : ''}>4. Live Storefront</span>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Producer Collective / Syndicate Name</label>
              <input
                type="text"
                value={collectiveName}
                onChange={(e) => setCollectiveName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Lead Agronomist</label>
              <input
                type="text"
                value={leadFarmer}
                onChange={(e) => setLeadFarmer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
            >
              Continue to Soil &amp; License Upload →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">SGS Zero-Residue Soil Certificate</span>
              <p className="text-slate-500">Attach accredited spectroscopy report showing 0.00 ppm organophosphates.</p>
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Document: SGS-SOIL-PUNE-2026.pdf (Verified)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
            >
              Proceed to Automated Catalog Extractor →
            </button>
          </div>
        )}

        {/* Step 3: 5-step Automated PDF Catalog Extractor */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <span className="material-symbols-outlined text-[36px] text-emerald-700">picture_as_pdf</span>
              <h4 className="font-bold text-slate-900 text-sm">Automated 5-Step PDF Catalog Extractor</h4>
              <p className="text-slate-500 max-w-sm mx-auto">
                Upload your wholesale harvest manifest or agricultural rate sheet. Our extractor will parse crop names, crate weights, and pricing automatically.
              </p>

              <button
                type="button"
                disabled={pdfExtractorRunning}
                onClick={handleSimulatePdfExtract}
                className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                {pdfExtractorRunning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Extracting 14 Farm Items via OCR...</span>
                  </>
                ) : (
                  <span>Upload &amp; Extract Harvest Rate Sheet</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4 text-xs text-center animate-fadeIn">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Vendor Storefront Created!
            </h4>
            <p className="text-slate-600">
              Extracted <strong>{extractedItemsCount} harvest items</strong>. Assigned dedicated escrow wallet and cold-chain route.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
            >
              Finish &amp; Open Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
