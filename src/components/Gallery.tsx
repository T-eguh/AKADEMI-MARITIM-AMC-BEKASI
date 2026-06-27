/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryProps {
  galleryItems: GalleryItem[];
  lang?: 'id' | 'en';
}

export default function Gallery({ galleryItems, lang = 'id' }: GalleryProps) {
  const isEn = lang === 'en';
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIdx === null) return;
    setLightboxIdx((prev) => (prev! - 1 + galleryItems.length) % galleryItems.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIdx === null) return;
    setLightboxIdx((prev) => (prev! + 1) % galleryItems.length);
  };

  return (
    <section id="gallery" className="py-24 bg-white text-slate-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-navy-800 bg-navy-50 px-3.5 py-1.5 rounded-full inline-block">
            {isEn ? 'Campus Documentation' : 'Dokumentasi Kampus'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-navy-950">
            {isEn ? 'Cadet Life & Maritime Training Photo Gallery' : 'Galeri Kehidupan Taruna & Aktivitas Bahari AMC Bekasi'}
          </h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        {/* Unified Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIdx(index)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-navy-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white z-10">
                <div className="p-2 bg-gold-500/20 border border-gold-500/30 text-gold-400 rounded-lg self-start text-[10px] font-bold uppercase tracking-widest mb-2.5">
                  {item.category}
                </div>
                <h4 className="font-display font-bold text-base leading-snug">{item.title}</h4>
                <p className="text-xs text-gray-300 font-sans mt-1 line-clamp-2">{item.description}</p>
              </div>

              {/* Corner Zoom icon */}
              <div className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox / Slideshow Modal */}
        {lightboxIdx !== null && galleryItems[lightboxIdx] && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-4"
            onClick={() => setLightboxIdx(null)}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white p-2">
              <span className="text-xs font-mono font-medium tracking-widest text-gray-400">
                {lightboxIdx + 1} / {galleryItems.length}
              </span>
              
              <button
                onClick={() => setLightboxIdx(null)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main view container */}
            <div className="flex-1 flex items-center justify-between relative max-w-5xl mx-auto w-full">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Central Image */}
              <div className="w-full flex justify-center p-4 max-h-[70vh]">
                <img
                  src={galleryItems[lightboxIdx].imageUrl}
                  alt={galleryItems[lightboxIdx].title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div
              className="bg-navy-950/80 border border-white/5 p-6 rounded-2xl max-w-3xl mx-auto w-full text-white mb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest block mb-1">
                {isEn ? 'CATEGORY: ' : 'KATEGORI: '}{galleryItems[lightboxIdx].category}
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl">
                {galleryItems[lightboxIdx].title}
              </h3>
              <p className="text-sm text-gray-300 font-sans mt-1.5 leading-relaxed">
                {galleryItems[lightboxIdx].description}
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
