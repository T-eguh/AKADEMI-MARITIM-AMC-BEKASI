/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NewsItem } from '../types';
import { ArrowRight, X, Sparkles } from 'lucide-react';

interface NewsProps {
  newsItems: NewsItem[];
  lang?: 'id' | 'en';
}

export default function News({ newsItems, lang = 'id' }: NewsProps) {
  const isEn = lang === 'en';
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);



  return (
    <section id="news" className="py-24 bg-slate-50 text-slate-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-navy-800 bg-navy-50 px-3.5 py-1.5 rounded-full inline-block">
            {isEn ? 'News Portal' : 'Portal Berita'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-navy-950">
            {isEn ? 'Latest AMC Bekasi Maritime News' : 'Kabar Maritim AMC Bekasi Terbaru'}
          </h2>
          <p className="text-gray-600 font-sans text-sm max-w-xl mx-auto">
            {isEn 
              ? 'Follow our latest campus operations, strategic industry collaborations, and the stellar achievements of our cadets.'
              : 'Ikuti berbagai aktivitas terbaru, jalinan kerjasama strategis industri, serta pencapaian prestasi akademik Taruna-Taruni kami.'}
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-navy-800/10 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative h-56 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                {/* Blurred backdrop to frame different aspect ratios cleanly without cropping */}
                <img
                  src={item.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="relative max-w-full max-h-full object-contain z-10 transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float Category Tag */}
                <div className="absolute top-4 left-4 bg-navy-800 text-gold-500 px-3.5 py-1.5 rounded-xl font-display font-bold text-[10px] tracking-wider uppercase shadow-md border border-white/5">
                  {item.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Headline */}
                  <h3 className="font-display font-bold text-base sm:text-lg text-navy-950 line-clamp-2 group-hover:text-navy-800 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-500 font-sans text-xs sm:text-sm leading-relaxed line-clamp-3 text-justify">
                    {item.summary}
                  </p>
                </div>

                {/* Read more action */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-navy-800 group-hover:text-gold-600 font-sans font-bold text-xs sm:text-sm transition-colors shrink-0">
                  <span>{isEn ? 'Read More' : 'Baca Selengkapnya'}</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Detailed Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-fade-in my-8 max-h-[90vh] flex flex-col">
              
              {/* Header Cover Image */}
              <div className="relative h-56 sm:h-80 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent z-20 pointer-events-none" />
                {/* Blurred backdrop to frame different aspect ratios cleanly without cropping */}
                <img
                  src={selectedArticle.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="relative max-w-full max-h-full object-contain z-10 p-2"
                  referrerPolicy="no-referrer"
                />
                
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Category Tag */}
                <div className="absolute top-4 left-4 z-20 bg-gold-500 text-navy-950 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  {selectedArticle.category}
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-6 flex-1">
                
                {/* Title */}
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-navy-950 leading-snug">
                  {selectedArticle.title}
                </h3>

                {/* Content Paragraphs */}
                <div className="space-y-4 font-sans text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
                  {(selectedArticle.content || '').split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

              </div>

              {/* Footer Panel */}
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="bg-navy-800 hover:bg-navy-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  {isEn ? 'Close Article' : 'Tutup Bacaan'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
