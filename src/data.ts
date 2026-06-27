/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WebsiteImage, StatItem, ProgramItem, FacilityItem, GalleryItem, NewsItem, TestimonialItem, SiteContent, TimelineEvent, LecturerItem, CalendarEventItem } from './types';

export const DEFAULT_IMAGES: WebsiteImage[] = [
  {
    id: 'campus_logo',
    section: 'logo',
    label: 'Logo Utama Kampus (PNG/JPG)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Logo_Akademi_Maritim_Cirebon.png'
  },
  {
    id: 'hero_bg_1',
    section: 'hero',
    label: 'Background Hero 1 (Kapal Laut)',
    url: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&q=85&w=1920'
  },
  {
    id: 'hero_bg_2',
    section: 'hero',
    label: 'Background Hero 2 (Kampus Modern)',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=85&w=1920'
  },
  {
    id: 'hero_bg_3',
    section: 'hero',
    label: 'Background Hero 3 (Kompas & Navigasi)',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=85&w=1920'
  },
  {
    id: 'about_campus',
    section: 'about',
    label: 'Foto Gedung Kampus Utama',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'about_owner',
    section: 'about',
    label: 'Foto Sambutan Pemilik/Owner',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=85&w=600'
  },
  {
    id: 'about_director',
    section: 'about',
    label: 'Foto Sambutan Direktur',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=85&w=600'
  },
  {
    id: 'prog_nautika',
    section: 'programs',
    label: 'Foto Program Studi Nautika',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'prog_teknika',
    section: 'programs',
    label: 'Foto Program Studi Teknika',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'prog_kpn',
    section: 'programs',
    label: 'Foto Program Studi KPN',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'org_chart',
    section: 'about',
    label: 'Foto Bagan Struktur Organisasi (PDF/Image)',
    url: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'org_photo',
    section: 'about',
    label: 'Foto Jajaran Kepengurusan / Senat',
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'fac_simulator',
    section: 'facilities',
    label: 'Fasilitas Simulator Navigasi',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'fac_lab',
    section: 'facilities',
    label: 'Fasilitas Laboratorium Teknik',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'fac_classroom',
    section: 'facilities',
    label: 'Fasilitas Ruang Kelas Premium',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'fac_library',
    section: 'facilities',
    label: 'Fasilitas Perpustakaan Digital',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'fac_dorm',
    section: 'facilities',
    label: 'Fasilitas Asrama Taruna',
    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=85&w=1200'
  },
];

export const DEFAULT_STATS: StatItem[] = [
  { id: 'stat_mhs', label: 'Taruna Aktif', value: 1250, suffix: '+', icon: 'Users' },
  { id: 'stat_dsn', label: 'Dosen & Instruktur', value: 85, suffix: '+', icon: 'GraduationCap' },
  { id: 'stat_prodi', label: 'Program Studi Unggulan', value: 3, suffix: '', icon: 'Anchor' },
  { id: 'stat_alumni', label: 'Alumni Terserap Kerja', value: 95, suffix: '%', icon: 'Briefcase' }
];

export const DEFAULT_PROGRAMS: ProgramItem[] = [
  {
    id: 'nautika',
    title: 'D3 Nautika',
    abbreviation: 'Nautika (Deck Officer)',
    degree: 'Ahli Madya (A.Md) & Ahli Nautika Tingkat III (ANT-III)',
    description: 'Mendidik calon Perwira Pelayaran Niaga bagian dek yang ahli dalam navigasi, navigasi elektronik, meteorologi, penanganan muatan, dan hukum maritim internasional.',
    fullDetails: 'Program Studi Nautika mendidik Taruna untuk menguasai kompetensi navigasi kapal, operasi muatan, kelaiklautan kapal, komunikasi radio, dan penyelamatan jiwa di laut. Taruna dipersiapkan menjadi Nakhoda (Captain) dan Perwira Navigasi yang tangguh.',
    careerOpportunities: [
      'Perwira Deck (Mualim) di Kapal Niaga Domestik & Internasional',
      'Port Captain / Marine Superintendent di Perusahaan Pelayaran',
      'Syahbandar & Otoritas Pelabuhan Pemerintah',
      'Surveyor Marine / Penilai Kelayakan Kapal'
    ],
    iconName: 'Compass',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'teknika',
    title: 'D3 Teknika',
    abbreviation: 'Teknika (Marine Engineering)',
    degree: 'Ahli Madya (A.Md) & Ahli Teknika Tingkat III (ATT-III)',
    description: 'Mendidik calon Perwira Pelayaran Niaga bagian mesin yang ahli dalam pengoperasian, perawatan, dan perbaikan mesin induk, mesin bantu, kelistrikan, dan sistem kontrol kapal.',
    fullDetails: 'Program Studi Teknika membekali Taruna dengan keahlian teknik mesin kapal, sistem propulsi termal, hidrolik, sistem pendingin, kontrol otomatis, pengelasan, dan kelistrikan kapal. Lulusan diproyeksikan menjadi Kepala Kamar Mesin (Chief Engineer).',
    careerOpportunities: [
      'Perwira Mesin (Masinis) di Kapal Kargo, Tanker & Penumpang',
      'Technical Superintendent / Engineer di Darat',
      'Inspektur Teknik di Klasifikasi Kapal (BKI, ABS, Lloyd Register)',
      'Manajer Perawatan Mesin di Industri Manufaktur & Pembangkit Listrik'
    ],
    iconName: 'Settings',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'kpn',
    title: 'D3 KPN',
    abbreviation: 'KPN (Port & Shipping)',
    degree: 'Ahli Madya (A.Md) Manajemen Pelayaran & Kepelabuhanan',
    description: 'Mendidik tenaga ahli profesional di bidang logistik maritim, manajemen perusahaan pelayaran, ekspor-impor, keagenan kapal, serta operasional kepelabuhanan modern.',
    fullDetails: 'Program Studi Ketatalaksanaan Pelayaran Niaga dan Kepelabuhanan (KPN) melatih mahasiswa dalam manajemen logistik, kepabeanan (customs clearance), administrasi pelabuhan, chartering kapal, asuransi laut, dan hukum bisnis maritim.',
    careerOpportunities: [
      'Eksekutif Operasional di Perusahaan Logistik & Forwarding',
      'Manajer Operasional Terminal Peti Kemas & Pelabuhan',
      'Agen Pelayaran (Shipping Agency) Lokal & Asing',
      'Spesialis Ekspor-Impor & Kepabeanan (PPJK)'
    ],
    iconName: 'Ship',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=85&w=1200'
  }
];

export const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    id: 'fac_simulator',
    title: 'Simulator Navigasi (Bridge Simulator)',
    description: 'Simulator komando kapal standar IMO STCW dengan tampilan visual 360 derajat yang realistis untuk menyimulasikan berbagai kondisi cuaca dan pelabuhan dunia.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'fac_lab',
    title: 'Laboratorium & Bengkel Teknik',
    description: 'Fasilitas bengkel kerja bubut, pengelasan kelistrikan kapal, dan simulasi perawatan kamar mesin kapal niaga berskala besar.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'fac_classroom',
    title: 'Ruang Kuliah Smart-Classroom',
    description: 'Ruangan nyaman dengan penyejuk udara (AC), dilengkapi LCD proyeksi interaktif, smartboard, serta sound system modern.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'fac_library',
    title: 'Perpustakaan & Digital Center',
    description: 'Pusat literatur maritim terlengkap yang terintegrasi dengan jurnal-jurnal ilmiah pelayaran nasional maupun internasional secara online.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=85&w=1200'
  },
  {
    id: 'fac_dorm',
    title: 'Asrama Taruna semi-Militer',
    description: 'Fasilitas asrama terpisah pria/wanita yang bersih, disiplin, dan tertata rapi, guna melatih mental kepemimpinan dan rasa kekeluargaan.',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=85&w=1200'
  }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal_1',
    title: 'Upacara Penerimaan Taruna Baru',
    category: 'kegiatan',
    imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop',
    description: 'Upacara khidmat pelantikan calon taruna (catar) menjadi taruna resmi AMC Bekasi dipimpin oleh Direktur.'
  },
  {
    id: 'gal_2',
    title: 'Latihan Praktik Penyelamatan Laut',
    category: 'praktik',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    description: 'Praktik Sea Survival di kolam latih untuk melatih kesiapan darurat di tengah samudera.'
  },
  {
    id: 'gal_3',
    title: 'Ujian Simulator Navigasi Komando',
    category: 'fasilitas',
    imageUrl: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=800&auto=format&fit=crop',
    description: 'Taruna melaksanakan simulasi badai laut di Bridge Simulator modern AMC Bekasi.'
  },
  {
    id: 'gal_4',
    title: 'Upacara Wisuda & Pedang Pora',
    category: 'wisuda',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    description: 'Prosesi tradisi pedang pora yang megah menyambut para wisudawan yang siap berlayar ke kancah global.'
  },
  {
    id: 'gal_5',
    title: 'Praktik Bongkar Muat Kargo',
    category: 'praktik',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    description: 'Taruna KPN melakukan kunjungan lapangan dan praktik langsung di Terminal Peti Kemas.'
  },
  {
    id: 'gal_6',
    title: 'Kunjungan Industri di Galangan Kapal',
    category: 'kegiatan',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
    description: 'Taruna Teknika mempelajari konstruksi lambung kapal secara langsung di galangan kapal nasional.'
  }
];

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'news_1',
    title: 'AMC Bekasi Jalin Kerjasama Penyaluran Lulusan dengan Perusahaan Pelayaran Internasional asal Jepang',
    category: 'Kerjasama',
    date: '2026-06-18',
    summary: 'Akademi Maritim AMC Bekasi menandatangani MoU strategis dengan Mitsui O.S.K. Lines (MOL) untuk memastikan cadet dan alumni langsung direkrut di armada kapal mereka.',
    content: 'Bekasi - AMC Bekasi kembali memperluas jejaring global dengan menandatangani Memorandum of Understanding (MoU) bersama raksasa pelayaran internasional Jepang, Mitsui O.S.K. Lines (MOL). Kerjasama ini meliputi program magang (Sea Project) berbayar untuk Taruna tingkat akhir, serta jaminan rekrutmen perwira bagi lulusan terbaik program studi Nautika dan Teknika. Direktur AMC Bekasi menegaskan bahwa langkah ini merupakan bukti nyata bahwa standar kurikulum yang diterapkan di AMC Bekasi telah diakui secara internasional.',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop',
    author: 'Capt. H. Sugiharto, M.Mar'
  },
  {
    id: 'news_2',
    title: 'Pendaftaran PMB Gelombang II Tahun Akademik 2026/2027 Resmi Dibuka, Simak Jalur Beasiswa Unggulan',
    category: 'PMB',
    date: '2026-06-10',
    summary: 'Kesempatan emas bergabung dengan kampus maritim terbaik di Bekasi. Tersedia beasiswa prestasi akademik dan beasiswa ikatan dinas dari yayasan.',
    content: 'Bekasi - Panitia Penerimaan Mahasiswa Baru (PMB) AMC Bekasi secara resmi membuka pendaftaran Gelombang II yang akan berlangsung hingga akhir Agustus 2026. Pada gelombang ini, pihak yayasan AMC Bekasi menyediakan program beasiswa khusus potongan biaya pendidikan hingga 50% bagi calon taruna yang memiliki prestasi akademik di SMA/SMK atau nilai rapor rata-rata di atas 85. Pendaftaran dapat diakses secara online penuh melalui portal resmi atau langsung mengunjungi kampus.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    author: 'Dr. Ir. Wahyudi, M.T.'
  },
  {
    id: 'news_3',
    title: 'Taruna AMC Bekasi Juara I Lomba Navigasi Maritim Tingkat Nasional di Surabaya',
    category: 'Prestasi',
    date: '2026-05-28',
    summary: 'Tim Nautika AMC Bekasi berhasil mengalahkan berbagai akademi pelayaran ternama dalam kejuaraan navigasi elektronik dan plot rute aman laut.',
    content: 'Surabaya - Prestasi membanggakan kembali diukir oleh Taruna AMC Bekasi dalam ajang Maritime Navigation Championship yang diadakan di Surabaya. Dalam kompetisi simulasi navigasi tingkat nasional ini, Tim Nautika AMC Bekasi yang digawangi oleh Taruna Muhammad Fadli dan Taruni Syafira berhasil meraih Juara I setelah mencatatkan poin navigasi tertinggi dan rute pelayaran paling efisien serta aman di bawah simulasi badai ekstrem.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    author: 'Bambang Hermawan, M.Mar.E'
  }
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testi_1',
    name: 'Muhammad Hadori',
    major: 'D3 Nautika',
    year: 'Lulusan 2017',
    testi: 'Pendidikan semi-militer, disiplin yang ketat, dan fasilitas simulator berstandar internasional di AMC Bekasi memberikan bekal yang sangat kuat bagi saya. Saat ini saya telah menjabat sebagai Nakhoda (Master) di armada tanker asing dengan penghasilan standar internasional. Bangga menjadi alumni AMC Bekasi!',
    company: 'SMOOTH INTERNATIONAL SHIPPING LIMITED',
    position: 'Nakhoda (MV ASHIMA)',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'testi_2',
    name: 'Dondon parulian Manurung',
    major: 'D3 Teknika',
    year: 'Lulusan 2019',
    testi: 'Sistem pembelajaran di bengkel kerja dan simulator mesin di AMC Bekasi sangat mirip dengan kondisi riil di atas kapal kargo tempat saya bekerja sekarang. Pengetahuan tentang perawatan mesin diesel dua-langkah bertenaga besar sangat terasah sejak di bangku kuliah.',
    company: 'PERTAMINA INTERNATIONAL SHIPPING (PIS)',
    position: 'Masinis (MT. PIS ROKAN)',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'testi_3',
    name: 'Enjelika Silitonga',
    major: 'D3 KPN',
    year: 'Lulusan 2021',
    testi: 'Prodi KPN terbukti sangat dibutuhkan di industri pelabuhan saat ini. Berkat bimbingan dosen praktisi pelabuhan di AMC Bekasi, saya bisa langsung diterima kerja di terminal petikemas BUMN sebelum wisuda digelar.',
    company: 'T%C OCEAN MANAGEMENT',
    position: 'Staff Logistik',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  }
];

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    title: 'Mencetak Taruna Maritim Profesional dan Berdaya Saing Global',
    subtitle: 'Akademi Maritim (AMC BEKASI) menyelenggarakan pendidikan tinggi pelayaran niaga terakreditasi yang melahirkan perwira dek, perwira mesin, serta ahli manajemen pelabuhan berstandar IMO.',
    ctaPrimary: 'Daftar PMB 2026',
    ctaSecondary: 'Eksplor Program Studi'
  },
  about: {
    history: 'Akademi Maritim (AMC BEKASI) merupakan salah satu perguruan tinggi vokasi maritim swasta terkemuka di Indonesia yang telah berdiri sejak tahun 2002. Berkomitmen untuk melahirkan sumber daya manusia sektor transportasi laut yang tangguh, beretika, dan menguasai teknologi maritim mutakhir. Dengan kurikulum yang mengacu pada kurikulum nasional dan konvensi internasional STCW (Standards of Training, Certification and Watchkeeping) beserta amandemennya, lulusan AMC BEKASI dibekali kompetensi global dan sertifikasi profesi pelaut tingkat internasional yang siap bersaing di kancah maritim dunia.',
    welcomeMessage: 'Selamat datang di Kampus Perjuangan Samudera, Akademi Maritim (AMC BEKASI). Di era globalisasi 2026 ini, transportasi laut tetap menjadi tulang punggung perdagangan dunia (90% logistik dunia menggunakan kapal). Kebutuhan akan perwira kapal yang kompeten dan administrator pelabuhan yang handal semakin meningkat pesat. Di AMC BEKASI, kami mendidik taruna-taruni dengan menyeimbangkan kedisiplinan mental karakter, pemahaman teori akademik yang mendalam, serta jam terbang latihan di laboratorium simulator canggih kami. Kami pastikan setiap taruna yang keluar dari gerbang kampus ini memiliki masa depan gemilang di atas samudera luas.',
    directorName: 'DR. FEREDDY SIAGIAN, S.Th, M.Th,',
    directorTitle: 'Direktur Utama Akademi Maritim (AMC BEKASI)',
    ownerName: 'RISTA SARAGIH, S.H,S.Sos,',
    ownerTitle: 'Pemilik Akademi Maritim (AMC BEKASI)',
    ownerMessage: 'Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas berdirinya dan terus berkembangnya Akademi Maritim (AMC BEKASI) hingga saat ini. Sebagai lembaga pendidikan tinggi pelayaran niaga, kami berkomitmen penuh untuk terus menyediakan sarana prasarana modern, simulator canggih, serta lingkungan pendidikan yang berdisiplin tinggi demi melahirkan perwira-perwira samudera dan administrator pelabuhan yang berkarakter kuat, berwawasan global, dan siap mendominasi pasar maritim internasional.',
    vision: 'Menjadi Akademi Maritim unggulan tingkat Asia Tenggara yang menghasilkan Perwira Pelayaran Niaga dan Ahli Ketatalaksanaan Pelayaran yang profesional, disiplin, berjiwa wirausaha, serta berdaya saing global pada tahun 2030.',
    mission: [
      'Menyelenggarakan pendidikan vokasi maritim berstandar internasional sesuai regulasi IMO (International Maritime Organization) and STCW.',
      'Melaksanakan penelitian terapan di bidang pelayaran niaga dan teknologi logistik maritim guna mendukung poros maritim nasional.',
      'Menyelenggarakan pengabdian masyarakat di wilayah kepesisiran untuk meningkatkan kesejahteraan dan kesadaran bahari masyarakat.',
      'Membina karakter taruna-taruni yang berdisiplin tinggi, berintegritas moral, berwawasan global, serta tangguh menghadapi tantangan laut.'
    ],
    objectives: [
      'Menghasilkan lulusan perwira pelayaran niaga yang kompeten, berkarakter prima, berdisiplin tinggi, dan memiliki daya saing global.',
      'Meningkatkan mutu penelitian terapan di bidang kemaritiman guna memberikan kontribusi nyata bagi industri pelayaran nasional.',
      'Melaksanakan pengabdian masyarakat yang terarah untuk meningkatkan pemahaman dan kemandirian masyarakat pesisir.',
      'Mengembangkan jejaring kemitraan strategis dengan perusahaan pelayaran dalam dan luar negeri guna percepatan penyerapan lulusan.'
    ]
  },
  contact: {
    phone: '+62 21 8899 7766',
    whatsapp: '+62 812 3456 7890',
    email: 'amc.bekasi1@gmail.com',
    address: ' Jalan Muara Bakti 17610 Sukawangi West Java',
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.822765582315!2d107.0863004!3d-6.1491799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a21e42cbb105f%3A0xe4ca71dc0f8b80b2!2sAkademi%20Maritim%20Cirebon%20Kampus%20Bekasi!5e0!3m2!1sid!2sid!4v1719234567890!5m2!1sid!2sid'
  },
  socialMedia: {
    facebook: 'https://www.facebook.com/amc.bekasi/',
    instagram: 'https://www.instagram.com/amc.bekasi/',
    youtube: 'https://www.youtube.com/@akademimaritimcirebon3135',
    tiktok:  'https://www.tiktok.com/@akademimaritimcirebon'
  },
  campusProfile: {
    accreditation: 'B (Baik Sekali)',
    establishedYear: '2002',
    status: 'Aktif Swasta',
    skKemenkumham: 'AHU-001245.AH.01.04.2021',
    izinHubla: 'PK.303/12/4/DK-2023',
    izinKemendikbud: 'No. 235/E/O/2022'
  }
};

import { AlumniItem, SEOSettings, UserItem, MediaItem, ActivityLogItem } from './types';

export const DEFAULT_ALUMNI: AlumniItem[] = [
  {
    id: 'alum_1',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
    name: 'Capt. Satria Perkasa, M.Mar',
    graduationYear: '2017',
    studyProgram: 'Nautika',
    occupation: 'Nakhoda Kapal (Master Mariner)',
    company: 'Chevron Shipping Company',
    city: 'Houston / Internasional',
    biography: 'Satria merupakan lulusan terbaik Nautika 2017. Karirnya melesat cepat dari 3rd Officer hingga kini dipercaya menjadi Nakhoda kapal tanker berbendera asing.',
    testimonial: 'Pendidikan semi-militer, disiplin yang ketat, dan fasilitas simulator berstandar internasional di AMC Bekasi memberikan bekal yang sangat kuat bagi saya. Saat ini saya telah menjabat sebagai Nakhoda (Master) di armada tanker asing dengan penghasilan standar internasional.',
    isFeatured: true,
    status: 'published',
    shipName: 'MV Chevron Voyager',
    placement: 'Houston, USA',
    displayOrder: 1
  },
  {
    id: 'alum_2',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300',
    name: 'Rian Hidayat, A.Md, ATT-III',
    graduationYear: '2019',
    studyProgram: 'Teknika',
    occupation: 'Second Engineer (Masinis II)',
    company: 'NYK Line Nippon Yusen',
    city: 'Tokyo / Internasional',
    biography: 'Rian memiliki passion tinggi di bidang permesinan kapal sejak di bangku taruna. Ia berhasil mengantongi sertifikat ATT-III dan ATT-II dalam waktu singkat.',
    testimonial: 'Sistem pembelajaran di bengkel kerja dan simulator mesin di AMC Bekasi sangat mirip dengan kondisi riil di atas kapal kargo tempat saya bekerja sekarang. Pengetahuan tentang perawatan mesin diesel dua-langkah bertenaga besar sangat terasah.',
    isFeatured: true,
    status: 'published',
    shipName: 'MV NYK Vega',
    placement: 'Tokyo, Japan',
    displayOrder: 2
  },
  {
    id: 'alum_3',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
    name: 'Sarah Ayunda, A.Md',
    graduationYear: '2021',
    studyProgram: 'KPN',
    occupation: 'Port Logistics Administrator',
    company: 'PT Pelabuhan Indonesia (Pelindo)',
    city: 'Tanjung Priok, Jakarta',
    biography: 'Sarah aktif dalam organisasi korps taruna semasa kuliah. Ia direkrut oleh Pelindo melalui jalur kemitraan prestasi sebelum ia diwisuda.',
    testimonial: 'Prodi KPN terbukti sangat dibutuhkan di industri pelabuhan saat ini. Berkat bimbingan dosen praktisi pelabuhan di AMC Bekasi, saya bisa langsung diterima kerja di terminal petikemas BUMN sebelum wisuda digelar.',
    isFeatured: true,
    status: 'published',
    shipName: 'Tanjung Priok Port Terminal',
    placement: 'Jakarta, Indonesia',
    displayOrder: 3
  }
];

export const DEFAULT_SEO: SEOSettings = {
  metaTitle: 'Akademi Maritim (AMC BEKASI) - Kampus Pelayaran Niaga Unggulan',
  metaDescription: 'Website Resmi Akademi Maritim (AMC BEKASI). Sekolah tinggi pelayaran niaga terakreditasi menghasilkan Perwira Deck (ANT-III), Perwira Mesin (ATT-III), dan Ahli Pelabuhan.',
  keywords: 'akademi maritim bekasi, amc bekasi, sekolah pelayaran bekasi, pendaftaran pelaut, d3 nautika, d3 teknika, d3 kpn, pmb amc bekasi, sekolah nakhoda',
  openGraph: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Logo_Akademi_Maritim_Cirebon.png',
  favicon: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Logo_Akademi_Maritim_Cirebon.png',
  robots: 'User-agent: *\nAllow: /\nSitemap: https://amc-bekasi.ac.id/sitemap.xml',
  sitemap: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://amc-bekasi.ac.id/</loc>\n    <lastmod>2026-06-26</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>'
};

export const DEFAULT_USERS: UserItem[] = [
  {
    id: 'user_1',
    username: 'admin',
    fullName: 'Laksma TNI (Purn) Dr. Ir. H. Mulyono',
    role: 'Super Admin',
    email: 'mulyono@amc-bekasi.ac.id'
  },
  {
    id: 'user_2',
    username: 'editor_humas',
    fullName: 'Humas AMC Bekasi',
    role: 'Editor',
    email: 'humas@amc-bekasi.ac.id'
  },
  {
    id: 'user_3',
    username: 'news_admin',
    fullName: 'Tim Publikasi Berita',
    role: 'News Admin',
    email: 'berita@amc-bekasi.ac.id'
  },
  {
    id: 'user_4',
    username: 'pmb_admin',
    fullName: 'Panitia PMB 2026',
    role: 'PMB Admin',
    email: 'pmb@amc-bekasi.ac.id'
  }
];

export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'media_1',
    name: 'logo_amc_bekasi.png',
    type: 'image',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Logo_Akademi_Maritim_Cirebon.png',
    folder: 'Logo',
    size: '124 KB',
    uploadedAt: '2026-06-10'
  },
  {
    id: 'media_2',
    name: 'hero_container_ship.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1516216628859-9bccecad13ec?q=80&w=1200',
    folder: 'Hero',
    size: '840 KB',
    uploadedAt: '2026-06-12'
  },
  {
    id: 'media_3',
    name: 'brosur_pendaftaran_2026.pdf',
    type: 'document',
    url: '#',
    folder: 'Dokumen PMB',
    size: '2.4 MB',
    uploadedAt: '2026-06-15'
  },
  {
    id: 'media_4',
    name: 'video_profil_kampus.mp4',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    folder: 'Promosi',
    size: '14.2 MB',
    uploadedAt: '2026-06-20'
  }
];

export const DEFAULT_LOGS: ActivityLogItem[] = [
  {
    id: 'log_1',
    user: 'admin',
    role: 'Super Admin',
    action: 'Login Berhasil',
    timestamp: '2026-06-26 13:30:15',
    details: 'Login sukses dari IP 114.124.201.88'
  },
  {
    id: 'log_2',
    user: 'admin',
    role: 'Super Admin',
    action: 'Update Kontak Kampus',
    timestamp: '2026-06-26 13:40:02',
    details: 'Mengubah alamat email kontak utama dan nomor WhatsApp pendaftaran'
  },
  {
    id: 'log_3',
    user: 'news_admin',
    role: 'News Admin',
    action: 'Tambah Berita Baru',
    timestamp: '2026-06-26 13:45:10',
    details: 'Membuat artikel tentang kerja sama penyerapan lulusan dengan perusahaan Jepang'
  }
];

export const DEFAULT_TIMELINE: TimelineEvent[] = [
  {
    id: 'time_1',
    year: 'Tahun 1986-1990',
    title: 'Dekade Pendirian Awal',
    description: 'Awal Pendirian: Resmi berdiri berdasarkan Akta Pendirian Yayasan No. 15 pada tanggal 8 Februari 1990,Keberadaan institusi ini diperkuat oleh Surat Keputusan Menteri Pendidikan dan Kebudayaan RI serta Pusdiklat Perhubungan Laut RI..'
  },
  {
    id: 'time_2',
    year: 'Tahun 1991-1993',
    title: 'Penguatan Legalitas Pemerintah',
    description: 'AMC mendapat legitimasi kedinasan maritim melalui SK Kepala Pusdiklat Perhubungan Laut RI Nomor: 165/DL.206 PDL 1991 lalu Ditahun 1993 : Legalitas akademik tingkat nasional diperkuat dengan terbitnya SK Menteri Pendidikan dan Kebudayaan RI Nomor: 134/D/O/1993.'
  },
  {
    id: 'time_3',
    year: 'Tahun 2009',
    title: 'Era Manajemen Baru & Ekspansi Lahan',
    description: 'Perubahan Pimpinan: Manajemen operasional institusi diambil alih oleh pimpinan baru di bawah Ibu Rista Saragih, S.Sos.Kampus Dukuh Semar: Di tahun yang sama, AMC mengembangkan sarana belajarnya dengan memanfaatkan lahan seluas 1 hektar milik Pemerintah Kota Cirebon di daerah Dukuh Semar, Harjamukti.'
  },
  {
    id: 'time_4',
    year: 'Tahun 2022-Sekarang',
    title: 'Relokasi Strategis ke Bekasi',
    description: "Setelah melahirkan puluhan ribu alumni di Cirebon, manajemen mengambil keputusan besar untuk memindahkan pusat operasional kampus ke Kabupaten Bekasi."
  },
];

export const DEFAULT_LECTURERS: LecturerItem[] = [
  {
    id: 'lec_1',
    name: 'Capt. Hartono, M.Mar',
    role: 'Dosen Kepala / Instruktur Simulator',
    dept: 'D3 Nautika',
    desc: 'Sertifikat Keahlian ANT-I (Master Mariner) dengan 15+ tahun pengalaman berlayar di kapal tanker samudera internasional.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300',
    email: 'hartono@amc-bekasi.ac.id',
    expertise: 'Navigasi Kapal & Bridge Simulator',
    degree: 'M.Mar'
  },
  {
    id: 'lec_2',
    name: 'Ir. Supardi, M.T., ATT-I',
    role: 'Dosen Senior Mesin',
    dept: 'D3 Teknika',
    desc: 'Sertifikat Keahlian ATT-I (Chief Engineer). Ahli dalam optimasi ketel uap dan sistem kontrol otomatis mesin induk kapal.',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300',
    email: 'supardi@amc-bekasi.ac.id',
    expertise: 'Motor Diesel & Sistem Kontrol',
    degree: 'Ir., M.T., ATT-I'
  },
  {
    id: 'lec_3',
    name: 'Dr. Endang Sulastri, S.E., M.M.',
    role: 'Dosen Manajemen Kepelabuhanan',
    dept: 'D3 KPN',
    desc: 'Doktor bidang Logistik Maritim. Berpengalaman luas dalam pengelolaan dry-port dan kepabeanan internasional.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300',
    email: 'endang@amc-bekasi.ac.id',
    expertise: 'Logistik & Manajemen Pelabuhan',
    degree: 'Dr., S.E., M.M.'
  },
  {
    id: 'lec_4',
    name: 'Capt. Teguh Wibowo, M.Mar',
    role: 'Instruktur Deck & Navigasi Elektronik',
    dept: 'D3 Nautika',
    desc: 'Spesialis Radar/ARPA, ECDIS, dan sistem komunikasi penyelamatan GMDSS berstandar konvensi IMO.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300',
    email: 'teguh.w@amc-bekasi.ac.id',
    expertise: 'ECDIS & Radar/ARPA',
    degree: 'M.Mar'
  },
  {
    id: 'lec_5',
    name: 'Yusuf Habibi, M.Tr.T., ATT-II',
    role: 'Instruktur Sistem Kelistrikan Kapal',
    dept: 'D3 Teknika',
    desc: 'Praktisi kelistrikan dan otomasi kapal kargo kontainer multinasional senior dengan lisensi ATT-II.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300',
    email: 'yusuf.h@amc-bekasi.ac.id',
    expertise: 'Kelistrikan & Otomasi Kapal',
    degree: 'M.Tr.T., ATT-II'
  },
  {
    id: 'lec_6',
    name: 'Hj. Ratna Sari, M.B.A.',
    role: 'Dosen Ekonomi Transportasi Laut',
    dept: 'D3 KPN',
    desc: 'Lulusan magister bisnis transportasi luar negeri dengan fokus riset manajemen rantai pasok dan chartering kapal.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300',
    email: 'ratna.s@amc-bekasi.ac.id',
    expertise: 'Supply Chain & Chartering',
    degree: 'M.B.A.'
  }
];

export const DEFAULT_CALENDAR: CalendarEventItem[] = [
  {
    id: 'cal_1',
    period: 'Agustus 2026',
    title: 'Pendidikan Kesamaptaan & Madabintal (Masa Dasar Bimbingan Fisik dan Mental Taruna Baru)',
    type: 'wajib'
  },
  {
    id: 'cal_2',
    period: 'September 2026',
    title: 'Upacara Pelantikan Taruna & Awal Perkuliahan Semester Ganjil TA 2026/2027',
    type: 'akademik'
  },
  {
    id: 'cal_3',
    period: 'November 2026',
    title: 'Ujian Tengah Semester (UTS) Teori dan Praktik Lab Simulator',
    type: 'akademik'
  },
  {
    id: 'cal_4',
    period: 'Desember 2026',
    title: 'Latihan Penyelamatan Jiwa di Laut (BST - Basic Safety Training) & Pemadaman Api',
    type: 'pelatihan'
  },
  {
    id: 'cal_5',
    period: 'Januari 2027',
    title: 'Ujian Akhir Semester (UAS) & Evaluasi Kelayakan Kenaikan Tingkat',
    type: 'akademik'
  },
  {
    id: 'cal_6',
    period: 'Februari 2027',
    title: 'Pelepasan Cadet untuk Praktek Laut (Prala) & Praktek Darat (Prada) Angkatan Baru',
    type: 'karir'
  }
];

export const DEFAULT_PMB_CONFIG = {
  waves: [
    { id: 'wave1', name: 'Gelombang I (Jalur Dini)', period: '1 Januari - 30 April 2026', examDate: '5 Mei 2026', status: 'closed' as const },
    { id: 'wave2', name: 'Gelombang II (Jalur Reguler & Beasiswa)', period: '1 Juni - 15 Agustus 2026', examDate: '18 - 20 Agustus 2026', status: 'open' as const },
    { id: 'wave3', name: 'Gelombang III (Jalur Terakhir)', period: '16 Agustus - 10 September 2026', examDate: '14 September 2026', status: 'upcoming' as const },
  ],
  fees: [
    { major: 'nautika', uangPangkal: 12000000, spp: 6500000, seragam: 3500000, bst: 4500000 },
    { major: 'teknika', uangPangkal: 12500000, spp: 6700000, seragam: 3500000, bst: 4500000 },
    { major: 'kpn', uangPangkal: 9000000, spp: 5000000, seragam: 3500000, bst: 0 },
  ],
  requirements: {
    general: [
      'Warga Negara Indonesia (WNI) baik Laki-laki maupun Perempuan.',
      'Lulusan SMA/SMK/MA sederajat (SMK Pelayaran, SMK Otomotif, SMA IPA diutamakan untuk Nautika/Teknika).',
      'Berusia maksimal 23 tahun pada saat perkuliahan dimulai (September 2026).',
      'Belum menikah dan bersedia tidak menikah selama masa pendidikan tahun pertama.'
    ],
    physical: [
      'Tinggi badan minimal: Pria 160 cm, Wanita 155 cm dengan berat badan proporsional.',
      'Sehat jasmani & rohani, tidak memiliki cacat fisik yang mengganggu aktivitas pelayaran.',
      'TIDAK buta warna baik parsial maupun total (Khusus Nautika & Teknika wajib melampirkan surat dokter).',
      'Bebas dari narkoba, tato, dan tindik telinga (khusus calon Taruna pria).'
    ],
    documents: [
      'Fotokopi Ijazah / SKL SMA-SMK yang telah dilegalisir basah (2 lembar).',
      'Fotokopi Kartu Keluarga (KK) & Akta Kelahiran (2 lembar).',
      'Surat Keterangan Catatan Kepolisian (SKCK) yang masih aktif.',
      'Pasfoto ukuran 3x4 & 4x6 (Biru untuk Nautika/KPN, Merah untuk Teknika).'
    ]
  },
  faqs: [
    {
      q: 'Apakah Taruna Berkacamata diperbolehkan mendaftar?',
      a: 'Khusus untuk Program Studi D3 Nautika dan D3 Teknika, Taruna disyaratkan TIDAK buta warna dan TIDAK berkacamata (maksimal toleransi 0.5 di bawah pengawasan ketat). Untuk Program Studi D3 Ketatalaksanaan Pelayaran Niaga dan Kepelabuhanan (KPN), calon Taruna yang berkacamata diperbolehkan mendaftar.'
    },
    {
      q: 'Bagaimana metode pembayaran biaya pendidikan di AMC Bekasi?',
      a: 'AMC Bekasi menerapkan sistem pembayaran yang fleksibel demi meringankan beban orang tua Taruna. Uang Pangkal dapat diangsur sebanyak 3-4 kali selama semester pertama berjalan. Biaya SPP dibayarkan di awal semester secara tertib.'
    },
    {
      q: 'Apakah AMC Bekasi menjamin lulusan langsung bekerja?',
      a: 'Kami memiliki Divisi Hubungan Industri & Career Development Center yang bekerjasama dengan puluhan maskapai pelayaran nasional dan internasional, keagenan kru (crewing agency), serta operator pelabuhan. Cadets yang berprestasi pada masa Praktek Laut (Prala/Prada) umumnya langsung ditawari ikatan kerja sebelum mereka resmi wisuda.'
    },
    {
      q: 'Berapa lama masa studi dan wajib asrama?',
      a: 'Pendidikan vokasi D3 di AMC Bekasi ditempuh selama 3 tahun (6 semester). Seluruh Taruna wajib tinggal di Asrama Kampus selama tahun pertama (Tingkat I) untuk menjalani bimbingan karakter, kedisiplinan fisik, dan kesamaptaan.'
    },
    {
      q: 'Dokumen apa saja yang wajib disiapkan saat pendaftaran online?',
      a: 'Cukup siapkan pindaian (scan) atau foto dari Ijazah/SKL, Akta Kelahiran, Kartu Keluarga, dan pasfoto terbaru. Seluruh dokumen tersebut dapat diunggah melalui formulir pendaftaran ini atau diserahkan langsung ke kampus.'
    }
  ]
};


