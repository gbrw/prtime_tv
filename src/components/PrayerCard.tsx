import { PrayerName } from '../types/prayer';

interface PrayerCardProps {
  name: PrayerName;
  time: string;
  isNext: boolean;
}

export default function PrayerCard({ name, time, isNext }: PrayerCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 transition-all flex flex-col justify-center items-center ${
        isNext
          ? 'bg-gradient-to-br from-green-600 to-green-700 shadow-2xl ring-4 ring-green-400'
          : 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg'
      }`}
    >
      <h3 className="text-2xl font-bold text-white text-center mb-2">
        {name}
      </h3>
      <p className="text-5xl font-extrabold text-white text-center tracking-wider">
        {time}
      </p>
      {isNext && (
        <div className="mt-2 text-center">
          <span className="inline-block bg-white text-green-700 px-2 py-1 rounded-full text-sm font-bold animate-pulse">
            الصلاة القادمة
          </span>
        </div>
      )}
    </div>
  );
}
