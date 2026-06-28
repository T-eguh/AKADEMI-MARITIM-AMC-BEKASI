import React, { useState, useEffect } from 'react';

interface FloatingButtonsProps {
  whatsappNumber?: string;
  phoneNumber?: string;
}

export default function FloatingButtons({ 
  whatsappNumber = "6281210101010", 
  phoneNumber = "02188997788" 
}: FloatingButtonsProps) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanNumber = (num: string) => {
    return num.replace(/[^0-9]/g, '');
  };

  const waLink = whatsappNumber 
    ? `https://wa.me/${cleanNumber(whatsappNumber)}?text=Halo%20Admin%20AMC%20Bekasi,%20saya%20ingin%20bertanya%20mengenai%20penerimaan%20taruna%20baru...`
    : '#';

  const telLink = phoneNumber ? `tel:${cleanNumber(phoneNumber)}` : '#';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end select-none">
      
      {/* WhatsApp Button */}
      {whatsappNumber && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce [animation-duration:3s]"
          title="Hubungi via WhatsApp"
        >
          {/* Tooltip */}
          <span className="absolute right-14 bg-navy-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-md border border-white/5">
            WhatsApp Kampus
          </span>
          <svg className="w-6 h-6 md:w-7 md:h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.978L2 22l5.177-1.356A9.898 9.898 0 0 0 12 22c5.506 0 9.989-4.478 9.99-9.984C22 6.507 17.513 2 12.012 2zm6.59 13.985c-.273.763-1.33 1.385-1.84 1.455-.453.063-.9.3-2.923-.509-2.583-1.033-4.22-3.66-4.35-3.83-.12-.17-.98-1.3-1.02-2.61-.04-1.31.64-1.95.88-2.21.23-.25.5-.32.67-.32.17 0 .34.01.49.02.15.01.35-.06.55.43.2.49.69 1.68.75 1.8.06.12.1.26.02.43-.08.17-.12.28-.25.43-.13.15-.27.33-.38.45-.12.12-.25.26-.11.5.14.24.62 1.03 1.33 1.66.92.81 1.7 1.06 1.94 1.18.25.12.39.1.53-.06.14-.17.61-.71.77-.95.16-.24.33-.2.55-.12.23.08 1.45.69 1.7.81.25.12.41.18.47.28.06.11.06.63-.21 1.39z"/>
          </svg>
        </a>
      )}

      {/* Telephone Button */}
      {phoneNumber && (
        <a
          href={telLink}
          className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-navy-600 hover:bg-navy-700 text-white flex items-center justify-center shadow-lg shadow-navy-600/30 hover:shadow-navy-600/40 transition-all duration-300 hover:scale-110 active:scale-95"
          title="Telepon Kampus"
        >
          {/* Tooltip */}
          <span className="absolute right-14 bg-navy-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-md border border-white/5">
            Hubungi Telepon
          </span>
          <svg className="w-5 h-5 md:w-6 md:h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      )}

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-navy-950 flex items-center justify-center shadow-lg shadow-gold-500/30 hover:shadow-gold-500/40 transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in"
          title="Kembali ke atas"
          aria-label="Kembali ke atas"
        >
          {/* Tooltip */}
          <span className="absolute right-14 bg-navy-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-md border border-white/5">
            Ke Atas
          </span>
          <svg className="w-5 h-5 md:w-6 md:h-6 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

    </div>
  );
}
