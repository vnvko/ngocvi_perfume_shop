// Trang danh sách sản phẩm — filter thương hiệu/giá/dung tích, sort, pagination
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ProductCard from '../../components/Product/ProductCard';
import { productAPI } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';

// Sort options — labels via i18n in component

const sizes = ['30ml', '50ml', '60ml', '100ml', '200ml'];

const categoryBanners = {
  'nuoc-hoa-nam': { title: 'NƯỚC HOA NAM', subtitle: 'MẠNH MẼ – LỊCH LÃM – CUỐN HÚT', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1400&q=80' },
  'nuoc-hoa-nu': { title: 'NƯỚC HOA NỮ', subtitle: 'QUYẾN RŨ – THANH LỊCH – ĐỘC ĐÁO', image: '/uploads/products/1775902581803-570817.jpg' },
  'unisex': { title: 'UNISEX FRAGRANCE', subtitle: 'CÁ TÍNH – ĐỘC ĐÁO – TỰ DO', image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1400&q=80' },
};

function AccordionFilter({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-light-secondary py-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <span className="text-xs tracking-widest uppercase font-sans font-medium text-dark">{title}</span>
        {open ? <FiChevronUp size={14} className="text-muted" /> : <FiChevronDown size={14} className="text-muted" />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function ProductList() {
  const sortOptions = [
    { value: 'newest',     label: "Mới nhất" },
    { value: 'price-asc',  label: "Giá: Thấp → Cao" },
    { value: 'price-desc', label: "Giá: Cao → Thấp" },
    { value: 'rating',     label: "Đánh giá cao nhất" },
    { value: 'popular',    label: "Phổ biến nhất" },
  ];
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const searchQ = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState('newest');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState(10000000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  // Map gender filter
  const genderMap = { 'nuoc-hoa-nam': 'male', 'nuoc-hoa-nu': 'female', 'unisex': 'unisex' };
  const gender = genderMap[category] || '';

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: PER_PAGE, sort, search: searchQ };
      if (category && !gender) params.category = category;
      if (selectedGenders.length) params.gender = selectedGenders.join(',');
      else if (gender) params.gender = gender;
      if (selectedBrands.length) params.brand = selectedBrands.join(',');
      if (priceRange < 10000000) params.maxPrice = priceRange;

      const res = await productAPI.getAll(params);
      setProducts(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      console.error('Fetch products error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, searchQ, category, gender, selectedBrands, selectedGenders, priceRange]);

  useEffect(() => {
    setSelectedGenders(gender ? [gender] : []);
    setPage(1);
  }, [gender]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    productAPI.getBrands().then(res => setBrands(res.data.brands || [])).catch(() => {});
    productAPI.getCategories().then(res => setCategories(res.data.categories || [])).catch(() => {});
  }, []);

  const toggleFilter = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PER_PAGE);
  const banner = categoryBanners[category];

  const Filters = () => (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs tracking-widest uppercase font-sans font-medium">Bộ Lọc</h3>
        {(selectedBrands.length > 0 || selectedGenders.length > 0 || selectedSizes.length > 0 || priceRange < 10000000) && (
          <button
            onClick={() => {
              setSelectedBrands([]);
              setSelectedGenders(gender ? [gender] : []);
              setSelectedSizes([]);
              setPriceRange(10000000);
              setPage(1);
            }}
            className="text-[10px] text-primary underline font-sans"
          >
            Xóa lọc
          </button>
        )}
      </div>

      <AccordionFilter title="Khoảng Giá">
        <input type="range" min={500000} max={10000000} step={100000} value={priceRange}
          onChange={e => { setPriceRange(Number(e.target.value)); setPage(1); }}
          className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted font-sans mt-1">
          <span>0đ</span>
          <span>{new Intl.NumberFormat('vi-VN').format(priceRange)}đ</span>
        </div>
      </AccordionFilter>

      <AccordionFilter title="Thương Hiệu">
        <div className="space-y-2.5">
          {brands.map(b => (
            <label key={b.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={selectedBrands.includes(String(b.id))}
                onChange={() => toggleFilter(selectedBrands, setSelectedBrands, String(b.id))}
                className="accent-primary w-3.5 h-3.5" />
              <span className="text-sm font-sans text-dark group-hover:text-primary transition-colors">{b.name}</span>
              <span className="text-muted text-xs ml-auto">({b.product_count})</span>
            </label>
          ))}
        </div>
      </AccordionFilter>

      <AccordionFilter title="Giới Tính">
        <div className="space-y-2.5">
          {[
            { id: 'male', label: 'Nam' },
            { id: 'female', label: 'Nữ' },
            { id: 'unisex', label: 'Unisex' },
          ].map((g) => (
            <label key={g.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedGenders.includes(g.id)}
                onChange={() => toggleFilter(selectedGenders, setSelectedGenders, g.id)}
                className="accent-primary w-3.5 h-3.5"
              />
              <span className="text-sm font-sans text-dark group-hover:text-primary transition-colors">{g.label}</span>
            </label>
          ))}
        </div>
      </AccordionFilter>

      <AccordionFilter title="Dung Tích">
        <div className="flex flex-wrap gap-2">
          {sizes.map(s => (
            <button key={s} onClick={() => toggleFilter(selectedSizes, setSelectedSizes, s)}
              className={`px-3 py-1.5 text-xs font-sans border transition-all ${selectedSizes.includes(s) ? 'border-primary bg-primary text-white' : 'border-light-secondary text-dark hover:border-primary hover:text-primary'}`}>
              {s}
            </button>
          ))}
        </div>
      </AccordionFilter>
    </aside>
  );

  return (
    <div>
      {banner && (
        <div className="relative h-56 md:h-72 overflow-hidden">
          <img src={mediaUrl(banner.image)} alt={banner.title} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-dark/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <h1 className="font-display text-2xl md:text-4xl tracking-wider">{banner.title}</h1>
            <p className="text-[11px] tracking-[0.3em] mt-2 text-white/70 font-sans">{banner.subtitle}</p>
          </div>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4">
        <nav className="text-xs font-sans text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-dark transition-colors">Trang chủ</Link>
          <span>/</span>
          {searchQ ? (
            <span className="text-dark">{`Tìm: "${searchQ}"`}</span>
          ) : (
            <div className="relative group">
              <span className="text-dark cursor-pointer inline-flex items-center gap-1">
                {categories.find(c => c.slug === category)?.name || 'Tất cả sản phẩm'}
                <FiChevronDown size={12} className="text-muted" />
              </span>
              <div className="absolute left-0 top-full mt-1 z-20 hidden group-hover:block min-w-48 bg-white border border-light-secondary shadow-md">
                <Link to="/products" className="block px-3 py-2 text-xs text-dark hover:bg-light-secondary/50">
                  Tất cả sản phẩm
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/products?category=${c.slug}`}
                    className="block px-3 py-2 text-xs text-dark hover:bg-light-secondary/50"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex gap-8">
          <div className="hidden md:block w-56 flex-shrink-0"><Filters /></div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-light-secondary">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileFilterOpen(true)} className="md:hidden flex items-center gap-2 text-xs tracking-widest uppercase font-sans border border-dark px-3 py-2">
                  <FiFilter size={13} /> Bộ lọc
                </button>
                <span className="text-sm text-muted font-sans">
                  {loading ? 'Đang tải...' : <><strong className="text-dark">{total}</strong> sản phẩm</>}
                </span>
              </div>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                className="text-xs font-sans border border-light-secondary bg-light px-3 py-2 outline-none cursor-pointer">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-light-secondary mb-3" />
                    <div className="h-3 bg-light-secondary rounded mb-2 w-3/4" />
                    <div className="h-3 bg-light-secondary rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                {products.map(p => <ProductCard key={p.id} product={p} allProducts={products} />)}
              </div>
            ) : (
              <div className="text-center py-20 text-muted font-sans">
                <p className="text-lg mb-2">Không tìm thấy sản phẩm</p>
                <p className="text-sm">Thử điều chỉnh bộ lọc hoặc từ khoá tìm kiếm</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-9 h-9 border border-light-secondary flex items-center justify-center text-sm text-muted disabled:opacity-30 hover:border-primary hover:text-primary transition-colors">←</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 border text-xs font-sans transition-colors ${p === page ? 'border-primary bg-primary text-white' : 'border-light-secondary text-dark hover:border-primary hover:text-primary'}`}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-9 h-9 border border-light-secondary flex items-center justify-center text-sm text-muted disabled:opacity-30 hover:border-primary hover:text-primary transition-colors">→</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-dark/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="w-72 bg-light h-full overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg">Bộ Lọc</h3>
              <button onClick={() => setMobileFilterOpen(false)}><FiX size={20} /></button>
            </div>
            <Filters />
            <button onClick={() => setMobileFilterOpen(false)} className="btn-primary w-full text-center mt-6">Áp Dụng</button>
          </div>
        </div>
      )}
    </div>
  );
}
