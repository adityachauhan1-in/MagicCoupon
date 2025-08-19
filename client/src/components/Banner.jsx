import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCoupons } from "../Context/CouponContext";

const settings = {
  dots: true,
  infinite: true,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 2000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export const Banners = () => {
  const { searchInput, selectedCategory } = useCoupons();

  return (
    <>
      {searchInput.trim() === "" && selectedCategory === "All" && (
        <div className="w-full max-w-[1200px] mx-auto my-4">
          <Slider {...settings}>
            <div className="h-[200px] md:h-[320px] lg:h-[360px]">
              <img src={banner1} alt="Offer 1" className="w-full h-full object-cover rounded-2xl shadow-lg" />
            </div>
            <div className="h-[200px] md:h-[320px] lg:h-[360px]">
              <img src={banner2} alt="Offer 2" className="w-full h-full object-cover rounded-2xl shadow-lg" />
            </div>
            <div className="h-[200px] md:h-[320px] lg:h-[360px]">
              <img src={banner3} alt="Offer 3" className="w-full h-full object-cover rounded-2xl shadow-lg" />
            </div>
            <div className="h-[200px] md:h-[320px] lg:h-[360px]">
              <img src={banner4} alt="Offer 3" className="w-full h-full object-cover rounded-2xl shadow-lg" />
            </div>
          </Slider>
        </div>
      )}
    </>
  );
};
