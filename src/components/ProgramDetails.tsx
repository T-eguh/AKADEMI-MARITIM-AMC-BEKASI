/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Compass, 
  Settings, 
  Ship, 
  GraduationCap, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Briefcase, 
  BookOpen, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { ProgramItem } from '../types';

interface ProgramDetailsProps {
  programId: 'nautika' | 'teknika' | 'kpn' | string;
  lang: 'id' | 'en';
  programs: ProgramItem[];
  onNavigate: (path: string) => void;
}

export default function ProgramDetails({ programId, lang, programs, onNavigate }: ProgramDetailsProps) {
  // Normalize program ID
  const normId = (programId === 'kpn' || programId === 'kpnk') ? 'kpn' : programId;
  const program = programs.find(p => p.id === normId || (normId === 'kpn' && p.id === 'kpnk')) || programs[0];

  // Specific curriculums / core subjects based on study program
  const getCurriculum = () => {
    if (normId === 'nautika') {
      return [
        { sem: 'Semester I - II', subjects: ['Ilmu Pelayaran Datar (Terrestrial Navigation)', 'Pencegahan Tubrukan di Laut (COLREGS)', 'Konstruksi & Stabilitas Kapal', 'Isyarat Visual & Komunikasi Radio'] },
        { sem: 'Semester III - IV', subjects: ['Navigasi Astronomi (Celestial Navigation)', 'RADAR / ARPA & ECDIS Simulator', 'Meteorologi Kelautan', 'Penanganan & Pengaturan Muatan (Cargo Work)', 'Hukum Maritim Internasional'] },
        { sem: 'Semester V (Praktik Laut)', subjects: ['Praktek Kerja Nyata (Prada) di Atas Kapal Niaga selama 1 Tahun Penuh (Sea Project)'] },
        { sem: 'Semester VI', subjects: ['Kaji Kasus Navigasi', 'Kepemimpinan & Kerja Sama Tim (HELM)', 'Kelaiklautan Kapal', 'Karya Tulis Ilmiah Terapan'] }
      ];
    } else if (normId === 'teknika') {
      return [
        { sem: 'Semester I - II', subjects: ['Pengenalan Mesin Kapal & Termodinamika', 'Gambar Teknik & Pemesinan Bubut', 'Kelistrikan Kapal Dasar', 'Keselamatan Kerja Kamar Mesin'] },
        { sem: 'Semester III - IV', subjects: ['Mesin Diesel Penggerak Utama Kapal', 'Mesin Bantu Kapal (Auxiliary Engines)', 'Sistem Kontrol & Otomatisasi', 'Sistem Pendingin & Boiler Kapal', 'Praktek Pengelasan & Kerja Plat'] },
        { sem: 'Semester V (Praktik Laut)', subjects: ['Praktek Kerja Nyata (Prada) di Kamar Mesin Kapal Niaga selama 1 Tahun (Sea Project)'] },
        { sem: 'Semester VI', subjects: ['Sistem Manajemen Perawatan Mesin (PMS)', 'Troubleshooting Kamar Mesin', 'Teknik Refrigrasi', 'Karya Tulis Ilmiah Terapan'] }
      ];
    } else {
      return [
        { sem: 'Semester I - II', subjects: ['Pengantar Bisnis Maritim', 'Ekonomi Transportasi Laut', 'Manajemen Logistik & Supply Chain', 'Bahasa Inggris Maritim'] },
        { sem: 'Semester III - IV', subjects: ['Administrasi Kepelabuhanan (Port Authority)', 'Keagenan Kapal (Shipping Agency)', 'Tata Laksana Ekspor-Impor & Kepabeanan', 'Asuransi Laut & Klaim Kargo', 'Chartering Kapal'] },
        { sem: 'Semester V (Praktek Darat)', subjects: ['Praktek Kerja Lapangan (PKL) di Pelindo, Bea Cukai, Shipping Line, atau Perusahaan Logistik'] },
        { sem: 'Semester VI', subjects: ['Manajemen Keuangan Perusahaan Pelayaran', 'Teknologi Informasi Kepelabuhanan', 'Hukum Bisnis Maritim', 'Tugas Akhir Terapan'] }
      ];
    }
  };

  const getSertifikatProfesi = () => {
    if (normId === 'nautika') {
      return [
        'Ahli Nautika Tingkat III (ANT-III) Internasional',
        'Basic Safety Training (BST)',
        'Survival Craft and Rescue Boats (SCRB)',
        'Advanced Fire Fighting (AFF)',
        'Medical First Aid (MEFA) & Medical Care (MC)',
        'Radar Simulator & ARPA Simulator (RS / AS)',
        'Electronic Chart Display and Information System (ECDIS)'
      ];
    } else if (normId === 'teknika') {
      return [
        'Ahli Teknika Tingkat III (ATT-III) Internasional',
        'Basic Safety Training (BST)',
        'Survival Craft and Rescue Boats (SCRB)',
        'Advanced Fire Fighting (AFF)',
        'Medical First Aid (MEFA)',
        'Engine Room Watchkeeping (EW)',
        'High Voltage Training for Marine Engineers'
      ];
    } else {
      return [
        'Sertifikat Kompetensi Ahli Kepelabuhanan & Logistik (LSP)',
        'Sertifikat Ekspor-Impor & Kepabeanan (Ahli PPJK)',
        'Sertifikat Dangerous Goods (Penanganan Barang Berbahaya)',
        'Sertifikat Brevet Freight Forwarding Internasional (FIATA)',
        'Sertifikat Keselamatan dan Kesehatan Kerja (K3) Pelabuhan'
      ];
    }
  };

  const getProgramIcon = () => {
    if (normId === 'nautika') return <Compass className="w-8 h-8 text-gold-400" />;
    if (normId === 'teknika') return <Settings className="w-8 h-8 text-gold-400" />;
    return <Ship className="w-8 h-8 text-gold-400" />;
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* Dynamic Hero Banner */}
      <div className="relative h-[45vh] min-h-[320px] bg-navy-950 text-white flex items-center shadow-lg overflow-hidden border-b-4 border-gold-500">
        <div className="absolute inset-0 z-0">
          <img
            src={program.imageUrl}
            alt={program.title}
            className="w-full h-full object-cover opacity-35 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gold-500/20 text-gold-300 px-3.5 py-1.5 rounded-full border border-gold-500/30 text-xs font-semibold tracking-wider uppercase mb-4">
                {getProgramIcon()}
                <span>{program.abbreviation}</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
                {program.title}
              </h1>
              
              <p className="text-slate-300 max-w-3xl text-sm md:text-base italic leading-relaxed">
                Gelar Akademik: <strong className="text-white font-medium">{program.degree}</strong>
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 shrink-0 bg-navy-900/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-inner">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Akreditasi</span>
                <span className="text-lg font-extrabold text-gold-400 flex items-center mt-0.5">
                  <Award className="w-4 h-4 mr-1 shrink-0" />
                  Baik Sekali (B)
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Lama Studi</span>
                <span className="text-lg font-extrabold text-gold-400 flex items-center mt-0.5">
                  <Clock className="w-4 h-4 mr-1 shrink-0" />
                  3 Tahun (6 Sem)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Description, Curriculums, Certificates */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview Section */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-950 flex items-center">
                <GraduationCap className="w-7 h-7 mr-2.5 text-navy-800" />
                {lang === 'id' ? 'Gambaran Umum Program' : 'Program Overview'}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed text-justify">
                {program.fullDetails}
              </p>
              <p className="text-slate-600 text-base leading-relaxed text-justify">
                {program.description}
              </p>
            </section>

            {/* Curriculum Structure */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-950 flex items-center">
                <BookOpen className="w-7 h-7 mr-2.5 text-navy-800" />
                {lang === 'id' ? 'Kurikulum & Mata Kuliah Inti' : 'Curriculum & Core Modules'}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Kurikulum vokasi dirancang dengan komposisi 70% Praktik dan 30% Teori, selaras dengan standar Kementerian Riset & Teknologi RI serta IMO Model Courses.
              </p>

              <div className="space-y-4">
                {getCurriculum().map((semester, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-5 hover:bg-slate-100/50 transition-colors">
                    <h3 className="font-display font-bold text-navy-900 text-base flex items-center mb-3">
                      <CheckCircle2 className="w-4.5 h-4.5 text-gold-500 mr-2 shrink-0" />
                      {semester.sem}
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 pl-6 list-disc">
                      {semester.subjects.map((sub, idx) => (
                        <li key={idx} className="font-medium">{sub}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Professional Certifications */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy-950 flex items-center">
                <ShieldAlert className="w-7 h-7 mr-2.5 text-navy-800" />
                {lang === 'id' ? 'Sertifikasi Kompetensi & Profesi' : 'Required Competency Certificates'}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Selain ijazah Diploma III (A.Md.Tra), setiap lulusan dibekali dengan setumpuk sertifikat keahlian berstandar internasional guna memastikan keterserapan kerja instan.
              </p>

              <div className="bg-navy-900 text-slate-100 rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden border border-gold-500/20">
                <div className="absolute right-0 bottom-0 text-white/5 pointer-events-none">
                  <FileText className="w-64 h-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {getSertifikatProfesi().map((cert, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4.5 h-4.5 text-gold-400 mt-1 shrink-0" />
                      <span className="text-sm font-semibold">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Career Path, PMB Call to Action Sidebar */}
          <div className="space-y-8">
            
            {/* Career opportunities sidebar box */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center mb-4 pb-2 border-b border-slate-200">
                <Briefcase className="w-5.5 h-5.5 mr-2 text-gold-500 shrink-0" />
                Peluang Karir Alumni
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Sektor maritim menawarkan prospek karir yang luar biasa luas dan gaji standar internasional dalam mata uang asing.
              </p>

              <div className="space-y-3">
                {program.careerOpportunities.map((career, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-3.5 rounded-xl hover:border-gold-300 transition-all flex items-start space-x-3 shadow-sm group">
                    <div className="p-1.5 bg-navy-50 text-navy-800 rounded group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 leading-snug">{career}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PMB Direct CTA Box */}
            <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden border-2 border-gold-500">
              {/* Gold light ring effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-gold-500 text-navy-950 text-[10px] font-bold tracking-widest uppercase rounded-full mb-4">
                  PMB 2026/2027
                </span>
                <h3 className="text-xl md:text-2xl font-display font-extrabold tracking-tight mb-2">
                  Siap Berlayar Menuju Sukses?
                </h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
                  Pendaftaran Mahasiswa Baru Gelombang II sudah dibuka. Jadilah bagian dari perwira samudera modern berikutnya di AMC Bekasi.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('/pendaftaran')}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-400 text-navy-950 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all focus:outline-none"
                  >
                    <span>Daftar Online Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onNavigate('/kontak')}
                    className="w-full inline-flex items-center justify-center bg-transparent hover:bg-white/5 text-slate-200 border border-slate-700 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all focus:outline-none"
                  >
                    Hubungi Konselor Pendaftaran
                  </button>
                </div>
              </div>
            </div>

            {/* Admission Requirements quick box */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h4 className="font-display font-bold text-sm text-navy-950 mb-3 uppercase tracking-wider">
                Persyaratan Calon Taruna
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc font-medium">
                <li>Lulusan SMA/MA/SMK Sederajat (Nautika/Teknika mensyaratkan rumpun IPA/Teknik).</li>
                <li>Tinggi badan minimal: Pria 160 cm, Wanita 155 cm.</li>
                <li>Tidak buta warna total maupun parsial.</li>
                <li>Sehat jasmani dan rohani (bebas narkoba).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
