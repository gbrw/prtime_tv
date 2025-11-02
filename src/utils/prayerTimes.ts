import { PrayerData, DailyPrayer, PrayerName } from '../types/prayer';

export const getPrayerTimesForDate = (
  data: PrayerData,
  date: Date
): DailyPrayer | null => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthData = data.الأشهر.find((m) => m.الشهر_الميلادي === month);
  if (!monthData) return null;

  const dayData = monthData.البيانات_اليومية.find((d) => d.اليوم === day);
  return dayData || null;
};

export const getNextPrayer = (
  prayerTimes: DailyPrayer,
  currentTime: Date
): { name: PrayerName; time: string } | null => {
  // استبعاد "الشروق" من الصلوات الخمس الفعلية
  const prayers: Array<{ name: PrayerName; time: string }> = [
    { name: 'الفجر', time: prayerTimes.الفجر },
    { name: 'الظهر', time: prayerTimes.الظهر },
    { name: 'العصر', time: prayerTimes.العصر },
    { name: 'المغرب', time: prayerTimes.المغرب },
    { name: 'العشاء', time: prayerTimes.العشاء },
  ];

  const currentMinutes =
    currentTime.getHours() * 60 + currentTime.getMinutes();

  for (const prayer of prayers) {
    let [hours, minutes] = prayer.time.split(':').map(Number);
    
    // تحويل من نظام 12 ساعة إلى 24 ساعة للأوقات المسائية
    // العصر والمغرب والعشاء تكون بعد الظهر
    if (prayer.name === 'العصر' || prayer.name === 'المغرب' || prayer.name === 'العشاء') {
      if (hours < 12) {
        hours += 12;
      }
    }
    
    const prayerMinutes = hours * 60 + minutes;

    if (prayerMinutes > currentMinutes) {
      return { name: prayer.name, time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` };
    }
  }

  // إذا لم نجد صلاة قادمة (بعد العشاء)، نرجع صلاة الفجر لليوم التالي
  return { name: 'الفجر', time: prayerTimes.الفجر };
};

export const getTimeRemaining = (
  prayerTime: string,
  currentTime: Date
): string => {
  const [hours, minutes] = prayerTime.split(':').map(Number);
  const prayerDate = new Date(currentTime);
  prayerDate.setHours(hours, minutes, 0, 0);

  // إذا كان وقت الصلاة قد مضى، أضف يوم واحد
  if (prayerDate.getTime() <= currentTime.getTime()) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }

  const diff = prayerDate.getTime() - currentTime.getTime();
  const totalMinutes = Math.floor(diff / 1000 / 60);
  const remainingHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (remainingHours > 0) {
    return `${remainingHours} ساعة و ${remainingMinutes} دقيقة`;
  }
  return `${remainingMinutes} دقيقة`;
};

export const getHijriDate = (gregorianDate: Date, offsetDays: number = 0): string => {
  // إنشاء نسخة من التاريخ وإضافة الأيام المطلوبة
  const adjustedDate = new Date(gregorianDate);
  adjustedDate.setDate(adjustedDate.getDate() + offsetDays);
  
  // استخدام Intl.DateTimeFormat للحصول على تاريخ هجري دقيق مع اسم الشهر
  const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return formatter.format(adjustedDate);
};

export const formatGregorianDate = (date: Date): string => {
  const arabicMonths = [
    'كانون الثاني',
    'شباط',
    'آذار',
    'نيسان',
    'أيار',
    'حزيران',
    'تموز',
    'آب',
    'أيلول',
    'تشرين الأول',
    'تشرين الثاني',
    'كانون الأول',
  ];

  const day = date.getDate();
  const month = arabicMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getDayName = (date: Date): string => {
  const arabicDays = [
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
  ];

  return arabicDays[date.getDay()];
};

// حساب عدد الثواني المتبقية للصلاة
export const getSecondsRemaining = (
  prayerTime: string,
  currentTime: Date
): number => {
  const [hours, minutes] = prayerTime.split(':').map(Number);
  const prayerDate = new Date(currentTime);
  prayerDate.setHours(hours, minutes, 0, 0);

  // إذا كان وقت الصلاة قد مضى، أضف يوم واحد
  if (prayerDate.getTime() <= currentTime.getTime()) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }

  const diff = prayerDate.getTime() - currentTime.getTime();
  return Math.floor(diff / 1000);
};
