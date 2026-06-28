import React, { useState, useEffect } from 'react';
import { PopupPromoConfig } from '../types';

interface PromoPopupProps {
  config: PopupPromoConfig;
  onNavigate?: (path: string) => void;
}

export default function PromoPopup({ config, onNavigate }: PromoPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!config || !config.isActive) return;

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('amc_popup_dismissed') === 'true';
    if (!isDismissed) {
      // Small delay of 1.5s after page loads for a professional feel
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [config]);

  if (!isOpen || !config || !config.isActive) return null;

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('amc_popup_dismissed', 'true');
  };

  const handleCta = () => {
    sessionStorage.setItem('amc_popup_dismissed', 'true');
    setIsOpen(false);
    
    const link = config.actionLink || '#pmb';
    if (link.startsWith('#')) {
      const element = document.getElementById(link.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        onNavigate?.(link);
      }
    } else {
      onNavigate?.(link);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark backdrop overlay with blur */}
      <div 
        className="absolute inset-0 bg-navy-950/70 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Dialog Card */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-100 z-10 animate-fade-in max-h-[90vh] flex flex-col">
        
        {/* Banner Image inside Popup */}
        {config.imageUrl && (
          <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
            <img 
              src={config.imageUrl} 
              alt={config.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Soft gold gradient border bottom */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-navy-800 via-gold-500 to-navy-800" />
            
            {/* Circle Close Icon on Top Right of Image */}
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy-950/70 hover:bg-gold-500 text-white hover:text-navy-950 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              aria-label="Tutup"
            >
              <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Text Content */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {!config.imageUrl && (
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl sm:text-2xl font-display font-black text-navy-900 pr-4">
                {config.title || 'Informasi Penting'}
              </h3>
              <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-navy-900"
                aria-label="Tutup"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {config.imageUrl && (
            <h3 className="text-lg sm:text-xl font-display font-black text-navy-950 mb-2 leading-tight">
              {config.title}
            </h3>
          )}

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-line mb-6">
            {config.description}
          </p>

          {/* Action Buttons Row */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-lg transition-colors duration-300 active:scale-95"
            >
              Tutup
            </button>
            <button
              onClick={handleCta}
              className="px-5 py-2 sm:px-6 sm:py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs sm:text-sm rounded-lg shadow-lg shadow-gold-500/10 transition-all duration-300 active:scale-95"
            >
              {config.actionText || 'Daftar Sekarang'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
