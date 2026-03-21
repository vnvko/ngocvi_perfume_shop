# NGOCVI Perfume Boutique

Website bán nước hoa cao cấp — React + Vite + Tailwind CSS.

## Cài đặt

```bash
npm install
npm run dev
```

## Cấu trúc thư mục

```
src/
├── components/
│   ├── layout/         # TopBar, Header, Footer
│   ├── Home/           # HeroBanner, CategoryHighlights, FeaturedProducts...
│   ├── Product/        # ProductCard, ProductGallery
│   └── ui/             # Button, Modal
├── context/
│   └── CartContext.jsx # Giỏ hàng & Wishlist (React Context)
├── data/
│   └── products.js     # Mock data: sản phẩm, brands, blog, formatPrice...
├── pages/
│   ├── Home/           # HomePage
│   ├── Products/       # ProductList (với filter, sort, pagination)
│   ├── ProductDetail/  # ProductDetail (gallery, size, tabs, reviews)
│   ├── Cart/           # (TODO)
│   ├── Checkout/       # (TODO)
│   ├── Profile/        # (TODO)
│   ├── Auth/           # (TODO)
│   └── Blog/           # (TODO)
└── routes/
    └── AppRoutes.jsx
```

## Tính năng đã có

- ✅ TopBar với thông tin hotline & ngôn ngữ
- ✅ Header responsive với search overlay, mobile menu
- ✅ Hero Banner tự động chuyển slide
- ✅ Category Highlights (Nam / Nữ / Unisex / Thương Hiệu)
- ✅ Featured Products với tabs (Best Seller / New / Trending)
- ✅ Gender Collections banner (For Him / For Her)
- ✅ Quiz Section CTA
- ✅ Blog Preview
- ✅ Brand Commitments
- ✅ Footer đầy đủ
- ✅ ProductList với filter sidebar (giá, thương hiệu, mùi hương, dung tích), sort, pagination
- ✅ ProductDetail với image gallery, size selector, add to cart, wishlist, tabs, reviews, related products
- ✅ Cart Context (add/remove/update, wishlist)
- ✅ Mobile responsive

## TODO (các trang tiếp theo)

- Cart page
- Checkout page
- Profile / Orders / Address / Password pages
- Login / Register pages
- Blog List & Detail
- Quiz
