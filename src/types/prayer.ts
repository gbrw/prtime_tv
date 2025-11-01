export interface DailyPrayer {
  اليوم: number;
  الفجر: string;
  الشروق: string;
  الظهر: string;
  العصر: string;
  المغرب: string;
  العشاء: string;
}

export interface MonthData {
  اسم_الشهر_السرياني: string;
  الشهر_الميلادي: number;
  البيانات_اليومية: DailyPrayer[];
}

export interface PrayerData {
  المدينة: string;
  المصدر: string;
  الأشهر: MonthData[];
}

export type PrayerName = 'الفجر' | 'الشروق' | 'الظهر' | 'العصر' | 'المغرب' | 'العشاء';
