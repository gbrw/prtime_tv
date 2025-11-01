interface DateDisplayProps {
  hijriDate: string;
  gregorianDate: string;
  city: string;
}

export default function DateDisplay({
  hijriDate,
  gregorianDate,
  city,
}: DateDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl mb-8">
      <h1 className="text-5xl font-extrabold text-white text-center mb-6">
        مواقيت الصلاة - {city}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700/50 rounded-2xl p-6">
          <p className="text-2xl text-slate-300 text-center mb-2">
            التاريخ الهجري
          </p>
          <p className="text-4xl font-bold text-white text-center">
            {hijriDate}
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-2xl p-6">
          <p className="text-2xl text-slate-300 text-center mb-2">
            التاريخ الميلادي
          </p>
          <p className="text-4xl font-bold text-white text-center">
            {gregorianDate}
          </p>
        </div>
      </div>
    </div>
  );
}
