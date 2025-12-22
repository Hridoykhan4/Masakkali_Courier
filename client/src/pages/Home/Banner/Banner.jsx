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
    <div>
      <Carousel
        showThumbs={false}
        autoPlay={true}
        interval={4000}
        infiniteLoop={true}
        
        // className="min-h-125"
      >
        {images.map((img, i) => (
          <img className="object-cover" key={i} src={img} />
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
