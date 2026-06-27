/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  currentPath: string;
  lang: 'id' | 'en';
  onNavigate: (path: string) => void;
}

export default function Breadcrumb({ currentPath, lang, onNavigate }: BreadcrumbProps) {
  // Do not show breadcrumbs on Homepage
  if (currentPath === '/' || currentPath === '') {
    return null;
  }

  const isEn = lang === 'en';

  // Helper to construct trail of segments
  const getSegments = () => {
    const segments: Array<{ label: string; path: string }> = [];

    // Always start with Home
    segments.push({
      label: isEn ? 'Home' : 'Beranda',
      path: '/'
    });

    const cleanPath = currentPath.toLowerCase().replace(/\/$/, '');

    // 1. PROFIL SECTION
    if (cleanPath.startsWith('/profil')) {
      segments.push({
        label: isEn ? 'Profile' : 'Profil',
        path: '/profil'
      });

      if (cleanPath.includes('/tentang')) {
        segments.push({ label: isEn ? 'About AMC' : 'Tentang AMC', path: '/profil/tentang' });
      } else if (cleanPath.includes('/sejarah')) {
        segments.push({ label: isEn ? 'History' : 'Sejarah', path: '/profil/sejarah' });
      } else if (cleanPath.includes('/visi-misi')) {
        segments.push({ label: isEn ? 'Vision & Mission' : 'Visi & Misi', path: '/profil/visi-misi' });
      } else if (cleanPath.includes('/struktur')) {
        segments.push({ label: isEn ? 'Organizational Structure' : 'Struktur Organisasi', path: '/profil/struktur-organisasi' });
      } else if (cleanPath.includes('/akreditasi')) {
        segments.push({ label: isEn ? 'Accreditation' : 'Akreditasi', path: '/profil/akreditasi' });
      } else if (cleanPath.includes('/kalender')) {
        segments.push({ label: isEn ? 'Academic Calendar' : 'Kalender Akademik', path: '/profil/kalender-akademik' });
      }
    }

    // 2. PROGRAM STUDI SECTION
    else if (cleanPath.startsWith('/program-studi')) {
      segments.push({
        label: isEn ? 'Study Programs' : 'Program Studi',
        path: '/program-studi'
      });

      if (cleanPath.endsWith('/nautika')) {
        segments.push({ label: 'D3 Nautika', path: '/program-studi/nautika' });
      } else if (cleanPath.endsWith('/teknika')) {
        segments.push({ label: 'D3 Teknika', path: '/program-studi/teknika' });
      } else if (cleanPath.endsWith('/kpn')) {
        segments.push({ label: 'D3 KPN', path: '/program-studi/kpn' });
      }
    }

    // 3. TENTANG (PORTAL) & SUB-PAGES
    else if (cleanPath.startsWith('/tentang')) {
      segments.push({
        label: isEn ? 'About' : 'Tentang',
        path: '/tentang'
      });
    }

    // 4. LAYANAN & SUB-PAGES (FACILITIES, GALLERY, NEWS, ALUMNI)
    else if (cleanPath.startsWith('/layanan') || cleanPath === '/fasilitas' || cleanPath === '/galeri' || cleanPath === '/berita' || cleanPath === '/alumni') {
      segments.push({
        label: isEn ? 'About' : 'Tentang',
        path: '/tentang'
      });

      if (cleanPath.includes('/fasilitas') || cleanPath === '/fasilitas') {
        segments.push({ label: isEn ? 'Facilities' : 'Fasilitas', path: '/fasilitas' });
      } else if (cleanPath.includes('/galeri') || cleanPath === '/galeri') {
        segments.push({ label: isEn ? 'Gallery' : 'Galeri', path: '/galeri' });
      } else if (cleanPath.includes('/berita') || cleanPath === '/berita') {
        segments.push({ label: isEn ? 'News' : 'Berita', path: '/berita' });
      } else if (cleanPath.includes('/alumni') || cleanPath === '/alumni') {
        segments.push({ label: isEn ? 'Alumni' : 'Alumni', path: '/alumni' });
      }
    }

    // 5. PMB SECTION
    else if (cleanPath.startsWith('/pmb') || cleanPath.startsWith('/pendaftaran')) {
      segments.push({
        label: 'PMB',
        path: '/pmb'
      });

      if (cleanPath.includes('/informasi')) {
        segments.push({ label: isEn ? 'PMB Information' : 'Informasi PMB', path: '/pmb/informasi' });
      } else if (cleanPath.includes('/persyaratan')) {
        segments.push({ label: isEn ? 'Requirements' : 'Persyaratan', path: '/pmb/persyaratan' });
      } else if (cleanPath.includes('/biaya')) {
        segments.push({ label: isEn ? 'Education Fees' : 'Biaya Pendidikan', path: '/pmb/biaya' });
      } else if (cleanPath.includes('/jadwal')) {
        segments.push({ label: isEn ? 'PMB Schedule' : 'Jadwal PMB', path: '/pmb/jadwal' });
      } else if (cleanPath.includes('/faq')) {
        segments.push({ label: 'FAQ', path: '/pmb/faq' });
      } else if (cleanPath.includes('/daftar')) {
        segments.push({ label: isEn ? 'Registration Form' : 'Daftar Online PMB', path: '/pmb/daftar' });
      }
    }

    // 6. KONTAK
    else if (cleanPath === '/kontak') {
      segments.push({
        label: isEn ? 'Contact' : 'Kontak',
        path: '/kontak'
      });
    }

    return segments;
  };

  const segments = getSegments();

  return (
    <div id="breadcrumb-container" className="bg-slate-100/60 border-b border-slate-200/50 py-3 px-4 sm:px-6 lg:px-8 mt-16 md:mt-20 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs font-medium font-sans text-slate-500">
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;

          return (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
              
              {isLast ? (
                <span className="text-navy-950 font-semibold tracking-tight truncate max-w-[180px] sm:max-w-xs">
                  {seg.label}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(seg.path)}
                  className="hover:text-navy-800 hover:underline transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  {idx === 0 && <Home className="h-3.5 w-3.5 text-slate-400 mr-1" />}
                  <span>{seg.label}</span>
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
