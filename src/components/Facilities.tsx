/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FacilityItem } from '../types';
import { ShieldAlert, Cpu, Laptop, Users, Library, Anchor, Wrench } from 'lucide-react';

interface FacilitiesProps {
  facilities: FacilityItem[];
  lang?: 'id' | 'en';
}

const getFacilityIcon = (title: string, id: string) => {
  const t = (title + ' ' + id).toLowerCase();
  if (t.includes('simulator')) return Cpu;
  if (t.includes('lab') || t.includes('bengkel') || t.includes('teknik') || t.includes('mesin')) return Wrench;
  if (t.includes('kelas') || t.includes('classroom') || t.includes('kuliah') || t.includes('lecture')) return Laptop;
  if (t.includes('perpustakaan') || t.includes('library') || t.includes('buku') || t.includes('digital')) return Library;
  if (t.includes('asrama') || t.includes('dorm') || t.includes('hunian') || t.includes('kamar')) return Users;
  return Anchor;
};

export default function Facilities({ facilities, lang = 'id' }: FacilitiesProps) {
  const isEn = lang === 'en';
  return (
    <section id="facilities" className="py-24 bg-slate-50 text-slate-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-navy-800 bg-navy-50 px-3.5 py-1.5 rounded-full inline-block">
            {isEn ? 'Training Facilities' : 'Fasilitas Diklat'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-navy-950">
            {isEn ? 'State-Of-The-Art Labs & Simulators' : 'Fasilitas AMC Bekasi'}
          </h2>
          <p className="text-gray-600 font-sans text-sm max-w-xl mx-auto">
            {isEn 
              ? 'We invest heavily in state-of-the-art maritime simulator technologies to provide a high-fidelity training environment mimicking real oceanic conditions.'
              : 'Kami menginvestasikan teknologi simulasi maritim modern untuk menyajikan ekosistem pelatihan yang semirip mungkin dengan kondisi laut lepas sesungguhnya.'}
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        {/* Bento/Grid Layout for Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-8">
          
          {/* Loop over facilities with dynamic grid sizing */}
          {facilities.map((fac, idx) => {
            const activeImage = fac.imageUrl || 'https://images.unsplash.com/photo-1516216628859-9bccecad13ec?q=80&w=800';
            const IconComponent = getFacilityIcon(fac.title, fac.id);
            
            // Layout styling (make simulator and engine lab bigger grids)
            const gridSpanClass = idx === 0 
              ? 'md:col-span-3 lg:col-span-3' 
              : idx === 1 
              ? 'md:col-span-3 lg:col-span-3' 
              : 'md:col-span-2 lg:col-span-2';
            
            return (
              <div
                key={fac.id}
                className={`${gridSpanClass} group relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col`}
              >
                {/* Image Section */}
                <div className="relative h-60 md:h-64 overflow-hidden">
                  <img
                    src={activeImage}
                    alt={fac.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Visual Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-90" />
                  
                  {/* Floating badge */}
                  <div className="absolute top-4 left-4 bg-navy-800 text-gold-500 p-2.5 rounded-xl shadow-lg">
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-navy-950 group-hover:text-navy-800 transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-gray-600 font-sans text-xs sm:text-sm leading-relaxed mt-2 text-justify">
                      {fac.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
