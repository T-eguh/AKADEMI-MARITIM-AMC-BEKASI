/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ClipboardCheck, ShieldCheck, HeartPulse, FileText, Calculator, Calendar, 
  HelpCircle, ArrowLeft, Send, Check, ChevronRight, Info, Award, Ship, Printer, Download, Plus, Minus
} from 'lucide-react';
import { PMBApplication, PMBConfig } from '../types';
import { DEFAULT_PMB_CONFIG } from '../data';

interface PMBPageProps {
  currentPath: string;
  lang: 'id' | 'en';
  onAddApplication: (app: PMBApplication) => void;
  onNavigate: (path: string) => void;
  pmbConfig?: PMBConfig;
}

export default function PMBPage({
  currentPath,
  lang,
  onAddApplication,
  onNavigate,
  pmbConfig
}: PMBPageProps) {
  const isEn = lang === 'en';
  const activeConfig = pmbConfig || DEFAULT_PMB_CONFIG;
  const cleanPath = currentPath.startsWith('/pmb') ? currentPath.replace('/pmb', '') : currentPath.replace('/pendaftaran', '');
  const subpath = cleanPath.replace(/^\//, '');

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    firstChoice: 'nautika',
    secondChoice: 'teknik',
    schoolOrigin: '',
    weight: '',
    height: '',
    waPhone: '',
    parentName: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appCode, setAppCode] = useState('');
  const [registeredCadet, setRegisteredCadet] = useState<any>(null);

  // Fee simulation calculator states
  const [calcMajor, setCalcMajor] = useState<'nautika' | 'teknika' | 'kpn'>('nautika');
  const [calcPath, setCalcPath] = useState<'reguler' | 'beasiswa' | 'dinas'>('reguler');

  // FAQ accordion active state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const codeNum = Math.floor(100000 + Math.random() * 900000);
    const code = `AMC-PMB-2026-${codeNum}`;

    const newApp: PMBApplication = {
      id: code,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      gender: formData.gender,
      firstChoice: formData.firstChoice === 'nautika' ? 'D3 Nautika' : formData.firstChoice === 'teknik' ? 'D3 Teknika' : 'D3 KPN',
      secondChoice: formData.secondChoice === 'nautika' ? 'D3 Nautika' : formData.secondChoice === 'teknik' ? 'D3 Teknika' : 'D3 KPN',
      schoolOrigin: formData.schoolOrigin,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    onAddApplication(newApp);
    setAppCode(code);
    setRegisteredCadet({
      ...formData,
      code,
      submittedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    });
    setIsSubmitted(true);
  };

  // Fee simulator parameters
  const getFeeCalculation = () => {
    const majorFee = activeConfig.fees.find(f => f.major.toLowerCase() === calcMajor.toLowerCase()) || activeConfig.fees[0];
    const baseUangPangkal = majorFee.uangPangkal;
    const baseSPP = majorFee.spp;
    const baseSeragam = majorFee.seragam;
    const baseBST = majorFee.bst;

    // Apply path discounts
    let discountPercent = 0;
    if (calcPath === 'beasiswa') {
      discountPercent = 40; // 40% discount on Uang Pangkal
    } else if (calcPath === 'dinas') {
      discountPercent = 50; // 50% discount on Uang Pangkal + Sponsored SPP
    }

    const uangPangkalDiscount = (baseUangPangkal * discountPercent) / 100;
    const finalUangPangkal = baseUangPangkal - uangPangkalDiscount;
    const totalAwal = finalUangPangkal + baseSPP + baseSeragam + baseBST;

    return {
      baseUangPangkal,
      uangPangkalDiscount,
      finalUangPangkal,
      spp: baseSPP,
      seragam: baseSeragam,
      bst: baseBST,
      total: totalAwal
    };
  };

  const calculatedFees = getFeeCalculation();

  // FAQs data
  const faqs = activeConfig.faqs;

  const sidebarMenus = [
    { path: '', label: isEn ? 'PMB Info' : 'Informasi PMB', icon: Info },
    { path: 'persyaratan', label: isEn ? 'Requirements' : 'Persyaratan Pendaftaran', icon: ShieldCheck },
    { path: 'biaya', label: isEn ? 'Education Fees' : 'Biaya Pendidikan & Kalkulator', icon: Calculator },
    { path: 'jadwal', label: isEn ? 'Admission Schedule' : 'Jadwal Seleksi Waves', icon: Calendar },
    { path: 'faq', label: isEn ? 'Admissions FAQ' : 'FAQ Calon Taruna', icon: HelpCircle },
    { path: 'daftar', label: isEn ? 'Register Online' : 'Daftar Online PMB', icon: ClipboardCheck },
  ];

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Printable Slip Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-8 pb-16 bg-slate-50 min-h-screen text-slate-950 font-sans print:bg-white print:pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0">
        
        {/* PMB page spacer */}
        <div className="mb-6 print:hidden"></div>

        {/* Master Layout grid: Sidebar Navigation + PMB content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
          
          {/* LEFT SIDEBAR: Navigation Menu (Hidden on print) */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 print:hidden">
            <h3 className="font-display font-extrabold text-xs text-navy-950 uppercase tracking-widest px-3 border-b pb-2">
              Menu PMB 2026
            </h3>
            <nav className="flex flex-col space-y-1">
              {sidebarMenus.map((item) => {
                const isActive = subpath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      const base = currentPath.startsWith('/pmb') ? '/pmb' : '/pendaftaran';
                      onNavigate(`${base}/${item.path}`.replace(/\/$/, ''));
                    }}
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
          <main className="lg:col-span-9 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm min-h-[500px] print:border-none print:shadow-none print:p-0">
            
            {/* SUB-PAGE 1: INFORMASI PMB (OVERVIEW) */}
            {subpath === '' && (
              <div className="space-y-8 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4">
                  <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider block">OFFICIAL PORTAL</span>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-navy-950 flex items-center gap-2">
                    <ClipboardCheck className="h-6 w-6 text-gold-500" />
                    Penerimaan Taruna Baru (PMB) TA 2026/2027
                  </h2>
                </div>

                <div className="relative rounded-2xl overflow-hidden h-48 bg-navy-950 flex items-center p-8 text-white">
                  <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1516216628859-9bccecad13ec?q=80&w=800)` }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-transparent" />
                  <div className="relative space-y-2 max-w-lg">
                    <span className="text-[10px] font-bold text-gold-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider inline-block">GELOMBANG II AKTIF</span>
                    <h3 className="font-display font-bold text-lg sm:text-xl">Mulai Karir Pelaut Samudra Anda Bersama AMC Bekasi</h3>
                    <p className="text-gray-300 text-xs">Pendaftaran Gelombang II dibuka hingga 15 Agustus 2026. Seleksi terpadu fisik, psikologi, akademik, dan kesehatan.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-bold text-sm text-navy-950">Mengapa Memilih Pendidikan Maritim di AMC Bekasi?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="p-1.5 bg-navy-50 text-navy-800 rounded-lg w-fit">
                        <Award className="h-4.5 w-4.5" />
                      </div>
                      <h4 className="font-display font-bold text-xs text-navy-950">Berlisensi Internasional</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Kurikulum Nautika & Teknika berstandar internasional IMO STCW, memudahkan lulusan berkarir di luar negeri.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="p-1.5 bg-navy-50 text-navy-800 rounded-lg w-fit">
                        <Ship className="h-4.5 w-4.5" />
                      </div>
                      <h4 className="font-display font-bold text-xs text-navy-950">Bridge Simulator Modern</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Praktikum navigasi modern menggunakan radar, ECDIS, dan visualisasi cuaca ekstrim jembatan kapal.</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gold-500/5 border border-gold-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-display font-bold text-sm text-navy-950">Sudah Siap Melakukan Pendaftaran Online?</h4>
                    <p className="text-xs text-slate-500">Proses pendaftaran online hanya memakan waktu 3 menit.</p>
                  </div>
                  <button
                    onClick={() => onNavigate('/pendaftaran/daftar')}
                    className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
                  >
                    Mulai Daftar Sekarang
                  </button>
                </div>
              </div>
            )}

            {/* SUB-PAGE 2: PERSYARATAN PENDAFTARAN */}
            {subpath === 'persyaratan' && (
              <div className="space-y-8 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4">
                  <h2 className="text-xl sm:text-2xl font-display font-black text-navy-950 flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-gold-500" />
                    Persyaratan & Dokumen Kelayakan
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Persyaratan Umum */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <h3 className="font-display font-bold text-sm text-navy-950 flex items-center gap-2 pb-2 border-b">
                      <Info className="h-4.5 w-4.5 text-navy-800" />
                      Persyaratan Akademik & Umum
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc">
                      {activeConfig.requirements.general.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Persyaratan Fisik */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <h3 className="font-display font-bold text-sm text-navy-950 flex items-center gap-2 pb-2 border-b">
                      <HeartPulse className="h-4.5 w-4.5 text-rose-600" />
                      Persyaratan Fisik & Kesehatan
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc">
                      {activeConfig.requirements.physical.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Berkas Dokumen */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <h3 className="font-display font-bold text-sm text-navy-950 flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-4.5 w-4.5 text-amber-600" />
                    Dokumen Administrasi yang Wajib Diunggah / Diserahkan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeConfig.requirements.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <div className="h-5 w-5 bg-navy-800 text-gold-400 font-bold rounded-full flex items-center justify-center shrink-0">{idx + 1}</div>
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PAGE 3: BIAYA PENDIDIKAN & KALKULATOR INTERAKTIF */}
            {subpath === 'biaya' && (
              <div className="space-y-8 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4">
                  <h2 className="text-xl sm:text-2xl font-display font-black text-navy-950 flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-gold-500" />
                    Biaya Pendidikan & Simulasi Kalkulator Biaya
                  </h2>
                </div>

                <p className="leading-relaxed">
                  Demi transparansi keuangan, AMC Bekasi menyediakan kalkulator biaya pendidikan interaktif. Silakan pilih Program Studi dan Jalur Seleksi pendaftaran Anda untuk mengkalkulasi estimasi rincian biaya registrasi awal semester 1.
                </p>

                {/* INTERACTIVE CALCULATOR */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Left Column: Interactive Selectors */}
                  <div className="md:col-span-5 space-y-5">
                    <h3 className="font-display font-bold text-sm text-navy-950 border-b pb-2">Simulasi Biaya</h3>
                    
                    {/* Selector 1: Major */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-700 font-bold block">1. Pilih Program Studi</label>
                      <select
                        value={calcMajor}
                        onChange={(e: any) => setCalcMajor(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 text-xs"
                      >
                        <option value="nautika">D3 Nautika (Deck Officer)</option>
                        <option value="teknika">D3 Teknika (Marine Engineer)</option>
                        <option value="kpn">D3 KPN (Port Logistics Management)</option>
                      </select>
                    </div>

                    {/* Selector 2: Selection Path */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-700 font-bold block">2. Pilih Jalur Seleksi</label>
                      <select
                        value={calcPath}
                        onChange={(e: any) => setCalcPath(e.target.value)}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 text-xs"
                      >
                        <option value="reguler">Jalur Reguler (Mandiri)</option>
                        <option value="beasiswa">Jalur Beasiswa Prestasi (Akademik)</option>
                        <option value="dinas">Jalur Ikatan Dinas Mitra Pelayaran</option>
                      </select>
                    </div>

                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/15 text-[11px] text-amber-900 leading-relaxed">
                      <strong>Catatan Cicilan:</strong> Uang Pangkal dapat dicicil hingga 4 kali angsuran selama Tahun Akademik pertama berlangsung untuk meringankan beban ekonomi keluarga Taruna.
                    </div>
                  </div>

                  {/* Right Column: Calculated Bill */}
                  <div className="md:col-span-7 bg-navy-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6">
                    <div>
                      <span className="text-[9px] text-gold-400 font-bold uppercase tracking-widest block mb-1">Rincian Estimasi Biaya</span>
                      <h4 className="font-display font-bold text-base border-b border-white/10 pb-2">Registrasi Awal & Atribut Taruna</h4>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Raw Uang Pangkal */}
                      <div className="flex justify-between text-slate-300">
                        <span>Biaya Uang Pangkal:</span>
                        <span>{formatRupiah(calculatedFees.baseUangPangkal)}</span>
                      </div>

                      {/* Discounts */}
                      {calculatedFees.uangPangkalDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400 font-medium">
                          <span>Subsidi/Potongan Jalur:</span>
                          <span>-{formatRupiah(calculatedFees.uangPangkalDiscount)}</span>
                        </div>
                      )}

                      {/* SPP */}
                      <div className="flex justify-between text-slate-300">
                        <span>SPP Kuliah Semester 1:</span>
                        <span>{formatRupiah(calculatedFees.spp)}</span>
                      </div>

                      {/* Uniform */}
                      <div className="flex justify-between text-slate-300">
                        <span>Atribut, Jas Almamater & Seragam Dinas:</span>
                        <span>{formatRupiah(calculatedFees.seragam)}</span>
                      </div>

                      {/* Safety Training if Nautical/Engineering */}
                      {calculatedFees.bst > 0 && (
                        <div className="flex justify-between text-slate-300">
                          <span>Diklat Keahlian BST & COP IMO:</span>
                          <span>{formatRupiah(calculatedFees.bst)}</span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="font-display font-bold text-xs text-gold-400 uppercase">ESTIMASI TOTAL AWAL:</span>
                      <span className="font-mono text-lg sm:text-xl font-bold text-white">{formatRupiah(calculatedFees.total)}</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SUB-PAGE 4: JADWAL PMB */}
            {subpath === 'jadwal' && (
              <div className="space-y-8 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4">
                  <h2 className="text-xl sm:text-2xl font-display font-black text-navy-950 flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-gold-500" />
                    Jadwal Penerimaan & Gelombang Pendaftaran
                  </h2>
                </div>

                <div className="space-y-6">
                  {activeConfig.waves.map((wave) => {
                    const isClosed = wave.status === 'closed';
                    const isOpen = wave.status === 'open';
                    return (
                      <div
                        key={wave.id}
                        className={`p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                          isOpen
                            ? 'bg-white border-2 border-gold-500 shadow-sm'
                            : isClosed
                            ? 'bg-slate-50 border border-slate-100 opacity-60'
                            : 'bg-slate-50 border border-slate-100'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4
                              className={`font-display font-bold text-sm ${
                                isOpen
                                  ? 'text-navy-950'
                                  : isClosed
                                  ? 'text-slate-500'
                                  : 'text-slate-700'
                              }`}
                            >
                              {wave.name}
                            </h4>
                            {isOpen && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                                AKTIF SEKARANG
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${isClosed ? 'text-slate-400' : 'text-slate-500'}`}>
                            Pendaftaran: {wave.period} | Ujian Seleksi: {wave.examDate}
                          </p>
                        </div>
                        {isOpen ? (
                          <button
                            onClick={() => onNavigate('/pendaftaran/daftar')}
                            className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold rounded-xl text-xs shadow transition cursor-pointer"
                          >
                            Daftar {wave.name.split(' ')[0]}
                          </button>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              isClosed
                                ? 'bg-slate-200 text-slate-600'
                                : 'bg-navy-50 text-navy-800'
                            }`}
                          >
                            {isClosed ? 'PENDAFTARAN TUTUP' : 'BELUM DIBUKA'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-PAGE 5: FAQ ACCORDION */}
            {subpath === 'faq' && (
              <div className="space-y-8 animate-fade-in text-sm text-slate-700">
                <div className="border-b pb-4">
                  <h2 className="text-xl sm:text-2xl font-display font-black text-navy-950 flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-gold-500" />
                    Frequently Asked Questions (FAQ)
                  </h2>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, idx) => {
                    const isOpen = activeFaq === idx;
                    return (
                      <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden transition-all">
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : idx)}
                          className="w-full flex justify-between items-center p-5 bg-slate-50 hover:bg-slate-100/50 text-left transition focus:outline-none"
                        >
                          <span className="font-display font-bold text-xs sm:text-sm text-navy-950">{faq.q}</span>
                          <span className="text-gold-600 shrink-0 ml-4 font-bold text-lg">
                            {isOpen ? <Minus className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="p-5 bg-white border-t border-slate-50 animate-fade-in text-xs leading-relaxed text-slate-600 text-justify">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-PAGE 6: FORMULIR DAFTAR PMB ONLINE */}
            {subpath === 'daftar' && (
              <div className="space-y-8 animate-fade-in text-sm text-slate-700">
                
                {isSubmitted && registeredCadet ? (
                  /* =========================================
                     PRINTABLE REGISTRATION SLIP / SUCCESS
                     ========================================= */
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* Success Alert Header (Hidden on print) */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2 print:hidden">
                      <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                        <Check className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-bold text-base text-emerald-950">Pendaftaran Berhasil Dikirim!</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        Data pendaftaran Calon Taruna telah sukses terdaftar di server database pusat AMC Bekasi. Silakan cetak slip pendaftaran di bawah ini untuk dibawa saat verifikasi fisik.
                      </p>
                      
                      <div className="flex gap-3 justify-center pt-2">
                        <button
                          onClick={handlePrint}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-navy-800 hover:bg-navy-950 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer"
                        >
                          <Printer className="h-4 w-4" />
                          <span>Cetak Slip Pendaftaran</span>
                        </button>
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                        >
                          Daftar Taruna Baru Lainnya
                        </button>
                      </div>
                    </div>

                    {/* THE SLIP BOX (Styled perfectly for standard A4 printing) */}
                    <div className="bg-white border-4 border-navy-950 rounded-3xl p-8 max-w-2xl mx-auto space-y-6 shadow-sm relative print:border-none print:shadow-none print:p-0">
                      
                      {/* Logo & Kampus Title */}
                      <div className="flex items-center justify-between border-b-2 border-navy-950 pb-4">
                        <div className="flex items-center space-x-3 text-left">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Logo_Akademi_Maritim_Cirebon.png" 
                            alt="AMC Logo" 
                            className="h-14 w-14 shrink-0" 
                          />
                          <div>
                            <h4 className="font-display font-black text-sm tracking-tight text-navy-950">AKADEMI MARITIM ( AMC Bekasi )</h4>
                            <p className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">AMC BEKASI CAMPUS</p>
                            <p className="text-[8px] text-slate-400">Jl. Raya Bekasi KM.26, Indonesia | Telp: 0812-3456-7890</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-extrabold uppercase bg-gold-500 text-navy-950 px-2 py-1 rounded">SLIP PENDAFTARAN</span>
                          <p className="text-[9px] font-mono font-bold text-navy-950 mt-1">{registeredCadet.code}</p>
                        </div>
                      </div>

                      {/* Slip Body details */}
                      <div className="space-y-4">
                        <h5 className="font-display font-extrabold text-xs text-navy-950 uppercase tracking-widest border-b pb-1">BIODATA CALON TARUNA</h5>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-400">Nama Lengkap:</span>
                            <strong className="text-navy-950 uppercase">{registeredCadet.fullName}</strong>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-400">Email:</span>
                            <strong className="text-navy-950">{registeredCadet.email}</strong>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-400">No. WhatsApp:</span>
                            <strong className="text-navy-950">{registeredCadet.phone}</strong>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-400">Jenis Kelamin:</span>
                            <strong className="text-navy-950">{registeredCadet.gender}</strong>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-400">Sekolah Asal:</span>
                            <strong className="text-navy-950 uppercase">{registeredCadet.schoolOrigin}</strong>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-slate-400">Tanggal Daftar:</span>
                            <strong className="text-navy-950">{registeredCadet.submittedAt}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Choice study program */}
                      <div className="bg-slate-50 p-4 rounded-xl border grid grid-cols-2 gap-4">
                        <div className="text-center border-r">
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block">PILIHAN UTAMA</span>
                          <strong className="text-xs text-navy-950 font-display font-bold uppercase block mt-1">
                            {registeredCadet.firstChoice === 'nautika' ? 'D3 Nautika (Deck Officer)' : registeredCadet.firstChoice === 'teknik' ? 'D3 Teknika (Marine Engineer)' : 'D3 KPN (Port Logistics)'}
                          </strong>
                        </div>
                        <div className="text-center">
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block">PILIHAN KEDUA</span>
                          <strong className="text-xs text-navy-950 font-display font-bold uppercase block mt-1">
                            {registeredCadet.secondChoice === 'nautika' ? 'D3 Nautika (Deck Officer)' : registeredCadet.secondChoice === 'teknik' ? 'D3 Teknika (Marine Engineer)' : 'D3 KPN (Port Logistics)'}
                          </strong>
                        </div>
                      </div>

                      {/* Instructions / Footer */}
                      <div className="space-y-2 bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <h6 className="font-display font-bold text-xs text-amber-950 flex items-center gap-1">
                          <Info className="h-4.5 w-4.5 text-amber-800" />
                          Langkah Selanjutnya (Prosedur Seleksi):
                        </h6>
                        <ol className="list-decimal pl-4 text-[10px] text-slate-600 space-y-1">
                          <li>Cetak lembaran slip pendaftaran ini (baik hitam-putih maupun berwarna).</li>
                          <li>Kirim berkas fotokopi ijazah, KK, akta lahir, pasfoto, dan surat sehat melalui pos atau serahkan langsung ke Sekretariat PMB AMC Bekasi.</li>
                          <li>Hadir di Kampus AMC Bekasi sesuai jadwal gelombang seleksi untuk mengikuti uji potensi akademik (TPA), uji fisik kesamaptaan jasmani, dan tes kesehatan.</li>
                          <li>Informasi kelulusan akhir akan diumumkan melalui WhatsApp resmi panitia PMB.</li>
                        </ol>
                      </div>

                      {/* Barcode/Signature Placeholders */}
                      <div className="pt-4 border-t flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="h-10 w-36 bg-slate-100 border border-slate-300 flex items-center justify-center font-mono text-[9px] text-slate-500 tracking-widest">
                            ||||| |||| || |||| ||||
                          </div>
                          <span className="text-[8px] font-mono text-slate-400">REGISTRATION BARCODE</span>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] text-slate-400">Bekasi, Panitia PMB AMC</p>
                          <div className="h-10" />
                          <strong className="text-[9px] text-navy-950 border-t border-navy-950 block pt-1 px-4">Ardianto, S.Pd.</strong>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* =========================================
                     REGISTRATION FORM VIEW
                     ========================================= */
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b pb-4">
                      <h2 className="text-xl sm:text-2xl font-display font-black text-navy-950 flex items-center gap-2">
                        <ClipboardCheck className="h-6 w-6 text-gold-500" />
                        Formulir Registrasi Taruna Baru (PMB)
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Lengkapi seluruh data secara valid untuk melakukan registrasi awal di portal akademik.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                      
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Nama Lengkap (Sesuai Ijazah) *</label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Masukkan nama lengkap Anda"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>

                      {/* Parent Name */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Nama Orang Tua / Wali *</label>
                        <input
                          type="text"
                          name="parentName"
                          required
                          value={formData.parentName}
                          onChange={handleInputChange}
                          placeholder="Nama Ayah / Ibu / Wali"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Alamat Email Aktif *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="nama@email.com"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>

                      {/* Phone / WA */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">No. WhatsApp Calon Taruna *</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="08xxxxxxxxxx"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>

                      {/* Place of Birth */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Tempat Lahir *</label>
                        <input
                          type="text"
                          name="birthPlace"
                          required
                          value={formData.birthPlace}
                          onChange={handleInputChange}
                          placeholder="Kota Kelahiran"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Tanggal Lahir *</label>
                        <input
                          type="date"
                          name="birthDate"
                          required
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>

                      {/* Gender */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Jenis Kelamin *</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>

                      {/* School Origin */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Sekolah Asal *</label>
                        <input
                          type="text"
                          name="schoolOrigin"
                          required
                          value={formData.schoolOrigin}
                          onChange={handleInputChange}
                          placeholder="Nama SMA / SMK Sederajat"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>

                      {/* Height */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Tinggi Badan (cm) *</label>
                        <input
                          type="number"
                          name="height"
                          required
                          value={formData.height}
                          onChange={handleInputChange}
                          placeholder="Contoh: 168"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>

                      {/* Weight */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Berat Badan (kg) *</label>
                        <input
                          type="number"
                          name="weight"
                          required
                          value={formData.weight}
                          onChange={handleInputChange}
                          placeholder="Contoh: 58"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>

                      {/* First Choice Major */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Program Studi Pilihan Pertama *</label>
                        <select
                          name="firstChoice"
                          value={formData.firstChoice}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        >
                          <option value="nautika">D3 Nautika (Deck Officer)</option>
                          <option value="teknik">D3 Teknika (Marine Engineer)</option>
                          <option value="kpn">D3 KPN (Port Logistics Management)</option>
                        </select>
                      </div>

                      {/* Second Choice Major */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">Program Studi Pilihan Kedua *</label>
                        <select
                          name="secondChoice"
                          value={formData.secondChoice}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        >
                          <option value="nautika">D3 Nautika (Deck Officer)</option>
                          <option value="teknik">D3 Teknika (Marine Engineer)</option>
                          <option value="kpn">D3 KPN (Port Logistics Management)</option>
                        </select>
                      </div>

                      {/* Submit */}
                      <div className="md:col-span-2 pt-4">
                        <button
                          type="submit"
                          className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-sm transition transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <Send className="h-4.5 w-4.5" />
                          <span>Kirim Data Registrasi Online</span>
                        </button>
                      </div>

                    </form>
                  </div>
                )}

              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
