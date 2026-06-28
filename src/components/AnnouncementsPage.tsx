import React, { useState } from 'react';
import { AnnouncementItem } from '../types';

interface AnnouncementsPageProps {
  announcements: AnnouncementItem[];
  lang: 'id' | 'en';
  onNavigate: (path: string) => void;
}

export default function AnnouncementsPage({ announcements, lang, onNavigate }: AnnouncementsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeAnnouncement, setActiveAnnouncement] = useState<AnnouncementItem | null>(null);

  const published = announcements.filter(ann => ann.status === 'published');

  // Dynamic Categories from Data
  const categories = ['Semua', ...Array.from(new Set(published.map(a => a.category || 'Umum')))];

  const filteredAnnouncements = published.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || (ann.category || 'Umum') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      {/* Visual Header Banner */}
      <div className="bg-[#003B7A] text-white py-12 relative overflow-hidden mb-10">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFC107_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-gold-500 font-bold text-xs uppercase tracking-widest block mb-2">Portal Informasi Taruna</span>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight">PENGUMUMAN RESMI</h1>
          <p className="text-slate-200 text-xs md:text-sm mt-2 max-w-xl font-sans">
            Informasi akademik, pengumuman pendaftaran taruna baru, kalender penting, dan pengumuman kedinasan resmi AMC Bekasi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search and Filters Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Categories Row */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#003B7A] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 flex-shrink-0">
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search announcement...' : 'Cari pengumuman...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003B7A]"
            />
            <svg className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Announcements List Grid */}
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
            <p className="text-slate-500 text-sm font-semibold">Tidak ada pengumuman yang sesuai kata kunci pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => setActiveAnnouncement(ann)}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:border-gold-500/40 relative group"
              >
                <div>
                  {/* Category and Date Header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-[#003B7A]/10 text-[#003B7A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {ann.category || 'Umum'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] font-semibold">{ann.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-slate-800 group-hover:text-[#003B7A] transition-colors leading-snug line-clamp-2 mb-3">
                    {ann.title}
                  </h3>

                  {/* Content Preview */}
                  <div 
                    className="text-xs text-slate-500 font-sans line-clamp-3 mb-6"
                    dangerouslySetInnerHTML={{ __html: ann.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...' }}
                  />
                </div>

                {/* Read More Footer link */}
                <div className="flex items-center text-xs font-bold text-[#003B7A] group-hover:text-gold-600 transition-colors gap-1 mt-auto pt-4 border-t border-slate-50">
                  <span>Lihat Selengkapnya</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Detail Modal Popup */}
      {activeAnnouncement && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setActiveAnnouncement(null)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-100 z-10 animate-fade-in flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-[#003B7A] text-white p-6 relative">
              <span className="bg-gold-500 text-navy-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                {activeAnnouncement.category || 'Umum'}
              </span>
              <h2 className="text-xl font-display font-black leading-tight tracking-tight pr-8">
                {activeAnnouncement.title}
              </h2>
              <p className="text-[11px] text-slate-300 font-mono mt-2 font-medium">Diterbitkan: {activeAnnouncement.date}</p>
              
              <button 
                onClick={() => setActiveAnnouncement(null)}
                className="absolute top-4 right-4 text-white hover:text-gold-500 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Scrollable HTML Content */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 font-sans text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line prose max-w-none">
              <div 
                className="announcement-modal-body"
                dangerouslySetInnerHTML={{ __html: activeAnnouncement.content }}
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveAnnouncement(null)}
                className="px-5 py-2 bg-[#003B7A] hover:bg-[#134887] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md shadow-navy-800/10 transition-colors"
              >
                Tutup Pengumuman
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
