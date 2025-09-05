'use client';

import { useState, useEffect } from 'react';

export const Countdown = () => {
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="mb-4 text-lg font-semibold text-black/80 tracking-wider uppercase">
      <span className="ml-2">{String(timeLeft.hours + timeLeft.days * 24).padStart(2, '0')}</span>
      <span className="ml-1 text-sm">Hours</span>
      <span className="ml-2">{String(timeLeft.minutes).padStart(2, '0')}</span>
      <span className="ml-1 text-sm">Minutes</span>
      <span className="ml-2">{String(timeLeft.seconds).padStart(2, '0')}</span>
      <span className="ml-1 text-sm">Seconds</span>
      <span className="ml-1 text-sm">remaining</span>
    </div>
  );
};
