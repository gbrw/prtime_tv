interface TimeRemainingProps {
  timeRemaining: string;
  nextPrayerName: string;
}

export default function TimeRemaining({
  timeRemaining,
  nextPrayerName,
}: TimeRemainingProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 shadow-2xl mb-6">
      <h2 className="text-4xl font-bold text-white text-center mb-4">
        الوقت المتبقي لصلاة {nextPrayerName}
      </h2>
      <p className="text-7xl font-extrabold text-white text-center tracking-wide">
        {timeRemaining}
      </p>
    </div>
  );
}
