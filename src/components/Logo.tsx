
import { IMAGES } from "../constants/images";

const Logo = () => {
  return (
    <div className="relative">
      <img
        src={IMAGES.assets.logo}
        alt="BAWO Logo"
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-105"
      />
    </div>
  );
};

export default Logo;
