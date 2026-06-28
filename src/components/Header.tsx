/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Anchor, 
  Lock, 
  LayoutDashboard, 
  ChevronDown, 
  ChevronRight, 
  Compass, 
  Settings, 
  Ship, 
  Building2, 
  Image, 
  Newspaper, 
  GraduationCap,
  Info,
  ShieldCheck,
  Calculator,
  Calendar,
  HelpCircle,
  ClipboardCheck,
  Network,
  Milestone,
  Target,
  BookOpen,
  Users,
  Bell,
  ShoppingBag
} from 'lucide-react';
import { WebsiteImage } from '../types';
import TransparentLogo from './TransparentLogo';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  images?: WebsiteImage[];
  lang: 'id' | 'en';
  onChangeLang: (lang: 'id' | 'en') => void;
}

export default function Header({
  onNavigate,
  activeSection,
  onOpenAdmin,
  isAdminLoggedIn,
  onLogoutAdmin,
  images = [],
  lang,
  onChangeLang
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop drop-down active state
  const [activeDropdown, setActiveDropdown] = useState<'profil' | 'programs' | 'tentang' | 'pmb' | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: 'profil' | 'programs' | 'tentang' | 'pmb') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250); // 250ms close delay
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Mobile Accordion active state
  const [mobileDropdown, setMobileDropdown] = useState<'profil' | 'programs' | 'tentang' | 'pmb' | null>(null);

  const logoImg = images.find((img) => img.id === 'campus_logo')?.url;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (path: string) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileDropdown(null);
    onNavigate(path);
  };

  // Dropdown Structures
  const profilDropdown = {
    label: lang === 'en' ? 'Profile' : 'Profil',
    id: 'profil' as const,
    items: [
      { label: lang === 'en' ? 'About AMC Bekasi' : 'Tentang AMC Bekasi', path: '/profil/tentang', icon: BookOpen },
      { label: lang === 'en' ? 'History' : 'Sejarah', path: '/profil/sejarah', icon: Milestone },
      { label: lang === 'en' ? 'Vision, Mission, Goals & Targets' : 'Visi Misi Tujuan & Sasaran', path: '/profil/visi-misi', icon: Target },
      { label: lang === 'en' ? 'Organizational Structure' : 'Struktur Organisasi', path: '/profil/struktur-organisasi', icon: Network },
      { label: lang === 'en' ? 'Accreditation & Approval' : 'Akreditasi & Approval', path: '/profil/akreditasi', icon: ShieldCheck },
      { label: lang === 'en' ? 'Academic Calendar' : 'Kalender Akademik', path: '/profil/kalender-akademik', icon: Calendar }
    ]
  };

  const programDropdown = {
    label: lang === 'en' ? 'Study Programs' : 'Program Studi',
    id: 'programs' as const,
    items: [
      { label: lang === 'en' ? 'D3 Nautical Studies' : 'D3 Nautika', path: '/program-studi/nautika', icon: Compass },
      { label: lang === 'en' ? 'D3 Marine Engineering' : 'D3 Teknika', path: '/program-studi/teknika', icon: Settings },
      { label: lang === 'en' ? 'D3 Port & Shipping Management' : 'D3 Ketatalaksanaan Pelayaran Niaga dan Kepelabuhanan (KPN)', path: '/program-studi/kpn', icon: Ship }
    ]
  };

  const tentangDropdown = {
    label: lang === 'en' ? 'About' : 'Tentang',
    id: 'tentang' as const,
    items: [
      { label: lang === 'en' ? 'Announcements' : 'Pengumuman', path: '/pengumuman', icon: Bell },
      { label: lang === 'en' ? 'Facilities' : 'Fasilitas', path: '/fasilitas', icon: Building2 },
      { label: lang === 'en' ? 'Gallery' : 'Galeri', path: '/galeri', icon: Image },
      { label: lang === 'en' ? 'News' : 'Berita', path: '/berita', icon: Newspaper },
      { label: lang === 'en' ? 'Alumni AMC Bekasi' : 'Alumni AMC Bekasi', path: '/alumni', icon: GraduationCap }
    ]
  };

  const pmbDropdown = {
    label: lang === 'en' ? 'Admissions' : 'PMB',
    id: 'pmb' as const,
    items: [
      { label: lang === 'en' ? 'PMB Info' : 'Informasi PMB', path: '/pmb/informasi', icon: Info },
      { label: lang === 'en' ? 'Requirements' : 'Persyaratan', path: '/pmb/persyaratan', icon: ShieldCheck },
      { label: lang === 'en' ? 'Education Fees' : 'Biaya Pendidikan', path: '/pmb/biaya', icon: Calculator },
      { label: lang === 'en' ? 'Admission Schedule' : 'Jadwal PMB', path: '/pmb/jadwal', icon: Calendar },
      { label: lang === 'en' ? 'FAQ' : 'FAQ', path: '/pmb/faq', icon: HelpCircle },
      { label: lang === 'en' ? 'Register Online' : 'Daftar Online', path: '/pmb/daftar', icon: ClipboardCheck }
    ]
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white text-navy-950 shadow-md py-2'
          : 'bg-navy-950/40 backdrop-blur-md text-white py-2.5 border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <div
            onClick={() => handleLinkClick('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {logoImg ? (
              <TransparentLogo
                src={logoImg}
                alt="Logo AMC"
                className="h-10 w-10 object-contain shrink-0"
              />
            ) : (
              <div className={`p-2 rounded-lg transition-colors ${
                isScrolled ? 'bg-navy-800 text-white' : 'bg-gold-500 text-navy-950'
              }`}>
                <Anchor className="h-6 w-6" />
              </div>
            )}
            <div>
              <span className="font-display font-bold text-lg leading-tight tracking-wider block">
                AMC BEKASI
              </span>
              <span className={`text-[10px] uppercase tracking-widest block font-medium ${
                isScrolled ? 'text-gray-500' : 'text-gold-200'
              }`}>
                Akademi Maritim (AMC BEKASI)
              </span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION MENU */}
          <nav className="hidden lg:flex items-center space-x-7">
            {/* Beranda */}
            <button
              onClick={() => handleLinkClick('/')}
              className={`font-sans font-medium text-sm transition-colors relative py-1 hover:text-gold-500 cursor-pointer ${
                activeSection === 'home'
                  ? isScrolled ? 'text-navy-800 font-semibold' : 'text-gold-400 font-semibold'
                  : isScrolled ? 'text-gray-700' : 'text-gray-100'
              }`}
            >
              {lang === 'en' ? 'Home' : 'Beranda'}
              {activeSection === 'home' && (
                <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full ${
                  isScrolled ? 'bg-navy-800' : 'bg-gold-400'
                }`} />
              )}
            </button>

            {/* Profil Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('profil')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleLinkClick('/profil')}
                className={`font-sans font-medium text-sm transition-colors flex items-center space-x-1 py-1 hover:text-gold-500 cursor-pointer focus:outline-none ${
                  activeSection === 'about' || activeDropdown === 'profil'
                    ? isScrolled ? 'text-navy-800 font-semibold' : 'text-gold-400 font-semibold'
                    : isScrolled ? 'text-gray-700' : 'text-gray-100'
                }`}
              >
                <span>{profilDropdown.label}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-250 ease-in-out ${activeDropdown === 'profil' ? 'rotate-180' : ''}`} />
              </button>

              <div 
                className={`absolute top-full left-0 mt-0 pt-2 w-72 z-50 transition-all duration-200 origin-top-left ${
                  activeDropdown === 'profil' 
                    ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                    : 'opacity-0 -translate-y-2 pointer-events-none scale-95'
                }`}
              >
                <div className="bg-white border border-slate-100 rounded-xl shadow-xl py-2 text-slate-800">
                  {profilDropdown.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLinkClick(item.path)}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-navy-950 hover:bg-slate-50 transition-colors flex items-center space-x-2.5 cursor-pointer min-h-[48px]"
                    >
                      <item.icon className="h-4.5 w-4.5 text-gold-600 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Program Studi Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('programs')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleLinkClick('/program-studi')}
                className={`font-sans font-medium text-sm transition-colors flex items-center space-x-1 py-1 hover:text-gold-500 cursor-pointer focus:outline-none ${
                  activeSection === 'programs' || activeDropdown === 'programs'
                    ? isScrolled ? 'text-navy-800 font-semibold' : 'text-gold-400 font-semibold'
                    : isScrolled ? 'text-gray-700' : 'text-gray-100'
                }`}
              >
                <span>{programDropdown.label}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-250 ease-in-out ${activeDropdown === 'programs' ? 'rotate-180' : ''}`} />
              </button>

              <div 
                className={`absolute top-full left-0 mt-0 pt-2 w-72 z-50 transition-all duration-200 origin-top-left ${
                  activeDropdown === 'programs' 
                    ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                    : 'opacity-0 -translate-y-2 pointer-events-none scale-95'
                }`}
              >
                <div className="bg-white border border-slate-100 rounded-xl shadow-xl py-2 text-slate-800">
                  {programDropdown.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLinkClick(item.path)}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-navy-950 hover:bg-slate-50 transition-colors flex items-center space-x-2.5 cursor-pointer min-h-[48px]"
                    >
                      <item.icon className="h-4.5 w-4.5 text-gold-600 shrink-0" />
                      <span className="leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tentang Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('tentang')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleLinkClick('/tentang')}
                className={`font-sans font-medium text-sm transition-colors flex items-center space-x-1 py-1 hover:text-gold-500 cursor-pointer focus:outline-none ${
                  ['facilities', 'gallery', 'news'].includes(activeSection) || activeDropdown === 'tentang'
                    ? isScrolled ? 'text-navy-800 font-semibold' : 'text-gold-400 font-semibold'
                    : isScrolled ? 'text-gray-700' : 'text-gray-100'
                }`}
              >
                <span>{tentangDropdown.label}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-250 ease-in-out ${activeDropdown === 'tentang' ? 'rotate-180' : ''}`} />
              </button>

              <div 
                className={`absolute top-full left-0 mt-0 pt-2 w-72 z-50 transition-all duration-200 origin-top-left ${
                  activeDropdown === 'tentang' 
                    ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                    : 'opacity-0 -translate-y-2 pointer-events-none scale-95'
                }`}
              >
                <div className="bg-white border border-slate-100 rounded-xl shadow-xl py-2 text-slate-800">
                  {tentangDropdown.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLinkClick(item.path)}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-navy-950 hover:bg-slate-50 transition-colors flex items-center space-x-2.5 cursor-pointer min-h-[48px]"
                    >
                      <item.icon className="h-4.5 w-4.5 text-gold-600 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PMB Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('pmb')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleLinkClick('/pmb')}
                className={`font-sans font-medium text-sm transition-colors flex items-center space-x-1 py-1 hover:text-gold-500 cursor-pointer focus:outline-none ${
                  activeSection === 'pmb' || activeDropdown === 'pmb'
                    ? isScrolled ? 'text-navy-800 font-semibold' : 'text-gold-400 font-semibold'
                    : isScrolled ? 'text-gray-700' : 'text-gray-100'
                }`}
              >
                <span>{pmbDropdown.label}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-250 ease-in-out ${activeDropdown === 'pmb' ? 'rotate-180' : ''}`} />
              </button>

              <div 
                className={`absolute top-full left-0 mt-0 pt-2 w-72 z-50 transition-all duration-200 origin-top-left ${
                  activeDropdown === 'pmb' 
                    ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                    : 'opacity-0 -translate-y-2 pointer-events-none scale-95'
                }`}
              >
                <div className="bg-white border border-slate-100 rounded-xl shadow-xl py-2 text-slate-800">
                  {pmbDropdown.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLinkClick(item.path)}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-navy-950 hover:bg-slate-50 transition-colors flex items-center space-x-2.5 cursor-pointer min-h-[48px]"
                    >
                      <item.icon className="h-4.5 w-4.5 text-gold-600 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kontak */}
            <button
              onClick={() => handleLinkClick('/kontak')}
              className={`font-sans font-medium text-sm transition-colors relative py-1 hover:text-gold-500 cursor-pointer ${
                activeSection === 'contact'
                  ? isScrolled ? 'text-navy-800 font-semibold' : 'text-gold-400 font-semibold'
                  : isScrolled ? 'text-gray-700' : 'text-gray-100'
              }`}
            >
              {lang === 'en' ? 'Contact' : 'Kontak'}
              {activeSection === 'contact' && (
                <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full ${
                  isScrolled ? 'bg-navy-800' : 'bg-gold-400'
                }`} />
              )}
            </button>

            {/* AMC Store */}
            <button
              onClick={() => handleLinkClick('/store')}
              className={`font-sans font-medium text-sm transition-colors relative py-1 hover:text-gold-500 cursor-pointer flex items-center space-x-1 ${
                activeSection === 'store'
                  ? isScrolled ? 'text-navy-800 font-semibold' : 'text-gold-400 font-semibold'
                  : isScrolled ? 'text-gray-700' : 'text-gray-100'
              }`}
            >
              <ShoppingBag className="h-4 w-4 shrink-0 text-gold-500" />
              <span>AMC Store</span>
              {activeSection === 'store' && (
                <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full ${
                  isScrolled ? 'bg-navy-800' : 'bg-gold-400'
                }`} />
              )}
            </button>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Language Switcher */}
            <div className={`flex items-center space-x-1 p-0.5 rounded-lg border transition-all ${
              isScrolled 
                ? 'bg-slate-100 border-slate-200' 
                : 'bg-white/10 border-white/20'
            }`}>
              <button
                onClick={() => onChangeLang('id')}
                className={`px-2 py-1 text-[10px] font-extrabold rounded transition-all cursor-pointer ${
                  lang === 'id'
                    ? 'bg-gold-500 text-navy-950 shadow-sm'
                    : isScrolled ? 'text-gray-600 hover:text-navy-950' : 'text-gray-300 hover:text-white'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => onChangeLang('en')}
                className={`px-2 py-1 text-[10px] font-extrabold rounded transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-gold-500 text-navy-950 shadow-sm'
                    : isScrolled ? 'text-gray-600 hover:text-navy-950' : 'text-gray-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Admin Access Panel */}
            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAdmin}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>{lang === 'en' ? 'Admin Panel' : 'Panel Admin'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdmin}
                className={`flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${
                  isScrolled ? 'text-gray-500 hover:text-navy-800 hover:bg-gray-100' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title={lang === 'en' ? 'Admin Portal' : 'Portal Admin'}
              >
                <Lock className="h-4 w-4" />
              </button>
            )}

            {/* Apply Button */}
            <button
              onClick={() => handleLinkClick('/pendaftaran/daftar')}
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-4 h-11 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center"
            >
              {lang === 'en' ? 'Apply PMB 2026' : 'Daftar PMB 2026'}
            </button>
          </div>

          {/* MOBILE TOGGLE AND QUICK ACCESS */}
          <div className="flex items-center space-x-3 lg:hidden">
            {/* Quick Mobile Language Swapper */}
            <div className="flex items-center bg-white/10 border border-white/20 rounded-md p-0.5">
              <button
                onClick={() => onChangeLang('id')}
                className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${lang === 'id' ? 'bg-gold-500 text-navy-950' : 'text-gray-300'}`}
              >
                ID
              </button>
              <button
                onClick={() => onChangeLang('en')}
                className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${lang === 'en' ? 'bg-gold-500 text-navy-950' : 'text-gray-300'}`}
              >
                EN
              </button>
            </div>

            {isAdminLoggedIn && (
              <button
                onClick={onOpenAdmin}
                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE ACCORDION DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white text-navy-950 shadow-2xl border-t border-gray-100 py-4 px-6 max-h-[calc(100vh-64px)] overflow-y-auto animate-fade-in">
          <div className="flex flex-col space-y-2">
            
            {/* Beranda */}
            <button
              onClick={() => handleLinkClick('/')}
              className={`text-left font-sans font-semibold py-2.5 border-b border-gray-50 hover:text-navy-800 transition-colors cursor-pointer ${
                activeSection === 'home' ? 'text-navy-800 pl-2 border-l-2 border-navy-800' : 'text-gray-600'
              }`}
            >
              {lang === 'en' ? 'Home' : 'Beranda'}
            </button>

            {/* Profil Accordion */}
            <div className="border-b border-gray-50 py-1 flex flex-col">
              <div className="w-full flex items-center justify-between py-2 hover:text-navy-800 text-gray-600">
                <button
                  onClick={() => handleLinkClick('/profil')}
                  className="font-sans font-semibold text-left flex-1 hover:text-navy-800 cursor-pointer text-sm sm:text-base"
                >
                  {profilDropdown.label}
                </button>
                <button
                  onClick={() => setMobileDropdown(prev => prev === 'profil' ? null : 'profil')}
                  className="p-2 -mr-2 hover:bg-slate-50 rounded-lg cursor-pointer focus:outline-none"
                  aria-label="Toggle Profil"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileDropdown === 'profil' ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              <div className={`transition-all duration-300 overflow-hidden ${
                mobileDropdown === 'profil' ? 'max-h-[400px] opacity-100 pl-4 space-y-1 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                {profilDropdown.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLinkClick(item.path)}
                    className="w-full text-left py-2.5 text-xs font-semibold text-slate-500 hover:text-navy-950 flex items-center space-x-2 cursor-pointer min-h-[48px]"
                  >
                    <item.icon className="h-4.5 w-4.5 text-gold-600 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Program Studi Accordion */}
            <div className="border-b border-gray-50 py-1 flex flex-col">
              <div className="w-full flex items-center justify-between py-2 hover:text-navy-800 text-gray-600">
                <button
                  onClick={() => handleLinkClick('/program-studi')}
                  className="font-sans font-semibold text-left flex-1 hover:text-navy-800 cursor-pointer text-sm sm:text-base"
                >
                  {programDropdown.label}
                </button>
                <button
                  onClick={() => setMobileDropdown(prev => prev === 'programs' ? null : 'programs')}
                  className="p-2 -mr-2 hover:bg-slate-50 rounded-lg cursor-pointer focus:outline-none"
                  aria-label="Toggle Program Studi"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileDropdown === 'programs' ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              <div className={`transition-all duration-300 overflow-hidden ${
                mobileDropdown === 'programs' ? 'max-h-[400px] opacity-100 pl-4 space-y-1 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                {programDropdown.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLinkClick(item.path)}
                    className="w-full text-left py-2.5 text-xs font-semibold text-slate-500 hover:text-navy-950 flex items-center space-x-2 cursor-pointer min-h-[48px]"
                  >
                    <item.icon className="h-4.5 w-4.5 text-gold-600 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tentang Accordion */}
            <div className="border-b border-gray-50 py-1 flex flex-col">
              <div className="w-full flex items-center justify-between py-2 hover:text-navy-800 text-gray-600">
                <button
                  onClick={() => handleLinkClick('/tentang')}
                  className="font-sans font-semibold text-left flex-1 hover:text-navy-800 cursor-pointer text-sm sm:text-base"
                >
                  {tentangDropdown.label}
                </button>
                <button
                  onClick={() => setMobileDropdown(prev => prev === 'tentang' ? null : 'tentang')}
                  className="p-2 -mr-2 hover:bg-slate-50 rounded-lg cursor-pointer focus:outline-none"
                  aria-label="Toggle Tentang"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileDropdown === 'tentang' ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              <div className={`transition-all duration-300 overflow-hidden ${
                mobileDropdown === 'tentang' ? 'max-h-[300px] opacity-100 pl-4 space-y-1 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                {tentangDropdown.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLinkClick(item.path)}
                    className="w-full text-left py-2.5 text-xs font-semibold text-slate-500 hover:text-navy-950 flex items-center space-x-2 cursor-pointer min-h-[48px]"
                  >
                    <item.icon className="h-4.5 w-4.5 text-gold-600 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PMB Accordion */}
            <div className="border-b border-gray-50 py-1 flex flex-col">
              <div className="w-full flex items-center justify-between py-2 hover:text-navy-800 text-gray-600">
                <button
                  onClick={() => handleLinkClick('/pmb')}
                  className="font-sans font-semibold text-left flex-1 hover:text-navy-800 cursor-pointer text-sm sm:text-base"
                >
                  {pmbDropdown.label}
                </button>
                <button
                  onClick={() => setMobileDropdown(prev => prev === 'pmb' ? null : 'pmb')}
                  className="p-2 -mr-2 hover:bg-slate-50 rounded-lg cursor-pointer focus:outline-none"
                  aria-label="Toggle PMB"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileDropdown === 'pmb' ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              <div className={`transition-all duration-300 overflow-hidden ${
                mobileDropdown === 'pmb' ? 'max-h-[400px] opacity-100 pl-4 space-y-1 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                {pmbDropdown.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLinkClick(item.path)}
                    className="w-full text-left py-2.5 text-xs font-semibold text-slate-500 hover:text-navy-950 flex items-center space-x-2 cursor-pointer min-h-[48px]"
                  >
                    <item.icon className="h-4.5 w-4.5 text-gold-600 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kontak */}
            <button
              onClick={() => handleLinkClick('/kontak')}
              className={`text-left font-sans font-semibold py-2.5 border-b border-gray-50 hover:text-navy-800 transition-colors cursor-pointer ${
                activeSection === 'contact' ? 'text-navy-800 pl-2 border-l-2 border-navy-800' : 'text-gray-600'
              }`}
            >
              {lang === 'en' ? 'Contact' : 'Kontak'}
            </button>

            {/* AMC Store Mobile */}
            <button
              onClick={() => handleLinkClick('/store')}
              className={`text-left font-sans font-semibold py-2.5 border-b border-gray-50 hover:text-navy-800 transition-colors cursor-pointer flex items-center space-x-2 ${
                activeSection === 'store' ? 'text-navy-800 pl-2 border-l-2 border-navy-800' : 'text-gray-600'
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5 text-gold-500 shrink-0" />
              <span>AMC Store</span>
            </button>

            {/* CTA Pendaftaran */}
            <div className="pt-4 flex flex-col space-y-2">
              <button
                onClick={() => handleLinkClick('/pendaftaran/daftar')}
                className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold py-3 rounded-lg text-center text-sm shadow-sm transition-all cursor-pointer"
              >
                {lang === 'en' ? 'Apply PMB 2026' : 'Daftar PMB 2026'}
              </button>
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center space-x-2 border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>{isAdminLoggedIn ? (lang === 'en' ? 'Open Admin Panel' : 'Buka Panel Admin') : (lang === 'en' ? 'Login Admin Portal' : 'Login Portal Admin')}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
