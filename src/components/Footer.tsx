/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Anchor, Instagram, Facebook, Lock } from 'lucide-react';
import { WebsiteImage } from '../types';
import TransparentLogo from './TransparentLogo';

const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  images?: WebsiteImage[];
  socialMedia?: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
  campusProfile?: {
    accreditation: string;
    establishedYear: string;
    status: string;
    skKemenkumham: string;
    izinHubla: string;
    izinKemendikbud: string;
  };
}

export default function Footer({ 
  onNavigate, 
  onOpenAdmin, 
  isAdminLoggedIn, 
  images = [],
  socialMedia,
  campusProfile
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const logoImg = images.find((img) => img.id === 'campus_logo')?.url;

  const fbUrl = socialMedia?.facebook || 'https://www.facebook.com/amc.bekasi';
  const igUrl = socialMedia?.instagram || 'https://www.instagram.com/amc.bekasi/';
  const ytUrl = socialMedia?.tiktok|| 'https://www.tiktok.com/@galeri.amc.bekasi?_t=8miZ7VYFCaO&_r=1';

  const skKemenkumham = campusProfile?.skKemenkumham || 'AHU-001245.AH.01.04.2021';
  const izinHubla = campusProfile?.izinHubla || 'PK.303/12/4/DK-2023';
  const izinKemendikbud = campusProfile?.izinKemendikbud || 'No. 235/E/O/2022';

  return (
    <footer className="bg-gradient-to-b from-[#001B3A] to-[#003B7A] text-white pt-16 pb-8 border-t border-blue-500/15 shadow-[0_-15px_40px_rgba(0,100,255,0.1)] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Footer section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/5">
          
          {/* Main Info Box */}
          <div className="md:col-span-5 space-y-5">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              {logoImg ? (
                <TransparentLogo
                  src={logoImg}
                  alt="Logo AMC"
                  className="h-14 w-14 object-contain shrink-0"
                />
              ) : (
                <div className="p-2 bg-gold-500 text-navy-950 rounded-lg">
                  <Anchor className="h-6 w-6 animate-pulse" />
                </div>
              )}
              <div>
                <span className="font-display font-bold text-lg leading-tight tracking-wider block">
                  AMC BEKASI
                </span>
                <span className="text-[10px] text-gold-300 uppercase tracking-widest block font-medium">
                  Akademi Maritim (AMC BEKASI)
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed text-justify max-w-sm">
              Akademi Maritim (AMC BEKASI) merupakan institusi pendidikan tinggi pelayaran niaga terkemuka di Jawa Barat yang mendidik calon perwira berkarakter prima, berpengetahuan global, dan berdisiplin tinggi.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
              <a
                href={igUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-gold-500 hover:text-navy-950 rounded-xl transition text-gray-300"
                title="Instagram AMC"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={fbUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-gold-500 hover:text-navy-950 rounded-xl transition text-gray-300"
                title="Facebook AMC"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={ytUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-gold-500 hover:text-navy-950 rounded-xl transition text-gray-300"
                title="Tiktok AMC"
              >
                <TiktokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links columns */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-gold-400 tracking-wider uppercase">Navigasi</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
                <li>
                  <button onClick={() => onNavigate('home')} className="hover:text-white hover:underline cursor-pointer">
                    Beranda
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('about')} className="hover:text-white hover:underline cursor-pointer">
                    Profil Kampus
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('programs')} className="hover:text-white hover:underline cursor-pointer">
                    Program Studi
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('facilities')} className="hover:text-white hover:underline cursor-pointer">
                    Fasilitas Kampus
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-gold-400 tracking-wider uppercase">Portal Info</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
                <li>
                  <button onClick={() => onNavigate('gallery')} className="hover:text-white hover:underline cursor-pointer">
                    Galeri Taruna
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('news')} className="hover:text-white hover:underline cursor-pointer">
                    Berita Terkini
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('pmb')} className="hover:text-white hover:underline cursor-pointer">
                    Informasi PMB
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className="hover:text-white hover:underline cursor-pointer">
                    Hubungi Kontak
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal / Institutional Details */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm text-gold-400 tracking-wider uppercase">Legalisasi Kampus</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p>SK Kemenkumham RI</p>
              <p className="text-white font-mono font-medium">{skKemenkumham}</p>
              <p>Izin Operasional Dirjen Hubla</p>
              <p className="text-white font-mono font-medium">{izinHubla}</p>
              <p>Izin Kemendikbudristek RI</p>
              <p className="text-white font-mono font-medium">{izinKemendikbud}</p>
            </div>
          </div>

        </div>

        {/* Lower Footer section */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-gray-500 gap-4">
          <p>© {currentYear} Akademi Maritim (AMC BEKASI). All rights reserved.</p>
          
          <div className="flex items-center space-x-6">
            <span className="text-[10px] tracking-wide text-gray-600">Standardized & Built in 2026</span>
            
            {/* Hidden/discrete portal link to trigger Admin Dashboard */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1 hover:text-white transition-colors border border-dashed border-gray-800 hover:border-gray-600 px-2 py-1 rounded cursor-pointer"
            >
              <Lock className="h-3 w-3" />
              <span>{isAdminLoggedIn ? 'Buka Panel Admin' : 'Portal Staf Admin'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
