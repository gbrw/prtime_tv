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
import DateDisplay from './components/DateDisplay';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayPrayers, setTodayPrayers] = useState<DailyPrayer | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{
    name: PrayerName;
    time: string;
  } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [testMode, setTestMode] = useState(false);

  const data = prayerData as PrayerData;

  // دالة لتغيير الوقت للاختبار
  const addMinutes = (minutes: number) => {
    setCurrentTime(prev => new Date(prev.getTime() + minutes * 60000));
  };

  const addHours = (hours: number) => {
    setCurrentTime(prev => new Date(prev.getTime() + hours * 3600000));
  };

  const addDays = (days: number) => {
    setCurrentTime(prev => new Date(prev.getTime() + days * 86400000));
  };

  const resetTime = () => {
    setCurrentTime(new Date());
  };

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

    // الضغط على مفتاح 'T' لإظهار/إخفاء أدوات الاختبار
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        setTestMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!todayPrayers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-4xl">جاري التحميل...</p>
      </div>
    );
  }

  // دالة لتحويل الوقت من 24 ساعة إلى 12 ساعة مع ص/م
  const convertTo12Hour = (time: string, prayerName: PrayerName): string => {
    let [hours, minutes] = time.split(':').map(Number);
    
    // تحويل العصر والمغرب والعشاء إلى نظام 24 ساعة أولاً
    if (prayerName === 'العصر' || prayerName === 'المغرب' || prayerName === 'العشاء') {
      if (hours < 12) {
        hours += 12;
      }
    }
    
    // تحويل من 24 ساعة إلى 12 ساعة للعرض
    let period = 'ص'; // صباحاً
    let displayHours = hours;
    
    if (hours >= 12) {
      period = 'م'; // مساءً
      if (hours > 12) {
        displayHours = hours - 12;
      }
    }
    
    if (hours === 0) {
      displayHours = 12;
    }
    
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // دالة للحصول على الوقت الحالي بنظام 12 ساعة
  const getCurrentTime12Hour = (): string => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    
    let period = 'ص';
    let displayHours = hours;
    
    if (hours >= 12) {
      period = 'م';
      if (hours > 12) {
        displayHours = hours - 12;
      }
    }
    
    if (hours === 0) {
      displayHours = 12;
    }
    
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const prayers: Array<{ name: PrayerName; time: string }> = [
    { name: 'الفجر', time: convertTo12Hour(todayPrayers.الفجر, 'الفجر') },
    { name: 'الشروق', time: convertTo12Hour(todayPrayers.الشروق, 'الشروق') },
    { name: 'الظهر', time: convertTo12Hour(todayPrayers.الظهر, 'الظهر') },
    { name: 'العصر', time: convertTo12Hour(todayPrayers.العصر, 'العصر') },
    { name: 'المغرب', time: convertTo12Hour(todayPrayers.المغرب, 'المغرب') },
    { name: 'العشاء', time: convertTo12Hour(todayPrayers.العشاء, 'العشاء') },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden" dir="rtl">
      <div className="h-full flex flex-col p-2">
        {/* التواريخ */}
        <div className="flex-none">
          <DateDisplay
            hijriDate={getHijriDate(currentTime)}
            gregorianDate={formatGregorianDate(currentTime)}
          />
        </div>

        {/* الوقت المتبقي والوقت الحالي */}
        <div className="flex-none grid grid-cols-2 gap-2 mb-2">
          {/* بطاقة الوقت الحالي */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-3 shadow-2xl">
            <h2 className="text-xl font-bold text-white text-center mb-1">
              الوقت الحالي
            </h2>
            <p className="text-4xl font-extrabold text-white text-center tracking-wide">
              {getCurrentTime12Hour()}
            </p>
          </div>

          {/* بطاقة الوقت المتبقي */}
          {nextPrayer && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-3 shadow-2xl">
              <h2 className="text-xl font-bold text-white text-center mb-1">
                الوقت المتبقي لصلاة {nextPrayer.name}
              </h2>
              <p className="text-4xl font-extrabold text-white text-center tracking-wide">
                {timeRemaining}
              </p>
            </div>
          )}
        </div>

        {/* بطاقات الصلاة - تأخذ المساحة المتبقية */}
        <div className="flex-1 min-h-0 pb-2">
          <div className="h-full grid grid-cols-3 gap-2">
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

        {/* أدوات الاختبار - تظهر عند الضغط على T */}
        {testMode && (
          <div className="fixed bottom-4 left-4 bg-slate-800 p-4 rounded-lg shadow-2xl border-2 border-blue-500 z-50">
            <h3 className="text-white text-xl font-bold mb-3 text-center">أدوات الاختبار</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => addMinutes(30)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  +30 دقيقة
                </button>
                <button
                  onClick={() => addHours(1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  +1 ساعة
                </button>
                <button
                  onClick={() => addHours(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  +3 ساعات
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addDays(1)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                  +1 يوم
                </button>
                <button
                  onClick={() => addDays(7)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                  +7 أيام
                </button>
                <button
                  onClick={() => addDays(30)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                  +30 يوم
                </button>
              </div>
              <button
                onClick={resetTime}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm w-full"
              >
                إعادة ضبط الوقت
              </button>
              <div className="text-white text-sm text-center mt-2 pt-2 border-t border-slate-600">
                الوقت الحالي: {currentTime.toLocaleTimeString('ar-SA')}
                <br />
                التاريخ: {currentTime.toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
