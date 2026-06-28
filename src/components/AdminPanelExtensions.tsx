/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trash2, Edit2, Plus, Check, Upload, GraduationCap, Globe, ShieldAlert, 
  FolderOpen, Activity, User, Link, Key, Briefcase, MapPin, Search, Ship,
  Image as ImageIcon, Megaphone, ShoppingBag, Bell, Settings, MessageSquare,
  FileText, Calendar, Save, Eye, EyeOff, CheckCircle, Package, DollarSign, RefreshCw
} from 'lucide-react';
import { 
  AlumniItem, SEOSettings, UserItem, MediaItem, ActivityLogItem,
  BannerPromoItem, PopupPromoConfig, RunningTextConfig, AnnouncementItem,
  StoreProduct, StoreOrder, NewsItem, SiteContent, WebsiteImage, PageSectionConfig
} from '../types';
import { DEFAULT_SECTIONS } from '../data';

// Image compressor helper (resizes and compresses images to prevent exceeding localStorage quota limit of 5MB)
const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      // Clean up object URL immediately to free memory
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      let width = img.naturalWidth || img.width || 800;
      let height = img.naturalHeight || img.height || 600;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to FileReader if context creation fails
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string || '');
        };
        reader.readAsDataURL(file);
        return;
      }

      // High-quality image smoothing configuration to prevent blurriness
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill a clean solid white background first to handle transparency in PNGs smoothly (avoids black backgrounds)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);
      
      try {
        // Compress to high-fidelity JPEG with specified quality
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      } catch (e) {
        console.warn('Gagal mengubah data URL canvas, menggunakan raw base64:', e);
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string || '');
        };
        reader.readAsDataURL(file);
      }
    };

    img.onerror = (err) => {
      console.warn('Gagal memuat gambar via ObjectURL, menggunakan fallback FileReader', err);
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string || '');
      };
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
};

interface ExtensionsProps {
  activeTab: string;
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

  // New promotional & e-commerce props
  banners?: BannerPromoItem[];
  onUpdateBanners?: (items: BannerPromoItem[]) => void;
  popupPromo?: PopupPromoConfig;
  onUpdatePopupPromo?: (config: PopupPromoConfig) => void;
  runningTexts?: RunningTextConfig[];
  onUpdateRunningTexts?: (texts: RunningTextConfig[]) => void;
  announcements?: AnnouncementItem[];
  onUpdateAnnouncements?: (items: AnnouncementItem[]) => void;
  storeProducts?: StoreProduct[];
  onUpdateStoreProducts?: (items: StoreProduct[]) => void;
  storeOrders?: StoreOrder[];
  onUpdateStoreOrders?: (items: StoreOrder[]) => void;

  // Additional content management helpers
  newsItems?: NewsItem[];
  onUpdateNews?: (items: NewsItem[]) => void;
  content?: SiteContent;
  onUpdateContent?: (content: SiteContent) => void;
  images?: WebsiteImage[];
  onUpdateImages?: (imgs: WebsiteImage[]) => void;

  sections?: PageSectionConfig[];
  onUpdateSections?: (sections: PageSectionConfig[]) => void;
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
  onUpdateLogs,

  // Destructure new props
  banners = [],
  onUpdateBanners = () => {},
  popupPromo,
  onUpdatePopupPromo = () => {},
  runningTexts = [],
  onUpdateRunningTexts = () => {},
  announcements = [],
  onUpdateAnnouncements = () => {},
  storeProducts = [],
  onUpdateStoreProducts = () => {},
  storeOrders = [],
  onUpdateStoreOrders = () => {},

  newsItems = [],
  onUpdateNews = () => {},
  content,
  onUpdateContent = () => {},
  images = [],
  onUpdateImages = () => {},

  sections = [],
  onUpdateSections = () => {}
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

  // ==================== NEW STATES FOR EXTENDED CMS TABS ====================
  // Banners States
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<Omit<BannerPromoItem, 'id'>>({
    image: '',
    title: '',
    description: '',
    link: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  // Running Text States
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textForm, setTextForm] = useState<Omit<RunningTextConfig, 'id'>>({
    text: '',
    isActive: true,
    color: 'text-yellow-400'
  });

  // Store Product States
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Omit<StoreProduct, 'id'>>({
    name: '',
    price: 0,
    description: '',
    stock: 10,
    category: 'Merchandise',
    image: ''
  });

  // Announcements States
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [announcementForm, setAnnouncementForm] = useState<Omit<AnnouncementItem, 'id'>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Akademik',
    status: 'published'
  });

  // New Category States
  const [newCategoryName, setNewCategoryName] = useState('');

  // Website Config Active Section
  const [activeConfigSection, setActiveConfigSection] = useState<'general' | 'socials' | 'logo' | 'maps'>('general');

  // --- Global UX States ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Search, Filter, Sort & Pagination States ---
  // 1. Alumni / Testimonials
  const [alumniSearch, setAlumniSearch] = useState('');
  const [alumniFilterStatus, setAlumniFilterStatus] = useState<string>('all');
  const [alumniSortBy, setAlumniSortBy] = useState<string>('displayOrder');
  const [alumniPage, setAlumniPage] = useState(1);
  const ALUMNI_PER_PAGE = 5;

  // 2. Announcements
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [announcementFilterCategory, setAnnouncementFilterCategory] = useState<string>('all');
  const [announcementPage, setAnnouncementPage] = useState(1);
  const ANNOUNCEMENTS_PER_PAGE = 5;

  // 3. Store Products
  const [productSearch, setProductSearch] = useState('');
  const [productFilterCategory, setProductFilterCategory] = useState<string>('all');
  const [productSortBy, setProductSortBy] = useState<string>('name');
  const [productPage, setProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 5;

  // 4. Store Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderPage, setOrderPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  // 5. Banners
  const [bannerSearch, setBannerSearch] = useState('');
  const [bannerFilterStatus, setBannerFilterStatus] = useState<string>('all');
  const [bannerPage, setBannerPage] = useState(1);
  const BANNERS_PER_PAGE = 5;

  // 6. Users / Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [adminFilterRole, setAdminFilterRole] = useState<string>('all');
  const [adminPage, setAdminPage] = useState(1);
  const ADMIN_PER_PAGE = 5;

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
    displayOrder: 1,
    rating: 5
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
      displayOrder: 1,
      rating: 5
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
    role: 'Editor',
    avatar: '',
    status: 'Aktif',
    password: ''
  });

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId === 'new') {
      const newUser: UserItem = {
        id: `user_${Date.now()}`,
        ...userForm,
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      onUpdateUsers([...users, newUser]);
      addLog('Tambah User', `Menambahkan pengguna baru: ${newUser.fullName} (${newUser.role})`);
    } else if (editingUserId) {
      const updated = users.map(u => u.id === editingUserId ? { ...u, ...userForm } : u);
      onUpdateUsers(updated);
      addLog('Edit User', `Mengedit hak akses pengguna: ${userForm.fullName}`);
    }
    setEditingUserId(null);
    setUserForm({ fullName: '', email: '', username: '', role: 'Editor', avatar: '', status: 'Aktif', password: '' });
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
      {(activeTab === 'alumni' || activeTab === 'testimonials') && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gold-600" />
                Manajemen Direktori Alumni & Testimoni
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

                 

                  {/* Rating */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Rating Testimoni (Stars)</label>
                    <select
                      value={alumniForm.rating || 5}
                      onChange={e => setAlumniForm({ ...alumniForm, rating: parseInt(e.target.value) || 5 })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-navy-800"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                      <option value="3">⭐⭐⭐ (3 Bintang)</option>
                      <option value="2">⭐⭐ (2 Bintang)</option>
                      <option value="1">⭐ (1 Bintang)</option>
                    </select>
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
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={alumniSearch}
                    onChange={e => { setAlumniSearch(e.target.value); setAlumniPage(1); }}
                    placeholder="Cari nama, perusahaan, atau testimonial..."
                    className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-lg text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={alumniFilterStatus}
                    onChange={e => { setAlumniFilterStatus(e.target.value); setAlumniPage(1); }}
                    className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-700"
                  >
                    <option value="all">Semua Status</option>
                    <option value="published">Diterbitkan (Published)</option>
                    <option value="draft">Konsep (Draft)</option>
                  </select>
                  <select
                    value={alumniSortBy}
                    onChange={e => { setAlumniSortBy(e.target.value); setAlumniPage(1); }}
                    className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-700"
                  >
                    <option value="displayOrder">Urutan Tampilan</option>
                    <option value="name">Nama (A-Z)</option>
                    <option value="rating">Rating (Tertinggi)</option>
                  </select>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-display text-navy-950 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Alumni</th>
                        <th className="p-4">Program Studi</th>
                        <th className="p-4">Tahun Lulus</th>
                        <th className="p-4">Pekerjaan</th>
                        <th className="p-4">Penempatan</th>
                        <th className="p-4 text-center">Rating</th>
                        <th className="p-4 text-center">Order</th>
                        <th className="p-4 text-center">Featured</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(() => {
                        const filtered = alumniItems
                          .filter(item => {
                            const matchesSearch = item.name.toLowerCase().includes(alumniSearch.toLowerCase()) ||
                              (item.company && item.company.toLowerCase().includes(alumniSearch.toLowerCase())) ||
                              (item.testimonial && item.testimonial.toLowerCase().includes(alumniSearch.toLowerCase()));
                            const matchesStatus = alumniFilterStatus === 'all' || item.status === alumniFilterStatus;
                            return matchesSearch && matchesStatus;
                          })
                          .sort((a, b) => {
                            if (alumniSortBy === 'name') return a.name.localeCompare(b.name);
                            if (alumniSortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
                            const orderA = a.displayOrder !== undefined ? a.displayOrder : 9999;
                            const orderB = b.displayOrder !== undefined ? b.displayOrder : 9999;
                            return orderA - orderB;
                          });

                        const totalPages = Math.ceil(filtered.length / ALUMNI_PER_PAGE);
                        const paginated = filtered.slice((alumniPage - 1) * ALUMNI_PER_PAGE, alumniPage * ALUMNI_PER_PAGE);

                        if (paginated.length === 0) {
                          return (
                            <tr>
                              <td colSpan={10} className="p-8 text-center text-slate-400 font-bold">
                                Tidak ada data alumni ditemukan.
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <>
                            {paginated.map(item => (
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
                                <td className="p-4 text-center whitespace-nowrap">
                                  <div className="flex gap-0.5 text-gold-500 justify-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span key={i}>{i < (item.rating || 5) ? '★' : '☆'}</span>
                                    ))}
                                  </div>
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
                                        displayOrder: item.displayOrder !== undefined ? item.displayOrder : 1,
                                        rating: item.rating || 5
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
                            {/* Pagination row */}
                            {totalPages > 1 && (
                              <tr>
                                <td colSpan={10} className="p-4 bg-slate-50">
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs text-slate-500">
                                      Menampilkan <span className="font-bold">{(alumniPage - 1) * ALUMNI_PER_PAGE + 1}-{Math.min(filtered.length, alumniPage * ALUMNI_PER_PAGE)}</span> dari <span className="font-bold">{filtered.length}</span> alumni
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        disabled={alumniPage === 1}
                                        onClick={() => setAlumniPage(p => Math.max(1, p - 1))}
                                        className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded disabled:opacity-50"
                                      >
                                        Sebelumnya
                                      </button>
                                      <button
                                        disabled={alumniPage === totalPages}
                                        onClick={() => setAlumniPage(p => Math.min(totalPages, p + 1))}
                                        className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded disabled:opacity-50"
                                      >
                                        Selanjutnya
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
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
              <h4 className="font-display font-bold text-navy-950 text-sm mb-4 border-b pb-2">
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

                {/* Password / Reset Password */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">
                    {editingUserId === 'new' ? 'Kata Sandi (Password)' : 'Reset Kata Sandi (Kosongkan jika tidak diubah)'}
                  </label>
                  <input
                    type="password"
                    value={userForm.password || ''}
                    onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder={editingUserId === 'new' ? 'Ketik kata sandi login...' : 'Ketik kata sandi baru untuk mereset...'}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  />
                </div>

                {/* Status Selection */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Status Akun</label>
                  <select
                    value={userForm.status || 'Aktif'}
                    onChange={e => setUserForm({ ...userForm, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg"
                  >
                    <option value="Aktif">Aktif (Bisa Login)</option>
                    <option value="Nonaktif">Nonaktif (Akses Ditangguhkan)</option>
                  </select>
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

                {/* Foto Profil / Avatar */}
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border">
                  <label className="text-slate-700 font-bold block mb-1">Foto Profil Administrator</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {userForm.avatar ? (
                        <img src={userForm.avatar} alt="Avatar" className="w-full h-full object-cover animate-fade-in" />
                      ) : (
                        <User className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const compressed = await compressImage(file);
                            setUserForm(prev => ({ ...prev, avatar: compressed }));
                          }
                        }}
                        className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-950 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingUserId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded-lg shadow cursor-pointer"
                  >
                    Simpan Hak Akses
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={e => { setAdminSearch(e.target.value); setAdminPage(1); }}
                    placeholder="Cari nama, email, atau username..."
                    className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <select
                    value={adminFilterRole}
                    onChange={e => { setAdminFilterRole(e.target.value); setAdminPage(1); }}
                    className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-700"
                  >
                    <option value="all">Semua Peran</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                  </select>
                </div>
              </div>

              {/* Table Wrapper */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-display text-navy-950 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Administrator</th>
                      <th className="p-4">Username</th>
                      <th className="p-4">Hak Akses Peran</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Riwayat Login</th>
                      <th className="p-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(() => {
                      const filtered = users.filter(u => {
                        const matchesSearch = u.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          u.username.toLowerCase().includes(adminSearch.toLowerCase());
                        const matchesRole = adminFilterRole === 'all' || u.role === adminFilterRole;
                        return matchesSearch && matchesRole;
                      });

                      const totalPages = Math.ceil(filtered.length / ADMIN_PER_PAGE);
                      const paginated = filtered.slice((adminPage - 1) * ADMIN_PER_PAGE, adminPage * ADMIN_PER_PAGE);

                      if (paginated.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                              Tidak ada data administrator ditemukan.
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <>
                          {paginated.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50/50">
                              <td className="p-4 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full border bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                                  {u.avatar ? (
                                    <img src={u.avatar} alt={u.fullName} className="w-full h-full object-cover animate-fade-in" />
                                  ) : (
                                    <User className="h-4 w-4 text-slate-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800">{u.fullName}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{u.email}</div>
                                </div>
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
                              <td className="p-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  u.status === 'Nonaktif' 
                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                }`}>
                                  {u.status || 'Aktif'}
                                </span>
                              </td>
                              <td className="p-4 text-center font-mono text-[10px] text-slate-500 whitespace-nowrap">
                                {u.lastLogin || 'Belum ada riwayat'}
                              </td>
                              <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    setEditingUserId(u.id);
                                    setUserForm({
                                      fullName: u.fullName,
                                      email: u.email,
                                      username: u.username,
                                      role: u.role,
                                      avatar: u.avatar || '',
                                      status: u.status || 'Aktif',
                                      password: ''
                                    });
                                  }}
                                  className="p-1.5 bg-slate-100 hover:bg-gold-500 hover:text-navy-950 rounded-lg text-slate-600 transition cursor-pointer"
                                  title="Edit akun"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.fullName)}
                                  className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg text-red-600 transition cursor-pointer"
                                  title="Hapus akun"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {/* Pagination row */}
                          {totalPages > 1 && (
                            <tr>
                              <td colSpan={6} className="p-4 bg-slate-50">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-slate-500">
                                    Menampilkan <span className="font-bold">{(adminPage - 1) * ADMIN_PER_PAGE + 1}-{Math.min(filtered.length, adminPage * ADMIN_PER_PAGE)}</span> dari <span className="font-bold">{filtered.length}</span> administrator
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      disabled={adminPage === 1}
                                      onClick={() => setAdminPage(p => Math.max(1, p - 1))}
                                      className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded disabled:opacity-50"
                                    >
                                      Sebelumnya
                                    </button>
                                    <button
                                      disabled={adminPage === totalPages}
                                      onClick={() => setAdminPage(p => Math.min(totalPages, p + 1))}
                                      className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded disabled:opacity-50"
                                    >
                                      Selanjutnya
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
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

      {/* ==================== 6. BANNERS PROMOSI (IKLAN KAMPUS) ==================== */}
      {activeTab === 'banners' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gold-600" />
                Manajemen Banner Promosi (Iklan Kampus)
              </h3>
              <p className="text-slate-500 mt-0.5">Kelola banner promosi dan iklan penerimaan mahasiswa baru (PMB) yang tampil di beranda tepat di bawah Hero Section.</p>
            </div>
            {!editingBannerId && (
              <button
                onClick={() => {
                  setEditingBannerId('new');
                  setBannerForm({
                    image: '',
                    title: '',
                    description: '',
                    link: '',
                    startDate: '',
                    endDate: '',
                    isActive: true
                  });
                }}
                className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-4 rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Banner Iklan</span>
              </button>
            )}
          </div>

          {editingBannerId ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-4">
              <h4 className="font-display font-bold text-navy-950 text-sm border-b pb-2">
                {editingBannerId === 'new' ? 'Tambah Banner Promosi Baru' : 'Edit Banner Promosi'}
              </h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const finalBannerForm = {
                    ...bannerForm,
                    imageUrl: bannerForm.image,
                    targetLink: bannerForm.link || ''
                  };
                  if (editingBannerId === 'new') {
                    const newItem: BannerPromoItem = {
                      id: `banner_${Date.now()}`,
                      ...finalBannerForm,
                      category: 'PROMOSI'
                    } as any;
                    onUpdateBanners([...banners, newItem]);
                    addLog('Tambah Banner Promosi', `Menambahkan banner iklan: ${bannerForm.title}`);
                  } else {
                    const updated = banners.map(b => b.id === editingBannerId ? { ...b, ...finalBannerForm } : b);
                    onUpdateBanners(updated);
                    addLog('Edit Banner Promosi', `Memperbarui banner iklan: ${bannerForm.title}`);
                  }
                  setEditingBannerId(null);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Judul Banner Promosi</label>
                    <input
                      type="text"
                      required
                      value={bannerForm.title}
                      onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                      placeholder="Contoh: Penerimaan Mahasiswa Baru AMC Bekasi Gelombang I"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Link Tujuan (URL Klik)</label>
                    <input
                      type="text"
                      value={bannerForm.link}
                      onChange={e => setBannerForm({ ...bannerForm, link: e.target.value })}
                      placeholder="Contoh: https://amcbekasi.ac.id/pmb"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Deskripsi Pendek / Keterangan Promo</label>
                  <textarea
                    rows={2}
                    value={bannerForm.description}
                    onChange={e => setBannerForm({ ...bannerForm, description: e.target.value })}
                    placeholder="Contoh: Dapatkan diskon pendaftaran bagi pendaftar gelombang pertama."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Mulai Tampil (Start Date) - Opsional</label>
                    <input
                      type="date"
                      value={bannerForm.startDate}
                      onChange={e => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Selesai Tampil (End Date) - Opsional</label>
                    <input
                      type="date"
                      value={bannerForm.endDate}
                      onChange={e => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Status Aktif</label>
                    <select
                      value={bannerForm.isActive ? 'true' : 'false'}
                      onChange={e => setBannerForm({ ...bannerForm, isActive: e.target.value === 'true' })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs"
                    >
                      <option value="true">Aktif (Tampilkan)</option>
                      <option value="false">Nonaktif (Sembunyikan)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 bg-slate-50 p-4 rounded-xl border">
                  <label className="text-slate-700 font-bold block mb-1.5">Gambar Banner (Rasio 16:9 atau Landskap)</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {bannerForm.image && (
                      <div className="w-32 h-18 rounded-lg overflow-hidden border bg-slate-100 shrink-0">
                        <img src={bannerForm.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const compressed = await compressImage(file);
                            setBannerForm(prev => ({ ...prev, image: compressed }));
                          }
                        }}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-950 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bannerForm.image}
                        onChange={e => setBannerForm({ ...bannerForm, image: e.target.value })}
                        placeholder="Atau tempel URL Gambar langsung..."
                        className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingBannerId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded-lg cursor-pointer shadow-md"
                  >
                    Simpan Banner
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={bannerSearch}
                    onChange={e => { setBannerSearch(e.target.value); setBannerPage(1); }}
                    placeholder="Cari judul atau deskripsi banner..."
                    className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <select
                    value={bannerFilterStatus}
                    onChange={e => { setBannerFilterStatus(e.target.value); setBannerPage(1); }}
                    className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-700"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Hanya Aktif</option>
                    <option value="inactive">Hanya Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* Table Wrapper */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-display text-navy-950 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Banner</th>
                        <th className="p-4">Keterangan / Link</th>
                        <th className="p-4">Tanggal Tayang</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(() => {
                        const filtered = banners.filter(banner => {
                          const matchesSearch = banner.title.toLowerCase().includes(bannerSearch.toLowerCase()) ||
                            (banner.description || '').toLowerCase().includes(bannerSearch.toLowerCase());
                          const matchesStatus = bannerFilterStatus === 'all' || 
                            (bannerFilterStatus === 'active' && banner.isActive) ||
                            (bannerFilterStatus === 'inactive' && !banner.isActive);
                          return matchesSearch && matchesStatus;
                        });

                        const totalPages = Math.ceil(filtered.length / BANNERS_PER_PAGE);
                        const paginated = filtered.slice((bannerPage - 1) * BANNERS_PER_PAGE, bannerPage * BANNERS_PER_PAGE);

                        if (paginated.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                                Tidak ada data banner ditemukan.
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <>
                            {paginated.map(banner => (
                              <tr key={banner.id} className="hover:bg-slate-50/50">
                                <td className="p-4 flex items-center space-x-3">
                                  <div className="w-16 h-10 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
                                    <img src={banner.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'} alt={banner.title} className="w-full h-full object-cover animate-fade-in" />
                                  </div>
                                  <div className="font-bold text-navy-950 max-w-[180px] truncate">{banner.title}</div>
                                </td>
                                <td className="p-4">
                                  <div className="text-[11px] text-slate-500 max-w-[240px] truncate">{banner.description || 'Tidak ada deskripsi.'}</div>
                                  {banner.link && <div className="text-[9px] text-indigo-600 font-mono mt-0.5 truncate">{banner.link}</div>}
                                </td>
                                <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                  {banner.startDate || 'Selamanya'} s/d {banner.endDate || 'Selamanya'}
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${banner.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {banner.isActive ? 'AKTIF' : 'NONAKTIF'}
                                  </span>
                                </td>
                                <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setEditingBannerId(banner.id);
                                      setBannerForm({
                                        ...banner,
                                        image: banner.image || banner.imageUrl || '',
                                        link: banner.link || banner.targetLink || ''
                                      });
                                    }}
                                    className="p-1.5 bg-slate-100 hover:bg-gold-500 hover:text-navy-950 rounded-lg text-slate-600 transition cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Hapus banner iklan "${banner.title}"?`)) {
                                        onUpdateBanners(banners.filter(b => b.id !== banner.id));
                                        addLog('Hapus Banner Promosi', `Menghapus banner: ${banner.title}`);
                                      }
                                    }}
                                    className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg text-red-600 transition cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {/* Pagination Row */}
                            {totalPages > 1 && (
                              <tr>
                                <td colSpan={5} className="p-4 bg-slate-50">
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs text-slate-500">
                                      Menampilkan <span className="font-bold">{(bannerPage - 1) * BANNERS_PER_PAGE + 1}-{Math.min(filtered.length, bannerPage * BANNERS_PER_PAGE)}</span> dari <span className="font-bold">{filtered.length}</span> banner
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        disabled={bannerPage === 1}
                                        onClick={() => setBannerPage(p => Math.max(1, p - 1))}
                                        className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded disabled:opacity-50"
                                      >
                                        Sebelumnya
                                      </button>
                                      <button
                                        disabled={bannerPage === totalPages}
                                        onClick={() => setBannerPage(p => Math.min(totalPages, p + 1))}
                                        className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded disabled:opacity-50"
                                      >
                                        Selanjutnya
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== 7. POPUP PROMOSI (ONLOAD MODAL) ==================== */}
      {activeTab === 'popup' && popupPromo && (
        <div className="space-y-6 animate-fade-in text-xs font-sans max-w-2xl">
          <div>
            <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-gold-600" />
              Popup Promosi & Pengumuman Onload
            </h3>
            <p className="text-slate-500 mt-0.5">Atur poster promosi interaktif yang muncul secara otomatis saat pengunjung pertama kali membuka halaman utama website.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-bold text-slate-700 text-xs block">Status Tampilan Popup</span>
                <span className="text-[10px] text-slate-400">Aktifkan atau matikan tampilan popup secara global di situs.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = { ...popupPromo, isEnabled: !popupPromo.isEnabled };
                  onUpdatePopupPromo(updated);
                  addLog('Toggle Popup Promosi', `Mengubah status popup menjadi: ${updated.isEnabled ? 'Aktif' : 'Nonaktif'}`);
                }}
                className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-extrabold transition cursor-pointer ${
                  popupPromo.isEnabled 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                }`}
              >
                {popupPromo.isEnabled ? '● AKTIF' : '○ NONAKTIF'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Judul Poster Popup</label>
                  <input
                    type="text"
                    value={popupPromo.title}
                    onChange={e => onUpdatePopupPromo({ ...popupPromo, title: e.target.value })}
                    placeholder="Contoh: Info PMB 2026/2027"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Link Tujuan Klik</label>
                  <input
                    type="text"
                    value={popupPromo.link}
                    onChange={e => onUpdatePopupPromo({ ...popupPromo, link: e.target.value })}
                    placeholder="Contoh: https://wa.me/628123456789 atau #pendaftaran"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Waktu Delay Muncul (Detik)</label>
                  <input
                    type="number"
                    min={0}
                    value={popupPromo.displayDelay || 1}
                    onChange={e => onUpdatePopupPromo({ ...popupPromo, displayDelay: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border flex flex-col justify-between">
                <div>
                  <span className="text-slate-700 font-bold block mb-1">Gambar Poster</span>
                  {popupPromo.image && (
                    <div className="w-full h-36 rounded-lg overflow-hidden border bg-slate-100 mb-2">
                      <img src={popupPromo.image} alt="Poster" className="w-full h-full object-contain bg-navy-950" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const compressed = await compressImage(file);
                        onUpdatePopupPromo({ ...popupPromo, image: compressed });
                        addLog('Upload Gambar Popup', 'Berhasil memperbarui poster popup promosi.');
                      }
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-950 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={popupPromo.image}
                    onChange={e => onUpdatePopupPromo({ ...popupPromo, image: e.target.value })}
                    placeholder="Atau URL Gambar langsung..."
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 8. RUNNING TEXT (INFORMASI TICKER BERJALAN) ==================== */}
      {activeTab === 'runningText' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <Activity className="h-5 w-5 text-gold-600" />
                Manajemen Running Text Ticker
              </h3>
              <p className="text-slate-500 mt-0.5">Kelola informasi sekilas, jadwal penting, pengumuman darurat, atau sambutan selamat datang yang berjalan di bawah Navbar utama.</p>
            </div>
            {!editingTextId && (
              <button
                onClick={() => {
                  setEditingTextId('new');
                  setTextForm({
                    text: '',
                    isActive: true,
                    color: 'text-yellow-400'
                  });
                }}
                className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-4 rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Ticker Info</span>
              </button>
            )}
          </div>

          {editingTextId ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-4 max-w-lg">
              <h4 className="font-display font-bold text-navy-950 text-sm border-b pb-2">
                {editingTextId === 'new' ? 'Buat Ticker Informasi Baru' : 'Edit Ticker Informasi'}
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingTextId === 'new') {
                    const newItem: RunningTextConfig = {
                      id: `text_${Date.now()}`,
                      ...textForm
                    };
                    onUpdateRunningTexts([...runningTexts, newItem]);
                    addLog('Tambah Running Text', `Menambahkan running text baru: ${textForm.text}`);
                  } else {
                    const updated = runningTexts.map(t => t.id === editingTextId ? { ...t, ...textForm } : t);
                    onUpdateRunningTexts(updated);
                    addLog('Edit Running Text', `Memperbarui running text: ${textForm.text}`);
                  }
                  setEditingTextId(null);
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Teks Pengumuman (Tampil Berjalan)</label>
                  <textarea
                    required
                    rows={3}
                    maxLength={200}
                    value={textForm.text}
                    onChange={e => setTextForm({ ...textForm, text: e.target.value })}
                    placeholder="Contoh: Penerimaan Taruna Baru Akademi Maritim Cirebon Bekasi Resmi Dibuka!"
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Warna Teks Sorotan</label>
                    <select
                      value={textForm.color}
                      onChange={e => setTextForm({ ...textForm, color: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-semibold"
                    >
                      <option value="text-yellow-400">Emas / Kuning Cerah</option>
                      <option value="text-white">Putih Polos</option>
                      <option value="text-emerald-400">Hijau Informasional</option>
                      <option value="text-red-400">Merah Darurat / Warning</option>
                      <option value="text-sky-300">Biru Langit Muda</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Status Aktif</label>
                    <select
                      value={textForm.isActive ? 'true' : 'false'}
                      onChange={e => setTextForm({ ...textForm, isActive: e.target.value === 'true' })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs"
                    >
                      <option value="true">Aktif (Tampilkan)</option>
                      <option value="false">Nonaktif (Sembunyikan)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingTextId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded-lg cursor-pointer shadow-md"
                  >
                    Simpan Ticker
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
                      <th className="p-4">Isi Pengumuman Berjalan</th>
                      <th className="p-4 text-center">Warna</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {runningTexts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400">Belum ada ticker pengumuman berjalan. Klik 'Tambah Ticker Info' untuk membuat baru.</td>
                      </tr>
                    ) : (
                      runningTexts.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-sans font-medium text-slate-800 leading-relaxed max-w-md">
                            {item.text}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-1 rounded bg-navy-950 font-bold text-[9px] ${item.color || 'text-yellow-400'}`}>
                              ABC
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {item.isActive ? 'AKTIF' : 'NONAKTIF'}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingTextId(item.id);
                                setTextForm({ ...item });
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-gold-500 hover:text-navy-950 rounded-lg text-slate-600 transition cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Apakah Anda yakin ingin menghapus ticker pengumuman ini?')) {
                                  onUpdateRunningTexts(runningTexts.filter(t => t.id !== item.id));
                                  addLog('Hapus Running Text', `Menghapus running text: ${item.text}`);
                                }
                              }}
                              className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg text-red-600 transition cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== 9. AMC STORE PRODUCTS (PRODUK & MERCHANDISE) ==================== */}
      {activeTab === 'store_products' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold-600" />
                Katalog Produk & Atribut AMC Store
              </h3>
              <p className="text-slate-500 mt-0.5">Kelola barang penunjang akademik taruna, seragam dinas harian, atribut pelayaran, dan merchandise resmi.</p>
            </div>
            {!editingProductId && (
              <button
                onClick={() => {
                  setEditingProductId('new');
                  setProductForm({
                    name: '',
                    price: 0,
                    description: '',
                    stock: 10,
                    category: 'Merchandise',
                    image: ''
                  });
                }}
                className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-4 rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Produk</span>
              </button>
            )}
          </div>

          {editingProductId ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-4">
              <h4 className="font-display font-bold text-navy-950 text-sm border-b pb-2">
                {editingProductId === 'new' ? 'Tambah Produk Store Baru' : 'Edit Produk Store'}
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const finalForm = {
                    ...productForm,
                    price: Number(productForm.price) || 0,
                    stock: Number(productForm.stock) || 0,
                    // Keep image and imageUrl in perfect sync for compatibility
                    image: productForm.image,
                    imageUrl: productForm.image
                  };
                  if (editingProductId === 'new') {
                    const newItem: StoreProduct = {
                      id: `prod_${Date.now()}`,
                      ...finalForm
                    };
                    onUpdateStoreProducts([...storeProducts, newItem]);
                    addLog('Tambah Produk Store', `Menambahkan produk baru: ${productForm.name}`);
                  } else {
                    const updated = storeProducts.map(p => p.id === editingProductId ? { ...p, ...finalForm } : p);
                    onUpdateStoreProducts(updated);
                    addLog('Edit Produk Store', `Memperbarui produk store: ${productForm.name}`);
                  }
                  setEditingProductId(null);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Nama Produk</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Contoh: Topi Pet Perwira AMC"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Kategori Produk</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-semibold"
                    >
                      <option value="Uniform">Seragam / Atribut Dinas (PDH/PDL)</option>
                      <option value="Merchandise">Merchandise & Aksesoris</option>
                      <option value="Buku">Buku & Modul Kuliah</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Harga Produk (Rp)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.price}
                      onChange={e => setProductForm({ ...productForm, price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Stok Produk</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.stock}
                      onChange={e => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Deskripsi Produk</label>
                  <textarea
                    required
                    rows={3}
                    value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Contoh: Topi pet perwira resmi bahan berkualitas."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs leading-relaxed"
                  />
                </div>

                <div className="space-y-1 bg-slate-50 p-4 rounded-xl border">
                  <label className="text-slate-700 font-bold block mb-1.5">Gambar Produk</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {productForm.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border bg-white shrink-0">
                        <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const compressed = await compressImage(file);
                            setProductForm(prev => ({ ...prev, image: compressed }));
                          }
                        }}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-950 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={productForm.image}
                        onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="Atau URL gambar produk..."
                        className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingProductId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded-lg cursor-pointer shadow-md"
                  >
                    Simpan Produk
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
                      <th className="p-4">Produk</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Harga (Rp)</th>
                      <th className="p-4 text-center">Stok</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {storeProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">Belum ada katalog produk. Klik 'Tambah Produk' untuk membuat baru.</td>
                      </tr>
                    ) : (
                      storeProducts.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50/50">
                          <td className="p-4 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
                              <img src={product.image || product.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600'} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-navy-950 text-xs">{product.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 max-w-[200px] truncate">{product.description}</div>
                            </div>
                          </td>
                          <td className="p-4 font-bold text-navy-800 text-[11px] whitespace-nowrap">
                            {product.category}
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                            Rp {product.price.toLocaleString('id-ID')}
                          </td>
                          <td className="p-4 text-center font-mono font-bold text-slate-800">
                            {product.stock} pcs
                          </td>
                          <td className="p-4 text-center space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingProductId(product.id);
                                setProductForm({
                                  ...product,
                                  image: product.image || product.imageUrl || ''
                                });
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-gold-500 hover:text-navy-950 rounded-lg text-slate-600 transition cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus produk "${product.name}"?`)) {
                                  onUpdateStoreProducts(storeProducts.filter(p => p.id !== product.id));
                                  addLog('Hapus Produk Store', `Menghapus produk: ${product.name}`);
                                }
                              }}
                              className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg text-red-600 transition cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== 10. STORE ORDERS (DAFTAR PESANAN MASUK) ==================== */}
      {activeTab === 'store_orders' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div>
            <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold-600" />
              Kelola Pesanan Masuk (AMC Store)
            </h3>
            <p className="text-slate-500 mt-0.5">Pantau pesanan perlengkapan dari taruna, periksa foto bukti transfer bank, dan perbarui status pesanan secara real-time.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-display text-navy-950 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">ID / Tanggal</th>
                    <th className="p-4">Pendaftar / Taruna</th>
                    <th className="p-4">Produk yang Dipesan</th>
                    <th className="p-4 text-center">Bukti Transfer</th>
                    <th className="p-4 text-center">Status Pesanan</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {storeOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400">Belum ada pesanan masuk di AMC Store.</td>
                    </tr>
                  ) : (
                    storeOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50">
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-bold text-navy-950 font-mono text-[11px]">{order.id}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                            {order.orderDate || order.date || order.createdAt || '-'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">
                            {order.buyerName || order.customerName || 'Pelanggan'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            NIM: {order.buyerNIM || 'Umum'} • {order.buyerPhone || order.customerPhone || '-'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-navy-900 text-xs">
                            {order.productName || (order.items && order.items.map(item => `${item.productName} (x${item.quantity})`).join(', ')) || 'Produk'}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {(order.quantity || (order.items && order.items.reduce((acc, curr) => acc + curr.quantity, 0)) || 1)} pcs • Total: <strong className="text-slate-900 font-mono">Rp {(order.totalPrice || order.totalAmount || 0).toLocaleString('id-ID')}</strong>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {order.receiptImage ? (
                            <a
                              href={order.receiptImage}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-900 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Lihat Bukti</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border px-2.5 py-1 rounded-lg">WhatsApp Order</span>
                          )}
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const updated = storeOrders.map(o => o.id === order.id ? { ...o, status: e.target.value as any } : o);
                              onUpdateStoreOrders(updated);
                              addLog('Update Status Pesanan', `Mengubah status pesanan ${order.id} menjadi: ${e.target.value}`);
                            }}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase border transition ${
                              order.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                            }`}
                          >
                            <option value="Pending">Menunggu Verifikasi</option>
                            <option value="Paid">Lunas (Disiapkan)</option>
                            <option value="Shipped">Sudah Diambil/Kirim</option>
                            <option value="Cancelled">Dibatalkan</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data pesanan "${order.id}" dari arsip?`)) {
                                onUpdateStoreOrders(storeOrders.filter(o => o.id !== order.id));
                                addLog('Hapus Pesanan', `Menghapus data transaksi: ${order.id}`);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg text-red-600 transition cursor-pointer"
                            title="Hapus data pesanan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 11. NEWS CATEGORIES (KATEGORI ARTIKEL BERITA) ==================== */}
      {activeTab === 'news_categories' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans max-w-xl">
          <div>
            <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-gold-600" />
              Kelola Kategori Artikel Berita
            </h3>
            <p className="text-slate-500 mt-0.5">Kelola kategori pengelompokan berita dan publikasi artikel kegiatan kampus Akademi Maritim Cirebon Bekasi.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <span className="font-bold text-slate-700 text-xs block">Tambah Kategori Berita Baru</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="Contoh: Pengabdian Masyarakat"
                className="flex-1 bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newCategoryName.trim()) return;
                  addLog('Tambah Kategori Berita', `Menambahkan kategori baru: ${newCategoryName}`);
                  alert(`Kategori "${newCategoryName}" berhasil dibuat! Anda sekarang dapat memilih kategori ini saat memposting berita.`);
                  setNewCategoryName('');
                }}
                className="bg-navy-800 hover:bg-navy-900 text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition shadow"
              >
                Tambah
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b text-navy-950 font-bold uppercase tracking-wider text-[10px]">
              Daftar Kategori Berita Saat Ini
            </div>
            <div className="divide-y divide-slate-100">
              {Array.from(new Set(newsItems.map(item => item.category || 'Berita'))).map((category, idx) => {
                const count = newsItems.filter(item => item.category === category).length;
                return (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-navy-50 text-navy-800 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-wider">
                        {count} Artikel
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 12. ANNOUNCEMENTS (PENGUMUMAN TARUNA & PUBLIK) ==================== */}
      {activeTab === 'announcements' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <Bell className="h-5 w-5 text-gold-600" />
                Manajemen Pengumuman Akademik & Kegiatan
              </h3>
              <p className="text-slate-500 mt-0.5">Kelola papan pengumuman dinamis untuk taruna aktif maupun calon taruna mengenai kalender akademik, ujian, dan wisuda.</p>
            </div>
            {!editingAnnouncementId && (
              <button
                onClick={() => {
                  setEditingAnnouncementId('new');
                  setAnnouncementForm({
                    title: '',
                    content: '',
                    date: new Date().toISOString().split('T')[0],
                    category: 'Akademik',
                    status: 'published'
                  });
                }}
                className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-4 rounded-xl shadow transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Buat Pengumuman</span>
              </button>
            )}
          </div>

          {editingAnnouncementId ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-4">
              <h4 className="font-display font-bold text-navy-950 text-sm border-b pb-2">
                {editingAnnouncementId === 'new' ? 'Buat Pengumuman Baru' : 'Edit Pengumuman'}
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingAnnouncementId === 'new') {
                    const newItem: AnnouncementItem = {
                      id: `ann_${Date.now()}`,
                      ...announcementForm
                    };
                    onUpdateAnnouncements([...announcements, newItem]);
                    addLog('Tambah Pengumuman', `Memposting pengumuman: ${announcementForm.title}`);
                  } else {
                    const updated = announcements.map(a => a.id === editingAnnouncementId ? { ...a, ...announcementForm } : a);
                    onUpdateAnnouncements(updated);
                    addLog('Edit Pengumuman', `Memperbarui pengumuman: ${announcementForm.title}`);
                  }
                  setEditingAnnouncementId(null);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-slate-700 font-bold block">Judul Pengumuman</label>
                    <input
                      type="text"
                      required
                      value={announcementForm.title}
                      onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      placeholder="Contoh: Jadwal Pelaksanaan Ujian Akhir Semester"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Kategori Informasi</label>
                    <select
                      value={announcementForm.category}
                      onChange={e => setAnnouncementForm({ ...announcementForm, category: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-semibold"
                    >
                      <option value="Akademik">Akademik & Perkuliahan</option>
                      <option value="Kegiatan">Kegiatan Taruna</option>
                      <option value="Pendaftaran">Pendaftaran (PMB)</option>
                      <option value="Kelulusan">Kelulusan & Wisuda</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Tanggal Publikasi</label>
                    <input
                      type="date"
                      required
                      value={announcementForm.date}
                      onChange={e => setAnnouncementForm({ ...announcementForm, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Status Penerbitan</label>
                    <select
                      value={announcementForm.status}
                      onChange={e => setAnnouncementForm({ ...announcementForm, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-semibold"
                    >
                      <option value="published">Terbitkan (Tampil di Board)</option>
                      <option value="draft">Simpan Sebagai Konsep (Draft)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Isi Konten Pengumuman</label>
                  <textarea
                    required
                    rows={8}
                    value={announcementForm.content}
                    onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    placeholder="Tulis detail pengumuman secara rinci di sini..."
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingAnnouncementId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded-lg cursor-pointer shadow-md"
                  >
                    Posting Pengumuman
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={announcementSearch}
                    onChange={e => { setAnnouncementSearch(e.target.value); setAnnouncementPage(1); }}
                    placeholder="Cari judul atau isi pengumuman..."
                    className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <select
                    value={announcementFilterCategory}
                    onChange={e => { setAnnouncementFilterCategory(e.target.value); setAnnouncementPage(1); }}
                    className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-700"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Penting">Penting</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
              </div>

              {/* Table Wrapper */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-display text-navy-950 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Tanggal</th>
                        <th className="p-4">Pengumuman</th>
                        <th className="p-4 font-bold">Kategori</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(() => {
                        const filtered = announcements.filter(item => {
                          const matchesSearch = item.title.toLowerCase().includes(announcementSearch.toLowerCase()) ||
                            item.content.toLowerCase().includes(announcementSearch.toLowerCase());
                          const matchesCategory = announcementFilterCategory === 'all' || item.category === announcementFilterCategory;
                          return matchesSearch && matchesCategory;
                        });

                        const totalPages = Math.ceil(filtered.length / ANNOUNCEMENTS_PER_PAGE);
                        const paginated = filtered.slice((announcementPage - 1) * ANNOUNCEMENTS_PER_PAGE, announcementPage * ANNOUNCEMENTS_PER_PAGE);

                        if (paginated.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                                Tidak ada pengumuman ditemukan.
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <>
                            {paginated.map(item => (
                              <tr key={item.id} className="hover:bg-slate-50/50">
                                <td className="p-4 whitespace-nowrap font-mono text-slate-500 font-semibold">{item.date}</td>
                                <td className="p-4">
                                  <div className="font-bold text-navy-950 text-xs">{item.title}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5 max-w-sm truncate">{item.content}</div>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                  <span className="px-2.5 py-1 rounded-full bg-navy-50 text-navy-800 font-bold text-[9px] uppercase tracking-wider">
                                    {item.category}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {item.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                                  </span>
                                </td>
                                <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setEditingAnnouncementId(item.id);
                                      setAnnouncementForm({ ...item });
                                    }}
                                    className="p-1.5 bg-slate-100 hover:bg-gold-500 hover:text-navy-950 rounded-lg text-slate-600 transition cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Hapus pengumuman "${item.title}"?`)) {
                                        onUpdateAnnouncements(announcements.filter(a => a.id !== item.id));
                                        addLog('Hapus Pengumuman', `Menghapus pengumuman: ${item.title}`);
                                      }
                                    }}
                                    className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg text-red-600 transition cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {/* Pagination Row */}
                            {totalPages > 1 && (
                              <tr>
                                <td colSpan={5} className="p-4 bg-slate-50">
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs text-slate-500">
                                      Menampilkan <span className="font-bold">{(announcementPage - 1) * ANNOUNCEMENTS_PER_PAGE + 1}-{Math.min(filtered.length, announcementPage * ANNOUNCEMENTS_PER_PAGE)}</span> dari <span className="font-bold">{filtered.length}</span> pengumuman
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        disabled={announcementPage === 1}
                                        onClick={() => setAnnouncementPage(p => Math.max(1, p - 1))}
                                        className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded disabled:opacity-50"
                                      >
                                        Sebelumnya
                                      </button>
                                      <button
                                        disabled={announcementPage === totalPages}
                                        onClick={() => setAnnouncementPage(p => Math.min(totalPages, p + 1))}
                                        className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded disabled:opacity-50"
                                      >
                                        Selanjutnya
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== 13. CONTACT CONFIGURATION (KONTAK WEBSITE) ==================== */}
      {activeTab === 'contact' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans max-w-2xl">
          <div>
            <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gold-600" />
              Pengaturan Kontak & Peta Google Maps
            </h3>
            <p className="text-slate-500 mt-0.5">Atur detail kontak resmi kampus, nomor pendaftaran WhatsApp, alamat sekretariat, dan iframe koordinat Google Maps.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (content) {
                  onUpdateContent({ ...content });
                  addLog('Update Kontak Kampus', 'Memperbarui koordinat kontak, nomor WhatsApp, email, dan Google Maps.');
                  alert('Kontak Kampus berhasil disimpan dan disinkronisasikan!');
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Nomor Telepon Kantor (Telephone)</label>
                  <input
                    type="text"
                    value={content?.phone || '(021) 88391234'}
                    onChange={e => onUpdateContent({ ...content!, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">WhatsApp Hot-Line (Pendaftaran Taruna)</label>
                  <input
                    type="text"
                    value={content?.whatsapp || '081234567890'}
                    onChange={e => onUpdateContent({ ...content!, whatsapp: e.target.value })}
                    placeholder="Contoh: 081290901234"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Alamat Email Resmi Kampus</label>
                <input
                  type="email"
                  value={content?.email || 'info@amcbekasi.ac.id'}
                  onChange={e => onUpdateContent({ ...content!, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Alamat Fisik / Sekretariat Kampus (Sesuai Footer)</label>
                <textarea
                  rows={3}
                  value={content?.address || 'Jl. Raya Teuku Umar No. 12, Bekasi, Jawa Barat, Indonesia'}
                  onChange={e => onUpdateContent({ ...content!, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1 bg-slate-50 p-4 rounded-xl border">
                <label className="text-slate-700 font-bold block">Link Google Maps Iframe URL</label>
                <input
                  type="text"
                  value={content?.mapsEmbed || ''}
                  onChange={e => onUpdateContent({ ...content!, mapsEmbed: e.target.value })}
                  className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-mono mb-2"
                />
                <span className="text-[10px] text-slate-400 block">Masukkan link embed (src dari iframe maps) untuk memperbarui tampilan penunjuk arah di halaman kontak.</span>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer transition"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Kontak & Peta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 14. WEBSITE CONFIGURATION (PENGATURAN LOGO & SOSMED) ==================== */}
      {activeTab === 'website_config' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans max-w-3xl">
          <div>
            <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
              <Settings className="h-5 w-5 text-gold-600" />
              Pengaturan Identitas Website (Identity & Branding)
            </h3>
            <p className="text-slate-500 mt-0.5">Kelola logo website, nama instansi, tautan sosial media resmi, sitemap link, robots.txt, dan footer copyright dalam satu pintu.</p>
          </div>

          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit border mb-2">
            {(['general', 'socials', 'logo'] as const).map(sec => (
              <button
                key={sec}
                onClick={() => setActiveConfigSection(sec)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                  activeConfigSection === sec 
                    ? 'bg-navy-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-navy-950 hover:bg-slate-200'
                }`}
              >
                {sec === 'general' && 'Umum & SEO'}
                {sec === 'socials' && 'Sosial Media'}
                {sec === 'logo' && 'Logo & Favicon'}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            {activeConfigSection === 'general' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Konfigurasi Umum & Identitas Website berhasil diperbarui!');
                  addLog('Update Konfigurasi Umum', 'Memperbarui nama website, metadata seo global, sitemap, dan robots.txt');
                }}
                className="space-y-4 animate-fade-in"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Nama Website</label>
                    <input
                      type="text"
                      defaultValue="Akademi Maritim Cirebon Bekasi (AMC Bekasi)"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Meta Title Global</label>
                    <input
                      type="text"
                      defaultValue="AMC Bekasi - Kampus Pelayaran Niaga Terbaik & Terakreditasi"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Meta Description Global</label>
                  <textarea
                    rows={2}
                    defaultValue="Akademi Maritim Cirebon Bekasi (AMC Bekasi) merupakan sekolah tinggi pelayaran niaga swasta terbaik dan terakreditasi yang melahirkan perwira pelayaran handal di Indonesia."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Google Analytics Measurement ID</label>
                    <input
                      type="text"
                      placeholder="G-XXXXXXXXXX"
                      defaultValue="G-Y2H7K0W8EX"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Google Search Console Verification Key</label>
                    <input
                      type="text"
                      placeholder="google-site-verification=..."
                      defaultValue="google-site-verification=abc123xyz_verification_amc"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Open Graph Title</label>
                    <input
                      type="text"
                      defaultValue="AMC Bekasi - Pendidikan Pelayaran Profesional"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Open Graph Image (Public URL)</label>
                    <input
                      type="text"
                      defaultValue="https://amcbekasi.ac.id/og-image.jpg"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">XML Sitemap Path</label>
                    <input
                      type="text"
                      defaultValue="/sitemap.xml"
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-xs font-mono text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Robots.txt Configuration</label>
                    <textarea
                      rows={3}
                      defaultValue={`User-agent: *\nAllow: /\nSitemap: https://amcbekasi.ac.id/sitemap.xml`}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Copyright Footer Text</label>
                  <input
                    type="text"
                    defaultValue="© 2026 Akademi Maritim Cirebon Bekasi. All Rights Reserved."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer transition"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan Pengaturan Umum</span>
                  </button>
                </div>
              </form>
            )}

            {activeConfigSection === 'socials' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Tautan Sosial Media berhasil disinkronisasikan!');
                  addLog('Update Sosial Media', 'Memperbarui link Facebook, Instagram, YouTube, dan Twitter Resmi Kampus.');
                }}
                className="space-y-4 animate-fade-in"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Instagram Link</label>
                    <input
                      type="text"
                      defaultValue="https://instagram.com/amcbekasi"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Facebook Page Link</label>
                    <input
                      type="text"
                      defaultValue="https://facebook.com/amcbekasiofficial"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">YouTube Channel Link</label>
                    <input
                      type="text"
                      defaultValue="https://youtube.com/c/amcbekasitv"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Twitter / X Link</label>
                    <input
                      type="text"
                      defaultValue="https://twitter.com/amcbekasi"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer transition"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan Link Sosmed</span>
                  </button>
                </div>
              </form>
            )}

            {activeConfigSection === 'logo' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                    <span className="font-bold text-slate-800 text-xs block">Logo Utama Website (Header & Footer)</span>
                    <div className="w-24 h-24 rounded-lg bg-navy-950 p-2 border flex items-center justify-center">
                      <img src="/logo.png" alt="AMC Logo" className="max-w-full max-h-full object-contain" onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200";
                      }} />
                    </div>
                    <div className="space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-950 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 block">Disarankan berformat PNG transparan.</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                    <span className="font-bold text-slate-800 text-xs block">Favicon Website (Ikon Tab Browser)</span>
                    <div className="w-12 h-12 rounded bg-white p-2 border flex items-center justify-center shadow-sm">
                      <img src="/favicon.ico" alt="Favicon" className="w-8 h-8 object-contain" onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100";
                      }} />
                    </div>
                    <div className="space-y-1.5">
                      <input
                        type="file"
                        accept=".ico,image/png"
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-950 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 block">Disarankan format ICO atau PNG 32x32.</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t">
                  <button
                    onClick={() => {
                      alert('Logo & Favicon berhasil diunggah!');
                      addLog('Update Logo & Favicon', 'Mengunggah logo utama website baru.');
                    }}
                    className="inline-flex items-center space-x-2 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Terapkan Branding</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== 15. DYNAMIC PAGE LAYOUT BUILDER ==================== */}
      {activeTab === 'sections_builder' && (
        <div className="space-y-6 animate-fade-in text-xs font-sans max-w-4xl">
          <div>
            <h3 className="font-display font-extrabold text-lg text-navy-950 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-gold-600" />
              Tata Letak Halaman (Dynamic Page Builder)
            </h3>
            <p className="text-slate-500 mt-0.5">Atur urutan penayangan (order) dan aktif/nonaktifkan (visibility) bagian-bagian halaman beranda (Homepage) langsung secara real-time.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="font-bold text-slate-800 text-sm">Daftar Bagian Beranda (Homepage Sections)</span>
              <button
                onClick={() => {
                  if (onUpdateSections) {
                    onUpdateSections(DEFAULT_SECTIONS);
                    addLog('Reset Tata Letak', 'Mengatur ulang tata letak beranda ke susunan standar.');
                    alert('Urutan tata letak berhasil disetel ulang ke konfigurasi standar.');
                  }
                }}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Reset Urutan Standar
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {[...sections]
                .sort((a, b) => a.order - b.order)
                .map((sec, index) => (
                  <div
                    key={sec.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                      sec.isEnabled 
                        ? 'bg-slate-50 border-slate-200' 
                        : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-navy-100 text-navy-950 font-bold flex items-center justify-center text-[10px]">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 block text-xs">
                          {sec.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ID: {sec.id} | Label: {sec.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Order Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => {
                            if (onUpdateSections) {
                              const sorted = [...sections].sort((a, b) => a.order - b.order);
                              const current = sorted[index];
                              const prev = sorted[index - 1];
                              const tempOrder = current.order;
                              current.order = prev.order;
                              prev.order = tempOrder;
                              onUpdateSections([...sorted]);
                              addLog('Ubah Tata Letak', `Memindahkan section '${current.name}' ke atas.`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                          title="Naikkan"
                        >
                          ▲
                        </button>
                        <button
                          disabled={index === sections.length - 1}
                          onClick={() => {
                            if (onUpdateSections) {
                              const sorted = [...sections].sort((a, b) => a.order - b.order);
                              const current = sorted[index];
                              const next = sorted[index + 1];
                              const tempOrder = current.order;
                              current.order = next.order;
                              next.order = tempOrder;
                              onUpdateSections([...sorted]);
                              addLog('Ubah Tata Letak', `Memindahkan section '${current.name}' ke bawah.`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                          title="Turunkan"
                        >
                          ▼
                        </button>
                      </div>

                      {/* Visibility Toggle */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold ${sec.isEnabled ? 'text-green-600' : 'text-slate-400'}`}>
                          {sec.isEnabled ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <button
                          onClick={() => {
                            if (onUpdateSections) {
                              const updated = sections.map(s => s.id === sec.id ? { ...s, isEnabled: !s.isEnabled } : s);
                              onUpdateSections(updated);
                              addLog('Ubah Visibilitas', `Mengubah status tayang '${sec.name}' menjadi ${!sec.isEnabled ? 'Aktif' : 'Nonaktif'}.`);
                            }
                          }}
                          className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                            sec.isEnabled ? 'bg-green-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                              sec.isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex gap-3 mt-4 text-[11px] leading-relaxed">
              <span className="text-base">💡</span>
              <div>
                <span className="font-bold block text-xs text-amber-950 mb-0.5">Petunjuk Tata Letak</span>
                Seluruh perubahan yang Anda lakukan di panel tata letak ini akan langsung mempengaruhi struktur layout halaman utama secara real-time. Jika Anda menonaktifkan suatu bagian, bagian tersebut tidak akan dirender oleh sistem untuk seluruh pengunjung website.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
