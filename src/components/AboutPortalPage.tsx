/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building2, Image, Newspaper, GraduationCap, ChevronRight } from 'lucide-react';

interface AboutPortalPageProps {
  lang: 'id' | 'en';
  onNavigate: (path: string) => void;
}

export default function AboutPortalPage({ lang, onNavigate }: AboutPortalPageProps) {
  const isEn = lang === 'en';

  const items = [
    {
      title: isEn ? 'Facilities' : 'Fasilitas Diklat',
      desc: isEn 
        ? 'Explore our world-class maritime training facilities, simulators, and libraries.' 
        : 'Lihat laboratorium simulator kapal, asrama, bengkel teknik, dan sarana belajar modern kami.',
      path: '/fasilitas',
      icon: Building2,
      color: 'bg-blue-500/20 text-blue-300'
    },
    {
      title: isEn ? 'Gallery' : 'Galeri Kegiatan',
      desc: isEn 
        ? 'Captured moments of cadet life, ceremonies, sea training, and campus events.' 
        : 'Dokumentasi foto dan video kegiatan latihan, upacara pelantikan, kesamaptaan, dan asrama.',
      path: '/galeri',
      icon: Image,
      color: 'bg-sky-500/20 text-sky-300'
    },
    {
      title: isEn ? 'News & Announcements' : 'Berita & Pengumuman',
      desc: isEn 
        ? 'Stay updated with the latest academic announcements, news, and insights.' 
        : 'Ikuti informasi akademik terbaru, berita prestasi taruna, pengumuman, dan agenda kampus.',
      path: '/berita',
      icon: Newspaper,
      color: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      title: isEn ? 'Alumni Directory' : 'Alumni & Tracer Study',
      desc: isEn 
        ? 'Connecting our successful graduates commanding merchant fleets globally.' 
        : 'Jejaring lulusan AMC Bekasi yang telah sukses berkarir di industri pelayaran nasional & global.',
      path: '/alumni',
      icon: GraduationCap,
      color: 'bg-amber-500/20 text-amber-300'
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-b from-[#001B3A] to-[#003B7A] min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full inline-block mb-3">
            {isEn ? 'Campus Services' : 'Layanan & Kegiatan'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            {isEn ? 'Information Portal' : 'Portal Informasi Utama'}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mt-4 leading-relaxed">
            {isEn 
              ? 'Find everything you need to know about our modern training facilities, student activities, latest announcements, and global alumni network.'
              : 'Temukan segala informasi mengenai fasilitas pendidikan, galeri dokumentasi kegiatan taruna, berita pengumuman terbaru, hingga direktori jejaring alumni AMC Bekasi.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {items.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => onNavigate(item.path)}
              className="bg-navy-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-lg hover:bg-navy-900/60 hover:border-gold-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl w-fit ${item.color}`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white group-hover:text-gold-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
              
              <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs font-bold text-gold-400 group-hover:text-white transition-colors">
                <span>{isEn ? 'Explore Section' : 'Buka Halaman'}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
