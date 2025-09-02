import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner8 from '../assets/banner8.png';
import banner7 from '../assets/banner7.png';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCoupons } from "../Context/CouponContext";
import { ChevronLeft, ChevronRight } from "lucide-react";


const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-1/2 left-2 z-10 cursor-pointer transform -translate-y-1/2 hover:scale-110 transition"
  >
    <ChevronLeft className="text-white w-8 h-8" />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-1/2 right-2 z-10 cursor-pointer transform -translate-y-1/2 hover:scale-110 transition"
  >
    <ChevronRight className="text-white w-8 h-8" />
  </div>
);

const settings = {
  dots: true,
  infinite: true,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 2500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
};

const bannerData = [
  { img: banner1,  },
  { img: banner2,  },
  { img: banner8,  },
  { img: banner7,  },
];

export const Banners = () => {
  const { searchInput, selectedCategory } = useCoupons();

  if (searchInput.trim() !== "" || selectedCategory !== "All") return null;

  return (
    <div className="w-full max-w-[1200px] mx-auto my-6 relative">
      <Slider {...settings}>
        {bannerData.map((banner, index) => (
          <div
            key={index}
            className="h-[180px] md:h-[280px] lg:h-[320px] relative overflow-hidden rounded-2xl shadow-xl"
          >
            <img
              src={banner.img}
              alt={banner.alt}
              className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl flex items-end p-6">
              <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
                {banner.alt}
              </h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
