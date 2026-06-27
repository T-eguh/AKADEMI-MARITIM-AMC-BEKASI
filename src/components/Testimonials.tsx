/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlumniItem } from '../types';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialsProps {
  alumni: AlumniItem[];
}

export default function Testimonials({ alumni }: TestimonialsProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const prevTesti = () => {
    setActiveIdx((prev) => (prev - 1 + alumni.length) % alumni.length);
  };

  const nextTesti = () => {
    setActiveIdx((prev) => (prev + 1) % alumni.length);
  };

  const activeAlumni = alumni.filter(item => item.isFeatured !== false && item.status === 'published');

  if (activeAlumni.length === 0) return null;
  const current = activeAlumni[activeIdx];

  return (
    <section className="py-20 bg-navy-900 text-white overflow-hidden relative" id="testimonials">
      
      {/* Decorative premium ambient gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-gold-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full inline-block">
            Kisah Sukses Alumni
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Alumni AMC Bekasi di Kancah Global
          </h2>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto rounded-full" />
        </div>

        {/* Testimonial Main Card Container */}
        <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-10 lg:p-12 flex flex-col items-center text-center space-y-6">
          <Quote className="h-10 w-10 text-gold-500/10 absolute top-6 left-6" />
          
          {/* Elegant 5 Stars Rating with Reduced Spacing */}
          <div className="flex items-center space-x-0.5 text-gold-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold-400 stroke-gold-400" />
            ))}
          </div>

          {/* Testimonial Quote - 800px max width, 1.8 leading, precise text sizing */}
          <blockquote className="font-sans text-[16px] md:text-[18px] lg:text-[20px] text-gray-100 italic leading-[1.8] max-w-[800px] text-center select-none">
            "{current.testimonial}"
          </blockquote>

          {/* Alumni profile in original position below quote */}
          <div className="pt-6 border-t border-white/10 w-full max-w-lg flex flex-col items-center">
            {/* Profile Photo - Increased size to 130px-140px, perfect circle, white border, soft shadow */}
            <div className="mb-4">
              <img
                src={current.photo}
                alt={current.name}
                className="h-[135px] w-[135px] rounded-full object-cover border-4 border-white shadow-xl shadow-black/30 transition-transform duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Program Study - Display only Nautika, Teknika, KPN as small gray text */}
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Prodi {current.studyProgram}
            </span>
            
            {/* Name - Desktop 28px, Tablet 24px, Mobile 22px, Bold, Yellow color */}
            <h4 className="font-display font-bold text-[22px] md:text-[24px] lg:text-[28px] text-gold-400 leading-tight">
              {current.name}
            </h4>

            {/* Job Title - Reduced size, white color, medium weight below name */}
            <div className="text-xs sm:text-sm text-white font-medium mt-1">
              {current.occupation}
            </div>

            {/* Company Badge - Compact, clean rounded badge */}
            <div className="inline-flex items-center space-x-1.5 bg-white/10 border border-white/10 text-[10px] sm:text-[11px] text-white px-3 py-1 rounded-full mt-3 font-semibold shadow-sm max-w-full truncate">
              <span>⚓ {current.occupation} • {current.company}</span>
            </div>
          </div>

          {/* Slider Controls with arrows and dots indicators */}
          <div className="flex flex-col items-center space-y-3 pt-2 w-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={prevTesti}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition focus:outline-none cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Dots indicators */}
              <div className="flex items-center space-x-1.5">
                {activeAlumni.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIdx === idx ? 'w-5 bg-gold-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTesti}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition focus:outline-none cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <span className="text-[10px] text-gray-400 font-mono">
              {activeIdx + 1} / {activeAlumni.length}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
