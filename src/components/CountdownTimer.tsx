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
    const targetDate = new Date('2026-08-01T23:59:59').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
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
