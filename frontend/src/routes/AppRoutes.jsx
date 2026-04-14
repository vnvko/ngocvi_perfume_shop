// Định tuyến toàn bộ ứng dụng (store + admin) — bảo vệ route admin bằng AdminGuard
import { Routes, Route } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Chatbox from '../pages/Chat/Chatbox';
import AdminGuard from '../components/admin/AdminGuard';

// ── Store ──
import HomePage        from '../pages/Home/HomePage';
import ProductList     from '../pages/Products/ProductList';
import ProductDetail   from '../pages/ProductDetail/ProductDetail';
import Cart            from '../pages/Cart/Cart';
import Checkout        from '../pages/Checkout/Checkout';
import Wishlist        from '../pages/Wishlist/Wishlist';
import Login           from '../pages/Auth/Login';
import Register        from '../pages/Auth/Register';
import Quiz            from '../pages/Quiz/Quiz';
import BlogList        from '../pages/Blog/BlogList';
import BlogDetail      from '../pages/Blog/BlogDetail';
import Contact         from '../pages/Contact/Contact';
import Policy          from '../pages/Policy/Policy';
import OrderDetail     from '../pages/OrderDetail/OrderDetail';
import ReviewProduct   from '../pages/ProductDetail/ReviewProduct';
import ProfileLayout   from '../pages/Profile/ProfileLayout';
import ProfileOverview from '../pages/Profile/ProfileOverview';
import PersonalInfo    from '../pages/Profile/PersonalInfo';
import Orders          from '../pages/Profile/Orders';
import Addresses       from '../pages/Profile/Addresses';
import ChangePassword  from '../pages/Profile/ChangePassword';

// ── Admin ──
import Dashboard          from '../pages/admin/Dashboard/Dashboard';
import AdminProducts      from '../pages/admin/Products/AdminProducts';
import AdminProductForm   from '../pages/admin/Products/AdminProductForm';
import AdminCategories    from '../pages/admin/Categories/AdminCategories';
import AdminCategoryForm  from '../pages/admin/Categories/AdminCategoryForm';
import AdminOrders        from '../pages/admin/Orders/AdminOrders';
import AdminOrderDetail   from '../pages/admin/Orders/AdminOrderDetail';
import AdminInventory     from '../pages/admin/Inventory/AdminInventory';
import AdminUsers         from '../pages/admin/Users/AdminUsers';
import AdminUserDetail    from '../pages/admin/Users/AdminUserDetail';
import AdminReviews       from '../pages/admin/Reviews/AdminReviews';
import AdminBlog          from '../pages/admin/Blog/AdminBlog';
import AdminBlogForm      from '../pages/admin/Blog/AdminBlogForm';
import AdminChatbox       from '../pages/admin/Chatbox/AdminChatbox';
import AdminStats         from '../pages/admin/Stats/AdminStats';
import AdminVouchers      from '../pages/admin/Vouchers/AdminVouchers';
import AdminBrands        from '../pages/admin/Brands/AdminBrands';
import AdminBanners       from '../pages/admin/Banners/AdminBanners';

const NotFound = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
    <div>
      <p className="font-display text-8xl text-primary/20 mb-4">404</p>
      <h1 className="font-display text-3xl text-dark mb-3">Không tìm thấy trang</h1>
      <p className="text-muted font-sans text-sm mb-8">Trang bạn đang tìm kiếm không tồn tại.</p>
      <a href="/" className="btn-primary">Về Trang Chủ</a>
    </div>
  </div>
);

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar /><Header />
      <div className="flex-1">{children}</div>
      <Footer /><Chatbox />
    </div>
  );
}

function AdminRoute({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Full-screen */}
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Store */}
      <Route path="/"               element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/products"         element={<MainLayout><ProductList /></MainLayout>} />
      <Route path="/products/:slug"   element={<MainLayout><ProductDetail /></MainLayout>} />
      <Route path="/products/:slug/review" element={<MainLayout><ReviewProduct /></MainLayout>} />
      <Route path="/cart"             element={<MainLayout><Cart /></MainLayout>} />
      <Route path="/wishlist"       element={<MainLayout><Wishlist /></MainLayout>} />
      <Route path="/quiz"           element={<MainLayout><Quiz /></MainLayout>} />
      <Route path="/blog"           element={<MainLayout><BlogList /></MainLayout>} />
      <Route path="/blog/:slug"     element={<MainLayout><BlogDetail /></MainLayout>} />
      <Route path="/contact"        element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/policy/:section?" element={<MainLayout><Policy /></MainLayout>} />

      {/* Profile */}
      <Route path="/profile" element={<MainLayout><ProfileLayout /></MainLayout>}>
        <Route index            element={<ProfileOverview />} />
        <Route path="info"     element={<PersonalInfo />} />
        <Route path="orders"   element={<Orders />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="password" element={<ChangePassword />} />
      </Route>

      {/* Admin */}
      <Route path="/admin"                       element={<AdminRoute><Dashboard /></AdminRoute>} />

      <Route path="/admin/products"              element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/products/new"          element={<AdminRoute><AdminProductForm /></AdminRoute>} />
      <Route path="/admin/products/:id/edit"     element={<AdminRoute><AdminProductForm /></AdminRoute>} />

      <Route path="/admin/categories"            element={<AdminRoute><AdminCategories /></AdminRoute>} />
      <Route path="/admin/categories/new"        element={<AdminRoute><AdminCategoryForm /></AdminRoute>} />
      <Route path="/admin/categories/:id/edit"   element={<AdminRoute><AdminCategoryForm /></AdminRoute>} />

      <Route path="/admin/orders"                element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/orders/:id"            element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
      <Route path="/admin/inventory"             element={<AdminRoute><AdminInventory /></AdminRoute>} />
      <Route path="/admin/users"                 element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/users/:id"             element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
      <Route path="/admin/reviews"               element={<AdminRoute><AdminReviews /></AdminRoute>} />

      <Route path="/admin/blog"                  element={<AdminRoute><AdminBlog /></AdminRoute>} />
      <Route path="/admin/blog/new"              element={<AdminRoute><AdminBlogForm /></AdminRoute>} />
      <Route path="/admin/blog/:id/edit"         element={<AdminRoute><AdminBlogForm /></AdminRoute>} />

      <Route path="/admin/chatbox"               element={<AdminRoute><AdminChatbox /></AdminRoute>} />
      <Route path="/admin/stats"                 element={<AdminRoute><AdminStats /></AdminRoute>} />
      <Route path="/admin/vouchers"              element={<AdminRoute><AdminVouchers /></AdminRoute>} />
      <Route path="/admin/brands"                element={<AdminRoute><AdminBrands /></AdminRoute>} />
      <Route path="/admin/banners"               element={<AdminRoute><AdminBanners /></AdminRoute>} />

      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  );
}
