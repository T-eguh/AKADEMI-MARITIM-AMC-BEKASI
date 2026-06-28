/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AlumniItem } from '../types';

interface TestimonialsProps {
  alumni: AlumniItem[];
}

export default function Testimonials({ alumni }: TestimonialsProps) {
  // Filter active and published alumni
  const activeAlumni = alumni.filter(
    (item) => item.isFeatured !== false && item.status === 'published'
  );

  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<(() => void) | null>(null);

  const handleNext = () => {
    if (activeAlumni.length === 0) return;
    setStartIndex((prev) => (prev + 1) % activeAlumni.length);
  };

  const handlePrev = () => {
    if (activeAlumni.length === 0) return;
    setStartIndex((prev) => (prev - 1 + activeAlumni.length) % activeAlumni.length);
  };

  useEffect(() => {
    autoPlayRef.current = handleNext;
  });

  useEffect(() => {
    if (activeAlumni.length <= 3 || isHovered) return;

    const play = () => {
      if (autoPlayRef.current) autoPlayRef.current();
    };

    const timer = setInterval(play, 5000); // Auto slide every 5 seconds
    return () => clearInterval(timer);
  }, [activeAlumni.length, isHovered]);

  if (activeAlumni.length === 0) return null;

  // Get visible items based on current start index (looping circularly)
  const getVisibleAlumni = () => {
    const visible: AlumniItem[] = [];
    const count = Math.min(activeAlumni.length, 3);
    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % activeAlumni.length;
      // Prevent duplicates in case total length is less than 3
      if (!visible.some(item => item.id === activeAlumni[index].id)) {
        visible.push(activeAlumni[index]);
      }
    }
    return visible;
  };

  const displayAlumni = getVisibleAlumni();

  return (
    <section 
      className="py-20 bg-[#031830] text-white overflow-hidden relative" 
      id="testimonials"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative premium ambient gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-widest uppercase">
              TESTIMONI ALUMNI
            </h2>
            <div className="w-16 h-0.5 bg-gold-500 mt-3 rounded-full mx-auto sm:mx-0" />
          </div>

          {/* Navigation Controls */}
          {activeAlumni.length > 3 && (
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-navy-950/80 hover:bg-gold-500 text-white hover:text-navy-950 flex items-center justify-center border border-white/10 transition-all duration-300 active:scale-90"
                aria-label="Sebelumnya"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-navy-950/80 hover:bg-gold-500 text-white hover:text-navy-950 flex items-center justify-center border border-white/10 transition-all duration-300 active:scale-90"
                aria-label="Selanjutnya"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Testimonials Card Slider Viewport */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
          {displayAlumni.map((item) => (
            <div
              key={item.id}
              className="bg-[#0c2340]/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-stretch gap-4 hover:border-gold-500/30 hover:bg-[#0c2340]/60 transition-all duration-300 min-h-[190px] animate-fade-in"
            >
              {/* Profile Photo - Vertical portrait layout with standard rounded corners */}
              <div className="w-[110px] sm:w-[120px] relative overflow-hidden rounded-xl border border-white/15 shrink-0 bg-navy-950/50">
                <img
                  src={item.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'}
                  alt={item.name}
                  className="w-full h-full object-cover object-center rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-between flex-1 py-1">
                {/* Kesan & Pesan / Testimonial */}
                <p className="text-xs sm:text-sm text-slate-200 italic font-sans leading-relaxed line-clamp-4 select-none mb-2">
                  "{item.testimonial}"
                </p>

                {/* Star Rating */}
                {item.rating && (
                  <div className="flex gap-0.5 text-gold-400 text-xs mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < (item.rating || 5) ? "text-gold-400" : "text-white/20"}>★</span>
                    ))}
                  </div>
                )}

                {/* Profile Meta: Name, Company, and Ship Name */}
                <div className="mt-auto pt-2 border-t border-white/5">
                  {/* Full Name - Bold Uppercase */}
                  <h4 className="font-display font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider line-clamp-1">
                    {item.name}
                  </h4>
                  
                  {/* Subtitle displaying Company and Ship Name in Gold */}
                  <div className="text-[10px] sm:text-[11px] text-gold-400 font-bold tracking-wide mt-1 space-y-0.5">
                    <p className="uppercase line-clamp-1">{item.company || 'Alumni AMC'}</p>
                    {item.shipName && (
                      <p className="text-slate-300 font-normal font-mono flex items-center gap-1 mt-0.5 line-clamp-1">
                        <span className="text-gold-400">⚓</span> {item.shipName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sliding Dot Indicators */}
        {activeAlumni.length > 3 && (
          <div className="flex justify-center gap-2 mt-8">
            {activeAlumni.map((_, index) => (
              <button
                key={index}
                onClick={() => setStartIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === startIndex ? 'w-6 bg-gold-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

