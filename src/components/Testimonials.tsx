/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlumniItem } from '../types';

interface TestimonialsProps {
  alumni: AlumniItem[];
}

export default function Testimonials({ alumni }: TestimonialsProps) {
  // Filter active and published alumni
  const activeAlumni = alumni.filter(
    (item) => item.isFeatured !== false && item.status === 'published'
  );

  if (activeAlumni.length === 0) return null;

  // We display up to 3 testimonials side-by-side in a beautiful grid as requested
  const displayAlumni = activeAlumni.slice(0, 3);

  return (
    <section className="py-20 bg-[#031830] text-white overflow-hidden relative" id="testimonials">
      {/* Decorative premium ambient gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-widest uppercase">
            TESTIMONI ALUMNI
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-3 rounded-full" />
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displayAlumni.map((item) => (
            <div
              key={item.id}
              className="bg-[#0c2340]/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-stretch gap-4 hover:border-gold-500/30 hover:bg-[#0c2340]/60 transition-all duration-300"
            >
              {/* Profile Photo - Vertical portrait layout with standard rounded corners */}
              <div className="w-[110px] sm:w-[130px] relative overflow-hidden rounded-xl border border-white/15 shrink-0 bg-navy-950/50">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-full object-cover object-center rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-between flex-1 py-1">
                {/* Kesan & Pesan / Testimonial */}
                <p className="text-xs sm:text-sm text-slate-200 italic font-sans leading-relaxed line-clamp-4 select-none mb-4">
                  "{item.testimonial}"
                </p>

                {/* Profile Meta: Name, Company, and Ship Name */}
                <div className="mt-auto pt-2 border-t border-white/5">
                  {/* Full Name - Bold Uppercase */}
                  <h4 className="font-display font-extrabold text-sm sm:text-[15px] text-white uppercase tracking-wider">
                    {item.name}
                  </h4>
                  
                  {/* Subtitle displaying Company and Ship Name in Gold */}
                  <div className="text-[11px] sm:text-xs text-gold-400 font-bold tracking-wide mt-1 space-y-0.5">
                    <p className="uppercase">{item.company}</p>
                    {item.shipName && (
                      <p className="text-slate-300 font-normal font-mono flex items-center gap-1 mt-0.5">
                        <span className="text-gold-400">⚓</span> {item.shipName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

