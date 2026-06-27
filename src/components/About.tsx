/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Target, Award, User, Quote } from 'lucide-react';
import { SiteContent, WebsiteImage } from '../types';

interface AboutProps {
  content: SiteContent;
  images: WebsiteImage[];
  lang?: 'id' | 'en';
}

export default function About({ content, images, lang = 'id' }: AboutProps) {
  const [activeTab, setActiveTab] = useState<'visi' | 'misi' | 'tujuan'>('visi');
  const [activeSambutan, setActiveSambutan] = useState<'owner' | 'director'>('owner');
  const isEn = lang === 'en';

  // Get the campus image, owner image, and director image
  const campusImg = images.find((img) => img.id === 'about_campus')?.url || 
    'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop';
  
  const ownerImg = images.find((img) => img.id === 'about_owner')?.url || 
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop';

  const directorImg = images.find((img) => img.id === 'about_director')?.url || 
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop';

  return (
    <section id="about" className="py-28 bg-gradient-to-b from-[#001B3A] to-[#003B7A] text-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-400 bg-white/10 px-3.5 py-1.5 rounded-full inline-block">
            {isEn ? 'Campus Profile' : 'Profil Kampus'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            {isEn ? "Building the Nation's Maritime Future" : "Membangun Masa Depan Bahari Bangsa"}
          </h2>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        {/* 2 Column Layout: History & Campus Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          
          {/* Left Column: History & Tabs */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display font-semibold text-2xl text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-gold-500" />
              {isEn ? 'About AMC BEKASI' : 'Sekilas AMC Bekasi'}
            </h3>
            
            <p className="font-sans text-blue-100 leading-relaxed text-justify">
              {content.about.history}
            </p>

            {/* Visi & Misi & Tujuan Toggle Tabs with 20px rounded corners & premium shadow */}
            <div className="bg-white p-6 rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-slate-100/50 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <div className="flex border-b border-gray-100 mb-5">
                <button
                  onClick={() => setActiveTab('visi')}
                  className={`flex-1 text-center font-display font-bold pb-3 text-sm tracking-wide transition-all ${
                    activeTab === 'visi'
                      ? 'text-navy-800 border-b-2 border-navy-800'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isEn ? 'VISION' : 'VISI'}
                </button>
                <button
                  onClick={() => setActiveTab('misi')}
                  className={`flex-1 text-center font-display font-bold pb-3 text-sm tracking-wide transition-all ${
                    activeTab === 'misi'
                      ? 'text-navy-800 border-b-2 border-navy-800'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isEn ? 'MISSION' : 'MISI'}
                </button>
                <button
                  onClick={() => setActiveTab('tujuan')}
                  className={`flex-1 text-center font-display font-bold pb-3 text-sm tracking-wide transition-all ${
                    activeTab === 'tujuan'
                      ? 'text-navy-800 border-b-2 border-navy-800'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isEn ? 'OBJECTIVES' : 'TUJUAN'}
                </button>
              </div>

              {activeTab === 'visi' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-navy-50 text-navy-800 rounded-lg shrink-0 mt-1">
                      <Target className="h-5 w-5 text-navy-800" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-sans italic leading-relaxed text-lg">
                        "{content.about.vision}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'misi' && (
                <div className="space-y-3.5 animate-fade-in">
                  {content.about.mission.map((missionText, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="h-5 w-5 bg-navy-800 text-gold-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 font-sans text-sm leading-relaxed">
                        {missionText}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'tujuan' && (
                <div className="space-y-3.5 animate-fade-in">
                  {(content.about.objectives || [
                    'Menghasilkan lulusan perwira pelayaran niaga yang kompeten, berkarakter prima, berdisiplin tinggi, dan memiliki daya saing global.',
                    'Meningkatkan mutu penelitian terapan di bidang kemaritiman guna memberikan kontribusi nyata bagi industri pelayaran nasional.',
                    'Melaksanakan pengabdian masyarakat yang terarah untuk meningkatkan pemahaman dan kemandirian masyarakat pesisir.',
                    'Mengembangkan jejaring kemitraan strategis dengan perusahaan pelayaran dalam dan luar negeri guna percepatan penyerapan lulusan.'
                  ]).map((objText, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="h-5 w-5 bg-gold-500 text-navy-950 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 font-sans text-sm leading-relaxed">
                        {objText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Campus Image Card */}
          <div className="lg:col-span-5">
            <div className="relative group transform hover:-translate-y-1.5 transition-all duration-300">
              {/* Image Frame Accent */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-gold-500 to-navy-800 rounded-[20px] opacity-10 blur group-hover:opacity-20 transition duration-300" />
              
              <div className="relative bg-white p-3 rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-slate-100/50 overflow-hidden">
                <img
                  src={campusImg}
                  alt="Gedung Kampus AMC Bekasi"
                  loading="lazy"
                  className="w-full h-[380px] object-cover rounded-xl transform hover:scale-[1.02] transition-transform duration-500"
                />
                
                {/* Embedded Mini Stat badge */}
                <div className="absolute bottom-6 left-6 bg-navy-800 text-white p-4 rounded-xl shadow-lg border border-white/10 flex items-center gap-3">
                  <div className="p-2 bg-gold-500 text-navy-950 rounded-lg">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gold-300 uppercase tracking-widest font-bold block">{isEn ? 'ACCREDITATION' : 'AKREDITASI'}</span>
                    <span className="text-sm font-bold font-display block">{isEn ? 'Excellent (B)' : 'Sangat Baik (B)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sambutan Section */}
        <div className="bg-navy-900 rounded-3xl text-white overflow-hidden shadow-2xl border border-white/5">
          {/* Header Controls for Toggling Greeting */}
          <div className="border-b border-white/10 px-6 py-4 flex flex-wrap gap-4 items-center justify-between bg-navy-950/50">
            <span className="text-sm font-display font-bold tracking-wider text-gold-400 uppercase">
              {isEn ? 'GREETINGS FROM THE OWNER AND COLLEGE DIRECTOR OF AMC BEKASI' : 'SAMBUTAN PEMILIK DAN DIREKTUR  AMC BEKASI'}
            </span>
            <div className="flex bg-navy-900 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveSambutan('owner')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeSambutan === 'owner'
                    ? 'bg-gold-500 text-navy-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {isEn ? 'OWNER OF AMC BEKASI' : 'PEMILIK/OWNER AMC BEKASI'}
              </button>
              <button
                onClick={() => setActiveSambutan('director')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeSambutan === 'director'
                    ? 'bg-gold-500 text-navy-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {isEn ? 'Director of the AMC Bekasi Maritime Academy' : 'DIREKTUR AKADEMI MARITIM (AMC BEKASI)'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
            
            {/* Portrait Image */}
            <div className="md:col-span-4 relative h-[320px] md:h-auto min-h-[300px]">
              <img
                src={activeSambutan === 'owner' ? ownerImg : directorImg}
                alt={activeSambutan === 'owner' ? "Sambutan Pemilik" : "Sambutan Direktur"}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-navy-900/40 to-navy-900" />
            </div>

            {/* Text Greeting */}
            <div className="md:col-span-8 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 relative">
              <Quote className="absolute top-8 right-8 h-16 w-16 text-white/5 pointer-events-none" />
              
              <div className="inline-flex items-center space-x-2 text-gold-400">
                <User className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {activeSambutan === 'owner' 
                    ? (isEn ? 'GREETING FROM THE OWNER OF AMC BEKASI' : 'SAMBUTAN PEMILIK/OWNER AMC BEKASI') 
                    : (isEn ? 'GREETING FROM THE COLLEGE DIRECTOR' : 'SAMBUTAN DIREKTUR AMC BEKASI')
                  }
                </span>
              </div>

              <blockquote className="font-sans text-gray-200 text-base leading-relaxed italic relative z-10 text-justify">
                "{activeSambutan === 'owner' ? content.about.ownerMessage : content.about.welcomeMessage}"
              </blockquote>

              <div className="pt-4 border-t border-white/10">
                <h4 className="font-display font-bold text-lg text-gold-500">
                  {activeSambutan === 'owner' ? content.about.ownerName : content.about.directorName}
                </h4>
                <p className="text-xs text-gray-400 tracking-wider uppercase font-medium">
                  {activeSambutan === 'owner' ? content.about.ownerTitle : content.about.directorTitle}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
