import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toZonedTime } from 'date-fns-tz';

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
    const NIGERIA_TIMEZONE = 'Africa/Lagos';

    // Load or initialize a persistent target date (50 days from first visit)
    let targetMs: number;
    const savedTarget = localStorage.getItem('reunionTargetMs');

    if (savedTarget) {
      targetMs = parseInt(savedTarget, 10);
    } else {
      const nowInNigeria = toZonedTime(new Date(), NIGERIA_TIMEZONE);
      const targetDate = new Date(nowInNigeria);
      targetDate.setDate(targetDate.getDate() + 50); // add 50 days
      targetMs = targetDate.getTime();
      localStorage.setItem('reunionTargetMs', String(targetMs));
    }

    const timer = setInterval(() => {
      const currentNigeriaTime = toZonedTime(new Date(), NIGERIA_TIMEZONE);
      const distance = targetMs - currentNigeriaTime.getTime();

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer); // stop once finished
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold text-gradient-romantic animate-pulse-heart">
          Until We're Together Again
        </h1>
        <p className="text-lg text-muted-foreground">
          David & Shalom&apos;s Reunion Countdown ✨
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds },
        ].map((item) => (
          <Card
            key={item.label}
            className="p-6 bg-gradient-romantic text-primary-foreground shadow-soft"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold animate-glow-romantic">
                {item.value.toString().padStart(2, '0')}
              </div>
              <div className="text-sm opacity-90 mt-1">{item.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center space-x-2 text-2xl animate-pulse-heart">
        <span>💕</span>
        <span>💖</span>
        <span>💕</span>
      </div>
    </div>
  );
};

export default CountdownTimer;