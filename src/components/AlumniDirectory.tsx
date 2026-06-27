/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Ship, 
  Compass, 
  GraduationCap, 
  Filter, 
  ChevronRight,
  User,
  Quote,
  X,
  Anchor
} from 'lucide-react';
import { AlumniItem } from '../types';

interface AlumniDirectoryProps {
  alumni: AlumniItem[];
  lang: 'id' | 'en';
  onNavigate: (path: string) => void;
}

export default function AlumniDirectory({ alumni, lang, onNavigate }: AlumniDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniItem | null>(null);

  // Get unique graduation years for filter
  const years = Array.from(new Set(alumni.map(a => a.graduationYear))).sort((a, b) => b.localeCompare(a));

  // Filtered and sorted alumni list
  const filteredAlumni = alumni
    .filter(item => {
      // Only show published items
      if (item.status && item.status !== 'published') return false;

      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.placement && item.placement.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (item.shipName && item.shipName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMajor = selectedMajor === 'all' || item.studyProgram === selectedMajor;
      const matchesYear = selectedYear === 'all' || item.graduationYear === selectedYear;

      return matchesSearch && matchesMajor && matchesYear;
    })
    .sort((a, b) => {
      // Sort by displayOrder ascending. Default to 9999 if displayOrder is not set.
      const orderA = a.displayOrder !== undefined ? a.displayOrder : 9999;
      const orderB = b.displayOrder !== undefined ? b.displayOrder : 9999;
      return orderA - orderB;
    });

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-gold-400 uppercase bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full inline-block">
                {lang === 'id' ? 'Direktori Alumni' : 'Alumni Directory'}
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-none">
                {lang === 'id' ? 'Jejaring Alumni AMC Bekasi' : 'AMC Bekasi Alumni Network'}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {lang === 'id' 
                  ? 'Menghubungkan perwira pelayaran dan ahli pelabuhan lulusan AMC Bekasi yang tersebar di seluruh dunia.'
                  : 'Connecting shipping officers and port logistics experts graduated from AMC Bekasi across the globe.'}
              </p>
            </div>
            
            {/* Quick Stats Block */}
            <div className="flex bg-navy-900/60 backdrop-blur border border-white/10 rounded-xl p-6 shadow-inner gap-8 shrink-0">
              <div className="text-center border-r border-white/10 pr-6">
                <span className="block text-3xl font-bold text-gold-400">95%</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Terserap Kerja</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-bold text-gold-400">1000+</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Perwira Laut</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Directory Core */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'id' ? "Cari alumni berdasarkan nama, perusahaan, .." : "Search alumni by name, , company, ..."}
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-700 placeholder-slate-400 bg-slate-50/50 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 text-slate-500 font-medium text-sm">
                <Filter className="w-4 h-4" />
                <span>Filters:</span>
              </div>

              {/* Major Filter */}
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
              >
                <option value="all">{lang === 'id' ? 'Semua Program Studi' : 'All Study Programs'}</option>
                <option value="Nautika">Nautika (Deck)</option>
                <option value="Teknika">Teknika (Engineering)</option>
                <option value="KPN">KPN (Kepelabuhanan)</option>
              </select>

              {/* Graduation Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
              >
                <option value="all">{lang === 'id' ? 'Semua Tahun Lulus' : 'All Graduation Years'}</option>
                {years.map(y => (
                  <option key={y} value={y}>Tahun {y}</option>
                ))}
              </select>

              {/* Reset Filters */}
              {(searchQuery || selectedMajor !== 'all' || selectedYear !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMajor('all');
                    setSelectedYear('all');
                  }}
                  className="text-xs text-red-500 font-medium hover:underline px-2 cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Directory Grid with requested card modifications */}
        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlumni.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
              >
                {/* Visual Header / Backdrop */}
                <div className="h-20 bg-gradient-to-r from-navy-800 to-navy-950 relative" />

                {/* Profile Photo Overlay */}
                <div className="flex justify-center -mt-[60px] mb-3 relative z-10">
                  <div className="w-[120px] h-[120px] rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md transition-transform group-hover:scale-105 duration-300">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-navy-100 text-navy-800 flex items-center justify-center">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Details - strictly limited to specified items: Name, Ship, Company, Testimonial, Button */}
                <div className="px-6 pb-6 flex-1 flex flex-col text-center">
                  
                  {/* Full Name */}
                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-navy-700 transition-colors">
                    {item.name}
                  </h3>
                  
                  {/* Company Name */}
                  <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mt-1.5 flex items-center justify-center space-x-1">
                    <Anchor className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>{item.company}</span>
                  </p>

                  {/* Ship Name */}
                  {item.shipName && (
                    <p className="text-xs text-navy-800 font-semibold mt-1.5 flex items-center justify-center space-x-1 font-mono">
                      <Ship className="w-3.5 h-3.5 text-navy-700 shrink-0" />
                      <span>{item.shipName}</span>
                    </p>
                  )}

                  {/* Short Testimonial / Kesan Pesan */}
                  <p className="text-slate-600 text-xs italic line-clamp-3 my-4 px-2 flex-1 border-t border-slate-100 pt-3.5 leading-relaxed">
                    "{item.testimonial}"
                  </p>

                  {/* Detail Button */}
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-center">
                    <button
                      onClick={() => setSelectedAlumni(item)}
                      className="w-full py-2.5 px-4 bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-sm"
                    >
                      <span>{lang === 'id' ? 'Selengkapnya' : 'View Details'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center border border-slate-100 max-w-xl mx-auto">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-slate-800 mb-2">
              {lang === 'id' ? 'Alumni Tidak Ditemukan' : 'Alumni Not Found'}
            </h3>
            <p className="text-slate-500 text-sm">
              {lang === 'id' 
                ? 'Silakan coba cari dengan kata kunci lain atau ubah filter program studi dan tahun kelulusan.'
                : 'Please try searching with another keyword or adjust the program or year filters.'}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal Dialog - Premium, clean, displaying ONLY: Large Photo, Full Name, Study Program, Current Position, Ship Name, Company Name, Current Placement, Short Testimonial */}
      {selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Header / Backdrop banner */}
            <div className="h-32 bg-gradient-to-r from-navy-900 to-navy-950 relative p-6 flex items-end">
              <button
                onClick={() => setSelectedAlumni(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4 translate-y-10 relative z-10">
                {/* Photo - Size 150-160px (150px) perfect circle, white border, soft shadow */}
                <div className="w-[150px] h-[150px] rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-lg shrink-0">
                  <img
                    src={selectedAlumni.photo}
                    alt={selectedAlumni.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Content - Only displaying the specified properties */}
            <div className="p-6 pt-14 overflow-y-auto flex-1 space-y-6">
              
              {/* Name only */}
              <div className="text-center md:text-left">
                <h2 className="font-display font-extrabold text-2xl text-navy-950">
                  {selectedAlumni.name}
                </h2>
              </div>

              {/* Core Details Grid */}
              <div className="grid grid-cols-1 gap-4">
                
               

                {/* Company Name */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Perusahaan</span>
                  <span className="text-sm font-bold text-slate-800 flex items-center mt-1">
                    <Anchor className="w-4 h-4 mr-2 text-gold-500 shrink-0" />
                    {selectedAlumni.company}
                  </span>
                </div>

                {/* Optional Ship Name block */}
                {selectedAlumni.shipName && (
                  <div className="bg-navy-50/50 p-3.5 rounded-xl border border-navy-100">
                    <span className="block text-[10px] text-navy-400 uppercase tracking-widest font-bold">Kapal Penugasan</span>
                    <span className="text-sm font-bold text-navy-950 flex items-center mt-1">
                      <Ship className="w-4 h-4 mr-2 text-navy-700 shrink-0" />
                      {selectedAlumni.shipName}
                    </span>
                  </div>
                )}

                
              </div>

              {/* Quote Testimonial only */}
              <div className="bg-gold-50 border-l-4 border-gold-500 p-5 rounded-r-xl relative">
                <Quote className="absolute right-4 top-2 w-12 h-12 text-gold-200/50 pointer-events-none" />
                <h4 className="font-display font-bold text-sm text-gold-800 mb-1 flex items-center">
                  <Compass className="w-4 h-4 mr-1 text-gold-600" />
                  {lang === 'id' ? 'Pesan & Kesan Alumni' : 'Words of Wisdom'}
                </h4>
                <p className="text-slate-700 text-sm italic leading-relaxed relative z-10">
                  "{selectedAlumni.testimonial}"
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end shrink-0">
              <button
                onClick={() => setSelectedAlumni(null)}
                className="py-1.5 px-5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold transition-all focus:outline-none shadow cursor-pointer"
              >
                {lang === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
