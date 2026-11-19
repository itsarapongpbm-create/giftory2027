import AboutSection from './AboutSection';
import BestSeller from './BestSeller';
import CustomGift from './CustomGift';
import HomeContactSection from './HomeContactSection';
import InstagramFeedSection from './InstagramFeedSection';
import NewArrivals from './NewArrivals';
import PageCover from './PageCover';
import PdmKaikuSection from './PdmKaikuSection';
import ProductCategory from './ProductCategory';
import SpecialIdentityService from './SpecialIdentityService';
import { getHomeCoverImage } from '@/lib/siteSettings';

const HomeContent = async () => {
  const homeCoverImage = await getHomeCoverImage();

  return (
    <div className="mb-8">
      <PageCover imageUrl={homeCoverImage} />
      <BestSeller />
      <CustomGift />
      <ProductCategory />
      <PdmKaikuSection />
      <NewArrivals />
      <SpecialIdentityService />
      <AboutSection />
      <InstagramFeedSection />
      <HomeContactSection />
    </div>
  );
};

export default HomeContent;
