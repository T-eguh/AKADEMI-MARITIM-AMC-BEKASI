/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { ProgramItem } from '../types';

interface ProgramsProps {
  programs: ProgramItem[];
  onNavigate: (sectionId: string) => void;
  lang?: 'id' | 'en';
}

export default function Programs({ programs, onNavigate, lang = 'id' }: ProgramsProps) {
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);
  const isEn = lang === 'en';

  return (
    <section id="programs" className="py-28 bg-gradient-to-b from-[#003B7A] to-[#001B3A] text-white scroll-mt-16 relative">
      {/* Wave Divider flowing seamlessly from the previous section's background */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 transform -translate-y-[98%] pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] text-[#003B7A] fill-current">
          <path d="M0,0 C300,100 900,0 1200,60 L1200,120 L0,120 Z" className="opacity-100"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-400 bg-white/10 px-3.5 py-1.5 rounded-full inline-block">
            {isEn ? 'Study Programs' : 'Program Studi'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            {isEn ? 'Accredited & Premier Maritime Education' : 'Pendidikan Vokasi Unggulan & Berlisensi'}
          </h2>
          <p className="text-blue-100 font-sans text-sm max-w-xl mx-auto">
            {isEn 
              ? 'An international-scale curriculum aligning maritime core theories, physical discipline, and professional sea-going licenses ready for immediate industry deployment.'
              : 'Kurikulum berskala internasional yang menyelaraskan teori, kedisiplinan fisik, dan sertifikasi keahlian laut langsung siap pakai di industri maritim.'}
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        {/* Major Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog) => {
            // Dynamically resolve icon if it exists in Lucide
            const IconComponent = (LucideIcons as any)[prog.iconName] || LucideIcons.Compass;
            
            return (
              <div
                key={prog.id}
                className="group flex flex-col bg-navy-900/40 backdrop-blur-md border border-white/10 rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedProgram(prog)}
              >
                {/* Thumbnail Header */}
                <div className="relative h-48 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-navy-900/25 z-20 group-hover:bg-navy-900/10 transition-all duration-300 pointer-events-none" />
                  {/* Blurred backdrop to frame different aspect ratios cleanly without cropping */}
                  <img
                    src={prog.imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src={prog.imageUrl}
                    alt={prog.title}
                    loading="lazy"
                    className="relative max-w-full max-h-full object-contain z-10 transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Icon Box */}
                  <div className="absolute bottom-4 left-6 z-30 flex items-center space-x-3">
                    <div className="p-3 bg-gold-500 text-navy-950 rounded-xl shadow-lg transform group-hover:rotate-12 transition-all">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display font-bold text-xl text-white group-hover:text-gold-400 transition-colors">
                        {prog.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-1 bg-white/10 text-gold-300 rounded-md border border-white/10">
                        D3 DIPLOMA
                      </span>
                    </div>
                    
                    <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider font-display">
                      {prog.abbreviation}
                    </p>

                    <p className="text-blue-100 font-sans text-xs leading-relaxed text-justify line-clamp-3">
                      {prog.description}
                    </p>
                  </div>

                  {/* Read More button */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-blue-200 font-bold group-hover:text-gold-400 transition-colors">
                      {isEn ? 'Explore Competency & Careers →' : 'Pelajari Kompetensi & Karir →'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Program Modal (Lightbox details) */}
        {selectedProgram && (
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-navy-950 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/10 animate-fade-in my-8 max-h-[90vh] flex flex-col">
              
              {/* Header Image Cover */}
              <div className="relative h-48 sm:h-56 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent z-20 pointer-events-none" />
                {/* Blurred backdrop to frame different aspect ratios cleanly without cropping */}
                <img
                  src={selectedProgram.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <img
                  src={selectedProgram.imageUrl}
                  alt={selectedProgram.title}
                  className="relative max-w-full max-h-full object-contain z-10 p-2"
                  referrerPolicy="no-referrer"
                />
                
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all focus:outline-none"
                >
                  <LucideIcons.X className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-6 z-30 text-white">
                  <span className="text-xs text-gold-400 font-bold uppercase tracking-wider block">{isEn ? 'PROGRAM DETAILS' : 'PRODI DETAIL'}</span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl drop-shadow-md">
                    {selectedProgram.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-white">
                
                {/* Degree block */}
                <div className="bg-white/5 border-l-4 border-gold-500 p-4 rounded-r-xl">
                  <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest font-display mb-1">{isEn ? 'Degree & Licensure' : 'Gelar Kelulusan & Lisensi'}</h4>
                  <p className="text-sm font-semibold text-white">{selectedProgram.degree}</p>
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gold-400/80 uppercase tracking-widest font-display">{isEn ? 'Curriculum Overview' : 'Ringkasan Kurikulum'}</h4>
                  <p className="text-blue-100 font-sans text-sm leading-relaxed text-justify">
                    {selectedProgram.fullDetails}
                  </p>
                </div>

                {/* Career opportunities list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gold-400/80 uppercase tracking-widest font-display">{isEn ? 'Career Opportunities' : 'Peluang Karir Lulusan'}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProgram.careerOpportunities.map((career, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <LucideIcons.CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-200 font-sans font-medium">{career}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer action buttons */}
              <div className="p-5 bg-navy-900 border-t border-white/10 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="text-slate-400 hover:text-white text-sm font-semibold px-4 py-2"
                >
                  {isEn ? 'Close' : 'Tutup'}
                </button>
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    onNavigate('pmb');
                  }}
                  className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all"
                >
                  {isEn ? 'Register Now' : 'Daftar Sekarang'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
