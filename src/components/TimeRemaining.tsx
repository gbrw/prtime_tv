interface TimeRemainingProps {
  timeRemaining: string;
  nextPrayerName: string;
}

export default function TimeRemaining({
  timeRemaining,
  nextPrayerName,
}: TimeRemainingProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 shadow-2xl mb-3">
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        الوقت المتبقي لصلاة {nextPrayerName}
      </h2>
      <p className="text-6xl font-extrabold text-white text-center tracking-wide">
        {timeRemaining}
      </p>
    </div>
  );
}
