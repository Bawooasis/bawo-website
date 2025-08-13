
import { TAILWIND_COLORS } from "../constants/colors";

const Logo = () => {
  return (
        <div
      className={`font-museo-bold text-7xl [filter:drop-shadow(0_2px_2px_rgb(0_0_0_/_0.4))] ${TAILWIND_COLORS.primary.text}`}
    >
      BAWO
    </div>
  );
};

export default Logo;
