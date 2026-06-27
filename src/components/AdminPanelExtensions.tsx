/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trash2, Edit2, Plus, Check, Upload, GraduationCap, Globe, ShieldAlert, 
  FolderOpen, Activity, User, Link, Key, Briefcase, MapPin, Search, Ship
} from 'lucide-react';
import { AlumniItem, SEOSettings, UserItem, MediaItem, ActivityLogItem } from '../types';

// Image compressor helper
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string || '');
    };
    reader.readAsDataURL(file);
  });
};

interface ExtensionsProps {
  activeTab: 'alumni' | 'seo' | 'users' | 'media' | 'logs';
  alumniItems: AlumniItem[];
  onUpdateAlumni: (items: AlumniItem[]) => void;
  seoSettings?: SEOSettings;
  onUpdateSEO: (seo: SEOSettings) => void;
  users: UserItem[];
  onUpdateUsers: (items: UserItem[]) => void;
  mediaItems: MediaItem[];
  onUpdateMedia: (items: MediaItem[]) => void;
  activityLogs: ActivityLogItem[];
  onUpdateLogs: (items: ActivityLogItem[]) => void;
}

export default function AdminPanelExtensions({
  activeTab,
  alumniItems,
  onUpdateAlumni,
  seoSettings,
  onUpdateSEO,
  users,
  onUpdateUsers,
  mediaItems,
  onUpdateMedia,
  activityLogs,
  onUpdateLogs
}: ExtensionsProps) {

  // Logs helper
  const addLog = (action: string, details: string) => {
    const newLog: ActivityLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Administrator',
      role: 'Super Admin',
      action,
      details
    };
    onUpdateLogs([newLog, ...activityLogs]);
  };

// Helper to process, crop, zoom, and rotate original high-resolution image
const processAlumniImage = (
  imageSrc: string,
  zoom: number,
  rotation: number
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = Math.min(img.naturalWidth, img.naturalHeight);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSrc);
        return;
      }
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      const drawWidth = img.naturalWidth * zoom;
      const drawHeight = img.naturalHeight * zoom;
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = () => {
      resolve(imageSrc);
    };
    img.src = imageSrc;
  });
};

  // 1. ALUMNI STATES & HANDLERS
  const [editingAlumniId, setEditingAlumniId] = useState<string | null>(null);
  
  // Photo Manager States
  const [photoZoom, setPhotoZoom] = useState<number>(1);
  const [photoRotation, setPhotoRotation] = useState<number>(0);
  const [rawUploadedImage, setRawUploadedImage] = useState<string>('');

  const [alumniForm, setAlumniForm] = useState<Omit<AlumniItem, 'id'>>({
    name: '',
    photo: '',
    graduationYear: new Date().getFullYear().toString(),
    studyProgram: '',
    occupation: '',
    company: '',
    city: '',
    biography: '',
    testimonial: '',
    socialMedia: {},
    isFeatured: true,
    status: 'published',
    shipName: '',
    placement: '',
    displayOrder: 1
  });

  const handleApplyAdjustments = async () => {
    if (rawUploadedImage) {
      try {
        const processed = await processAlumniImage(rawUploadedImage, photoZoom, photoRotation);
        setAlumniForm(prev => ({ ...prev, photo: processed }));
        alert('Foto berhasil disesuaikan dengan kualitas HD asli!');
      } catch (err) {
        console.error('Gagal memproses foto:', err);
      }
    }
  };

  const handleSaveAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalPhoto = alumniForm.photo;
    if (rawUploadedImage && (photoZoom !== 1 || photoRotation !== 0)) {
      try {
        finalPhoto = await processAlumniImage(rawUploadedImage, photoZoom, photoRotation);
      } catch (err) {
        console.error('Gagal memproses foto otomatis saat menyimpan:', err);
      }
    }

    const preparedForm = {
      ...alumniForm,
      photo: finalPhoto,
      city: alumniForm.placement || alumniForm.city || '',
      displayOrder: Number(alumniForm.displayOrder) || 1
    };

    if (editingAlumniId === 'new') {
      const newItem: AlumniItem = {
        id: `alum_${Date.now()}`,
        ...preparedForm,
        isFeatured: preparedForm.isFeatured !== undefined ? preparedForm.isFeatured : true,
        status: preparedForm.status || 'published'
      };
      onUpdateAlumni([...alumniItems, newItem]);
      addLog('Tambah Alumni', `Berhasil menambahkan alumni baru: ${newItem.name}`);
    } else if (editingAlumniId) {
      const updated = alumniItems.map(item => item.id === editingAlumniId ? {
        ...item,
        ...preparedForm,
        isFeatured: preparedForm.isFeatured !== undefined ? preparedForm.isFeatured : true,
        status: preparedForm.status || 'published'
      } : item);
      onUpdateAlumni(updated);
      addLog('Edit Alumni', `Berhasil mengedit profil alumni: ${preparedForm.name}`);
    }
    
    setEditingAlumniId(null);
    setPhotoZoom(1);
    setPhotoRotation(0);
    setRawUploadedImage('');
    setAlumniForm({
      name: '',
      photo: '',
      graduationYear: new Date().getFullYear().toString(),
      studyProgram: '',
      occupation: '',
      company: '',
      city: '',
      biography: '',
      testimonial: '',
      socialMedia: {},
      isFeatured: true,
      status: 'published',
      shipName: '',
      placement: '',
      displayOrder: 1
    });
  };

  const handleDeleteAlumni = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data alumni ${name}?`)) {
      onUpdateAlumni(alumniItems.filter(item => item.id !== id));
      addLog('Hapus Alumni', `Menghapus data alumni: ${name}`);
    }
  };

  const handleAlumniImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use original resolution by using FileReader dataURL directly
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string || '';
        setRawUploadedImage(resultStr);
        setAlumniForm(prev => ({ ...prev, photo: resultStr }));
        setPhotoZoom(1);
        setPhotoRotation(0);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. SEO STATES & HANDLERS
  const defaultSEO: SEOSettings = {
    metaTitle: 'Akademi Maritim  (AMC) Bekasi',
    metaDescription: 'Portal Resmi Akademi Maritim C (AMC) Bekasi. Menghasilkan Perwira Pelayaran Niaga dan Tenaga Logistik Maritim handal yang berstandar internasional.',
    keywords: 'amc bekasi, akademi maritim, pmb amc, nautika bekasi, teknika bekasi, kpn bekasi, sekolah pelayaran',
    openGraph: 'https://amc.ac.id/og-image.jpg',
    favicon: 'https://amc.ac.id/favicon.ico',
    robots: 'index, follow',
    sitemap: 'https://amc.ac.id/sitemap.xml'
  };

  const currentSEO = seoSettings || defaultSEO;
  const [seoForm, setSeoForm] = useState<SEOSettings>(currentSEO);
  const [seoSaved, setSeoSaved] = useState(false);

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSEO(seoForm);
    setSeoSaved(true);
    addLog('Update SEO', 'Memperbarui konfigurasi Meta SEO dan sitemap');
    setTimeout(() => setSeoSaved(false), 3000);
  };

  // 3. USERS STATES & HANDLERS
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState<Omit<UserItem, 'id'>>({
    fullName: '',
    email: '',
    username: '',
    role: 'Editor'
  });

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId === 'new') {
      const newUser: UserItem = {
        id: `user_${Date.now()}`,
        ...userForm
      };
      onUpdateUsers([...users, newUser]);
      addLog('Tambah User', `Menambahkan pengguna baru: ${newUser.fullName} (${newUser.role})`);
    } else if (editingUserId) {
      const updated = users.map(u => u.id === editingUserId ? { ...u, ...userForm } : u);
      onUpdateUsers(updated);
      addLog('Edit User', `Mengedit hak akses pengguna: ${userForm.fullName}`);
    }
    setEditingUserId(null);
    setUserForm({ fullName: '', email: '', username: '', role: 'Editor' });
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (id === 'user_1') {
      alert('Maaf, akun Super Admin utama tidak dapat dihapus untuk mencegah lock-out sistem.');
      return;
    }
    if (confirm(`Hapus hak akses untuk administrator ${name}?`)) {
      onUpdateUsers(users.filter(u => u.id !== id));
      addLog('Hapus User', `Mencabut akses administrator: ${name}`);
    }
  };

  // 4. MEDIA STATES & HANDLERS
  const [mediaUploadSuccess, setMediaUploadSuccess] = useState(false);
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newItems: MediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImage(file);
        newItems.push({
          id: `media_${Date.now()}_${i}`,
          name: file.name,
          type: 'image',
          url: compressed,
          folder: 'Root',
          size: `${Math.round(file.size / 1024)} KB`,
          uploadedAt: new Date().toISOString().split('T')[0]
        });
      }
      onUpdateMedia([...newItems, ...mediaItems]);
      setMediaUploadSuccess(true);
      addLog('Upload Media', `Mengunggah ${files.length} berkas ke Media Library`);
      setTimeout(() => setMediaUploadSuccess(false), 3000);
    }
  };

  const handleDeleteMedia = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus berkas media "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      onUpdateMedia(mediaItems.filter(m => m.id !== id));
      addLog('Hapus Media', `Menghapus berkas media: ${name}`);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Link gambar berhasil disalin ke clipboard! Anda dapat menempelkannya di input form gambar manapun.');
  };

  // 5. ACTIVITY LOGS HANDLERS
  const handleClearLogs = () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh log aktivitas audit? Tindakan ini hanya boleh dilakukan oleh Super Admin.')) {
      onUpdateLogs([]);
      alert('Seluruh log aktivitas audit berhasil dibersihkan.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ==================== 1. ALUMNI MANAGEMENT ==================== */}
      {activeTab === 'alumni' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gold-600" />
                Manajemen Direktori Alumni & Kisah Sukses (LOCKED)
              </h3>
              <p className="text-slate-500 mt-0.5">Kelola data perwira samudera lulusan AMC Bekasi untuk ditampilkan pada beranda dan direktori sukses publik.</p>
            </div>
            {!editingAlumniId && (
              <button
                onClick={() => {
                  setEditingAlumniId('new');
                  setPhotoZoom(1);
                  setPhotoRotation(0);
                  setRawUploadedImage('');
                  setAlumniForm({
                    name: '',
                    photo: '',
                    graduationYear: new Date().getFullYear().toString(),
                    studyProgram: '',
                    occupation: '',
                    company: '',
                    city: '',
                    biography: '',
                    testimonial: '',
                    socialMedia: {},
                    isFeatured: true,
                    status: 'published',
                    shipName: '',
                    placement: '',
                    displayOrder: 1
                  });
                }}
                className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-4 rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Alumni Baru</span>
              </button>
            )}
          </div>

          {editingAlumniId ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-6">
              <h4 className="font-display font-bold text-navy-950 text-sm mb-2 border-b pb-2 flex items-center justify-between">
                <span>{editingAlumniId === 'new' ? 'Registrasi Profil Alumni Baru' : 'Perbarui Profil Alumni'}</span>
                <span className="text-[10px] text-gold-600 font-bold bg-gold-50 px-2 py-0.5 rounded">CMS v2.0 Synchronized</span>
              </h4>
              
              <form onSubmit={handleSaveAlumni} className="space-y-6">
                
                {/* 1. PHOTO MANAGER SECTION */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="text-slate-800 font-bold text-xs mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-navy-800" />
                      ALUMNI PHOTO MANAGER (HD Crop & Adjust)
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded font-extrabold uppercase">
                      Original Resolution Protected
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Circle Frame Live Preview */}
                    <div className="relative shrink-0 flex flex-col items-center">
                      <div className="w-[145px] h-[145px] rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg relative flex items-center justify-center">
                        {alumniForm.photo || rawUploadedImage ? (
                          <img
                            src={rawUploadedImage || alumniForm.photo}
                            alt="Crop preview"
                            style={{
                              transform: `scale(${photoZoom}) rotate(${photoRotation}deg)`,
                              transformOrigin: 'center center'
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-slate-400 text-center flex flex-col items-center">
                            <User className="h-8 w-8 mb-1" />
                            <span className="text-[9px]">Belum Ada Foto</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2.5 px-3 py-1 bg-navy-950 text-white text-[9px] rounded-full font-bold uppercase tracking-wider shadow">
                        Live Crop Frame
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 w-full space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-slate-700 font-bold block">Pilih File Foto Alumni</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAlumniImageUpload}
                          className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-950 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-600 font-bold block">Atau URL Gambar Langsung (Opsional)</span>
                        <input
                          type="text"
                          value={alumniForm.photo}
                          onChange={e => {
                            setAlumniForm(prev => ({ ...prev, photo: e.target.value }));
                            setRawUploadedImage(e.target.value);
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs"
                        />
                      </div>

                      {/* Sliders - Dynamic based on active image */}
                      {(rawUploadedImage || alumniForm.photo) && (
                        <div className="space-y-3 pt-3 border-t border-slate-200/60">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100">
                              <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                                <span>Zoom</span>
                                <span className="font-bold text-navy-800">{photoZoom.toFixed(1)}x</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.1"
                                value={photoZoom}
                                onChange={e => setPhotoZoom(parseFloat(e.target.value))}
                                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-navy-800"
                              />
                            </div>

                            <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100">
                              <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                                <span>Rotasi</span>
                                <span className="font-bold text-navy-800">{photoRotation}°</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                step="1"
                                value={photoRotation}
                                onChange={e => setPhotoRotation(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-navy-800"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleApplyAdjustments}
                              className="px-3.5 py-1.5 bg-navy-100 hover:bg-gold-400 hover:text-navy-950 text-navy-900 rounded-lg text-[10px] font-bold tracking-wider uppercase transition"
                            >
                              Kunci Hasil Crop & Adjustments
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. CORE FIELDS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={alumniForm.name}
                      onChange={e => setAlumniForm({ ...alumniForm, name: e.target.value })}
                      placeholder="Contoh: Capt. Satria Perkasa, M.Mar"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  {/* Study program */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Program Studi</label>
                    <select
                      value={alumniForm.studyProgram}
                      onChange={e => setAlumniForm({ ...alumniForm, studyProgram: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:ring-2"
                    >
                      <option value="Nautika">Nautika</option>
                      <option value="Teknika">Teknika</option>
                      <option value="KPN">KPN</option>
                    </select>
                  </div>

                 

                  {/* Occupation */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Pekerjaan / Jabatan Sekarang</label>
                    <input
                      type="text"
                      required
                      value={alumniForm.occupation}
                      onChange={e => setAlumniForm({ ...alumniForm, occupation: e.target.value })}
                      placeholder="Contoh: Chief Officer / Marine Superintendent"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Nama Perusahaan (Company)</label>
                    <input
                      type="text"
                      required
                      value={alumniForm.company}
                      onChange={e => setAlumniForm({ ...alumniForm, company: e.target.value })}
                      placeholder="Contoh: Maersk Line / NYK Shipmanagement"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  {/* Ship Name */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Nama Kapal (Ship Name) - Opsional</label>
                    <input
                      type="text"
                      value={alumniForm.shipName || ''}
                      onChange={e => setAlumniForm({ ...alumniForm, shipName: e.target.value })}
                      placeholder="Contoh: MV Maersk Mc-Kinney Moller"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                 

                  {/* Display Order */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">No. Urutan Tampilan (Display Order)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={alumniForm.displayOrder !== undefined ? alumniForm.displayOrder : 1}
                      onChange={e => setAlumniForm({ ...alumniForm, displayOrder: parseInt(e.target.value) || 1 })}
                      placeholder="Contoh: 1 (Urutan teratas)"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-navy-800"
                    />
                  </div>
                </div>

                {/* Testimonial */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Kesan & Pesan / Testimonial Pendek (Max 300 Karakter)</label>
                  <textarea
                    required
                    rows={3}
                    maxLength={300}
                    value={alumniForm.testimonial}
                    onChange={e => setAlumniForm({ ...alumniForm, testimonial: e.target.value })}
                    placeholder="Tuliskan testimonial singkat atau kutipan inspiratif untuk para cadet..."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-navy-800 leading-relaxed"
                  />
                </div>

                {/* Settings Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      id="alum-is-featured"
                      checked={alumniForm.isFeatured !== false}
                      onChange={e => setAlumniForm({ ...alumniForm, isFeatured: e.target.checked })}
                      className="h-4 w-4 text-navy-800 focus:ring-navy-800 border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="alum-is-featured" className="text-slate-700 font-bold select-none cursor-pointer text-xs">
                      Featured Alumni (Tampilkan di Slider Beranda)
                    </label>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block text-[11px]">Status Publikasi</label>
                    <select
                      value={alumniForm.status || 'published'}
                      onChange={e => setAlumniForm({ ...alumniForm, status: e.target.value as any })}
                      className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs"
                    >
                      <option value="published">Diterbitkan (Published)</option>
                      <option value="draft">Konsep (Draft)</option>
                    </select>
                  </div>
                </div>

                {/* Submit actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAlumniId(null);
                      setPhotoZoom(1);
                      setPhotoRotation(0);
                      setRawUploadedImage('');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded-lg shadow cursor-pointer"
                  >
                    Simpan & Sinkronisasi
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-display text-navy-950 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Alumni</th>
                      <th className="p-4">Program Studi</th>
                      <th className="p-4"> Perusahaan</th>
                      <th className="p-4 text-center">Order</th>
                      <th className="p-4 text-center">Featured</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {alumniItems
                      .sort((a, b) => {
                        const orderA = a.displayOrder !== undefined ? a.displayOrder : 9999;
                        const orderB = b.displayOrder !== undefined ? b.displayOrder : 9999;
                        return orderA - orderB;
                      })
                      .map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-4 whitespace-nowrap flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border overflow-hidden shrink-0">
                              <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-navy-950 text-xs">{item.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 max-w-[180px] truncate">"{item.testimonial}"</div>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap font-bold text-navy-800 text-[11px]">
                            {item.studyProgram}
                          </td>
                          <td className="p-4 whitespace-nowrap text-slate-500 font-bold">
                             {item.graduationYear}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-800 text-[11px]">{item.occupation}</div>
                            {item.shipName ? (
                              <div className="text-[10px] text-navy-600 font-semibold mt-0.5 flex items-center gap-1">
                                <Ship className="w-3 h-3 text-navy-500" />
                                {item.shipName} • {item.company}
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">{item.company}</div>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap text-slate-600 font-semibold text-[11px]">
                            {item.placement || item.city || 'Global Oceans'}
                          </td>
                          <td className="p-4 text-center whitespace-nowrap font-bold text-navy-900">
                            {item.displayOrder !== undefined ? item.displayOrder : 1}
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${item.isFeatured !== false ? 'bg-emerald-500' : 'bg-slate-200'}`} title={item.isFeatured !== false ? 'Featured di Homepage' : 'Bukan Featured'} />
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              item.status !== 'draft' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {(item.status || 'published').toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingAlumniId(item.id);
                                setPhotoZoom(1);
                                setPhotoRotation(0);
                                setRawUploadedImage(item.photo || '');
                                setAlumniForm({
                                  ...item,
                                  isFeatured: item.isFeatured !== undefined ? item.isFeatured : true,
                                  status: item.status || 'published',
                                  shipName: item.shipName || '',
                                  placement: item.placement || item.city || '',
                                  displayOrder: item.displayOrder !== undefined ? item.displayOrder : 1
                                });
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-gold-500 hover:text-navy-950 rounded-lg text-slate-600 transition cursor-pointer"
                              title="Edit profil"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAlumni(item.id, item.name)}
                              className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg text-red-600 transition cursor-pointer"
                              title="Hapus alumni"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== 2. SEO SETTINGS ==================== */}
      {activeTab === 'seo' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div>
            <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
              <Globe className="h-5 w-5 text-gold-600" />
              Sistem Konfigurasi Meta SEO & Analytics
            </h3>
            <p className="text-slate-500 mt-0.5">Optimalkan posisi website di Google Search Engine (SEO) dan pantau trafik pengunjung via Google Analytics ID.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-2xl">
            {seoSaved && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl mb-4 flex items-center space-x-2">
                <Check className="h-4 w-4 shrink-0" />
                <span className="font-bold">Konfigurasi Meta SEO berhasil disimpan dan diaktifkan di server production!</span>
              </div>
            )}

            <form onSubmit={handleSaveSEO} className="space-y-4">
              
              {/* Meta title */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">Judul Halaman (Meta Title Template)</label>
                <input
                  type="text"
                  required
                  value={seoForm.metaTitle}
                  onChange={e => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                  placeholder="Contoh: Akademi Maritim Cendekia | %s"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 font-mono"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">Deskripsi Utama Web (Meta Description)</label>
                <textarea
                  required
                  rows={3}
                  value={seoForm.metaDescription}
                  onChange={e => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                  placeholder="Masukkan rangkuman penjelas situs untuk snippet Google Search..."
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2"
                />
              </div>

              {/* Meta Keywords */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">Kata Kunci Utama (Meta Keywords)</label>
                <input
                  type="text"
                  required
                  value={seoForm.keywords}
                  onChange={e => setSeoForm({ ...seoForm, keywords: e.target.value })}
                  placeholder="amc bekasi, sekolah pelayaran, pelaut cerdas, nakhoda kapal"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2"
                />
              </div>

              {/* OpenGraph */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">OpenGraph Banner Image URL</label>
                <input
                  type="text"
                  required
                  value={seoForm.openGraph}
                  onChange={e => setSeoForm({ ...seoForm, openGraph: e.target.value })}
                  placeholder="https://amc.ac.id/og-image.jpg"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 font-mono"
                />
              </div>

              {/* Favicon */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">Favicon Icon URL</label>
                <input
                  type="text"
                  required
                  value={seoForm.favicon}
                  onChange={e => setSeoForm({ ...seoForm, favicon: e.target.value })}
                  placeholder="https://amc.ac.id/favicon.ico"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 font-mono"
                />
              </div>

              {/* Index policy */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">Robots Meta Policy</label>
                <input
                  type="text"
                  required
                  value={seoForm.robots}
                  onChange={e => setSeoForm({ ...seoForm, robots: e.target.value })}
                  placeholder="index, follow"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 font-mono"
                />
              </div>

              {/* Sitemap */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">XML Sitemap URL</label>
                <input
                  type="text"
                  required
                  value={seoForm.sitemap}
                  onChange={e => setSeoForm({ ...seoForm, sitemap: e.target.value })}
                  placeholder="https://amc.ac.id/sitemap.xml"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 font-mono"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-3 px-6 rounded-xl shadow cursor-pointer transition"
              >
                <Globe className="h-4 w-4" />
                <span>Simpan & Terapkan SEO</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 3. USERS & ROLES ==================== */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-gold-600" />
                Manajemen Hak Akses Administrator & Peran
              </h3>
              <p className="text-slate-500 mt-0.5">Kelola hak login staf kampus, batasi akses penambahan artikel, verifikasi berkas PMB, atau reset basis data.</p>
            </div>
            {!editingUserId && (
              <button
                onClick={() => {
                  setEditingUserId('new');
                  setUserForm({ fullName: '', email: '', username: '', role: 'Editor' });
                }}
                className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-4 rounded-xl shadow transition"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Administrator</span>
              </button>
            )}
          </div>

          {editingUserId ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-md">
              <h4 className="font-display font-bold text-navy-950 text-sm mb-4">
                {editingUserId === 'new' ? 'Tambah Akun Staf Kampus' : 'Ubah Akses Akun'}
              </h4>
              <form onSubmit={handleSaveUser} className="space-y-4">
                
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Nama Lengkap Administrator</label>
                  <input
                    type="text"
                    required
                    value={userForm.fullName}
                    onChange={e => setUserForm({ ...userForm, fullName: e.target.value })}
                    placeholder="Contoh: Budi Santoso, S.Kom"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Alamat Email Resmi</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="budis@amc.ac.id"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  />
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Username Login</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                    placeholder="Contoh: budismart"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg font-mono"
                  />
                </div>

                {/* Role selection */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Hak Peran (System Role)</label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value as 'Super Admin' | 'Admin' | 'Editor' | 'News Admin' | 'PMB Admin' })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  >
                    <option value="Super Admin">Super Admin (Akses penuh seluruh kontrol room)</option>
                    <option value="Admin">Admin (Akses penuh panel admin dasar)</option>
                    <option value="Editor">Editor Akademik (Mengelola berita, alumni, dan gambar)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingUserId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded-lg shadow"
                  >
                    Simpan Hak Akses
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-display text-navy-950 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Administrator</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Hak Akses Peran</th>
                    <th className="p-4 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{u.fullName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{u.email}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-navy-800">{u.username}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                          u.role === 'Super Admin' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : u.role === 'Editor'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingUserId(u.id);
                            setUserForm({ ...u });
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-gold-500 hover:text-navy-950 rounded-lg text-slate-600 transition"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.fullName)}
                          className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg text-red-600 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== 4. MEDIA LIBRARY ==================== */}
      {activeTab === 'media' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-gold-600" />
                Penyimpanan Berkas Digital (Media Library)
              </h3>
              <p className="text-slate-500 mt-0.5">Unggah gambar kampus beresolusi tinggi, salin tautan URL base64, lalu gunakan tautan tersebut di form berita atau fasilitas manapun.</p>
            </div>
            
            <div className="flex items-center space-x-2 shrink-0">
              <label className="cursor-pointer inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-4 rounded-xl shadow transition">
                <Upload className="h-4 w-4" />
                <span>Upload Foto Kampus</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {mediaUploadSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2">
              <Check className="h-4 w-4" />
              <span className="font-bold">Gambar berhasil diunggah ke pustaka digital media kampus!</span>
            </div>
          )}

          {mediaItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
              <FolderOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Belum ada file gambar yang diunggah.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mediaItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition">
                  <div className="h-32 bg-slate-50 relative flex items-center justify-center border-b overflow-hidden">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur rounded text-[8px] text-white font-mono uppercase">
                      {item.size}
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="font-bold text-slate-800 truncate" title={item.name}>{item.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">{item.uploadedAt}</div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyLink(item.url)}
                        className="flex-1 inline-flex items-center justify-center space-x-1 py-1.5 bg-slate-100 hover:bg-navy-50 text-slate-600 hover:text-navy-900 rounded font-semibold transition"
                      >
                        <Link className="h-3 w-3" />
                        <span>Salin Link</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(item.id, item.name)}
                        className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded text-red-600 transition"
                        title="Hapus media"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== 5. ACTIVITY LOGS AUDIT TRAIL ==================== */}
      {activeTab === 'logs' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <Activity className="h-5 w-5 text-gold-600" />
                Log Audit Aktivitas Administrator (Security Logs)
              </h3>
              <p className="text-slate-500 mt-0.5">Pantau jejak tindakan keamanan dan pembaruan data yang dilakukan oleh tim administrasi AMC Bekasi secara transparan.</p>
            </div>
            
            {activityLogs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="inline-flex items-center space-x-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 font-bold py-2.5 px-4 rounded-xl shadow transition border border-red-200"
              >
                <Trash2 className="h-4 w-4" />
                <span>Bersihkan Seluruh Log</span>
              </button>
            )}
          </div>

          {activityLogs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
              <Activity className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Belum ada riwayat aktivitas log sistem yang tercatat.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-display text-navy-950 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Waktu Kejadian (WIB)</th>
                      <th className="p-4">Pengguna (User)</th>
                      <th className="p-4">Peran (Role)</th>
                      <th className="p-4">Aksi / Aktivitas</th>
                      <th className="p-4">Detail Perubahan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-[11px] text-slate-600">
                    {activityLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-4 whitespace-nowrap text-navy-950 font-bold">
                          {log.timestamp}
                        </td>
                        <td className="p-4 font-sans font-bold text-slate-800">
                          {log.user}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                            log.role === 'Super Admin' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {log.role}
                          </span>
                        </td>
                        <td className="p-4 font-sans font-bold text-navy-800 whitespace-nowrap">
                          {log.action}
                        </td>
                        <td className="p-4 font-sans max-w-[280px] truncate" title={log.details}>
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
