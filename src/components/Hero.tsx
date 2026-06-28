/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Anchor, ShieldCheck, Globe, Award } from 'lucide-react';
import { SiteContent, WebsiteImage } from '../types';

interface HeroProps {
  content: SiteContent;
  images: WebsiteImage[];
  onNavigate: (sectionId: string) => void;
  lang?: 'id' | 'en';
}

export default function Hero({ content, images, onNavigate, lang = 'id' }: HeroProps) {
  const isEn = lang === 'en';
  // Use first hero-specific background image or elegant fallback
  const heroBgs = images.filter((img) => img.section === 'hero' && img.url).map((img) => img.url);
  const bgImageUrl = heroBgs.length > 0 ? heroBgs[0] : 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&q=85&w=1920';

  const highlightWords = ['Professional', 'Global', 'Maritime', 'Maritim', 'Profesional', 'Officers'];

  return (
    <section
      id="home"
      className="relative w-full h-screen overflow-hidden bg-black text-white flex items-center"
    >
      {/* Single Stable Background Image */}
      <div className="absolute inset-0 scale-105">
        <img
          src={bgImageUrl}
          alt="Maritim AMC Background"
          loading="eager"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-90 transition-transform duration-1000"
        />
      </div>

      {/* Elegant Blue Transparent Overlay (approx 45% for premium image crispness & clear readability) */}
      <div className="absolute inset-0 bg-[#001B3A]/45 mix-blend-multiply z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#00142C]/95 via-transparent to-[#00142C]/45 z-10" />

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 pt-16 flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-6 flex flex-col items-center">
          
          {/* Dynamic Headline with Premium Text Drop Shadow */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6.5xl text-white leading-tight tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] animate-fade-in select-none max-w-4xl">
            {content.hero.title.split(' ').map((word, i) => (
              <span key={i} className={highlightWords.includes(word.replace(/[,.]/g, '')) ? 'text-amber-400' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>

          {/* Subheadline with clear legibility and shadow */}
          <p className="font-sans text-base sm:text-lg text-gray-150 leading-relaxed max-w-2xl font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mx-auto">
            {content.hero.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('pmb')}
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-gold-500/20 text-center text-sm transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
            >
              {content.hero.ctaPrimary}
            </button>
            <button
              onClick={() => onNavigate('programs')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold px-8 py-4 rounded-xl text-center text-sm transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
            >
              {content.hero.ctaSecondary}
            </button>
          </div>

          {/* Key Advantages Horizontal Band */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-12 border-t border-white/10 max-w-5xl w-full mx-auto">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center sm:space-x-3">
              <div className="p-2 bg-white/5 rounded-lg text-gold-500 mb-2 sm:mb-0">
                <Anchor className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-white">{isEn ? 'Official Bond' : 'Ikatan Dinas'}</h4>
                <p className="text-[11px] text-gray-400">{isEn ? 'Industry Partnership' : 'Kerjasama Industri'}</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center sm:space-x-3">
              <div className="p-2 bg-white/5 rounded-lg text-gold-500 mb-2 sm:mb-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-white">{isEn ? 'Semi Military' : 'Semi Militer'}</h4>
                <p className="text-[11px] text-gray-400">{isEn ? 'Discipline & Character' : 'Mental Disiplin'}</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center sm:space-x-3">
              <div className="p-2 bg-white/5 rounded-lg text-gold-500 mb-2 sm:mb-0">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-white">{isEn ? 'Global Career' : 'Karir Global'}</h4>
                <p className="text-[11px] text-gray-400">{isEn ? 'Global Shipping Line' : 'Kapal Internasional'}</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center sm:space-x-3">
              <div className="p-2 bg-white/5 rounded-lg text-gold-500 mb-2 sm:mb-0">
                <Award className="h-5 w-5 text-amber-500 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-white">{isEn ? 'Accredited' : 'Terakreditasi'}</h4>
                <p className="text-[11px] text-gray-400">BAN-PT & IMO STCW</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Elegant Scroll Cue */}
      <div className="absolute bottom-6 right-8 z-20 hidden md:flex flex-col items-center space-y-2 cursor-pointer" onClick={() => onNavigate('about')}>
        <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold animate-pulse">{isEn ? 'Explore' : 'Eksplor'}</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-gold-500 to-transparent" />
      </div>
    </section>
  );
}
