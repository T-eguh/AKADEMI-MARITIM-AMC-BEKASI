import React, { useState } from 'react';
import { StoreProduct, StoreOrder } from '../types';

interface StorePageProps {
  products: StoreProduct[];
  orders: StoreOrder[];
  onAddOrder: (order: StoreOrder) => void;
  lang: 'id' | 'en';
}

export default function StorePage({ products, orders, onAddOrder, lang }: StorePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  
  // Shopping Cart state
  const [cart, setCart] = useState<{ product: StoreProduct; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Checkout Form states
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutPayment, setCheckoutPayment] = useState('WhatsApp Order');
  const [orderComplete, setOrderComplete] = useState<StoreOrder | null>(null);

  const activeProducts = products.filter(p => p.stock > 0);
  const categories = ['Semua', ...Array.from(new Set(activeProducts.map(p => p.category || 'Atribut')))];

  const filteredProducts = activeProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || (p.category || 'Atribut') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: StoreProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Limit to stock
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Visual helper toast or just open cart directly
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > item.product.stock) return item; // limit to stock
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as { product: StoreProduct; quantity: number }[]);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !checkoutName || !checkoutPhone || !checkoutAddress) return;

    const today = new Date().toISOString().split('T')[0];
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const productNames = cart.map(item => `${item.product.name} (x${item.quantity})`).join(', ');
    const totalQty = cart.reduce((acc, curr) => acc + curr.quantity, 0);

    const newOrder: StoreOrder = {
      id: orderId,
      customerName: checkoutName,
      customerPhone: checkoutPhone,
      shippingAddress: checkoutAddress,
      paymentMethod: checkoutPayment,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: totalCartPrice,
      totalPrice: totalCartPrice, // Set totalPrice for Admin Panel compatibility
      status: 'Pending', // Capitalized for proper Admin Panel status styling
      date: today,
      orderDate: today, // Set orderDate for Admin Panel compatibility
      buyerName: checkoutName, // Set buyerName for Admin Panel compatibility
      buyerPhone: checkoutPhone, // Set buyerPhone for Admin Panel compatibility
      buyerNIM: 'Umum / Publik', // Set buyerNIM for Admin Panel compatibility
      productName: productNames, // Set productName for Admin Panel compatibility
      quantity: totalQty, // Set total quantity for Admin Panel compatibility
    };

    onAddOrder(newOrder);
    setOrderComplete(newOrder);
    setIsCheckoutOpen(false);

    // Format WA Message
    const orderListText = cart.map((item, index) => `${index + 1}. ${item.product.name} (x${item.quantity}) - ${formatPrice(item.product.price * item.quantity)}`).join('\n');
    const waText = `Halo Admin AMC Store!\n\nSaya ingin melakukan pemesanan atribut kampus:\n\n*ID Pesanan:* ${orderId}\n*Nama:* ${checkoutName}\n*No. HP/WA:* ${checkoutPhone}\n*Alamat Kirim:* ${checkoutAddress}\n\n*Daftar Pesanan:*\n${orderListText}\n\n*Total Pembayaran:* ${formatPrice(totalCartPrice)}\n*Metode Pembayaran:* ${checkoutPayment}\n\nMohon bantuannya untuk memproses pesanan saya. Terima kasih!`;
    const encodedWaText = encodeURIComponent(waText);
    
    // Direct link to WA (Load dynamic phone number from admin configuration with fallback)
    let waPhone = '6281210101010';
    try {
      const storedContent = localStorage.getItem('amc_content');
      if (storedContent) {
        const parsed = JSON.parse(storedContent);
        const contactWa = parsed.contact?.whatsapp || parsed.whatsapp || parsed.contact?.phone;
        if (contactWa) {
          let cleaned = contactWa.replace(/[^0-9]/g, '');
          if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
          }
          if (cleaned) {
            waPhone = cleaned;
          }
        }
      }
    } catch (e) {
      console.warn('Gagal membaca nomor WhatsApp dinamis:', e);
    }

    const waLink = `https://wa.me/${waPhone}?text=${encodedWaText}`;
    
    setTimeout(() => {
      window.open(waLink, '_blank', 'noopener,noreferrer');
      setCart([]); // Clear cart
    }, 1000);
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      {/* Page Banner */}
      <div className="bg-[#003B7A] text-white py-12 relative overflow-hidden mb-10">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFC107_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-gold-500 font-bold text-xs uppercase tracking-widest block mb-2">Campus Merchandise Portal</span>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight">AMC STORE</h1>
            <p className="text-slate-200 text-xs md:text-sm mt-2 max-w-xl font-sans">
              Dapatkan kelengkapan pakaian seragam, atribut taruna, aksesoris, modul kuliah, dan merchandise resmi Akademi Maritim Cirebon Bekasi.
            </p>
          </div>
          
          {/* Floating cart toggle */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-gold-500/20 active:scale-95 transition-all self-start md:self-center"
          >
            <div className="relative">
              <svg className="w-5 h-5 stroke-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalCartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white font-mono text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse border border-white">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span>Keranjang Saya</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#003B7A] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 flex-shrink-0">
            <input
              type="text"
              placeholder="Cari merchandise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003B7A]"
            />
            <svg className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-slate-500 text-sm font-semibold">Tidak ada merchandise yang sesuai pencarian atau kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gold-500/20 transition-all flex flex-col justify-between group"
              >
                {/* Product Image */}
                <div 
                  className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer shrink-0"
                  onClick={() => setSelectedProduct(p)}
                >
                  {(p.imageUrl || p.image) ? (
                    <img
                      src={p.imageUrl || p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#00346c] to-[#001835] flex flex-col items-center justify-center p-4 text-center group-hover:scale-105 transition-transform duration-500">
                      <svg className="w-8 h-8 text-gold-500 mb-2 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider block">AMC STORE</span>
                      <span className="text-[8px] text-gold-500/70 font-mono mt-0.5 uppercase tracking-widest block font-bold">Produk Segera Hadir</span>
                    </div>
                  )}
                  {p.stock <= 3 && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">
                      Stok Terbatas: {p.stock} pcs
                    </span>
                  )}
                </div>

                {/* Content info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">
                      {p.category || 'Atribut'}
                    </span>
                    <h3 
                      onClick={() => setSelectedProduct(p)}
                      className="font-display font-bold text-slate-800 leading-snug hover:text-[#003B7A] transition-colors cursor-pointer line-clamp-2 min-h-[40px] text-sm md:text-base mb-1"
                    >
                      {p.name}
                    </h3>
                    <p className="text-gold-600 font-bold font-mono text-sm md:text-base mb-3">
                      {formatPrice(p.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(p)}
                    className="w-full bg-[#003B7A] hover:bg-gold-500 hover:text-navy-950 text-white font-bold py-2 rounded-lg text-xs md:text-sm transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Beli Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-100 z-10 animate-fade-in flex flex-col md:flex-row max-h-[85vh]">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 text-white md:text-slate-500 hover:text-gold-500 w-8 h-8 rounded-full bg-navy-950/50 md:bg-slate-100 flex items-center justify-center transition-colors"
              aria-label="Tutup"
            >
              <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Photo half */}
            <div className="w-full md:w-1/2 h-56 md:h-auto bg-slate-100 overflow-hidden relative shrink-0">
              {(selectedProduct.imageUrl || selectedProduct.image) ? (
                <img
                  src={selectedProduct.imageUrl || selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00346c] to-[#001835] flex flex-col items-center justify-center p-8 text-center min-h-[224px] md:min-h-0">
                  <svg className="w-12 h-12 text-gold-500 mb-3 opacity-95 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="text-sm font-extrabold text-white uppercase tracking-widest block">ATRIBUT KAMPUS</span>
                  <span className="text-xs text-gold-500/80 font-mono mt-1 uppercase tracking-widest block font-bold">Photo Coming Soon</span>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-[180px]">Foto resmi belum diunggah oleh administrasi store.</p>
                </div>
              )}
            </div>

            {/* Content half */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
              <div>
                <span className="bg-[#003B7A]/10 text-[#003B7A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                  {selectedProduct.category || 'Atribut'}
                </span>
                
                <h2 className="text-xl font-display font-black leading-tight text-slate-800 tracking-tight mb-2">
                  {selectedProduct.name}
                </h2>

                <p className="text-gold-600 font-bold font-mono text-lg mb-4">
                  {formatPrice(selectedProduct.price)}
                </p>

                <div className="border-t border-slate-100 pt-4 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Informasi Stok</span>
                  <span className={`text-xs font-bold ${selectedProduct.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedProduct.stock > 0 ? `Tersedia: ${selectedProduct.stock} pcs` : 'Stok Habis'}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4 mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Deskripsi Produk</span>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto pr-2">
                    {selectedProduct.description || 'Tidak ada deskripsi produk.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.stock === 0}
                  className="flex-1 bg-[#003B7A] hover:bg-gold-500 hover:text-navy-950 disabled:bg-slate-100 disabled:text-slate-400 font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-navy-800/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Tambah Ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          <div 
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-100 z-10 animate-fade-in flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#003B7A] text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="font-display font-black tracking-tight text-lg">Keranjang Belanja</span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-white hover:text-gold-500 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-100">
              {cart.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  <svg className="w-12 h-12 stroke-1 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-sm font-semibold">Keranjang belanja Anda masih kosong.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="py-4 flex gap-3 items-center">
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                      {(item.product.imageUrl || item.product.image) ? (
                        <img 
                          src={item.product.imageUrl || item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#00346c] to-[#001835] flex flex-col items-center justify-center p-1 text-center">
                          <svg className="w-5 h-5 text-gold-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span className="text-[7px] text-white font-black block leading-none mt-0.5">AMC</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-400 uppercase font-semibold mb-1">{item.product.category || 'Atribut'}</p>
                      <p className="text-gold-600 font-bold font-mono text-xs sm:text-sm">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    {/* Controls */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 hover:bg-slate-100 rounded text-slate-500 font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 hover:bg-slate-100 rounded text-slate-500 font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 text-[11px] font-bold uppercase tracking-wider"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary & Checkout Action */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0">
              <div className="flex justify-between items-center mb-4 text-slate-800">
                <span className="font-bold text-sm">Total Belanja:</span>
                <span className="font-mono font-black text-lg text-gold-600">
                  {formatPrice(totalCartPrice)}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                disabled={cart.length === 0}
                className="w-full bg-[#003B7A] hover:bg-gold-500 hover:text-navy-950 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-navy-800/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lanjut ke Formulir Pemesanan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Form Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setIsCheckoutOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-100 z-10 animate-fade-in flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#003B7A] text-white p-6 shrink-0 relative">
              <h2 className="text-xl font-display font-black leading-tight tracking-tight">
                FORMULIR PEMESANAN MERCHANDISE
              </h2>
              <p className="text-xs text-slate-300 mt-1 font-sans">Selesaikan data Anda untuk memesan langsung via WhatsApp & pencatatan sistem.</p>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gold-500 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Checkout Form Content */}
            <form onSubmit={handleCheckoutSubmit} className="p-6 md:p-8 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Lengkap Pemesan *</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003B7A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nomor WhatsApp Aktif *</label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 0812XXXXXXXX"
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003B7A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alamat Pengiriman Lengkap *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan alamat pengiriman beserta Kelurahan, Kecamatan, Kota/Kabupaten, dan Kode Pos"
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003B7A] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Metode Pembayaran *</label>
                <select
                  value={checkoutPayment}
                  onChange={(e) => setCheckoutPayment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003B7A]"
                >
                  <option value="WhatsApp Order">Pesan via WhatsApp (Bayar Manual / COD)</option>
                  <option value="Bank Transfer">Transfer Bank Mandiri (No Rek: 123-456-7890 a/n AMC)</option>
                </select>
              </div>

              {/* Items Summary in Checkout */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Ringkasan Pembayaran</span>
                <div className="space-y-1.5 text-xs text-slate-600 font-sans">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="line-clamp-1 flex-1 pr-4">{item.product.name} (x{item.quantity})</span>
                      <span className="font-mono font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-slate-800 text-sm">
                    <span>Total Pembayaran:</span>
                    <span className="font-mono text-gold-600">{formatPrice(totalCartPrice)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#003B7A] hover:bg-gold-500 hover:text-navy-950 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-navy-800/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Kirim Pesanan via WhatsApp</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.978L2 22l5.177-1.356A9.898 9.898 0 0 0 12 22c5.506 0 9.989-4.478 9.99-9.984C22 6.507 17.513 2 12.012 2zm6.59 13.985c-.273.763-1.33 1.385-1.84 1.455-.453.063-.9.3-2.923-.509-2.583-1.033-4.22-3.66-4.35-3.83-.12-.17-.98-1.3-1.02-2.61-.04-1.31.64-1.95.88-2.21.23-.25.5-.32.67-.32.17 0 .34.01.49.02.15.01.35-.06.55.43.2.49.69 1.68.75 1.8.06.12.1.26.02.43-.08.17-.12.28-.25.43-.13.15-.27.33-.38.45-.12.12-.25.26-.11.5.14.24.62 1.03 1.33 1.66.92.81 1.7 1.06 1.94 1.18.25.12.39.1.53-.06.14-.17.61-.71.77-.95.16-.24.33-.2.55-.12.23.08 1.45.69 1.7.81.25.12.41.18.47.28.06.11.06.63-.21 1.39z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderComplete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-navy-950/75 backdrop-blur-md" onClick={() => setOrderComplete(null)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl overflow-hidden p-8 shadow-2xl border border-slate-100 z-10 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 border-2 border-emerald-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-xl font-display font-black text-slate-800 leading-tight mb-2">PEMESANAN BERHASIL!</h3>
            <p className="text-xs text-slate-500 font-sans leading-relaxed mb-6">
              ID Pesanan Anda adalah <strong className="text-gold-600 font-mono">{orderComplete.id}</strong>. Kami sedang mengalihkan Anda ke WhatsApp Admin Kampus untuk mempercepat proses verifikasi pembayaran & pengiriman.
            </p>
            
            <button
              onClick={() => setOrderComplete(null)}
              className="w-full bg-[#003B7A] hover:bg-gold-500 hover:text-navy-950 text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Kembali Belanja
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
