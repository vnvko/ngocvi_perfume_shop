// Trang chủ — Hero Banner, FeaturedProducts, Categories, Blog Preview
import HeroBanner from '../../components/Home/HeroBanner';
import CategoryHighlights from '../../components/Home/CategoryHighlights';
import FeaturedProducts from '../../components/Home/FeaturedProducts';
import GenderCollections from '../../components/Home/GenderCollections';
import QuizSection from '../../components/Home/QuizSection';
import BlogPreview from '../../components/Home/BlogPreview';
import BrandCommitments from '../../components/Home/BrandCommitments';

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <CategoryHighlights />
      <FeaturedProducts />
      <GenderCollections />
      <QuizSection />
      <BlogPreview />
      <BrandCommitments />
    </main>
  );
}
