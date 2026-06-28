/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  WebsiteImage, SiteContent, NewsItem, PMBApplication, FacilityItem, GalleryItem,
  AlumniItem, SEOSettings, UserItem, MediaItem, ActivityLogItem, TimelineEvent, LecturerItem, CalendarEventItem,
  ProgramItem, PMBConfig, BannerPromoItem, PopupPromoConfig, RunningTextConfig, AnnouncementItem, StoreProduct, StoreOrder, PageSectionConfig
} from './types';
import {
  DEFAULT_IMAGES,
  DEFAULT_STATS,
  DEFAULT_PROGRAMS,
  DEFAULT_FACILITIES,
  DEFAULT_GALLERY,
  DEFAULT_NEWS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_CONTENT,
  DEFAULT_ALUMNI,
  DEFAULT_SEO,
  DEFAULT_USERS,
  DEFAULT_MEDIA,
  DEFAULT_LOGS,
  DEFAULT_TIMELINE,
  DEFAULT_LECTURERS,
  DEFAULT_CALENDAR,
  DEFAULT_PMB_CONFIG,
  DEFAULT_BANNERS,
  DEFAULT_POPUP,
  DEFAULT_RUNNING_TEXTS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_PRODUCTS,
  DEFAULT_SECTIONS
} from './data';

// Import all modular sub-components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Programs from './components/Programs';
import Facilities from './components/Facilities';
import Gallery from './components/Gallery';
import News from './components/News';
import PMB from './components/PMB';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

// New Custom Applet Features
import PromoBanner from './components/PromoBanner';
import PromoPopup from './components/PromoPopup';
import FloatingButtons from './components/FloatingButtons';
import AnnouncementsPage from './components/AnnouncementsPage';
import StorePage from './components/StorePage';
import RunningTextTicker from './components/RunningTextTicker';

import AlumniDirectory from './components/AlumniDirectory';
import ProgramDetails from './components/ProgramDetails';
import ProfilePage from './components/ProfilePage';
import PMBPage from './components/PMBPage';
import AboutPortalPage from './components/AboutPortalPage';
import Breadcrumb from './components/Breadcrumb';

export default function App() {
  // ----------------------------------------------------
  // Multilingual State (Indonesian / English)
  // ----------------------------------------------------
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [isConfigLoading, setIsConfigLoading] = useState<boolean>(true);

  // ----------------------------------------------------
  // Persistent States loaded from LocalStorage
  // ----------------------------------------------------
  const [images, setImages] = useState<WebsiteImage[]>(() => {
    const stored = localStorage.getItem('amc_images');
    let loadedImages = DEFAULT_IMAGES;
    if (stored) {
      try {
        loadedImages = JSON.parse(stored) as WebsiteImage[];
      } catch (e) {
        loadedImages = DEFAULT_IMAGES;
      }
    }
    
    // Ensure all default images from DEFAULT_IMAGES are present in loadedImages and have up-to-date high-res URLs
    let finalImages = [...loadedImages];
    let updated = false;

    const OLD_LOWRES_URLS = [
      'https://images.unsplash.com/photo-1516216628859-9bccecad13ec?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400'
    ];

    DEFAULT_IMAGES.forEach((defaultImg) => {
      const existingIdx = finalImages.findIndex(img => img.id === defaultImg.id);
      if (existingIdx === -1) {
        finalImages.push(defaultImg);
        updated = true;
      } else if (finalImages[existingIdx].url !== defaultImg.url) {
        // ONLY overwrite if the current stored image url is in our old low-res list
        // This ensures custom user-uploaded/edited images are never reverted!
        const currentUrl = finalImages[existingIdx].url;
        const isOldDefault = OLD_LOWRES_URLS.includes(currentUrl);
        if (isOldDefault) {
          finalImages[existingIdx].url = defaultImg.url;
          updated = true;
        }
      }
    });
    
    // Ensure 'campus_logo' exists
    const hasLogo = finalImages.some(img => img.id === 'campus_logo');
    
    if (!hasLogo) {
      finalImages = [
        {
          id: 'campus_logo',
          section: 'logo',
          label: 'Logo Utama Kampus (PNG/JPG)',
          url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Logo_Akademi_Maritim_Cirebon.png'
        },
        ...finalImages
      ];
      updated = true;
    }
    
    if (updated) {
      localStorage.setItem('amc_images', JSON.stringify(finalImages));
    }
    return finalImages;
  });

  const [content, setContent] = useState<SiteContent>(() => {
    const stored = localStorage.getItem('amc_content');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.hero && parsed.hero.subtitle && parsed.hero.subtitle.includes('Akademi Maritim AMC Bekasi')) {
          parsed.hero.subtitle = parsed.hero.subtitle.replace('Akademi Maritim AMC Bekasi', 'Akademi Maritim (AMC BEKASI)');
        }
        if (parsed.about) {
          if (parsed.about.history && parsed.about.history.includes('Akademi Maritim AMC Bekasi')) {
            parsed.about.history = parsed.about.history.replaceAll('Akademi Maritim AMC Bekasi', 'Akademi Maritim (AMC BEKASI)');
          }
          if (parsed.about.welcomeMessage && parsed.about.welcomeMessage.includes('Akademi Maritim AMC Bekasi')) {
            parsed.about.welcomeMessage = parsed.about.welcomeMessage.replaceAll('Akademi Maritim AMC Bekasi', 'Akademi Maritim (AMC BEKASI)');
          }
          if (parsed.about.directorTitle && parsed.about.directorTitle.includes('Akademi Maritim AMC Bekasi')) {
            parsed.about.directorTitle = parsed.about.directorTitle.replaceAll('Akademi Maritim AMC Bekasi', 'Akademi Maritim (AMC BEKASI)');
          }
          if (!parsed.about.ownerName) {
            parsed.about.ownerName = DEFAULT_CONTENT.about.ownerName;
          }
          if (!parsed.about.ownerTitle) {
            parsed.about.ownerTitle = DEFAULT_CONTENT.about.ownerTitle;
          }
          if (!parsed.about.ownerMessage) {
            parsed.about.ownerMessage = DEFAULT_CONTENT.about.ownerMessage;
          }
        }
        return parsed;
      } catch (e) {
        return DEFAULT_CONTENT;
      }
    }
    return DEFAULT_CONTENT;
  });

  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_news');
      return stored ? JSON.parse(stored) : DEFAULT_NEWS;
    } catch (e) {
      console.error('Error parsing amc_news:', e);
      return DEFAULT_NEWS;
    }
  });

  const [facilities, setFacilities] = useState<FacilityItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_facilities');
      return stored ? JSON.parse(stored) : DEFAULT_FACILITIES;
    } catch (e) {
      console.error('Error parsing amc_facilities:', e);
      return DEFAULT_FACILITIES;
    }
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_gallery');
      return stored ? JSON.parse(stored) : DEFAULT_GALLERY;
    } catch (e) {
      console.error('Error parsing amc_gallery:', e);
      return DEFAULT_GALLERY;
    }
  });

  const [applications, setApplications] = useState<PMBApplication[]>(() => {
    try {
      const stored = localStorage.getItem('amc_applications');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error parsing amc_applications:', e);
      return [];
    }
  });

  const [alumniItems, setAlumniItems] = useState<AlumniItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_alumni');
      if (stored) {
        const parsed = JSON.parse(stored) as AlumniItem[];
        return parsed.map(item => {
          const defaultItem = DEFAULT_ALUMNI.find(d => d.id === item.id);
          if (defaultItem) {
            return {
              ...defaultItem,
              ...item,
              shipName: item.shipName || defaultItem.shipName,
              placement: item.placement || defaultItem.placement
            };
          }
          return item;
        });
      }
      return DEFAULT_ALUMNI;
    } catch (e) {
      return DEFAULT_ALUMNI;
    }
  });

  const [seoSettings, setSeoSettings] = useState<SEOSettings>(() => {
    try {
      const stored = localStorage.getItem('amc_seo');
      return stored ? JSON.parse(stored) : DEFAULT_SEO;
    } catch (e) {
      return DEFAULT_SEO;
    }
  });

  const [users, setUsers] = useState<UserItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_users');
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_media');
      return stored ? JSON.parse(stored) : DEFAULT_MEDIA;
    } catch (e) {
      return DEFAULT_MEDIA;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_logs');
      return stored ? JSON.parse(stored) : DEFAULT_LOGS;
    } catch (e) {
      return DEFAULT_LOGS;
    }
  });

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
    try {
      const stored = localStorage.getItem('amc_timeline');
      return stored ? JSON.parse(stored) : DEFAULT_TIMELINE;
    } catch (e) {
      return DEFAULT_TIMELINE;
    }
  });

  const [lecturers, setLecturers] = useState<LecturerItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_lecturers');
      return stored ? JSON.parse(stored) : DEFAULT_LECTURERS;
    } catch (e) {
      return DEFAULT_LECTURERS;
    }
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_calendar');
      return stored ? JSON.parse(stored) : DEFAULT_CALENDAR;
    } catch (e) {
      return DEFAULT_CALENDAR;
    }
  });

  const [programs, setPrograms] = useState<ProgramItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_programs');
      let loaded = stored ? JSON.parse(stored) as ProgramItem[] : DEFAULT_PROGRAMS;
      let updated = false;
      let finalProgs = loaded.map(item => {
        if (item.id === 'kpnk') {
          item = { ...item, id: 'kpn' };
          updated = true;
        }

        if (item.id === 'kpn') {
          let itemUpdated = false;
          let title = item.title;
          let abbreviation = item.abbreviation;
          let fullDetails = item.fullDetails;
          
          if (title && title.includes('KPNK')) {
            title = title.replace(/KPNK/g, 'KPN');
            itemUpdated = true;
          }
          if (abbreviation && abbreviation.includes('KPNK')) {
            abbreviation = abbreviation.replace(/KPNK/g, 'KPN');
            itemUpdated = true;
          }
          if (fullDetails && fullDetails.includes('KPNK')) {
            fullDetails = fullDetails.replace(/KPNK/g, 'KPN');
            itemUpdated = true;
          }
          if (itemUpdated) {
            updated = true;
            item = { ...item, title, abbreviation, fullDetails };
          }
        }

        const defaultItem = DEFAULT_PROGRAMS.find(d => d.id === item.id);
        if (defaultItem && item.imageUrl !== defaultItem.imageUrl) {
          // Only overwrite if the current imageUrl is one of the old low-res beach defaults.
          // If the user has custom-uploaded/changed it, let's keep their change!
          const oldProgsUrls = [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400'
          ];
          const isOldDefault = oldProgsUrls.includes(item.imageUrl);
          if (isOldDefault) {
            updated = true;
            return { ...item, imageUrl: defaultItem.imageUrl };
          }
        }
        return item;
      });
      if (updated) {
        localStorage.setItem('amc_programs', JSON.stringify(finalProgs));
      }
      return finalProgs;
    } catch (e) {
      return DEFAULT_PROGRAMS;
    }
  });

  const [pmbConfig, setPmbConfig] = useState<PMBConfig>(() => {
    try {
      const stored = localStorage.getItem('amc_pmb_config');
      return stored ? JSON.parse(stored) : DEFAULT_PMB_CONFIG;
    } catch (e) {
      return DEFAULT_PMB_CONFIG;
    }
  });

  // ----------------------------------------------------
  // New State Declarations for Promotional & E-commerce features
  // ----------------------------------------------------
  const [banners, setBanners] = useState<BannerPromoItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_banners');
      return stored ? JSON.parse(stored) : DEFAULT_BANNERS;
    } catch (e) {
      console.error('Error parsing amc_banners:', e);
      return DEFAULT_BANNERS;
    }
  });

  const [popupPromo, setPopupPromo] = useState<PopupPromoConfig>(() => {
    try {
      const stored = localStorage.getItem('amc_popup_promo');
      return stored ? JSON.parse(stored) : DEFAULT_POPUP;
    } catch (e) {
      console.error('Error parsing amc_popup_promo:', e);
      return DEFAULT_POPUP;
    }
  });

  const [runningTexts, setRunningTexts] = useState<RunningTextConfig[]>(() => {
    try {
      const stored = localStorage.getItem('amc_running_texts');
      return stored ? JSON.parse(stored) : DEFAULT_RUNNING_TEXTS;
    } catch (e) {
      console.error('Error parsing amc_running_texts:', e);
      return DEFAULT_RUNNING_TEXTS;
    }
  });

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    try {
      const stored = localStorage.getItem('amc_announcements');
      return stored ? JSON.parse(stored) : DEFAULT_ANNOUNCEMENTS;
    } catch (e) {
      console.error('Error parsing amc_announcements:', e);
      return DEFAULT_ANNOUNCEMENTS;
    }
  });

  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(() => {
    try {
      const stored = localStorage.getItem('amc_store_products');
      return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS;
    } catch (e) {
      console.error('Error parsing amc_store_products:', e);
      return DEFAULT_PRODUCTS;
    }
  });

  const [storeOrders, setStoreOrders] = useState<StoreOrder[]>(() => {
    try {
      const stored = localStorage.getItem('amc_store_orders');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error parsing amc_store_orders:', e);
      return [];
    }
  });

  const [sections, setSections] = useState<PageSectionConfig[]>(() => {
    try {
      const stored = localStorage.getItem('amc_sections');
      if (stored) {
        return JSON.parse(stored);
      }
      return DEFAULT_SECTIONS;
    } catch (e) {
      console.error('Error parsing amc_sections:', e);
      return DEFAULT_SECTIONS;
    }
  });


  // ----------------------------------------------------
  // Automatic Static Site Configuration Bootloader (amc_backup.json)
  // ----------------------------------------------------
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const isBackupLoaded = localStorage.getItem('amc_backup_loaded') === 'true';
        if (isBackupLoaded) {
          console.log('AMC Bekasi: Dynamic local storage config already loaded. Preserving custom user edits.');
          setIsConfigLoading(false);
          return;
        }

        const res = await fetch('/amc_backup.json');
        if (res.ok) {
          const parsed = await res.json();
          if (parsed && typeof parsed === 'object') {
            console.log('AMC Bekasi: First-time loading custom config from amc_backup.json...');
            if (parsed.images && Array.isArray(parsed.images)) {
              setImages(parsed.images);
              localStorage.setItem('amc_images', JSON.stringify(parsed.images));
            }
            if (parsed.content && typeof parsed.content === 'object') {
              setContent(parsed.content);
              localStorage.setItem('amc_content', JSON.stringify(parsed.content));
            }
            if (parsed.newsItems && Array.isArray(parsed.newsItems)) {
              setNewsItems(parsed.newsItems);
              localStorage.setItem('amc_news', JSON.stringify(parsed.newsItems));
            }
            if (parsed.facilities && Array.isArray(parsed.facilities)) {
              setFacilities(parsed.facilities);
              localStorage.setItem('amc_facilities', JSON.stringify(parsed.facilities));
            }
            if (parsed.galleryItems && Array.isArray(parsed.galleryItems)) {
              setGalleryItems(parsed.galleryItems);
              localStorage.setItem('amc_gallery', JSON.stringify(parsed.galleryItems));
            }
            if (parsed.applications && Array.isArray(parsed.applications)) {
              setApplications(parsed.applications);
              localStorage.setItem('amc_applications', JSON.stringify(parsed.applications));
            }
            if (parsed.alumniItems && Array.isArray(parsed.alumniItems)) {
              setAlumniItems(parsed.alumniItems);
              localStorage.setItem('amc_alumni', JSON.stringify(parsed.alumniItems));
            }
            if (parsed.seoSettings && typeof parsed.seoSettings === 'object') {
              setSeoSettings(parsed.seoSettings);
              localStorage.setItem('amc_seo', JSON.stringify(parsed.seoSettings));
            }
            if (parsed.users && Array.isArray(parsed.users)) {
              setUsers(parsed.users);
              localStorage.setItem('amc_users', JSON.stringify(parsed.users));
            }
            if (parsed.timelineEvents && Array.isArray(parsed.timelineEvents)) {
              setTimelineEvents(parsed.timelineEvents);
              localStorage.setItem('amc_timeline', JSON.stringify(parsed.timelineEvents));
            }
            if (parsed.lecturers && Array.isArray(parsed.lecturers)) {
              setLecturers(parsed.lecturers);
              localStorage.setItem('amc_lecturers', JSON.stringify(parsed.lecturers));
            }
            if (parsed.calendarEvents && Array.isArray(parsed.calendarEvents)) {
              setCalendarEvents(parsed.calendarEvents);
              localStorage.setItem('amc_calendar', JSON.stringify(parsed.calendarEvents));
            }
            if (parsed.programs && Array.isArray(parsed.programs)) {
              setPrograms(parsed.programs);
              localStorage.setItem('amc_programs', JSON.stringify(parsed.programs));
            }
            if (parsed.pmbConfig && typeof parsed.pmbConfig === 'object') {
              setPmbConfig(parsed.pmbConfig);
              localStorage.setItem('amc_pmb_config', JSON.stringify(parsed.pmbConfig));
            }
            if (parsed.banners && Array.isArray(parsed.banners)) {
              setBanners(parsed.banners);
              localStorage.setItem('amc_banners', JSON.stringify(parsed.banners));
            }
            if (parsed.popupPromo && typeof parsed.popupPromo === 'object') {
              setPopupPromo(parsed.popupPromo);
              localStorage.setItem('amc_popup_promo', JSON.stringify(parsed.popupPromo));
            }
            if (parsed.runningTexts && Array.isArray(parsed.runningTexts)) {
              setRunningTexts(parsed.runningTexts);
              localStorage.setItem('amc_running_texts', JSON.stringify(parsed.runningTexts));
            }
            if (parsed.announcements && Array.isArray(parsed.announcements)) {
              setAnnouncements(parsed.announcements);
              localStorage.setItem('amc_announcements', JSON.stringify(parsed.announcements));
            }
            if (parsed.storeProducts && Array.isArray(parsed.storeProducts)) {
              setStoreProducts(parsed.storeProducts);
              localStorage.setItem('amc_store_products', JSON.stringify(parsed.storeProducts));
            }
            if (parsed.storeOrders && Array.isArray(parsed.storeOrders)) {
              setStoreOrders(parsed.storeOrders);
              localStorage.setItem('amc_store_orders', JSON.stringify(parsed.storeOrders));
            }
            if (parsed.sections && Array.isArray(parsed.sections)) {
              setSections(parsed.sections);
              localStorage.setItem('amc_sections', JSON.stringify(parsed.sections));
            }
            localStorage.setItem('amc_backup_loaded', 'true');
          }
        }
      } catch (e) {
        console.log('AMC Bekasi: No amc_backup.json found or failed to parse, falling back to defaults.');
      } finally {
        setIsConfigLoading(false);
      }
    };
    loadConfig();
  }, []);

  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('amc_admin_logged');
      return stored === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // ----------------------------------------------------
  // Automatic Background Storage Optimizer removed to ensure high-fidelity image retention
  // ----------------------------------------------------
  // Synchronization Effects
  // ----------------------------------------------------
  useEffect(() => {
    const saveImagesWithSelfHealing = async () => {
      try {
        localStorage.setItem('amc_images', JSON.stringify(images));
      } catch (e) {
        console.warn('Gagal menyimpan gambar ke local storage, mencoba kompresi otomatis untuk menghemat ruang...', e);
        
        // Find user-uploaded base64 images that are large (e.g. > 150KB)
        const base64Images = images.filter(img => img.url && img.url.startsWith('data:image/') && img.url.length > 150000);
        
        if (base64Images.length > 0) {
          // Sort by length (largest first) to optimize the heaviest first
          const sorted = [...base64Images].sort((a, b) => b.url.length - a.url.length);
          const target = sorted[0];
          
          try {
            const compressed = await new Promise<string>((resolve) => {
              const imgEl = new window.Image();
              imgEl.onload = () => {
                const canvas = document.createElement('canvas');
                // Target extremely safe smaller resolution for automatic fallback
                const maxW = 1000;
                const maxH = 1000;
                let w = imgEl.naturalWidth || imgEl.width || 800;
                let h = imgEl.naturalHeight || imgEl.height || 600;
                
                if (w > h) {
                  if (w > maxW) {
                    h = Math.round((h * maxW) / w);
                    w = maxW;
                  }
                } else {
                  if (h > maxH) {
                    w = Math.round((w * maxH) / h);
                    h = maxH;
                  }
                }
                
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.imageSmoothingEnabled = true;
                  ctx.imageSmoothingQuality = 'high';
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(0, 0, w, h);
                  ctx.drawImage(imgEl, 0, 0, w, h);
                  resolve(canvas.toDataURL('image/jpeg', 0.75)); // Compress to 75% quality JPEG
                } else {
                  resolve('');
                }
              };
              imgEl.onerror = () => resolve('');
              imgEl.src = target.url;
            });
            
            if (compressed) {
              const healed = images.map(img => img.id === target.id ? { ...img, url: compressed } : img);
              setImages(healed);
              console.log(`Auto-compressed image ${target.id} successfully from ${Math.round(target.url.length / 1024)}KB to ${Math.round(compressed.length / 1024)}KB.`);
            }
          } catch (errComp) {
            console.error('Gagal melakukan auto-kompresi gambar:', errComp);
          }
        } else {
          // If no large base64 images are left but it still fails, alert the user about other data limits
          alert('⚠️ Memori penyimpanan browser penuh! Tidak dapat menyimpan gambar baru. Silakan hapus beberapa data transaksi atau logs di Admin Panel.');
        }
      }
    };

    saveImagesWithSelfHealing();
  }, [images]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_content', JSON.stringify(content));
    } catch (e) {
      console.warn('Gagal menyimpan konten ke local storage:', e);
    }
  }, [content]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_news', JSON.stringify(newsItems));
    } catch (e) {
      console.warn('Gagal menyimpan berita ke local storage (kemungkinan ukuran gambar terlalu besar):', e);
    }
  }, [newsItems]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_facilities', JSON.stringify(facilities));
    } catch (e) {
      console.warn('Gagal menyimpan fasilitas ke local storage (kemungkinan ukuran gambar terlalu besar):', e);
    }
  }, [facilities]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_gallery', JSON.stringify(galleryItems));
    } catch (e) {
      console.warn('Gagal menyimpan galeri ke local storage (kemungkinan ukuran gambar terlalu besar):', e);
    }
  }, [galleryItems]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_applications', JSON.stringify(applications));
    } catch (e) {
      console.warn('Gagal menyimpan aplikasi ke local storage:', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_alumni', JSON.stringify(alumniItems));
    } catch (e) {
      console.warn('Gagal menyimpan alumni ke local storage:', e);
    }
  }, [alumniItems]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_seo', JSON.stringify(seoSettings));
    } catch (e) {
      console.warn('Gagal menyimpan SEO ke local storage:', e);
    }
  }, [seoSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Gagal menyimpan users ke local storage:', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_media', JSON.stringify(mediaItems));
    } catch (e) {
      console.warn('Gagal menyimpan media ke local storage:', e);
    }
  }, [mediaItems]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_logs', JSON.stringify(activityLogs));
    } catch (e) {
      console.warn('Gagal menyimpan logs ke local storage:', e);
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_admin_logged', String(isAdminLoggedIn));
    } catch (e) {
      console.warn('Gagal menyimpan status login ke local storage:', e);
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_timeline', JSON.stringify(timelineEvents));
    } catch (e) {
      console.warn('Gagal menyimpan timeline ke local storage:', e);
    }
  }, [timelineEvents]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_lecturers', JSON.stringify(lecturers));
    } catch (e) {
      console.warn('Gagal menyimpan lecturers ke local storage:', e);
    }
  }, [lecturers]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_calendar', JSON.stringify(calendarEvents));
    } catch (e) {
      console.warn('Gagal menyimpan kalender akademik ke local storage:', e);
    }
  }, [calendarEvents]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_programs', JSON.stringify(programs));
    } catch (e) {
      console.warn('Gagal menyimpan program studi ke local storage:', e);
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_pmb_config', JSON.stringify(pmbConfig));
    } catch (e) {
      console.warn('Gagal menyimpan konfigurasi PMB ke local storage:', e);
    }
  }, [pmbConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_banners', JSON.stringify(banners));
    } catch (e) {
      console.warn('Gagal menyimpan banners ke local storage:', e);
    }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_popup_promo', JSON.stringify(popupPromo));
    } catch (e) {
      console.warn('Gagal menyimpan popup promo ke local storage:', e);
    }
  }, [popupPromo]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_running_texts', JSON.stringify(runningTexts));
    } catch (e) {
      console.warn('Gagal menyimpan running texts ke local storage:', e);
    }
  }, [runningTexts]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_announcements', JSON.stringify(announcements));
    } catch (e) {
      console.warn('Gagal menyimpan announcements ke local storage:', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_store_products', JSON.stringify(storeProducts));
    } catch (e) {
      console.warn('Gagal menyimpan store products ke local storage:', e);
    }
  }, [storeProducts]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_store_orders', JSON.stringify(storeOrders));
    } catch (e) {
      console.warn('Gagal menyimpan store orders ke local storage:', e);
    }
  }, [storeOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('amc_sections', JSON.stringify(sections));
    } catch (e) {
      console.warn('Gagal menyimpan sections ke local storage:', e);
    }
  }, [sections]);

  // Automatic server-side backup saving for Vercel deployment preparation
  useEffect(() => {
    // Only attempt in development environments
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('.run.app')) {
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const payload = {
          images,
          content,
          newsItems,
          facilities,
          galleryItems,
          applications,
          alumniItems,
          seoSettings,
          users,
          timelineEvents,
          lecturers,
          calendarEvents,
          programs,
          pmbConfig,
          banners,
          popupPromo,
          runningTexts,
          announcements,
          storeProducts,
          storeOrders,
          sections
        };
        const response = await fetch('/api/save-backup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          console.log('AMC Bekasi: Saved state to public/amc_backup.json automatically on server');
        }
      } catch (err) {
        // Silent catch for production/Vercel builds where /api/save-backup does not exist
      }
    }, 2000);

    return () => clearTimeout(handler);
  }, [
    images,
    content,
    newsItems,
    facilities,
    galleryItems,
    applications,
    alumniItems,
    seoSettings,
    users,
    timelineEvents,
    lecturers,
    calendarEvents,
    programs,
    pmbConfig,
    banners,
    popupPromo,
    runningTexts,
    announcements,
    storeProducts,
    storeOrders,
    sections
  ]);


  // ----------------------------------------------------
  // Navigation & Page Routing
  // ----------------------------------------------------
  const handleNavigate = (target: string) => {
    if (target === 'home' || target === 'Beranda' || target === '/') {
      navigateTo('/');
      setActiveSection('home');
    } else if (target === 'about' || target === 'Profil' || target === '/profil') {
      navigateTo('/profil');
      setActiveSection('about');
    } else if (target === 'programs' || target === 'Program Studi' || target === '/program-studi') {
      navigateTo('/program-studi');
      setActiveSection('programs');
    } else if (target === 'facilities' || target === 'Fasilitas' || target === '/layanan/fasilitas') {
      navigateTo('/layanan/fasilitas');
      setActiveSection('facilities');
    } else if (target === 'gallery' || target === 'Galeri' || target === '/layanan/galeri') {
      navigateTo('/layanan/galeri');
      setActiveSection('gallery');
    } else if (target === 'news' || target === 'Berita' || target === '/layanan/berita') {
      navigateTo('/layanan/berita');
      setActiveSection('news');
    } else if (target === 'alumni' || target === 'Alumni' || target === '/layanan/alumni') {
      navigateTo('/layanan/alumni');
      setActiveSection('alumni');
    } else if (target === 'pmb' || target === 'PMB' || target === '/pendaftaran') {
      navigateTo('/pendaftaran');
      setActiveSection('pmb');
    } else if (target === 'contact' || target === 'Kontak' || target === '/kontak') {
      navigateTo('/kontak');
      setActiveSection('contact');
    } else if (target === 'store' || target === '/store') {
      navigateTo('/store');
      setActiveSection('store');
    } else if (target === 'pengumuman' || target === '/pengumuman') {
      navigateTo('/pengumuman');
      setActiveSection('pengumuman');
    } else if (target === 'nautika' || target === '/program-studi/nautika') {
      navigateTo('/program-studi/nautika');
      setActiveSection('programs');
    } else if (target === 'teknika' || target === '/program-studi/teknika') {
      navigateTo('/program-studi/teknika');
      setActiveSection('programs');
    } else if (target === 'kpnk' || target === 'kpn' || target === '/program-studi/kpn') {
      navigateTo('/program-studi/kpn');
      setActiveSection('programs');
    } else if (target.startsWith('/')) {
      navigateTo(target);
      if (target === '/store') {
        setActiveSection('store');
      } else if (target === '/pengumuman') {
        setActiveSection('pengumuman');
      }
    } else {
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setActiveSection('home');
    } else if (path.startsWith('/profil')) {
      setActiveSection('about');
    } else if (path.startsWith('/program-studi')) {
      setActiveSection('programs');
    } else if (path.startsWith('/layanan/fasilitas')) {
      setActiveSection('facilities');
    } else if (path.startsWith('/layanan/galeri')) {
      setActiveSection('gallery');
    } else if (path.startsWith('/layanan/berita')) {
      setActiveSection('news');
    } else if (path.startsWith('/layanan/alumni')) {
      setActiveSection('alumni');
    } else if (path.startsWith('/pendaftaran')) {
      setActiveSection('pmb');
    } else if (path === '/kontak') {
      setActiveSection('contact');
    } else if (path === '/store') {
      setActiveSection('store');
    } else if (path === '/pengumuman') {
      setActiveSection('pengumuman');
    }
  }, [currentPath]);

  useEffect(() => {
    const trackingSections = ['home', 'about', 'programs', 'facilities', 'gallery', 'news', 'pmb', 'contact'];
    
    const handleScrollTracking = () => {
      if (window.location.pathname !== '/') return;
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      for (const sectionId of trackingSections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollTracking);
    return () => window.removeEventListener('scroll', handleScrollTracking);
  }, []);

  // Add a new student registration application
  const handleAddApplication = (newApp: PMBApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  // Reset all dynamic configuration back to beautiful defaults
  const handleResetToDefaults = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua data ke pengaturan default kampus? Semua perubahan gambar, artikel, dan pendaftar akan di-reset.')) {
      setImages(DEFAULT_IMAGES);
      setContent(DEFAULT_CONTENT);
      setNewsItems(DEFAULT_NEWS);
      setFacilities(DEFAULT_FACILITIES);
      setGalleryItems(DEFAULT_GALLERY);
      setApplications([]);
      setAlumniItems(DEFAULT_ALUMNI);
      setSeoSettings(DEFAULT_SEO);
      setUsers(DEFAULT_USERS);
      setMediaItems(DEFAULT_MEDIA);
      setActivityLogs(DEFAULT_LOGS);
      setSections(DEFAULT_SECTIONS);
      setIsAdminLoggedIn(false);
      setIsAdminOpen(false);
      localStorage.clear();
      localStorage.setItem('amc_backup_loaded', 'true');
      alert('Semua konfigurasi berhasil di-reset ke default.');
    }
  };

  // Dynamically translate key corporate text fields if English is selected
  const translatedContent = {
    ...content,
    hero: lang === 'en' ? {
      title: "Forging Professional Maritime Officers & Global Competitors",
      subtitle: "The Maritime Academy (AMC BEKASI) provides accredited maritime higher education producing deck officers, engineer officers, and harbor management experts matching IMO standards.",
      ctaPrimary: "Register Now (PMB 2026)",
      ctaSecondary: "Explore Study Programs"
    } : content.hero,
    about: lang === 'en' ? {
      ...content.about,
      history: "The Maritime Academy (AMC BEKASI) is a premier private maritime vocational college in Indonesia, established in 2002. It is dedicated to nurturing resilient, highly disciplined merchant shipping professionals equipped with modern marine expertise. Guided by national curriculum guidelines and STCW (Standards of Training, Certification and Watchkeeping) international conventions, AMC BEKASI graduates hold the global competencies and professional seafarer certifications required to command the international shipping industry.",
      welcomeMessage: "Welcome to the Ocean Struggle Campus, Maritime Academy (AMC BEKASI). In this globalized era of 2026, maritime transport remains the backbone of world trade—carrying over 90% of global logistics. The demand for competent ship officers and reliable harbor administrators is rising exponentially. At AMC BEKASI, we train cadets by balancing rigorous character discipline, deep academic theory, and extensive flight hours in our advanced simulator laboratories, ensuring every cadet steps out of our gates into a bright global future.",
      directorTitle: "ACADEMY DIRECTOR OF AMC BEKASI",
      ownerTitle: "CHAIRMAN OF THE FOUNDATION & OWNER OF AMC BEKASI",
      ownerMessage: "Praise be to God Almighty for the continuous growth and achievements of the Maritime Academy (AMC BEKASI). As a maritime higher education institution, we are fully committed to providing modern facilities, advanced simulators, and a highly disciplined environment to cultivate sea officers and port administrators who possess a strong character, global vision, and are ready to dominate the international maritime market.",
      vision: "To be a leading maritime academy in Southeast Asia, producing professional, disciplined, entrepreneurial, and globally competitive merchant shipping officers and port logistics experts by 2030.",
      mission: [
        'Provide international-standard maritime vocational education in accordance with IMO (International Maritime Organization) and STCW regulations.',
        'Conduct applied research in merchant shipping and maritime logistics technology to support the national maritime axis.',
        'Organize community service in coastal areas to improve local welfare and enhance maritime awareness.',
        'Foster high discipline, moral integrity, global vision, and absolute resilience in facing the challenges of the oceans.'
      ]
    } : content.about
  };

  const translatedStats = DEFAULT_STATS.map(stat => {
    if (lang === 'en') {
      let label = stat.label;
      if (stat.label.toLowerCase().includes('lulusan') || stat.label.toLowerCase().includes('alumni')) {
        label = 'Alumni Graduates';
      } else if (stat.label.toLowerCase().includes('taruna') || stat.label.toLowerCase().includes('aktif')) {
        label = 'Active Cadets';
      } else if (stat.label.toLowerCase().includes('dosen') || stat.label.toLowerCase().includes('instruktur') || stat.label.toLowerCase().includes('pengajar')) {
        label = 'Expert Instructors';
      } else if (stat.label.toLowerCase().includes('laboratorium') || stat.label.toLowerCase().includes('lab') || stat.label.toLowerCase().includes('fasilitas')) {
        label = 'Advanced Labs';
      }
      return { ...stat, label };
    }
    return stat;
  });

  const translatedPrograms = programs.map(prog => {
    const customizedImg = images.find(img => img.id === `prog_${prog.id}`);
    const currentImageUrl = customizedImg ? customizedImg.url : prog.imageUrl;

    if (lang === 'en') {
      if (prog.id === 'nautika') {
        return {
          ...prog,
          imageUrl: currentImageUrl,
          title: "D3 Nautical Studies",
          degree: "Associate of Applied Science (A.Md.Tra) & Class III Deck Officer (ANT-III) International License",
          description: "Trains ocean-going deck officers skilled in ship navigation, cargo handling, celestial navigation, and safety operations according to IMO STCW conventions.",
          fullDetails: "This program focuses on ship navigation, meteorology, maritime law, ship stability, electronic navigation aids (RADAR/ARPA, ECDIS), marine meteorology, watchkeeping, and sea rescue procedures. In addition to a diploma, cadets gain professional ANT-III license certs to serve as Deck Officers (3rd Officer / 2nd Officer) commanding international merchant fleets.",
          careerOpportunities: ["Merchant Ship Deck Officer (OOW)", "Marine Surveyor & Cargo Assessor", "Port Pilot & Ship Routing Advisor", "Maritime Administration Officer", "Seafaring Safety Trainer"]
        };
      }
      if (prog.id === 'teknika') {
        return {
          ...prog,
          imageUrl: currentImageUrl,
          title: "D3 Marine Engineering",
          degree: "Associate of Applied Science (A.Md.Tra) & Class III Engineer Officer (ATT-III) International License",
          description: "Nurtures marine engineers specializing in merchant ship propulsion, power generation, refrigeration systems, auxiliary machines, and marine machinery maintenance.",
          fullDetails: "Provides systematic training on internal combustion engines, auxiliary boilers, marine electrical systems, hydraulic control systems, thermodynamics, metal work, and automated machinery maintenance. Graduates obtain ATT-III professional credentials to work as Ship Engineers (4th Engineer / 3rd Engineer) overseeing advanced marine engine rooms.",
          careerOpportunities: ["Marine Engineer Officer (OOW)", "Power Plant Operations Engineer", "Shipyard Quality Inspector", "Technical Superintendent", "Heavy Machinery Maintenance Engineer"]
        };
      }
      if (prog.id === 'kpn' || prog.id === 'kpnk') {
        return {
          ...prog,
          imageUrl: currentImageUrl,
          title: "D3 Port & Shipping Management",
          degree: "Associate of Applied Science (A.Md.Tra) in Shipping Management & Logistics",
          description: "Produces harbor administrators, shipping business managers, logistics experts, and cargo clearance specialists ready for dry-ports and marine agencies.",
          fullDetails: "Focuses on port operations, export-import procedures, sea freight logistics, shipping agency operations, customs clearance, marine insurance, and business economics. This program equips graduates with solid administrative and logistics expertise to run international terminals, shipping agency conglomerates, or freight-forwarding corporations.",
          careerOpportunities: ["Port Operations Officer", "Customs Broker & Clearance Manager", "Freight Forwarding Analyst", "Shipping Agency Representative", "Logistics & Supply Chain Specialist"]
        };
      }
    }
    return { ...prog, imageUrl: currentImageUrl };
  });

  if (isConfigLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#031830] text-white font-sans selection:bg-gold-500 selection:text-navy-950">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-16 h-16 border-4 border-[#FFC107]/20 border-t-[#FFC107] rounded-full animate-spin"></div>
          <div className="w-8 h-8 rounded-full bg-[#003B7A] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#FFC107] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          </div>
        </div>
        <p className="text-sm font-medium tracking-widest uppercase text-slate-400 animate-pulse">Memuat Situs...</p>
        <p className="text-xs text-slate-500 mt-2">AMC Bekasi Official Website</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans selection:bg-gold-500 selection:text-navy-950">
      
      {/* Dynamic Header Navbar */}
      <Header
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={() => setIsAdminLoggedIn(false)}
        images={images}
        lang={lang}
        onChangeLang={setLang}
      />

      {/* Running Text Ticker */}
      <RunningTextTicker configs={runningTexts} />

      {/* Global Breadcrumb Trail */}
      <Breadcrumb
        currentPath={currentPath}
        lang={lang}
        onNavigate={handleNavigate}
      />

      {/* Main Page Layout Sections */}
      <main>
        {currentPath === '/' || currentPath === '' ? (
          <>
            {sections
              .filter(sec => sec.isEnabled)
              .sort((a, b) => a.order - b.order)
              .map(sec => {
                switch (sec.id) {
                  case 'hero':
                    return (
                      <div id="home" key="hero">
                        <Hero
                          content={translatedContent}
                          images={images}
                          onNavigate={handleNavigate}
                          lang={lang}
                        />
                      </div>
                    );
                  case 'banners':
                    return (
                      <div key="banners">
                        <PromoBanner banners={banners} onNavigate={handleNavigate} />
                      </div>
                    );
                  case 'about':
                    return (
                      <div id="about" key="about">
                        <About
                          content={translatedContent}
                          images={images}
                          lang={lang}
                        />
                      </div>
                    );
                  case 'stats':
                    return (
                      <div key="stats">
                        <Stats stats={translatedStats} />
                      </div>
                    );
                  case 'programs':
                    return (
                      <div id="programs" key="programs">
                        <Programs
                          programs={translatedPrograms}
                          onNavigate={handleNavigate}
                          lang={lang}
                        />
                      </div>
                    );
                  case 'facilities':
                    return (
                      <div id="facilities" key="facilities">
                        <Facilities
                          facilities={facilities}
                          lang={lang}
                        />
                      </div>
                    );
                  case 'gallery':
                    return (
                      <div id="gallery" key="gallery">
                        <Gallery
                          galleryItems={galleryItems}
                          lang={lang}
                        />
                      </div>
                    );
                  case 'news':
                    return (
                      <div id="news" key="news">
                        <News
                          newsItems={newsItems}
                          lang={lang}
                        />
                      </div>
                    );
                  case 'pmb':
                    return (
                      <div id="pmb" key="pmb">
                        <PMB
                          onAddApplication={handleAddApplication}
                          lang={lang}
                          pmbConfig={pmbConfig}
                        />
                      </div>
                    );
                  case 'testimonials':
                    return (
                      <div key="testimonials">
                        <Testimonials alumni={alumniItems} />
                      </div>
                    );
                  case 'contact':
                    return (
                      <div id="contact" key="contact">
                        <Contact contact={translatedContent.contact} />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
          </>
        ) : currentPath.startsWith('/profil') ? (
          <ProfilePage
            currentPath={currentPath}
            lang={lang}
            content={translatedContent}
            images={images}
            onNavigate={handleNavigate}
            timelineEvents={timelineEvents}
            lecturers={lecturers}
            calendarEvents={calendarEvents}
            programs={programs}
          />
        ) : currentPath === '/program-studi' ? (
          <div className="pt-20 bg-[#003B7A]">
            <Programs
              programs={translatedPrograms}
              onNavigate={handleNavigate}
              lang={lang}
            />
          </div>
        ) : currentPath.startsWith('/program-studi/') ? (
          <ProgramDetails
            programId={currentPath.replace('/program-studi/', '')}
            lang={lang}
            programs={translatedPrograms}
            onNavigate={handleNavigate}
          />
        ) : currentPath === '/tentang' ? (
          <AboutPortalPage
            lang={lang}
            onNavigate={handleNavigate}
          />
        ) : currentPath === '/layanan/fasilitas' || currentPath === '/fasilitas' ? (
          <div className="pt-8 bg-white">
            <Facilities
              facilities={facilities}
              lang={lang}
            />
          </div>
        ) : currentPath === '/layanan/galeri' || currentPath === '/galeri' ? (
          <div className="pt-8 bg-white">
            <Gallery
              galleryItems={galleryItems}
              lang={lang}
            />
          </div>
        ) : currentPath === '/layanan/berita' || currentPath === '/berita' ? (
          <div className="pt-8 bg-white">
            <News
              newsItems={newsItems}
              lang={lang}
            />
          </div>
        ) : currentPath === '/layanan/alumni' || currentPath === '/alumni' ? (
          <AlumniDirectory
            alumni={alumniItems}
            lang={lang}
            onNavigate={handleNavigate}
          />
        ) : currentPath.startsWith('/pendaftaran') || currentPath.startsWith('/pmb') ? (
          <PMBPage
            currentPath={currentPath}
            lang={lang}
            onAddApplication={handleAddApplication}
            onNavigate={handleNavigate}
            pmbConfig={pmbConfig}
          />
        ) : currentPath === '/kontak' ? (
          <div className="pt-8 bg-white">
            <Contact contact={translatedContent.contact} />
          </div>
        ) : currentPath === '/store' ? (
          <StorePage
            products={storeProducts}
            orders={storeOrders}
            onAddOrder={(order) => setStoreOrders([order, ...storeOrders])}
            lang={lang}
          />
        ) : currentPath === '/pengumuman' ? (
          <AnnouncementsPage
            announcements={announcements}
            lang={lang}
            onNavigate={handleNavigate}
          />
        ) : (
          <div className="pt-24 pb-12 text-center bg-white min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-display font-black text-navy-950 mb-2">404</h1>
            <p className="text-slate-500 mb-6">Halaman tidak ditemukan.</p>
            <button
              onClick={() => handleNavigate('/')}
              className="px-6 py-2 bg-navy-900 text-white rounded-lg font-bold text-sm"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}
      </main>

      {/* Corporate Institutional Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        images={images}
        socialMedia={translatedContent.socialMedia}
        campusProfile={translatedContent.campusProfile}
      />

      {/* Interactive Admin Portal Panel (Overlay Control Room) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setIsAdminLoggedIn(false); // Secure: force logout on exiting admin panel
        }}
        images={images}
        onUpdateImages={setImages}
        content={content}
        onUpdateContent={setContent}
        newsItems={newsItems}
        onUpdateNews={setNewsItems}
        facilities={facilities}
        onUpdateFacilities={setFacilities}
        galleryItems={galleryItems}
        onUpdateGallery={setGalleryItems}
        applications={applications}
        onUpdateApplications={setApplications}
        alumniItems={alumniItems}
        onUpdateAlumni={setAlumniItems}
        seoSettings={seoSettings}
        onUpdateSEO={setSeoSettings}
        users={users}
        onUpdateUsers={setUsers}
        mediaItems={mediaItems}
        onUpdateMedia={setMediaItems}
        activityLogs={activityLogs}
        onUpdateLogs={setActivityLogs}
        isLoggedIn={isAdminLoggedIn}
        onLoginStatusChange={setIsAdminLoggedIn}
        onResetToDefaults={handleResetToDefaults}
        timelineEvents={timelineEvents}
        onUpdateTimelineEvents={setTimelineEvents}
        lecturers={lecturers}
        onUpdateLecturers={setLecturers}
        calendarEvents={calendarEvents}
        onUpdateCalendarEvents={setCalendarEvents}
        programs={programs}
        onUpdatePrograms={setPrograms}
        pmbConfig={pmbConfig}
        onUpdatePMBConfig={setPmbConfig}
        banners={banners}
        onUpdateBanners={setBanners}
        popupPromo={popupPromo}
        onUpdatePopupPromo={setPopupPromo}
        runningTexts={runningTexts}
        onUpdateRunningTexts={setRunningTexts}
        announcements={announcements}
        onUpdateAnnouncements={setAnnouncements}
        storeProducts={storeProducts}
        onUpdateStoreProducts={setStoreProducts}
        storeOrders={storeOrders}
        onUpdateStoreOrders={setStoreOrders}
        sections={sections}
        onUpdateSections={setSections}
      />

      {/* Global Promotional Overlays & Contact Portals */}
      <PromoPopup config={popupPromo} />
      <FloatingButtons />

    </div>
  );
}
