import React, { useState, useEffect } from 'react';
import { ShoppingCart, Filter, Search, Check, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productService, categoryService, brandService, getApiError } from '../api/services';

const Products = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, productName: '' });

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsData, categoriesData, brandsData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
          brandService.getAll(),
        ]);

        const available = productsData.filter((p) => p.is_active && p.is_available);
        setProducts(available);
        setCategories(categoriesData);
        setBrands(brandsData);

        // Fetch images for all products
        const imageMap = {};
        await Promise.allSettled(
          available.map(async (product) => {
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
    fetchAll();
  }, []);

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || '';
  const getBrandName = (id) => brands.find((b) => b.id === id)?.name || '';

const handleAddToCart = (product) => {
  addToCart({
    ...product,
    image_url: productImages[product.id] || '',
  });
  setToast({ show: true, productName: product.name });
  setTimeout(() => setToast({ show: false, productName: '' }), 3000);
};


  const displayedProducts = products.filter((product) => {
    const categoryName = getCategoryName(product.category_id);
    const brandName = getBrandName(product.brand_id);
    const matchesCategory = activeCategory === 'All' || categoryName === activeCategory;
    const matchesBrand = activeBrand === 'All' || brandName === activeBrand;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brandName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  const clearFilters = () => {
    setActiveCategory('All');
    setActiveBrand('All');
    setSearchTerm('');
  };

  return (
    <div className="bg-[#000000] text-white flex-1 flex flex-col pt-16 pb-12 relative overflow-hidden">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 2xl:px-32 flex-1 flex flex-col">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#ffffff]/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
              Equipment <span className="text-[#00DF81]">Catalog</span>
            </h1>
            <p className="text-[#ffffff]/60 font-medium max-w-xl text-[15px]">
              Browse our entire inventory. Everything you need for your next shoot is right here.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ffffff]/40" />
            <input
              type="text"
              placeholder="Search gear..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121212] border border-[#ffffff]/10 rounded-full pl-12 pr-4 py-4 focus:outline-none focus:border-[#00DF81] text-base text-white transition-all shadow-inner"
            />
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-4 pb-2">
          <div className="flex items-center gap-2 bg-[#ffffff]/5 px-4 py-2 rounded-full border border-[#ffffff]/10 shrink-0 text-[#ffffff]/60">
            <Filter size={16} />
            <span className="text-sm font-bold uppercase tracking-widest">Category</span>
          </div>
          <div className="w-[1px] h-6 bg-[#ffffff]/10 mx-1 shrink-0" />
          <button
            onClick={() => setActiveCategory('All')}
            className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition-all border ${
              activeCategory === 'All'
                ? 'bg-[#00DF81]/10 border-[#00DF81]/30 text-[#00DF81]'
                : 'bg-[#121212] border-[#ffffff]/10 text-[#ffffff]/60 hover:text-white hover:border-[#ffffff]/30'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                activeCategory === cat.name
                  ? 'bg-[#00DF81]/10 border-[#00DF81]/30 text-[#00DF81]'
                  : 'bg-[#121212] border-[#ffffff]/10 text-[#ffffff]/60 hover:text-white hover:border-[#ffffff]/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* BRAND FILTERS */}
        {brands.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
            <div className="flex items-center gap-2 bg-[#ffffff]/5 px-4 py-2 rounded-full border border-[#ffffff]/10 shrink-0 text-[#ffffff]/60">
              <Filter size={16} />
              <span className="text-sm font-bold uppercase tracking-widest">Brand</span>
            </div>
            <div className="w-[1px] h-6 bg-[#ffffff]/10 mx-1 shrink-0" />
            <button
              onClick={() => setActiveBrand('All')}
              className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                activeBrand === 'All'
                  ? 'bg-[#00DF81]/10 border-[#00DF81]/30 text-[#00DF81]'
                  : 'bg-[#121212] border-[#ffffff]/10 text-[#ffffff]/60 hover:text-white hover:border-[#ffffff]/30'
              }`}
            >
              All
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setActiveBrand(brand.name)}
                className={`shrink-0 px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                  activeBrand === brand.name
                    ? 'bg-[#00DF81]/10 border-[#00DF81]/30 text-[#00DF81]'
                    : 'bg-[#121212] border-[#ffffff]/10 text-[#ffffff]/60 hover:text-white hover:border-[#ffffff]/30'
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={36} className="animate-spin text-[#00DF81]" />
          </div>
        )}

        {/* ERROR */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-[#ffffff]/40 text-sm mb-1">Failed to load products</p>
            <p className="text-red-400 text-xs">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-[#00DF81] font-bold text-sm hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-[#ffffff]/10 rounded-2xl overflow-hidden bg-[#121212] flex flex-col hover:border-[#00DF81]/50 hover:shadow-[0_0_20px_rgba(0,223,129,0.1)] transition-all duration-300 group"
                >
                  <div className="relative h-36 sm:h-48 xl:h-56 w-full bg-[#000000] flex items-center justify-center p-3 sm:p-6 border-b border-[#ffffff]/5">
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#121212]/90 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[8px] sm:text-[10px] font-bold text-white shadow-sm z-10 border border-[#ffffff]/10">
                      {getCategoryName(product.category_id) || 'Gear'}
                    </span>

                    {productImages[product.id] ? (
                      <img
                        src={productImages[product.id]}
                        alt={product.name}
                        className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
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

            {/* EMPTY STATE */}
            {displayedProducts.length === 0 && (
              <div className="text-center py-20 border border-[#ffffff]/10 rounded-2xl bg-[#121212]">
                <p className="text-[#ffffff]/60 font-medium">
                  {searchTerm
                    ? `No equipment found matching "${searchTerm}"`
                    : 'No equipment found for the selected filters.'}
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[#00DF81] font-bold hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
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

export default Products;