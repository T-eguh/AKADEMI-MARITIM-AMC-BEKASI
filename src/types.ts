/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WebsiteImage {
  id: string;
  section: string;
  label: string;
  url: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  abbreviation: string;
  degree: string;
  description: string;
  fullDetails: string;
  careerOpportunities: string[];
  iconName: string;
  imageUrl: string;
  isFeatured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  // Additional unified CMS properties
  name?: string;
  code?: string;
  level?: string;
  duration?: string;
  skPendirian?: string;
  prospekKarir?: string[];
  accreditation?: string;
}

export interface FacilityItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  isFeatured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'kegiatan' | 'praktik' | 'fasilitas' | 'wisuda';
  imageUrl: string;
  description: string;
  isFeatured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  isFeatured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export interface TestimonialItem {
  id: string;
  name: string;
  major: string;
  year: string;
  testi: string;
  company: string;
  position: string;
  imageUrl: string;
}

export interface PMBApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  firstChoice: string;
  secondChoice: string;
  schoolOrigin: string;
  status: 'Pending' | 'Diterima' | 'Ditolak';
  submittedAt: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    history: string;
    welcomeMessage: string;
    directorName: string;
    directorTitle: string;
    ownerName: string;
    ownerTitle: string;
    ownerMessage: string;
    vision: string;
    mission: string[];
    objectives?: string[];
  };
  contact?: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    googleMapsEmbed: string;
  };
  socialMedia?: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok?: string;
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

export interface AlumniItem {
  id: string;
  photo: string;
  name: string;
  graduationYear: string;
  studyProgram: 'Nautika' | 'Teknika' | 'KPN' | string;
  occupation: string;
  company: string;
  city?: string;
  biography?: string;
  testimonial: string;
  socialMedia?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  isFeatured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  shipName?: string;
  placement?: string;
  displayOrder?: number;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  openGraph: string;
  favicon: string;
  robots: string;
  sitemap: string;
}

export interface UserItem {
  id: string;
  username: string;
  fullName: string;
  role: 'Super Admin' | 'Admin' | 'Editor' | 'News Admin' | 'PMB Admin';
  email: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  folder: string;
  size: string;
  uploadedAt: string;
}

export interface ActivityLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  isFeatured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export interface LecturerItem {
  id: string;
  name: string;
  role: string;
  dept: string;
  desc: string;
  photo: string;
  email: string;
  expertise: string;
  degree: string;
  isFeatured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export interface CalendarEventItem {
  id: string;
  period: string;
  title: string;
  type: string;
  isFeatured?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export interface PMBConfig {
  academicYear?: string;
  contactPhone?: string;
  contactEmail?: string;
  waves: {
    id: string;
    name: string;
    period: string;
    examDate: string;
    status: 'open' | 'closed' | 'upcoming';
  }[];
  fees: {
    major: string;
    uangPangkal: number;
    spp: number;
    seragam: number;
    bst: number;
  }[];
  requirements: {
    general: string[];
    physical: string[];
    documents: string[];
  };
  faqs: {
    q: string;
    a: string;
  }[];
}


