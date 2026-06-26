import { IMAGES } from '../constants/images';

const Logo = () => {
  return (
    <div className="relative">
      <img
        src={IMAGES.assets.logo}
        alt="BawoSocial"
        className="h-auto w-[8.5rem] sm:w-[9.5rem] md:w-[10.5rem] transition-all duration-300 hover:scale-[1.02]"
      />
    </div>
  );
};

export default Logo;
