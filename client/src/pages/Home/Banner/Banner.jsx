import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import img1 from "../../../assets/banner/banner1.png";
import img2 from "../../../assets/banner/banner2.png";
import img3 from "../../../assets/banner/banner3.png";
import img4 from "../../../assets/banner/ari-sha-RqZ-xGRnCYI-unsplash (1).jpg";
import img5 from "../../../assets/banner/claudio-schwarz-q8kR_ie6WnI-unsplash (1).jpg";
import img6 from "../../../assets/banner/jan-kopriva-b6fns2kOFsk-unsplash (1).jpg";
const Banner = () => {
  const images = [img1, img2, img3, img4, img5, img6];

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      <Carousel
        autoPlay
        infiniteLoop
        swipeable
        showThumbs={false}
        showStatus={false}
        interval={3500}
        transitionTime={800}
        stopOnHover
        emulateTouch
      >
        {images.map((image, i) => (
          <div className="relative h-[70vh] md:h-[85vh]" key={i}>
            <img
              src={image}
              alt={`Banner-${i}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black-40 to-black/50"></div>
              <div className="absolute inset-0 flex items-center justify-center px-6 md:px-16">

            <div className="max-w-xl text-white space-y-4">
              <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                Fast & Reliable <br /> Courier Service
              </h2>
              <p className="text-sm md:text-base text-gray-200">
                Delivering trust, speed, and safety across the country.
              </p>
            </div>

              </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
