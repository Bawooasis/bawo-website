import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Find the next December 1st at midnight UTC from today
    const getNextLaunchDate = () => {
      const now = new Date();
      const currentYear = now.getUTCFullYear();
      const decemberFirstThisYear = Date.UTC(currentYear, 11, 1, 0, 0, 0);
      // If we're past this year's Dec 1, roll to next year so the timer never sits at zero
      const target =
        now.getTime() > decemberFirstThisYear
          ? Date.UTC(currentYear + 1, 11, 1, 0, 0, 0)
          : decemberFirstThisYear;
      return target;
    };

    let launchDate = getNextLaunchDate();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // Recompute launch date to keep timer rolling year over year
        launchDate = getNextLaunchDate();
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 text-white">
      <div className="flex items-center gap-1 md:gap-2">
        <span className="text-2xl md:text-3xl lg:text-4xl font-museo-bold text-[#ff7f39]">
          {timeLeft.days}
        </span>
        <span className="text-base md:text-lg font-museo-medium">Days</span>
      </div>
      <span className="text-xl md:text-2xl font-museo-bold">•</span>
      <div className="flex items-center gap-1 md:gap-2">
        <span className="text-2xl md:text-3xl lg:text-4xl font-museo-bold text-[#ff7f39]">
          {timeLeft.hours}
        </span>
        <span className="text-base md:text-lg font-museo-medium">Hours</span>
      </div>
      <span className="text-xl md:text-2xl font-museo-bold">•</span>
      <div className="flex items-center gap-1 md:gap-2">
        <span className="text-2xl md:text-3xl lg:text-4xl font-museo-bold text-[#ff7f39]">
          {timeLeft.minutes}
        </span>
        <span className="text-base md:text-lg font-museo-medium">Minutes</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
