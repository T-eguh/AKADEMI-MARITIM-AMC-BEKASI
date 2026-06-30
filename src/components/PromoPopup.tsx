import React, { useState, useEffect } from 'react';
import { PopupPromoConfig } from '../types';

interface PromoPopupProps {
  config: PopupPromoConfig;
  onNavigate?: (path: string) => void;
}

export default function PromoPopup({ config, onNavigate }: PromoPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isActive = config ? (config.isActive ?? config.isEnabled ?? false) : false;
  const displayImg = config ? (config.imageUrl || config.image) : '';
  const actionLink = config ? (config.actionLink || config.link || '#pmb') : '#pmb';

  useEffect(() => {
    if (!config || !isActive) return;

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('amc_popup_dismissed') === 'true';
    if (!isDismissed) {
      const delay = (config.displayDelay && config.displayDelay > 0) ? config.displayDelay * 1000 : 1500;
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [config, isActive]);

  if (!isOpen || !config || !isActive) return null;

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('amc_popup_dismissed', 'true');
  };

  const handleCta = () => {
    sessionStorage.setItem('amc_popup_dismissed', 'true');
    setIsOpen(false);
    
    const link = actionLink;
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
      <div className="relative bg-white w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-100 z-10 animate-fade-in max-h-[95vh] flex flex-col">
        
        {/* Banner Image inside Popup */}
        {displayImg && (
          <div className="relative max-h-[70vh] bg-navy-950 flex items-center justify-center overflow-hidden flex-shrink">
            <img 
              src={displayImg} 
              alt={config.title}
              className="max-h-[70vh] w-full object-contain"
              referrerPolicy="no-referrer"
            />
            {/* Soft gold gradient border bottom */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-navy-800 via-gold-500 to-navy-800 z-10" />
            
            {/* Circle Close Icon on Top Right of Image */}
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy-950/70 hover:bg-gold-500 text-white hover:text-navy-950 flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10 cursor-pointer"
              aria-label="Tutup"
            >
              <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Text Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col justify-between">
          <div>
            {!displayImg && (
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

            {displayImg && (
              <h3 className="text-sm sm:text-base font-display font-black text-navy-950 mb-1 leading-tight">
                {config.title}
              </h3>
            )}

            {config.description && (
              <p className={`text-slate-600 leading-relaxed font-sans ${displayImg ? 'text-[11px] sm:text-xs line-clamp-2 mb-3' : 'text-xs sm:text-sm whitespace-pre-line mb-6'}`}>
                {config.description}
              </p>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-2.5 justify-end pt-2 border-t border-slate-100 flex-shrink-0">
            <button
              onClick={handleClose}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors duration-300 active:scale-95"
            >
              Tutup
            </button>
            <button
              onClick={handleCta}
              className="px-4 py-1.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs rounded-lg shadow-md shadow-gold-500/10 transition-all duration-300 active:scale-95"
            >
              {config.actionText || 'Daftar Sekarang'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
