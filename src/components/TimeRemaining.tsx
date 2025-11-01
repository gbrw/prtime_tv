interface TimeRemainingProps {
  timeRemaining: string;
  nextPrayerName: string;
}

export default function TimeRemaining({
  timeRemaining,
  nextPrayerName,
}: TimeRemainingProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-14 shadow-2xl mb-10">
      <h2 className="text-6xl font-bold text-white text-center mb-8">
        الوقت المتبقي لصلاة {nextPrayerName}
      </h2>
      <p className="text-9xl font-extrabold text-white text-center tracking-wide">
        {timeRemaining}
      </p>
    </div>
  );
}
