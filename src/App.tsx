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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <DateDisplay
          hijriDate={getHijriDate(currentTime)}
          gregorianDate={formatGregorianDate(currentTime)}
          city={data.المدينة}
        />

        {nextPrayer && (
          <TimeRemaining
            timeRemaining={timeRemaining}
            nextPrayerName={nextPrayer.name}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prayers.map((prayer) => (
            <PrayerCard
              key={prayer.name}
              name={prayer.name}
              time={prayer.time}
              isNext={nextPrayer?.name === prayer.name}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-2xl">
            {data.المصدر}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
