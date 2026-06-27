/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, CheckCircle2, ClipboardCheck, ArrowRight, UserCheck, HeartPulse, FileText, Send, Check } from 'lucide-react';
import { PMBApplication, PMBConfig } from '../types';
import { DEFAULT_PMB_CONFIG } from '../data';

interface PMBProps {
  onAddApplication: (app: PMBApplication) => void;
  lang?: 'id' | 'en';
  pmbConfig?: PMBConfig;
}

export default function PMB({ onAddApplication, lang = 'id', pmbConfig }: PMBProps) {
  const isEn = lang === 'en';
  const activeConfig = pmbConfig || DEFAULT_PMB_CONFIG;
  const [activeTab, setActiveTab] = useState<'persyaratan' | 'jalur' | 'timeline'>('persyaratan');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appCode, setAppCode] = useState('');

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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate random application code (e.g., AMC-2026-9284)
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const code = `AMC-2026-${codeNum}`;

    const newApp: PMBApplication = {
      id: code,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      gender: formData.gender,
      firstChoice: formData.firstChoice === 'nautika' ? ' Nautika' : formData.firstChoice === 'teknik' ? 'D Teknik' : 'KPN',
      secondChoice: formData.secondChoice === 'nautika' ? ' Nautika' : formData.secondChoice === 'teknik' ? 'D Teknik' : ' KPN',
      schoolOrigin: formData.schoolOrigin,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    onAddApplication(newApp);
    setAppCode(code);
    setIsSubmitted(true);
    
    // Clear form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      birthPlace: '',
      birthDate: '',
      gender: 'Laki-laki',
      firstChoice: 'nautika',
      secondChoice: 'teknik',
      schoolOrigin: '',
    });
  };

  return (
    <section id="pmb" className="py-24 bg-white text-slate-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-navy-800 bg-navy-50 px-3.5 py-1.5 rounded-full inline-block">
            {isEn ? 'New Cadet Admissions' : 'Penerimaan Mahasiswa Baru'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-navy-950">
            {isEn ? 'Batch II Registration Academic Year 2026/2027' : 'Pendaftaran Gelombang II TA 2026/2027'}
          </h2>
          <p className="text-gray-600 font-sans text-sm max-w-xl mx-auto">
            {isEn 
              ? 'Join hundreds of newly minted ocean-going officers. Our selection process is completely transparent, objective, and fully digital.'
              : 'Bergabunglah bersama ratusan perwira samudera baru. Proses seleksi transparan, objektif, dan terintegrasi secara daring.'}
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Block: Info Tabs (Requirements, Selection Pathways, Timeline) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Info Navigation Tabs */}
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button
                onClick={() => setActiveTab('persyaratan')}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold font-display tracking-wide transition-all ${
                  activeTab === 'persyaratan'
                    ? 'bg-navy-800 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {isEn ? 'Requirements' : 'Persyaratan'}
              </button>
              <button
                onClick={() => setActiveTab('jalur')}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold font-display tracking-wide transition-all ${
                  activeTab === 'jalur'
                    ? 'bg-navy-800 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {isEn ? 'Admission Paths' : 'Jalur Seleksi'}
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold font-display tracking-wide transition-all ${
                  activeTab === 'timeline'
                    ? 'bg-navy-800 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {isEn ? 'Timeline' : 'Timeline'}
              </button>
            </div>

            {/* Tab 1: Persyaratan */}
            {activeTab === 'persyaratan' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  
                  {/* Persyaratan Umum */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <div className="p-2.5 bg-navy-50 text-navy-800 rounded-xl w-10 h-10 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-navy-800" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-navy-950">{isEn ? 'General Requirements' : 'Persyaratan Umum'}</h4>
                    <ul className="text-xs text-gray-600 space-y-2 font-sans">
                      {activeConfig.requirements.general.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-gold-600 font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Persyaratan Fisik */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl w-10 h-10 flex items-center justify-center">
                      <HeartPulse className="h-5 w-5 text-rose-800" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-navy-950">{isEn ? 'Physical Requirements' : 'Persyaratan Fisik'}</h4>
                    <ul className="text-xs text-gray-600 space-y-2 font-sans">
                      {activeConfig.requirements.physical.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-gold-600 font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Berkas Dokumen */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl w-10 h-10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-800" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-navy-950">{isEn ? 'Required Documents' : 'Berkas Dokumen'}</h4>
                    <ul className="text-xs text-gray-600 space-y-2 font-sans">
                      {activeConfig.requirements.documents.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-gold-600 font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            )}

            {/* Tab 2: Jalur Seleksi */}
            {activeTab === 'jalur' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Jalur Reguler */}
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-8 w-8 bg-navy-800 text-gold-500 rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <div>
                    <h4 className="font-display font-bold text-base text-navy-950">{isEn ? 'Regular Pathway (Standard Exam)' : 'Jalur Reguler (Tes Mandiri)'}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-sans mt-1 leading-relaxed text-justify">
                      {isEn 
                        ? 'Standard selection system covering Academic Potentials Exam (TPA), physical health examination, nautical interview, and stamina tests. Open from Batch I to Batch III.'
                        : 'Sistem seleksi standar meliputi Tes Potensi Akademik (TPA), Tes Kesehatan fisik, Wawancara maritim, dan Kesamaptaan jasmani. Dibuka sepanjang Gelombang I hingga Gelombang III.'}
                    </p>
                  </div>
                </div>

                {/* Jalur Beasiswa Prestasi */}
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-8 w-8 bg-navy-800 text-gold-500 rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <div>
                    <h4 className="font-display font-bold text-base text-navy-950">{isEn ? 'Scholarship Pathway (Academic & Sports)' : 'Jalur Beasiswa Prestasi (Akademik & Non-Akademik)'}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-sans mt-1 leading-relaxed text-justify">
                      {isEn 
                        ? 'Zero registration fees and up to 50% tuition subsidies for students with high academic ranks (1st to 5th) or regional sport/science champions.'
                        : 'Bebas biaya pendaftaran dan potongan Uang Pangkal hingga 50% bagi siswa berprestasi di sekolah (peringkat 1-5) atau pemenang kejuaraan olahraga/sains minimal tingkat kabupaten.'}
                    </p>
                  </div>
                </div>

                {/* Jalur Ikatan Dinas Yayasan */}
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="h-8 w-8 bg-navy-800 text-gold-500 rounded-full flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  <div>
                    <h4 className="font-display font-bold text-base text-navy-950">{isEn ? 'Official Sponsorship (Shipping Lines)' : 'Jalur Ikatan Dinas (Perusahaan Pelayaran)'}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-sans mt-1 leading-relaxed text-justify">
                      {isEn 
                        ? 'Special selection programs in direct partnership with shipping conglomerates. Graduates receive guaranteed jobs with corporate sponsorships.'
                        : 'Program seleksi khusus bekerjasama dengan perusahaan pelayaran mitra (domestik & asing). Lulusan dijamin langsung bekerja dan biaya pendidikan disubsidi oleh pihak sponsor korporat.'}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 3: Timeline */}
            {activeTab === 'timeline' && (
              <div className="relative pl-6 space-y-6 border-l border-navy-100 animate-fade-in py-2">
                {activeConfig.waves.map((wave) => {
                  const isOpen = wave.status === 'open';
                  const isClosed = wave.status === 'closed';
                  return (
                    <div key={wave.id} className="relative">
                      <div className={`absolute -left-[31px] top-1 h-4 w-4 border-4 border-white rounded-full ${isOpen ? 'bg-navy-800' : isClosed ? 'bg-slate-300' : 'bg-gold-500'}`} />
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-display font-bold text-sm sm:text-base ${isClosed ? 'text-slate-500' : 'text-navy-950'}`}>
                            {wave.name}
                          </h4>
                          <p className={`text-xs font-sans mt-0.5 ${isClosed ? 'text-slate-400' : 'text-slate-500'}`}>
                            Pendaftaran: {wave.period} | Ujian Seleksi: {wave.examDate}
                          </p>
                        </div>
                        {isOpen && (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md shrink-0 uppercase">
                            AKTIF
                          </span>
                        )}
                        {isClosed && (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md shrink-0 uppercase">
                            TUTUP
                          </span>
                        )}
                        {!isOpen && !isClosed && (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md shrink-0 uppercase">
                            MENDATANG
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Block: Working Interactive Admission Form */}
          <div className="lg:col-span-5">
            <div className="relative">
              
              {/* Highlight background glow */}
              <div className="absolute -inset-1.5 bg-gold-500/10 rounded-3xl filter blur-xl" />
              
              <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100">
                <h3 className="font-display font-bold text-lg text-navy-950 mb-1 flex items-center gap-2">
                  <ClipboardCheck className="h-5.5 w-5.5 text-gold-500 animate-bounce" />
                  {isEn ? 'Online Registration Form' : 'Formulir Pendaftaran Online'}
                </h3>
                <p className="text-xs text-gray-500 font-sans mb-6">{isEn ? 'Fill out the form below to submit your cadet application.' : 'Isi seluruh formulir berikut untuk mengajukan pendaftaran Anda.'}</p>

                {isSubmitted ? (
                  /* Success Screen */
                  <div className="text-center py-8 space-y-4 animate-fade-in">
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
                      <Check className="h-8 w-8 text-emerald-600" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-base text-navy-950">{isEn ? 'Registration Successful!' : 'Pendaftaran Berhasil!'}</h4>
                      <p className="text-xs text-gray-500 font-sans">{isEn ? 'Your Cadet Application Code:' : 'Kode Aplikasi Pendaftaran Anda:'}</p>
                      <span className="inline-block px-4 py-2 bg-navy-50 text-navy-800 font-mono text-sm font-bold rounded-xl tracking-wider uppercase border border-navy-100">
                        {appCode}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-xs mx-auto">
                      {isEn 
                        ? 'Your application details have been safely logged in the campus database. Our academic registrar will validate your files and contact you shortly via WhatsApp.'
                        : 'Dokumentasi pendaftaran telah disimpan di portal kampus. Petugas akademik kami akan segera memvalidasi berkas dan menghubungi Anda via WhatsApp.'}
                    </p>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs text-navy-800 font-bold hover:text-gold-600 transition-colors cursor-pointer"
                    >
                      {isEn ? 'Register Another Cadet ←' : 'Daftarkan Calon Taruna Lain ←'}
                    </button>
                  </div>
                ) : (
                  /* Form Fields */
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                    
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block">{isEn ? 'Full Name as on Diploma *' : 'Nama Lengkap Sesuai Ijazah *'}</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={isEn ? 'Enter your full name' : 'Masukkan nama lengkap Anda'}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">{isEn ? 'Active Email *' : 'Email Aktif *'}</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="name@email.com"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>
                      
                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">{isEn ? 'WhatsApp Number *' : 'No. WhatsApp *'}</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="081234xxxxxx"
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Birth Place */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">{isEn ? 'Place of Birth *' : 'Tempat Lahir *'}</label>
                        <input
                          type="text"
                          name="birthPlace"
                          required
                          value={formData.birthPlace}
                          onChange={handleInputChange}
                          placeholder="Bekasi, Jakarta..."
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>
                      
                      {/* Birth Date */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">{isEn ? 'Date of Birth *' : 'Tanggal Lahir *'}</label>
                        <input
                          type="date"
                          name="birthDate"
                          required
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Gender */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">{isEn ? 'Gender *' : 'Jenis Kelamin *'}</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        >
                          <option value="Laki-laki">{isEn ? 'Male' : 'Laki-laki'}</option>
                          <option value="Perempuan">{isEn ? 'Female' : 'Perempuan'}</option>
                        </select>
                      </div>

                      {/* Origin School */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">{isEn ? 'School Origin *' : 'Sekolah Asal *'}</label>
                        <input
                          type="text"
                          name="schoolOrigin"
                          required
                          value={formData.schoolOrigin}
                          onChange={handleInputChange}
                          placeholder={isEn ? 'High School / Vocational' : 'SMA / SMK Sederajat'}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* First Choice */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">{isEn ? 'First Choice Major *' : 'Pilihan Utama *'}</label>
                        <select
                          name="firstChoice"
                          value={formData.firstChoice}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        >
                          <option value="nautika"> Nautika</option>
                          <option value="teknik"> Teknik</option>
                          <option value="kpn">KPN</option>
                        </select>
                      </div>

                      {/* Second Choice */}
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold block">{isEn ? 'Second Choice Major *' : 'Pilihan Kedua *'}</label>
                        <select
                          name="secondChoice"
                          value={formData.secondChoice}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                        >
                          <option value="nautika"> Nautika</option>
                          <option value="teknik"> Teknik</option>
                          <option value="kpn"> KPN</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold py-3.5 rounded-xl shadow-lg hover:shadow-gold-500/10 flex items-center justify-center space-x-2 text-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer mt-4"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isEn ? 'Submit Cadet Application' : 'Kirim Pendaftaran Online'}</span>
                    </button>
                    
                  </form>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
