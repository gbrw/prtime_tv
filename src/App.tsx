import { useEffect, useState } from 'react';
import prayerData from './data/ramadi_prtime.json';
import { PrayerData, DailyPrayer, PrayerName } from './types/prayer';
import {
  getPrayerTimesForDate,
  getNextPrayer,
  getTimeRemaining,
  getHijriDate,
  formatGregorianDate,
} from './utils/prayerTimes';
import PrayerCard from './components/PrayerCard';
import TimeRemaining from './components/TimeRemaining';
import DateDisplay from './components/DateDisplay';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayPrayers, setTodayPrayers] = useState<DailyPrayer | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{
    name: PrayerName;
    time: string;
  } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const data = prayerData as PrayerData;

  useEffect(() => {
    const prayers = getPrayerTimesForDate(data, currentTime);
    setTodayPrayers(prayers);

    if (prayers) {
      const next = getNextPrayer(prayers, currentTime);
      setNextPrayer(next);

      if (next) {
        const remaining = getTimeRemaining(next.time, currentTime);
        setTimeRemaining(remaining);
      }
    }
  }, [currentTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (!todayPrayers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-4xl">جاري التحميل...</p>
      </div>
    );
  }

  const prayers: Array<{ name: PrayerName; time: string }> = [
    { name: 'الفجر', time: todayPrayers.الفجر },
    { name: 'الشروق', time: todayPrayers.الشروق },
    { name: 'الظهر', time: todayPrayers.الظهر },
    { name: 'العصر', time: todayPrayers.العصر },
    { name: 'المغرب', time: todayPrayers.المغرب },
    { name: 'العشاء', time: todayPrayers.العشاء },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 overflow-hidden flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-[3840px] h-full flex flex-col justify-between py-4">
        <div className="flex-shrink-0">
          <DateDisplay
            hijriDate={getHijriDate(currentTime)}
            gregorianDate={formatGregorianDate(currentTime)}
          />
        </div>

        {nextPrayer && (
          <div className="flex-shrink-0">
            <TimeRemaining
              timeRemaining={timeRemaining}
              nextPrayerName={nextPrayer.name}
            />
          </div>
        )}

        <div className="flex-1 min-h-0">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 h-full">
            {prayers.map((prayer) => (
              <PrayerCard
                key={prayer.name}
                name={prayer.name}
                time={prayer.time}
                isNext={nextPrayer?.name === prayer.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
