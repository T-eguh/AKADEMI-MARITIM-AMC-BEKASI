/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquareCode } from 'lucide-react';

interface ContactProps {
  contact?: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    googleMapsEmbed: string;
  };
}

export default function Contact({ contact }: ContactProps) {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  // Pre-configured contact channels falling back to dynamic settings
  const phoneVal = contact?.phone || '0813 8321 444';
  const whatsappVal = contact?.whatsapp || '0853-2683-9619';
  const emailVal = contact?.email || 'amc.cirebon@gmail.com';
  const addressVal = contact?.address || ' Jl. Gombang, Kp. Kalen Keramat RT.003/RW.003, Desa Sukawangi, Kecamatan Sukawangi, Kabupaten Bekasi, Provinsi Jawa Barat, Kode Pos 17620';

  // Format WhatsApp Link
  const cleanWa = whatsappVal.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa || '6281234567890'}?text=Halo%20Admin%20AMC%20Bekasi%2C%20saya%20tertarik%20dengan%20informasi%20penerimaan%20taruna%20baru.`;

  return (
    <section id="contact" className="py-28 bg-[#003B7A] text-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-400 bg-white/10 px-3.5 py-1.5 rounded-full inline-block">
            Hubungi Kami
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Hubungkan Impian Bahari Anda Bersama Kami
          </h2>
          <p className="text-blue-100 font-sans text-sm max-w-xl mx-auto">
            Kami siap melayani konsultasi pendaftaran, penawaran kerjasama industri pelayaran, ataupun kunjungan sekolah.
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Contact Channels Info */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="space-y-6">
              <h3 className="font-display font-bold text-xl text-white">Informasi Kontak Utama</h3>
              <p className="text-blue-100 text-sm font-sans leading-relaxed">
                Silakan datang langsung ke kampus pada jam kerja (Senin - Jumat 08:00 - 16:00, Sabtu 08:00 - 13:00) atau hubungi portal digital kami.
              </p>
            </div>

            <div className="space-y-4">
              {/* Address Card */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-[20px] border border-slate-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-navy-50 text-navy-800 rounded-xl shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-navy-950">Alamat Kampus</h4>
                  <p className="text-xs text-gray-500 font-sans mt-1 leading-relaxed">{addressVal}</p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-start space-x-4 p-5 bg-white rounded-[20px] border border-slate-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl shrink-0 mt-0.5">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-navy-950">Telepon Kantor</h4>
                  <p className="text-xs text-gray-500 font-sans mt-1">{phoneVal}</p>
                </div>
              </div>

              {/* Email Card */}
              <a
                href={`mailto:${emailVal}`}
                className="flex items-start space-x-4 p-5 bg-white rounded-[20px] border border-slate-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 block hover:border-navy-300/55"
              >
                <div className="p-3 bg-sky-50 text-sky-800 rounded-xl shrink-0 mt-0.5">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-navy-950">Email Akademik</h4>
                  <p className="text-xs text-gray-500 font-sans mt-1 hover:text-navy-800 transition-colors">{emailVal}</p>
                </div>
              </a>

              {/* WhatsApp direct CTA */}
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:bg-emerald-100/90 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-500 text-white rounded-xl shrink-0">
                    <MessageSquareCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-emerald-950">WhatsApp Center PMB</h4>
                    <p className="text-xs text-emerald-700 font-sans mt-0.5">{whatsappVal}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-3 py-1.5 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  Chat Sekarang
                </span>
              </a>
            </div>

          </div>

          {/* Right Column: Modern Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-[20px] border border-slate-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative">
              <h3 className="font-display font-bold text-lg text-navy-950 mb-1">Kirim Pesan Langsung</h3>
              <p className="text-xs text-gray-500 font-sans mb-6">Pesan Anda akan langsung masuk ke layanan Customer Service akademik kami.</p>

              {isSent ? (
                /* Success Feedback */
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-lg text-navy-950">Pesan Berhasil Terkirim!</h4>
                    <p className="text-xs text-gray-500 font-sans max-w-sm mx-auto">
                      Terima kasih telah menghubungi AMC Bekasi. Tim kami akan merespons pesan Anda melalui email atau telepon secepatnya.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-xs text-navy-800 font-bold hover:text-gold-600 transition-colors underline cursor-pointer mt-2"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                /* Form fields */
                <form onSubmit={handleSend} className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block">Nama Anda *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nama Lengkap"
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                      />
                    </div>
                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block">No. Telepon / WA *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="081xxxx"
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Email Anda *</label>
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

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Perihal Pesan *</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="PMB, Proposal Kerjasama, dsb"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Isi Pesan *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tuliskan detail pertanyaan atau pesan Anda di sini..."
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 text-sm transition-all duration-200 cursor-pointer pt-3"
                  >
                    <Send className="h-4 w-4" />
                    <span>Kirim Pesan</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* Embedded Google Map */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-3 h-96">
          <iframe
            src={contact?.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d495.8829386569014!2d107.12968842341346!3d-6.12215484573171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a292a6bf65303%3A0xa775a1b59bb4b158!2sAMC%20BEKASI!5e0!3m2!1sid!2sid!4v1782630632796!5m2!1sid!2sid"}
            title="Lokasi Kampus AMC Bekasi"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-2xl"
          />
        </div>

      </div>
    </section>
  );
}
