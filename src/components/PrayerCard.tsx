import { PrayerName } from '../types/prayer';

interface PrayerCardProps {
  name: PrayerName;
  time: string;
  isNext: boolean;
}

export default function PrayerCard({ name, time, isNext }: PrayerCardProps) {
  return (
    <div
      className={`rounded-3xl p-8 transition-all flex flex-col justify-center ${
        isNext
          ? 'bg-gradient-to-br from-green-600 to-green-700 shadow-2xl scale-105 ring-4 ring-green-400'
          : 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg'
      }`}
    >
      <h3 className="text-5xl font-bold text-white text-center mb-6">
        {name}
      </h3>
      <p className="text-8xl font-extrabold text-white text-center tracking-wider">
        {time}
      </p>
      {isNext && (
        <div className="mt-6 text-center">
          <span className="inline-block bg-white text-green-700 px-8 py-3 rounded-full text-3xl font-bold animate-pulse">
            الصلاة القادمة
          </span>
        </div>
      )}
    </div>
  );
}
