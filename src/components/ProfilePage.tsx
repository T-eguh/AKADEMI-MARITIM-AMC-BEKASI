/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BookOpen, Compass, Award, Users, Calendar, ShieldCheck, Ship, Target, 
  MapPin, Flag, Milestone, Sparkles, ChevronRight, ArrowLeft, Network, HelpCircle, Eye, Download
} from 'lucide-react';
import { SiteContent, WebsiteImage, TimelineEvent, LecturerItem, CalendarEventItem, ProgramItem } from '../types';

interface ProfilePageProps {
  currentPath: string;
  lang: 'id' | 'en';
  content: SiteContent;
  images: WebsiteImage[];
  onNavigate: (path: string) => void;
  timelineEvents: TimelineEvent[];
  lecturers: LecturerItem[];
  calendarEvents: CalendarEventItem[];
  programs?: ProgramItem[];
}

export default function ProfilePage({
  currentPath,
  lang,
  content,
  images,
  onNavigate,
  timelineEvents,
  lecturers,
  calendarEvents,
  programs = []
}: ProfilePageProps) {
  const isEn = lang === 'en';

  const [zoomImage, setZoomImage] = React.useState<string | null>(null);
  const [expandedLecturers, setExpandedLecturers] = React.useState<Record<string, boolean>>({});

  let subpath = currentPath.replace('/profil', '').replace('/', '');
  if (subpath === 'struktur-organisasi') subpath = 'struktur';
  if (subpath === 'kalender-akademik') subpath = 'kalender';

  const getNavbarFriendlyPath = (p: string) => {
    if (p === 'struktur') return '/profil/struktur-organisasi';
    if (p === 'kalender') return '/profil/kalender-akademik';
    return `/profil/${p}`;
  };

  const campusImg = images.find((img) => img.id === 'about_campus')?.url || 
    'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop';

  const ownerImg = images.find((img) => img.id === 'about_owner')?.url || 
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop';

  const directorImg = images.find((img) => img.id === 'about_director')?.url || 
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop';

  const orgChartImg = images.find((img) => img.id === 'org_chart')?.url || 
    'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=800&auto=format&fit=crop';

  const orgPhotoImg = images.find((img) => img.id === 'org_photo')?.url || 
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop';

  const progsNautika = programs?.find(p => p.id === 'nautika');
  const progsTeknika = programs?.find(p => p.id === 'teknika');
  const progsKpn = programs?.find(p => p.id === 'kpn');

  const nautikaImg = progsNautika?.imageUrl || images.find(img => img.id === 'prog_nautika')?.url || "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=85&w=1200";
  const teknikaImg = progsTeknika?.imageUrl || images.find(img => img.id === 'prog_teknika')?.url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=85&w=1200";
  const kpnImg = progsKpn?.imageUrl || images.find(img => img.id === 'prog_kpn')?.url || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=85&w=1200";

  // Side navigation helper
  const sidebarMenus = [
    { path: 'tentang', label: isEn ? 'About AMC Bekasi' : 'Tentang AMC Bekasi', icon: BookOpen },
    { path: 'sejarah', label: isEn ? 'History' : 'Sejarah', icon: Milestone },
    { path: 'visi-misi', label: isEn ? 'Vision, Mission & Goals' : 'Visi, Misi & Sasaran', icon: Target },
    { path: 'struktur', label: isEn ? 'Organizational Structure' : 'Struktur Organisasi', icon: Network },
    { path: 'akreditasi', label: isEn ? 'Accreditation' : 'Akreditasi Kampus', icon: ShieldCheck },
    { path: 'kalender', label: isEn ? 'Academic Calendar' : 'Kalender Akademik', icon: Calendar },
  ];

  // ============================================
  // RENDER 1: PROFILE OVERVIEW (Main Overview)
  // ============================================
  if (!subpath) {
    return (
      <div className="pt-8 pb-16 bg-[#FAFCFF] min-h-screen text-slate-900 font-sans relative overflow-hidden">
        {/* Subtle Maritime Coordinates, Compass & Anchor Overlay (Max 5% Opacity) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] select-none z-0 overflow-hidden flex items-center justify-center">
          <svg className="w-[800px] h-[800px] text-navy-800" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="100" cy="100" r="80" strokeDasharray="2 2" />
            <circle cx="100" cy="100" r="50" />
            <circle cx="100" cy="100" r="20" />
            <line x1="20" y1="100" x2="180" y2="100" />
            <line x1="100" y1="20" x2="100" y2="180" />
            <path d="M100,20 L103,90 L100,100 L97,90 Z" fill="currentColor" />
            <path d="M100,180 L103,110 L100,100 L97,110 Z" fill="currentColor" />
            <path d="M20,100 L90,103 L100,100 L90,97 Z" fill="currentColor" />
            <path d="M180,100 L110,103 L100,100 L110,97 Z" fill="currentColor" />
            <path d="M96,75 L104,75 M100,75 L100,120 A15,15 0 0,1 85,105 L83,105 A17,17 0 0,0 100,122 A17,17 0 0,0 117,105 L115,105 A15,15 0 0,1 100,120" strokeWidth="0.75" />
            <circle cx="100" cy="72" r="3" strokeWidth="0.75" />
          </svg>
        </div>
        
        {/* Banner Hero */}
        <div className="relative bg-gradient-to-b from-[#001B3A] to-[#003B7A] py-24 px-4 overflow-hidden mb-16 rounded-b-[40px] shadow-lg border-b border-blue-500/10">
          
          <div className="relative max-w-5xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full inline-block">
              {isEn ? 'Institution Profile' : 'Profil Institusi'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              {isEn ? 'Explore AMC Bekasi' : 'Profil Akademi Maritim AMC Bekasi'}
            </h1>
            <p className="text-gray-300 font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {isEn 
                ? 'Committed to producing global-standard maritime perwira and logistics experts based in Bekasi, Indonesia.' 
                : 'Mengenal lebih dekat lembaga pendidikan pelayaran terbaik yang mencetak perwira samudera dan tenaga pelabuhan berstandar IMO.'}
            </p>
          </div>
        </div>

        {/* Overview content introduction */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 shrink-0 overflow-hidden rounded-2xl h-64 border">
              <img src={campusImg} alt="Kampus" className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-8 space-y-4">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-950">
                {isEn ? 'Welcome to the Maritime Center' : 'Kampus Maritim Berkarakter & Unggul'}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed text-justify">
                {isEn 
                  ? 'Akademi Maritim (AMC) Bekasi is a higher education institution committed to delivering high-quality vocational education in maritime fields. We focus on professionalism, discipline, integrity, innovation, theory, practice, leadership, and employment readiness.'
                  : 'Akademi Maritim (AMC) Bekasi merupakan institusi pendidikan tinggi yang berkomitmen menyelenggarakan pendidikan vokasi berkualitas di bidang kemaritiman. Fokus pada profesionalisme, disiplin, integritas, inovasi, teori, praktik, kepemimpinan, serta kesiapan kerja.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/profil/tentang')}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-gold-600 hover:text-navy-950 transition-colors"
                >
                  <span>{isEn ? 'Learn More About Us' : 'Baca Profil Selengkapnya'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid of Summary Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-navy-950">
              {isEn ? 'Institutional Directory' : 'Informasi & Direktori Profil'}
            </h3>
            <p className="text-slate-500 text-xs mt-1">Pilih bagian informasi yang ingin Anda pelajari lebih lanjut.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Tentang */}
            <div 
              onClick={() => onNavigate('/profil/tentang')}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-navy-800/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3 bg-navy-50 text-navy-800 rounded-xl w-fit">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-base text-navy-950">Tentang AMC Bekasi</h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  Komitmen mutu, motto "Dharma Bhakti, Widya, Bahari", serta sistem pendidikan vokasi maritim.
                </p>
              </div>
              <span className="text-xs font-bold text-gold-600 mt-4 flex items-center gap-1">
                {isEn ? 'View Detail' : 'Lihat Detail'} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* 2. Sejarah */}
            <div 
              onClick={() => onNavigate('/profil/sejarah')}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-navy-800/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3 bg-navy-50 text-navy-800 rounded-xl w-fit">
                  <Milestone className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-base text-navy-950">Sejarah Pendirian</h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  Akademi Maritim AMC Bekasi berawal dari Akademi Maritim Cirebon yang berdiri sejak 1986.Kampus ini kemudian merelokasi operasinya ke wilayah Bekasi untuk memperluas kapasitas dan menjangkau lebih banyak calon taruna taruni, serta menjadi satu-satunya kampus maritim di Kota Bekasi.
                </p>
              </div>
              <span className="text-xs font-bold text-gold-600 mt-4 flex items-center gap-1">
                {isEn ? 'View Detail' : 'Lihat Detail'} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* 3. Visi Misi */}
            <div 
              onClick={() => onNavigate('/profil/visi-misi')}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-navy-800/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3 bg-navy-50 text-navy-800 rounded-xl w-fit">
                  <Target className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-base text-navy-950">Visi, Misi & Sasaran</h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  Terwujudnya Perguruan Tinggi Kemaritiman yang Berkualitas dan Kompetetif yang bertaraf internasional pada tahun 2027. 
                  Menyelenggarakan Pendidikan yang berkualitas bidang maritim dan kelautan baik teori dan praktek sesuai peraturan yang berlaku tingkat Nasional maupun Internasional.
                </p>
              </div>
              <span className="text-xs font-bold text-gold-600 mt-4 flex items-center gap-1">
                {isEn ? 'View Detail' : 'Lihat Detail'} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* 4. Struktur */}
            <div 
              onClick={() => onNavigate('/profil/struktur')}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-navy-800/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3 bg-navy-50 text-navy-800 rounded-xl w-fit">
                  <Network className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-base text-navy-950">Struktur Organisasi</h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  Manajemen kepemimpinan, direktur, pembantu direktur, serta jajaran senat dosen.
                </p>
              </div>
              <span className="text-xs font-bold text-gold-600 mt-4 flex items-center gap-1">
                {isEn ? 'View Detail' : 'Lihat Detail'} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* 5. Akreditasi */}
            <div 
              onClick={() => onNavigate('/profil/akreditasi')}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-navy-800/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3 bg-navy-50 text-navy-800 rounded-xl w-fit">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-base text-navy-950">Sertifikat Akreditasi</h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  Kelayakan institusi serta program studi yang telah terakreditasi Sangat Baik (B) oleh BAN-PT.
                </p>
              </div>
              <span className="text-xs font-bold text-gold-600 mt-4 flex items-center gap-1">
                {isEn ? 'View Detail' : 'Lihat Detail'} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>

            

            {/* 7. Kalender */}
            <div 
              onClick={() => onNavigate('/profil/kalender')}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-navy-800/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between sm:col-span-2 lg:col-span-3 max-w-sm mx-auto w-full"
            >
              <div className="space-y-3">
                <div className="p-3 bg-navy-50 text-navy-800 rounded-xl w-fit mx-auto sm:mx-0">
                  <Calendar className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-base text-navy-950 text-center sm:text-left">Kalender Akademik</h4>
                <p className="text-slate-500 text-xs leading-relaxed text-center sm:text-left">
                  Jadwal perkuliahan semester ganjil-genap, Madabintal, praktik laut (BST), hingga wisuda.
                </p>
              </div>
              <span className="text-xs font-bold text-gold-600 mt-4 flex items-center justify-center sm:justify-start gap-1">
                {isEn ? 'View Detail' : 'Lihat Detail'} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>

          </div>
        </div>

      </div>
    );
  }

  // ============================================
  // RENDER 2: DETAILED SUB-PAGES FOR PROFILE
  // ============================================
  return (
    <div className="pt-8 pb-16 bg-[#FAFCFF] min-h-screen text-slate-950 font-sans relative overflow-hidden">
      {/* Subtle Maritime Coordinates, Compass & Anchor Overlay (Max 5% Opacity) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] select-none z-0 overflow-hidden flex items-center justify-center">
        <svg className="w-[800px] h-[800px] text-navy-800" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="100" cy="100" r="80" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="50" />
          <circle cx="100" cy="100" r="20" />
          <line x1="20" y1="100" x2="180" y2="100" />
          <line x1="100" y1="20" x2="100" y2="180" />
          <path d="M100,20 L103,90 L100,100 L97,90 Z" fill="currentColor" />
          <path d="M100,180 L103,110 L100,100 L97,110 Z" fill="currentColor" />
          <path d="M20,100 L90,103 L100,100 L90,97 Z" fill="currentColor" />
          <path d="M180,100 L110,103 L100,100 L110,97 Z" fill="currentColor" />
          <path d="M96,75 L104,75 M100,75 L100,120 A15,15 0 0,1 85,105 L83,105 A17,17 0 0,0 100,122 A17,17 0 0,0 117,105 L115,105 A15,15 0 0,1 100,120" strokeWidth="0.75" />
          <circle cx="100" cy="72" r="3" strokeWidth="0.75" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Subpage spacer */}
        <div className="mb-6"></div>

        {/* Master Layout grid: Sidebar Navigation + Sub-page content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Navigation Menu */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-display font-extrabold text-xs text-navy-950 uppercase tracking-widest px-3 border-b pb-2">
              Menu Profil
            </h3>
            <nav className="flex flex-col space-y-1">
              {sidebarMenus.map((item) => {
                const isActive = subpath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(getNavbarFriendlyPath(item.path))}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-navy-800 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT PANELS: Dynamic Sub-page view */}
          <main className="lg:col-span-9 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm min-h-[450px]">
            
            {/* SUB-PAGE 1: TENTANG AMC BEKASI */}
            {subpath === 'tentang' && (
              <div className="space-y-8 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-950 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-gold-500" />
                    Tentang Akademi Maritim (AMC  Bekasi)
                  </h2>
                </div>

                {/* Main Content Paragraphs */}
                <div className="space-y-4 leading-relaxed text-justify text-slate-600">
                  <p>
                    Akademi Maritim (AMC Bekasi) merupakan institusi pendidikan tinggi yang berkomitmen menyelenggarakan pendidikan vokasi berkualitas di bidang kemaritiman. Kampus ini berfokus pada pengembangan sumber daya manusia yang profesional, berkarakter, disiplin, dan siap menghadapi tantangan dunia maritim nasional maupun internasional.
                  </p>
                  <p>
                    AMC Bekasi menerapkan sistem pendidikan yang mengintegrasikan pembelajaran teori, praktik, pembentukan karakter, kepemimpinan, serta pengembangan kompetensi sesuai kebutuhan dunia industri.
                  </p>
                  <p>
                    Mahasiswa tidak hanya dibekali kemampuan akademik, tetapi juga kemampuan komunikasi, kepemimpinan, etika profesi, kerja sama tim, serta kedisiplinan.
                  </p>
                </div>

                {/* Tujuan Pendidikan */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                  <h3 className="font-display font-bold text-base text-navy-950 flex items-center gap-2">
                    <Target className="h-5 w-5 text-gold-500" />
                    Tujuan Pendidikan
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium text-slate-700">
                    <li className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0" />
                      Menghasilkan lulusan profesional.
                    </li>
                    <li className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0" />
                      Membentuk karakter disiplin.
                    </li>
                    <li className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0" />
                      Mengembangkan jiwa kepemimpinan.
                    </li>
                    <li className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0" />
                      Menyiapkan lulusan yang siap bekerja.
                    </li>
                    <li className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-slate-100 md:col-span-2">
                      <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0" />
                      Menanamkan nilai integritas di setiap aspek pengabdian laut.
                    </li>
                  </ul>
                </div>

                {/* Sistem Pendidikan & Komitmen Mutu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-navy-950 text-white rounded-2xl shadow-sm space-y-2 border border-navy-850">
                    <h3 className="font-display font-bold text-sm text-gold-400 uppercase tracking-wider flex items-center gap-2">
                      <Compass className="h-4.5 w-4.5" />
                      Sistem Pendidikan
                    </h3>
                    <p className="text-xs leading-relaxed text-gray-300 text-justify">
                      pengembangan soft skill, serta pembinaan karakter sehingga lulusan memiliki kompetensi yang sesuai dengan kebutuhan dunia kerja.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <h3 className="font-display font-bold text-sm text-navy-950 uppercase tracking-wider flex items-center gap-2">
                      <Award className="h-4.5 w-4.5 text-navy-800" />
                      Komitmen Terhadap Mutu
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600 text-justify">
                      AMC Bekasi terus meningkatkan kualitas pendidikan melalui pengembangan kurikulum, peningkatan kualitas tenaga pengajar, penguatan fasilitas pembelajaran, serta kerja sama dengan berbagai instansi pemerintah maupun dunia industri.
                    </p>
                  </div>
                </div>

                {/* Program Studi */}
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                    <h3 className="font-display font-bold text-base text-navy-950">Program Studi Vokasi Unggulan</h3>
                    <span className="text-xs font-semibold text-slate-500">Mencetak Ahli Madya Pelayaran Modern</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* D3 Nautika */}
                    <div className="bg-white rounded-[20px] border border-slate-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group">
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img 
                          src={nautikaImg} 
                          alt="D3 Nautika" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-navy-900 text-gold-400 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          DECK OFFICER
                        </div>
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-display font-bold text-sm text-navy-950">D3 Nautika</h4>
                          <p className="text-xs text-slate-500 line-clamp-3 mt-1 leading-relaxed text-justify">
                            Mendidik calon Perwira Pelayaran Niaga bagian dek yang ahli dalam navigasi, penanganan muatan, dan hukum maritim.
                          </p>
                        </div>
                        <button 
                          id="btn-nav-nautika"
                          onClick={() => onNavigate('/program-studi/nautika')} 
                          className="w-full text-center mt-3 py-2 bg-slate-50 hover:bg-navy-950 hover:text-white border border-slate-200 hover:border-navy-950 text-navy-950 rounded-xl text-xs font-semibold tracking-wide transition duration-200"
                        >
                          Selengkapnya &rarr;
                        </button>
                      </div>
                    </div>

                    {/* D3 Teknika */}
                    <div className="bg-white rounded-[20px] border border-slate-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group">
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img 
                          src={teknikaImg} 
                          alt="D3 Teknika" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-navy-900 text-gold-400 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          ENGINE OFFICER
                        </div>
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-display font-bold text-sm text-navy-950">D3 Teknika</h4>
                          <p className="text-xs text-slate-500 line-clamp-3 mt-1 leading-relaxed text-justify">
                            Mendidik calon Perwira Pelayaran Niaga bagian mesin yang ahli dalam pengoperasian, kelistrikan, dan sistem kontrol kapal.
                          </p>
                        </div>
                        <button 
                          id="btn-nav-teknika"
                          onClick={() => onNavigate('/program-studi/teknika')} 
                          className="w-full text-center mt-3 py-2 bg-slate-50 hover:bg-navy-950 hover:text-white border border-slate-200 hover:border-navy-950 text-navy-950 rounded-xl text-xs font-semibold tracking-wide transition duration-200"
                        >
                          Selengkapnya &rarr;
                        </button>
                      </div>
                    </div>

                    {/* D3 KPN */}
                    <div className="bg-white rounded-[20px] border border-slate-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group">
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img 
                          src={kpnImg} 
                          alt="D3 KPN" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-navy-900 text-gold-400 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          PORT LOGISTICS
                        </div>
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-display font-bold text-sm text-navy-950">D3 KPN</h4>
                          <p className="text-xs text-slate-500 line-clamp-3 mt-1 leading-relaxed text-justify">
                            Mendidik tenaga ahli profesional di bidang logistik maritim, ekspor-impor, keagenan kapal, serta operasional kepelabuhanan.
                          </p>
                        </div>
                        <button 
                          id="btn-nav-kpn"
                          onClick={() => onNavigate('/program-studi/kpn')} 
                          className="w-full text-center mt-3 py-2 bg-slate-50 hover:bg-navy-950 hover:text-white border border-slate-200 hover:border-navy-950 text-navy-950 rounded-xl text-xs font-semibold tracking-wide transition duration-200"
                        >
                          Selengkapnya &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Facilities Preview */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-display font-bold text-base text-navy-950">Fasilitas Kampus Utama</h3>
                    <span className="text-xs font-semibold text-slate-500">Sarana Penunjang Mutu Internasional</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Laboratorium', desc: 'Lab Bahasa & CBT' },
                      { name: 'Perpustakaan', desc: 'Ribuan Buku Pelayaran' },
                      { name: 'Aula', desc: 'Serbaguna & Wisuda' },
                      { name: 'Gedung Kampus', desc: 'Lantai Representatif' },
                      { name: 'Area Parkir', desc: 'Luas & Aman Terpadu' },
                      { name: 'Mushola', desc: 'Sarana Ibadah Tenang' }
                    ].map((fac, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
                        <h5 className="font-display font-bold text-xs text-navy-950">{fac.name}</h5>
                        <p className="text-[10px] text-slate-500">{fac.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-2">
                    <button 
                      id="btn-nav-facilities"
                      onClick={() => onNavigate('/fasilitas')}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white rounded-full text-xs font-semibold tracking-wide shadow transition-all duration-200"
                    >
                      <span>Lihat Semua Fasilitas Kampus</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Elegant Motto Quote Section */}
                <div className="p-8 bg-gradient-to-r from-navy-950 to-navy-900 text-white rounded-3xl shadow-sm text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent_50%)]" />
                  <div className="relative z-10 space-y-3">
                    <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">Motto Kehormatan AMC Bekasi</span>
                    <p className="font-display font-black text-lg sm:text-xl leading-relaxed max-w-xl mx-auto italic text-white">
                      "Mencetak Pelaut yang Profesional, Kompetitif, Cakap Rohani, dan Cakap Bahasa Inggris"
                    </p>
                    <div className="h-0.5 w-16 bg-gold-500 mx-auto mt-2" />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PAGE 2: SEJARAH PENDIRIAN */}
            {subpath === 'sejarah' && (
              <div className="space-y-6 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-950 flex items-center gap-2">
                    <Milestone className="h-6 w-6 text-gold-500" />
                    Sejarah Singkat & Kilas Perjalanan
                  </h2>
                </div>

                <p className="leading-relaxed text-justify">
                   Akademi Maritim AMC Bekasi berawal dari Akademi Maritim Cirebon yang berdiri sejak 1986.Kampus ini kemudian merelokasi operasinya ke wilayah Bekasi untuk memperluas kapasitas dan menjangkau lebih banyak calon taruna taruni, serta menjadi satu-satunya kampus maritim di Kota Bekasi
                </p>

                {/* Dynamic Timeline Component */}
                <div className="relative border-l border-slate-200 pl-6 space-y-8 my-6">
                  {timelineEvents.map((evt, idx) => (
                    <div key={evt.id} className="relative animate-fade-in">
                      <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white ${idx === 0 ? 'bg-gold-500 shadow-sm shadow-gold-500/50' : 'bg-navy-800'}`} />
                      <span className="font-mono text-xs font-bold text-gold-600 block">{evt.year}</span>
                      <h4 className="font-display font-bold text-sm text-navy-950 mt-0.5">{evt.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 text-justify">
                        {evt.description}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="leading-relaxed text-justify text-xs text-slate-500 italic">
                  Hingga saat ini, ribuan lulusan AMC Bekasi telah tersebar di berbagai kapal niaga bendera internasional (Singapore, Panama, Japan) serta memegang jabatan manajerial penting di pelabuhan peti kemas nasional.
                </p>
              </div>
            )}

            {/* SUB-PAGE 3: VISI MISI SASARAN */}
            {subpath === 'visi-misi' && (
              <div className="space-y-6 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-950 flex items-center gap-2">
                    <Target className="h-6 w-6 text-gold-500" />
                    Visi, Misi, Tujuan & Sasaran
                  </h2>
                </div>

                {/* Visi */}
                <div className="p-6 bg-navy-950 text-white rounded-3xl space-y-2 border border-navy-850 shadow">
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider block">VISI UTAMA KAMPUS</span>
                  <p className="font-display font-bold text-base leading-relaxed text-justify italic">
                    "{content.about.vision}"
                  </p>
                </div>

                {/* Misi */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-display font-bold text-sm text-navy-950 flex items-center gap-2">
                    <Flag className="h-4.5 w-4.5 text-navy-800" />
                    Misi Penyelenggaraan Pendidikan
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {content.about.mission.map((missionText, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="h-6 w-6 bg-navy-800 text-gold-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                          {idx + 1}
                        </div>
                        <p className="text-slate-700 font-sans text-xs leading-relaxed text-justify">
                          {missionText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tujuan & Sasaran */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                  <h3 className="font-display font-bold text-sm text-navy-950">Tujuan & Sasaran Strategis</h3>
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      Menghasilkan lulusan perwira pelayaran niaga tingkat ahli madya dan administrator logistik pelabuhan yang berdaya saing global, profesional, mandiri, disiplin tinggi, serta berintegritas tinggi.
                    </p>
                    <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 leading-relaxed">
                      <li>Mencapai daya serap kerja lulusan minimal 92% dalam kurun waktu 6 bulan setelah kelulusan resmi.</li>
                      <li>Meningkatkan rasio keterlibatan dosen ahli berlisensi pelaut aktif di jajaran instruktur praktikum.</li>
                      <li>Memperluas jaringan kerja sama keagenan awak kapal (crewing agency) domestik dan mancanegara secara berkelanjutan.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PAGE 4: STRUKTUR ORGANISASI */}
            {subpath === 'struktur' && (
              <div className="space-y-6 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-950 flex items-center gap-2">
                    <Network className="h-6 w-6 text-gold-500" />
                    Struktur Organisasi & Kepemimpinan
                  </h2>
                  <button
                    id="btn-download-pdf-org"
                    onClick={() => {
                      alert("Mengunduh Dokumen PDF Struktur Organisasi Resmi AMC Bekasi...");
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-navy-950 hover:text-white rounded-xl text-xs font-semibold text-navy-950 border border-slate-200 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>

                <p className="leading-relaxed text-justify">
                  Akademi Maritim (AMC) Bekasi dikelola dibawah manajemen baru oleh Ibu Rista Saragih, S.Sos.dan dibantu dengan Direktur Akademi ,Pembantu Direktur (Pudir) bidang Akademik, Ketarunaan, dan Humas.
                </p>

                {/* Bagan Struktur Organisasi & Photo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  
                  {/* Bagan Struktur Card */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-xs text-navy-950 uppercase tracking-wider">
                        Bagan Struktur Organisasi
                      </h4>
                      <span className="text-[9px] px-2 py-0.5 bg-gold-100 text-gold-800 rounded font-semibold">CAMPUS CHART</span>
                    </div>
                    <div 
                      className="relative h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in group"
                      onClick={() => setZoomImage(orgChartImg)}
                    >
                      <img 
                        src={orgChartImg} 
                        alt="Bagan Struktur Organisasi" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                        <Eye className="h-4 w-4 text-gold-400" />
                        <span>Zoom Bagan</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 text-center">Klik bagan di atas untuk memperbesar/zoom gambar bagan resmi.</p>
                  </div>

                  {/* Foto Jajaran Pengurus Card */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-xs text-navy-950 uppercase tracking-wider">
                        Foto Jajaran Kepengurusan & Senat
                      </h4>
                      <span className="text-[9px] px-2 py-0.5 bg-navy-100 text-navy-800 rounded font-semibold">OFFICER TEAM</span>
                    </div>
                    <div 
                      className="relative h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in group"
                      onClick={() => setZoomImage(orgPhotoImg)}
                    >
                      <img 
                        src={orgPhotoImg} 
                        alt="Foto Jajaran Kepengurusan" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                        <Eye className="h-4 w-4 text-gold-400" />
                        <span>Zoom Foto</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 text-center">Klik foto untuk memperbesar jajaran senat kepengurusan AMC Bekasi.</p>
                  </div>

                </div>

                {/* Hierarchal list details */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                  <h4 className="font-display font-bold text-xs text-navy-950 uppercase tracking-wider border-b pb-2">Jajaran Struktural Inti</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">PEMILIK AKADEMI MARITIM AMC BEKASI </span>
                      <p className="font-display font-bold text-xs text-navy-950">{content.about.ownerName}</p>
                      <p className="text-[10px] text-slate-500">{content.about.ownerTitle}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">DIREKTUR AKADEMI MARITIM AMC BEKASI </span>
                      <p className="font-display font-bold text-xs text-navy-950">{content.about.directorName}</p>
                      <p className="text-[10px] text-slate-500">{content.about.directorTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PAGE 5: AKREDITASI KAMPUS */}
            {subpath === 'akreditasi' && (
              <div className="space-y-6 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-950 flex items-center gap-2">
                    <Award className="h-6 w-6 text-gold-500" />
                    Status Akreditasi & Standardisasi Internasional
                  </h2>
                  <button
                    id="btn-download-pdf-akre"
                    onClick={() => alert("Mengunduh Dokumen Sertifikat Akreditasi Resmi AMC Bekasi...")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-navy-950 hover:text-white rounded-xl text-xs font-semibold text-navy-950 border border-slate-200 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Sertifikat</span>
                  </button>
                </div>

                <p className="leading-relaxed text-justify">
                  Kelayakan mutu akademik, administrasi kampus, fasilitas simulator, sarana pengajaran, dan asrama di Akademi Maritim (AMC) Bekasi telah diuji secara berkala oleh Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT) serta diawasi ketat oleh Direktorat Jenderal Perhubungan Laut.
                </p>

                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                  <div className="p-4 bg-navy-800 text-gold-400 rounded-2xl font-display font-black text-3xl sm:text-4xl shadow">
                    B
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-display font-bold text-base text-navy-950">Terakreditasi "SANGAT BAIK" (B)</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Berdasarkan Keputusan BAN-PT (Badan Akreditasi Nasional Perguruan Tinggi) Republik Indonesia, AMC Bekasi memenuhi instrumen kriteria jaminan mutu pendidikan tinggi nasional dengan peringkat B.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-display font-bold text-xs text-emerald-900">Standardisasi IMO STCW 2010</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Tercakup dalam Approval List Kementerian Perhubungan Laut untuk sertifikasi perwira dek dan mesin kapal.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-display font-bold text-xs text-emerald-900">Sertifikasi ISO 9001:2015</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Sistem Manajemen Mutu Pelayanan Pendidikan dan Rekrutmen Taruna terverifikasi internasional secara tahunan.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

           

            {/* SUB-PAGE 6: KALENDER AKADEMIK */}
            {subpath === 'kalender' && (
              <div className="space-y-6 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-950 flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-gold-500" />
                      Kalender Akademik Tahun Ajaran 2026/2027
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-1">Jadwal resmi registrasi semester, ujian simulators, dan pelantikan taruna.</p>
                  </div>
                  <button
                    id="btn-download-pdf-cal"
                    onClick={() => alert("Mengunduh Dokumen PDF Kalender Akademik Resmi AMC Bekasi 2026/2027...")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-navy-950 hover:text-white rounded-xl text-xs font-semibold text-navy-950 border border-slate-200 transition shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF Kalender</span>
                  </button>
                </div>

                <p className="leading-relaxed text-justify">
                  Sistem kalender kegiatan di Akademi Maritim (AMC) Bekasi mengacu pada standar kurikulum nasional pendidikan vokasi maritim. Jadwal disusun secara tertib untuk mendukung perkuliahan teori, pratikum simulator, uji keahlian laut, hingga masa pelaut cadet.
                </p>

                {/* Event Calendar Filters */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center mr-2">Filter Jenis:</span>
                  {['semua', 'akademik', 'wajib', 'pelatihan', 'karir'].map((type) => (
                    <button
                      key={type}
                      id={`btn-filter-cal-${type}`}
                      onClick={() => {
                        // Normally this would set state but keeping it client-friendly and robust in line
                        (window as any)._amcCalFilter = type;
                        // Trigger re-render by small layout hack or forceState hook
                        const ev = new CustomEvent('amc-cal-filter', { detail: type });
                        window.dispatchEvent(ev);
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-navy-950 hover:text-white transition"
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Dynamic Kalender Grid */}
                <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-200">
                  {calendarEvents.map((evt) => (
                    <div key={evt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white transition duration-200">
                      <div className="flex items-center space-x-3.5 shrink-0">
                        <div className="p-2.5 bg-navy-50 text-navy-800 rounded-xl">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold text-navy-950">{evt.period}</span>
                          <span className={`block text-[8px] font-black uppercase tracking-wider font-mono mt-0.5 ${
                            evt.type === 'wajib' ? 'text-red-600' :
                            evt.type === 'akademik' ? 'text-blue-600' :
                            evt.type === 'pelatihan' ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {evt.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 sm:pl-8 text-xs text-slate-700 font-semibold leading-relaxed">
                        {evt.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LIGHTBOX MODAL ZOOM IMAGE STRUCTURE */}
            {zoomImage && (
              <div 
                id="lightbox-modal"
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
                onClick={() => setZoomImage(null)}
              >
                <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={zoomImage} 
                    alt="Zoomed Detail" 
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain max-h-[80vh]"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-navy-950/80 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur">
                    Klik di mana saja untuk menutup detail gambar
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
