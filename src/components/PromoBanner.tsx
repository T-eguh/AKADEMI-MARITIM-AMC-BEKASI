import React, { useState, useEffect } from 'react';
import { BannerPromoItem } from '../types';

interface PromoBannerProps {
  banners: BannerPromoItem[];
  onNavigate?: (path: string) => void;
}

export default function PromoBanner({ banners, onNavigate }: PromoBannerProps) {
  const activeBanners = banners.filter(banner => {
    if (!banner.isActive) return false;
    
    // Date validity check
    const today = new Date().toISOString().split('T')[0];
    if (banner.startDate && today < banner.startDate) return false;
    if (banner.endDate && today > banner.endDate) return false;
    
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000); // Auto-scroll every 6 seconds

    return () => clearInterval(timer);
  }, [activeBanners.length, isHovered]);

  if (activeBanners.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const currentBanner = activeBanners[currentIndex];

  const handleCtaClick = (link: string) => {
    if (link.startsWith('#')) {
      const element = document.getElementById(link.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        onNavigate?.(link);
      }
    } else if (link.startsWith('/')) {
      onNavigate?.(link);
    } else {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section 
      id="promo-banner-section"
      className="relative bg-gradient-to-b from-[#01142C] to-[#000E22] border-b border-[#0f2d54] py-12 md:py-16 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Decorative Pattern & Ambient Glow */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#FFC107_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Elegant Section Title */}
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] sm:text-xs font-bold text-gold-500 uppercase tracking-widest bg-gold-500/10 px-3.5 py-1.5 rounded-full border border-gold-500/20">
            INFORMASI TERKINI & EVENT
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mt-3 tracking-tight">
            Banner Promosi <span className="text-gold-500">& Info Kampus</span>
          </h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="relative h-[400px] sm:h-[420px] md:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#0f2d54] bg-[#000e22]">
          
          {/* Active Banner Slides */}
          {activeBanners.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-98 pointer-events-none z-0'
                } flex flex-col md:flex-row`}
              >
                {/* Left Block: Content Card (Excellent solid readability) */}
                <div className="w-full md:w-[45%] h-[50%] md:h-full bg-gradient-to-b from-[#011633] to-[#000E22] p-5 sm:p-8 lg:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#0f2d54]/50 z-20 relative shrink-0">
                  {/* Banner Category Badge */}
                  <div className="flex items-center space-x-2 mb-2 sm:mb-4">
                    <span className="bg-gold-500 text-navy-950 text-[9px] md:text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                      {banner.category || 'PROMOSI'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">AMC Bekasi</span>
                  </div>
                  
                  {/* Banner Title */}
                  <h3 className="text-base sm:text-2xl md:text-2.5xl lg:text-3xl font-display font-extrabold text-white leading-tight tracking-tight mb-2 sm:mb-3 line-clamp-2">
                    {banner.title}
                  </h3>
                  
                  {/* Banner Description */}
                  <p className="text-[11px] sm:text-xs md:text-sm text-gray-300 leading-relaxed line-clamp-2 md:line-clamp-4 font-sans mb-3 sm:mb-5">
                    {banner.description}
                  </p>
                  
                  {/* Call To Action Button */}
                  {(() => {
                    const link = banner.targetLink || banner.link || '';
                    if (!link) return null;
                    const isExternal = !link.startsWith('#') && !link.startsWith('/');
                    const btnClasses = "px-5 py-2 sm:px-6 sm:py-3.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-black rounded-xl text-[10px] sm:text-xs md:text-sm tracking-wide transition-all duration-300 shadow-lg shadow-gold-500/20 active:scale-95 cursor-pointer inline-flex items-center gap-2 no-underline select-none";

                    if (isExternal) {
                      return (
                        <div className="mt-1">
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={btnClasses}
                          >
                            <span>Selengkapnya</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </div>
                      );
                    }

                    return (
                      <div className="mt-1">
                        <button
                          onClick={() => handleCtaClick(link)}
                          className={btnClasses}
                        >
                          <span>Selengkapnya</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {/* Right Block: Fully Crisp & Bright Photo (Un-obscured background image) */}
                <div className="w-full md:w-[55%] h-[50%] md:h-full relative overflow-hidden bg-[#000E22]">
                  <img
                    src={banner.imageUrl || banner.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200'}
                    alt={banner.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle vignette layer at edges to bridge content smoothly, keeping the main picture fully intact */}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows for Slider with modern circular styling */}
          {activeBanners.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-navy-950/70 hover:bg-gold-500 hover:text-navy-950 text-white flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-gold-500 active:scale-90 shadow-lg cursor-pointer"
                aria-label="Previous Promo"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-navy-950/70 hover:bg-gold-500 hover:text-navy-950 text-white flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-gold-500 active:scale-90 shadow-lg cursor-pointer"
                aria-label="Next Promo"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Slider Bullet Indicators */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-6 right-6 z-20 flex gap-2">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex ? 'w-8 bg-gold-500' : 'w-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}
