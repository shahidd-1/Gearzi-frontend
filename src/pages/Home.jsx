import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productService, categoryService, brandService, getApiError } from '../api/services';

const Home = () => {
  const { addToCart } = useCart();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, productName: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const [productsData, categoriesData, brandsData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
          brandService.getAll(),
        ]);

        setCategories(categoriesData);
        setBrands(brandsData);

        const available = productsData.filter((p) => p.is_available && p.is_active);

        // Check localStorage for admin-pinned featured products
        let featured = [];
        try {
          const storedIds = JSON.parse(localStorage.getItem('gearzi_featured_ids') || '[]');
          if (storedIds.length > 0) {
            featured = storedIds
              .map((id) => available.find((p) => p.id === id))
              .filter(Boolean)
              .slice(0, 5);
          }
        } catch { /* ignore */ }

        // Fallback: random 5 if nothing pinned
        if (featured.length === 0) {
          const shuffled = [...available].sort(() => Math.random() - 0.5);
          featured = shuffled.slice(0, 5);
        }

        setFeaturedProducts(featured);

        // Fetch images for each featured product
        const imageMap = {};
        await Promise.allSettled(
          featured.map(async (product) => {
            try {
              const images = await productService.getImages(product.id);
              if (images?.length > 0) imageMap[product.id] = images[0].image_url;
            } catch { /* no image */ }
          })
        );
        setProductImages(imageMap);

      } catch (err) {
        setError(getApiError(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || 'Gear';
  const getBrandName = (id) => brands.find((b) => b.id === id)?.name || '';

const handleAddToCart = (product) => {
  addToCart({
    ...product,
    image_url: productImages[product.id] || '',
  });
  setToast({ show: true, productName: product.name });
  setTimeout(() => setToast({ show: false, productName: '' }), 3000);
};

  const brandNames = [
    'SONY', 'CANON', 'NIKON', 'DJI', 'SIGMA', 'GODOX',
    'RED', 'ARRI', 'BLACKMAGIC', 'TAMRON', 'SAMYANG',
  ];

  return (
    <div className="bg-[#000000] text-white flex flex-col flex-1 overflow-hidden relative">

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(15px) scale(0.95); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 15px rgba(0, 223, 129, 0.4)); }
          50% { opacity: 0.8; filter: drop-shadow(0 0 30px rgba(0, 223, 129, 0.8)); }
        }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 7s ease-in-out 2s infinite; }
        .animate-float-reverse { animation: float-reverse 8s ease-in-out 1s infinite; }
        .animate-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .spin-origin-center { transform-origin: 400px 320px; }
        .animate-ring-1 { animation: spin-slow 20s linear infinite; }
        .animate-ring-2 { animation: spin-slow-reverse 25s linear infinite; }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover { animation-play-state: paused; }
      `}</style>

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 2xl:px-32 pt-4 pb-6 flex-1 flex flex-col">

        {/* HERO */}
        <div className="bg-[#121212] border border-[#ffffff]/10 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col items-center text-center justify-center min-h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40 md:opacity-60">
            <svg viewBox="0 0 800 600" className="w-full h-full max-w-[800px] animate-float" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="matte-metal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2A2A2A" /><stop offset="40%" stopColor="#111111" /><stop offset="100%" stopColor="#050505" />
                </linearGradient>
                <linearGradient id="grip-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#151515" /><stop offset="100%" stopColor="#0a0a0a" />
                </linearGradient>
                <radialGradient id="lens-glass" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
                  <stop offset="0%" stopColor="#00DF81" stopOpacity="0.8" />
                  <stop offset="30%" stopColor="#004A2A" stopOpacity="0.9" />
                  <stop offset="80%" stopColor="#050505" stopOpacity="1" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="1" />
                </radialGradient>
                <radialGradient id="lens-core" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="20%" stopColor="#00DF81" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
                </radialGradient>
                <filter id="emerald-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="15" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="emerald-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="25" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g className="animate-glow">
                <circle cx="150" cy="150" r="3" fill="#00DF81" className="animate-float" filter="url(#emerald-glow)" />
                <circle cx="650" cy="200" r="5" fill="#00DF81" className="animate-float-reverse" filter="url(#emerald-glow)" opacity="0.6"/>
                <circle cx="200" cy="450" r="4" fill="#00DF81" className="animate-float-delayed" filter="url(#emerald-glow)" opacity="0.4"/>
                <circle cx="600" cy="480" r="2" fill="#00DF81" className="animate-float" filter="url(#emerald-glow)" />
              </g>
              <g className="spin-origin-center">
                <ellipse cx="400" cy="320" rx="350" ry="120" fill="none" stroke="#00DF81" strokeWidth="1" opacity="0.15" transform="rotate(-15 400 320)" className="animate-ring-1" />
                <ellipse cx="400" cy="320" rx="300" ry="90" fill="none" stroke="#00DF81" strokeWidth="1" opacity="0.1" transform="rotate(25 400 320)" className="animate-ring-2" />
                <circle cx="400" cy="320" r="240" fill="none" stroke="#00DF81" strokeWidth="0.5" strokeDasharray="10 10" opacity="0.2" className="animate-ring-1" />
              </g>
              <g>
                <path d="M 330 180 Q 400 130 470 180 L 500 200 L 300 200 Z" fill="url(#matte-metal)" stroke="#333" strokeWidth="1"/>
                <path d="M 200 240 Q 200 200 240 200 L 560 200 Q 600 200 620 240 L 640 400 Q 650 480 580 480 L 220 480 Q 150 480 180 380 Z" fill="url(#matte-metal)" stroke="#2a2a2a" strokeWidth="2" filter="drop-shadow(0px 30px 40px rgba(0,0,0,0.8))" />
                <path d="M 200 240 Q 180 300 180 380 Q 150 480 220 480 L 280 480 Q 260 380 270 240 Z" fill="url(#grip-metal)" />
                <path d="M 230 220 Q 260 210 280 230" fill="none" stroke="#ff3333" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
                <rect x="210" y="185" width="40" height="15" rx="5" fill="#111" stroke="#333" strokeWidth="1" />
                <ellipse cx="230" cy="185" rx="15" ry="5" fill="#00DF81" opacity="0.3" filter="url(#emerald-glow)" />
                <rect x="270" y="190" width="30" height="10" rx="2" fill="#222" />
                <rect x="520" y="180" width="60" height="20" rx="3" fill="#111" stroke="#333" strokeWidth="1" strokeDasharray="2 2"/>
                <rect x="590" y="190" width="20" height="10" rx="2" fill="#222" />
              </g>
              <g>
                <circle cx="420" cy="330" r="155" fill="#0a0a0a" stroke="#222" strokeWidth="4" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.9))"/>
                <circle cx="420" cy="330" r="140" fill="none" stroke="#1a1a1a" strokeWidth="15" strokeDasharray="4 4" />
                <circle cx="420" cy="330" r="125" fill="#050505" stroke="#333" strokeWidth="2" />
                <circle cx="420" cy="330" r="115" fill="#000" stroke="#111" strokeWidth="3" />
                <circle cx="420" cy="330" r="100" fill="url(#lens-glass)" />
                <circle cx="420" cy="330" r="40" fill="url(#lens-core)" />
                <circle cx="420" cy="330" r="25" fill="#000" stroke="#00DF81" strokeWidth="0.5" filter="url(#emerald-glow-strong)" className="animate-glow" />
                <path d="M 340 270 A 95 95 0 0 1 480 250 A 90 90 0 0 0 340 270 Z" fill="#ffffff" opacity="0.15" />
                <path d="M 370 400 A 80 80 0 0 0 490 380 A 75 75 0 0 1 370 400 Z" fill="#00DF81" opacity="0.2" />
                <path id="text-path" d="M 330 330 A 90 90 0 1 1 510 330" fill="none" />
                <text fill="#ffffff" opacity="0.4" fontSize="10" letterSpacing="4">
                  <textPath href="#text-path" startOffset="15%">FE 24-70mm F2.8 GM</textPath>
                </text>
              </g>
              <g className="animate-glow">
                <rect x="250" y="280" width="10" height="2" fill="#00DF81" opacity="0.8" />
                <rect x="250" y="290" width="15" height="2" fill="#00DF81" opacity="0.4" />
                <circle cx="610" cy="300" r="3" fill="none" stroke="#00DF81" strokeWidth="1" opacity="0.6"/>
                <circle cx="610" cy="300" r="1" fill="#00DF81" opacity="0.8"/>
                <path d="M 610 305 L 610 320 L 590 320" fill="none" stroke="#00DF81" strokeWidth="1" opacity="0.4" />
              </g>
            </svg>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 relative z-10 text-white tracking-tight">
            Where Creators <span className="text-[#00DF81]" style={{ textShadow: '0 0 20px rgba(0,223,129,0.4)' }}>forge</span> their Visions
          </h1>
          <p className="text-lg md:text-xl text-[#ffffff]/80 max-w-2xl relative z-10 font-medium">
            Rent premium audio-visual equipment. Cameras, Lenses, Lights, and more. <br className="hidden md:block" /> Powering smarter shoots.
          </p>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#00DF81]/10 to-transparent pointer-events-none z-0"></div>
        </div>

        {/* FEATURED EQUIPMENT */}
        <section className="mt-16 bg-[#000000] w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <p className="text-[#00DF81] font-bold text-[11px] tracking-widest uppercase mb-2">Trending Gear</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Featured Equipment</h2>
              <p className="text-[#ffffff]/60 font-medium text-[15px]">Top-rated gear chosen by professional creators.</p>
            </div>
            <Link to="/products" className="flex items-center text-[#00DF81] font-bold text-[15px] mt-4 md:mt-0 hover:opacity-80 transition group">
              View Full Catalog
              <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[#00DF81]" />
            </div>
          )}

          {error && !isLoading && (
            <div className="flex items-center justify-center py-20 text-center">
              <div>
                <p className="text-[#ffffff]/40 text-sm mb-2">Could not load products</p>
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="border border-[#ffffff]/10 rounded-2xl overflow-hidden bg-[#121212] flex flex-col hover:border-[#00DF81]/50 hover:shadow-[0_0_20px_rgba(0,223,129,0.1)] transition-all duration-300 group">

                  <div className="relative h-36 sm:h-48 xl:h-56 w-full bg-[#000000] flex items-center justify-center p-3 sm:p-6 border-b border-[#ffffff]/5">
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#121212]/90 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[8px] sm:text-[10px] font-bold text-white shadow-sm z-10 border border-[#ffffff]/10">
                      {getCategoryName(product.category_id)}
                    </span>

                    {productImages[product.id] ? (
                      <img
                        src={productImages[product.id]}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart size={40} className="text-[#ffffff]/10" />
                      </div>
                    )}

                    {getBrandName(product.brand_id) && (
                      <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#121212]/90 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[8px] sm:text-[10px] font-bold text-[#00DF81] shadow-sm z-10 border border-[#ffffff]/10">
                        {getBrandName(product.brand_id)}
                      </span>
                    )}
                  </div>

                  <div className="p-3 sm:p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-xs sm:text-[14px] xl:text-[15px] leading-snug mb-3 sm:mb-6 text-white line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <p className="text-[8px] sm:text-[10px] text-[#ffffff]/40 font-bold mb-0.5 sm:mb-1 uppercase tracking-wider">Daily Rate</p>
                        <p className="text-sm sm:text-lg xl:text-xl font-black text-[#00DF81]">₹{product.daily_rate}</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#ffffff]/5 border border-[#ffffff]/10 text-white font-bold py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-full flex items-center gap-1.5 sm:gap-2 hover:bg-[#00DF81] hover:border-[#00DF81] hover:text-[#000000] transition-colors shadow-sm"
                      >
                        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                        <span className="text-[11px] sm:text-[13px]">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && featuredProducts.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <p className="text-[#ffffff]/40 text-sm">No products available right now.</p>
            </div>
          )}
        </section>

        {/* BRANDS MARQUEE */}
        <section className="mt-20 mb-10 w-full border-t border-[#ffffff]/10 pt-16 overflow-hidden">
          <div className="mb-10">
            <p className="text-[#00DF81] font-bold text-[11px] tracking-widest uppercase mb-2">Industry Standard</p>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Premium Brands We Stock</h2>
          </div>
          <div className="relative w-full overflow-hidden flex items-center h-20 group">
            <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-[#000000] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-[#000000] to-transparent z-10"></div>
            <div className="animate-scroll flex gap-16 md:gap-24 items-center">
              {[...brandNames, ...brandNames].map((brand, index) => (
                <div key={index} className="text-2xl md:text-4xl font-black tracking-tighter text-[#ffffff]/20 hover:text-[#00DF81] transition-colors duration-300 cursor-pointer">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* TOAST */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#121212] border border-[#00DF81]/30 text-white px-5 py-3 rounded-full shadow-[0_0_30px_rgba(0,223,129,0.15)] flex items-center gap-3 backdrop-blur-md">
          <div className="bg-[#00DF81] text-[#000000] rounded-full p-1 border border-[#00DF81]">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="text-sm font-bold tracking-wide">
            <span className="text-[#00DF81]">{toast.productName}</span> added to cart!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;