import { useEffect, useState } from 'react';
import prayerData from './data/ramadi_prtime.json';
import { PrayerData, DailyPrayer, PrayerName } from './types/prayer';
import {
  getPrayerTimesForDate,
  getNextPrayer,
  getTimeRemaining,
  getHijriDate,
  formatGregorianDate,
  getDayName,
  getSecondsRemaining,
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
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(9999); // قيمة كبيرة لتجنب تشغيل الصوت عند التحميل
  const [hijriOffset, setHijriOffset] = useState(-1); //من هنا تعديل التاريخ الهجري +1 او -1 ....الخ
  const [soundPlayed, setSoundPlayed] = useState(false);

  const data = prayerData as PrayerData;

  // تشغيل صوت التنبيه (tic tic)
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // دالة لإنشاء صوت "تِك" واحد
      const playTick = (delay: number) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // صوت تِك قصير وحاد
          oscillator.frequency.value = 1200;
          oscillator.type = 'square';
          
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.05);
        }, delay);
      };
      
      // تشغيل 5 تِكات متتالية
      playTick(0);
      playTick(150);
      playTick(300);
      playTick(450);
      playTick(600);
      
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

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
        
        // حساب الثواني المتبقية
        const seconds = getSecondsRemaining(next.time, currentTime);
        setSecondsLeft(seconds);
        
        // إظهار النافذة عندما يكون الوقت المتبقي ≤ 15 دقيقة و >= -15 ثانية (15 ثانية بعد وقت الصلاة)
        const shouldShow = seconds <= 900 && seconds >= -15;
        setShowCountdownModal(shouldShow);
      } else {
        setShowCountdownModal(false);
      }
    }
  }, [currentTime, data]);

  // تشغيل الصوت عندما يحين وقت الصلاة
  useEffect(() => {
    // تجنب تشغيل الصوت عند التحميل الأولي أو عندما لا توجد بيانات
    if (secondsLeft === 9999 || !nextPrayer) {
      return;
    }
    
    // عندما تكون الثواني المتبقية بين 0 و -5 (أول 5 ثوانٍ بعد وقت الصلاة)
    if (secondsLeft <= 0 && secondsLeft >= -5 && !soundPlayed) {
      playNotificationSound();
      setSoundPlayed(true);
    }
    
    // إعادة تعيين soundPlayed عندما نبتعد عن وقت الصلاة
    if (secondsLeft > 10 || secondsLeft < -15) {
      setSoundPlayed(false);
    }
  }, [secondsLeft, soundPlayed, nextPrayer]);

  useEffect(() => {
    // تحديث كل ثانية عند ظهور النافذة، كل دقيقة عند إخفائها
    const interval = showCountdownModal ? 1000 : 60000;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, interval);

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
  }, [showCountdownModal]);

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

  // تنسيق العداد التنازلي (دقائق:ثواني)
  const formatCountdown = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden" dir="rtl">
      {/* نافذة العد التنازلي */}
      {showCountdownModal && nextPrayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="text-center px-8 pt-40">
            {secondsLeft > 0 ? (
              // العد التنازلي
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-blue-300 mb-32 drop-shadow-2xl">
                  الوقت المتبقي لصلاة {nextPrayer.name}
                </h1>
                <div className="text-[12rem] md:text-[15rem] font-extrabold text-white mt-[-20px] tracking-wider tabular-nums drop-shadow-2xl">
                  {formatCountdown(secondsLeft)}
                </div>
              </>
            ) : (
              // حان وقت الصلاة
              <div className="animate-pulse">
                <h1 className="text-[10rem] md:text-[12rem] font-extrabold text-green-400 mb-12 drop-shadow-2xl">
                  🕌
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold text-green-300 mb-8 drop-shadow-2xl">
                  حان وقت الصلاة
                </h2>
                <p className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">
                  صلاة {nextPrayer.name}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="h-full flex flex-col p-4 gap-3">
        {/* التواريخ */}
        <div className="flex-none">
          <DateDisplay
            hijriDate={getHijriDate(currentTime, hijriOffset)}
            gregorianDate={formatGregorianDate(currentTime)}
            dayName={getDayName(currentTime)}
            hijriOffset={hijriOffset}
            onHijriOffsetChange={setHijriOffset}
          />
        </div>

        {/* الوقت المتبقي والوقت الحالي */}
        <div className="flex-none grid grid-cols-2 gap-3">
          {/* بطاقة الوقت الحالي */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-3 shadow-2xl">
            <h2 className="text-2xl font-bold text-white text-center mb-1">
              الوقت الحالي
            </h2>
            <p className="text-4xl font-extrabold text-white text-center tracking-wide">
              {getCurrentTime12Hour()}
            </p>
          </div>

          {/* بطاقة الوقت المتبقي */}
          {nextPrayer && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-3 shadow-2xl">
              <h2 className="text-2xl font-bold text-white text-center mb-1">
                الوقت المتبقي لصلاة {nextPrayer.name}
              </h2>
              <p className="text-4xl font-extrabold text-white text-center tracking-wide">
                {timeRemaining}
              </p>
            </div>
          )}
        </div>

        {/* بطاقات الصلاة - تأخذ المساحة المتبقية */}
        <div className="flex-1 min-h-0">
          <div className="h-full grid grid-cols-3 grid-rows-2 gap-3">
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
          <div className="fixed bottom-4 left-4 bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-2xl border-2 border-blue-500 z-50 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-2xl font-bold">⚙️ أدوات الاختبار</h3>
              <button
                onClick={() => setTestMode(false)}
                className="text-red-400 hover:text-red-300 text-2xl font-bold"
                title="إغلاق (اضغط T)"
              >
                ✕
              </button>
            </div>
            
            {/* معلومات الوقت الحالي */}
            <div className="bg-slate-700 rounded-lg p-3 mb-4">
              <p className="text-blue-300 text-sm mb-1">⏰ الوقت الحالي:</p>
              <p className="text-white text-lg font-mono">{currentTime.toLocaleTimeString('ar-SA')}</p>
              <p className="text-blue-300 text-sm mt-2 mb-1">📅 التاريخ:</p>
              <p className="text-white text-lg">{currentTime.toLocaleDateString('ar-SA')}</p>
              {nextPrayer && (
                <>
                  <p className="text-green-300 text-sm mt-2 mb-1">🕌 الصلاة القادمة:</p>
                  <p className="text-white text-lg">{nextPrayer.name}</p>
                  <p className="text-yellow-300 text-sm mt-2 mb-1">⏳ الثواني المتبقية:</p>
                  <p className="text-white text-lg font-mono">{secondsLeft} ثانية ({Math.floor(secondsLeft / 60)} دقيقة)</p>
                  <p className="text-purple-300 text-sm mt-2 mb-1">📊 حالة النافذة:</p>
                  <p className="text-white text-lg">{showCountdownModal ? '✅ معروضة' : '❌ مخفية'}</p>
                </>
              )}
            </div>

            {/* أزرار التحكم بالدقائق */}
            <div className="mb-3">
              <p className="text-blue-300 text-sm mb-2 font-semibold">⏱️ إضافة دقائق:</p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => addMinutes(1)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +1 د
                </button>
                <button
                  onClick={() => addMinutes(5)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +5 د
                </button>
                <button
                  onClick={() => addMinutes(10)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +10 د
                </button>
                <button
                  onClick={() => addMinutes(15)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +15 د
                </button>
              </div>
            </div>

            {/* أزرار التحكم بالساعات */}
            <div className="mb-3">
              <p className="text-blue-300 text-sm mb-2 font-semibold">🕐 إضافة ساعات:</p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => addHours(1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +1 س
                </button>
                <button
                  onClick={() => addHours(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +2 س
                </button>
                <button
                  onClick={() => addHours(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +3 س
                </button>
                <button
                  onClick={() => addHours(6)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +6 س
                </button>
              </div>
            </div>

            {/* أزرار التحكم بالأيام */}
            <div className="mb-3">
              <p className="text-blue-300 text-sm mb-2 font-semibold">📆 إضافة أيام:</p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => addDays(1)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +1 يوم
                </button>
                <button
                  onClick={() => addDays(7)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +أسبوع
                </button>
                <button
                  onClick={() => addDays(30)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +شهر
                </button>
                <button
                  onClick={() => addDays(365)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  +سنة
                </button>
              </div>
            </div>

            {/* اختصارات سريعة */}
            <div className="mb-3">
              <p className="text-yellow-300 text-sm mb-2 font-semibold">⚡ اختصارات سريعة:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (nextPrayer) {
                      // الانتقال لـ 20 دقيقة قبل الصلاة القادمة
                      const [hours, minutes] = nextPrayer.time.split(':').map(Number);
                      const prayerTime = new Date(currentTime);
                      prayerTime.setHours(hours, minutes - 20, 0, 0);
                      setCurrentTime(prayerTime);
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  ⏩ قبل الصلاة بـ20د
                </button>
                <button
                  onClick={() => {
                    if (nextPrayer) {
                      // الانتقال لـ 1 دقيقة قبل الصلاة القادمة
                      const [hours, minutes] = nextPrayer.time.split(':').map(Number);
                      const prayerTime = new Date(currentTime);
                      prayerTime.setHours(hours, minutes - 1, 0, 0);
                      setCurrentTime(prayerTime);
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-semibold"
                >
                  ⏩ قبل الصلاة بـ1د
                </button>
              </div>
            </div>

            {/* زر إعادة الضبط */}
            <button
              onClick={resetTime}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-base w-full font-bold shadow-lg"
            >
              🔄 إعادة ضبط الوقت الحقيقي
            </button>
            
            <p className="text-gray-400 text-xs text-center mt-3">
              اضغط T للإغلاق
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
