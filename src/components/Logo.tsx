import { IMAGES } from '../constants/images';

const Logo = () => {
  return (
    <div className="relative">
      <img 
        src={IMAGES.assets.logo} 
        alt="BawoSocial - Culture, Connection, Community"
        className="h-24 sm:h-28 md:h-32 lg:h-40 xl:h-48 w-auto drop-shadow-[0_8px_24px_rgba(212,175,55,0.5)] transition-all duration-300 hover:scale-[1.02] hover:drop-shadow-[0_12px_36px_rgba(212,175,55,0.7)]"
        style={{ 
          filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))'
        }}
      />
    </div>
  );
};

export default Logo;
