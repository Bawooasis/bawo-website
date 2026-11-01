import { IMAGES } from '../constants/images';

const Logo = () => {
  return (
    <div className="relative inline-flex items-center gap-2">
      <img
        src={IMAGES.assets.mark}
        alt=""
        className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
        aria-hidden
      />
      <span className="bawo-site-logo__wordmark text-[1.35rem] sm:text-[1.5rem] md:text-[1.65rem] transition-transform duration-300 hover:scale-[1.02]">
        BawoSocial
      </span>
      <img
        src={IMAGES.assets.logo}
        alt="BawoSocial"
        className="sr-only"
      />
    </div>
  );
};

export default Logo;
