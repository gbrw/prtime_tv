interface DateDisplayProps {
  hijriDate: string;
  gregorianDate: string;
  city?: string; // اختياري لأننا لن نستخدمه
}

export default function DateDisplay({
  hijriDate,
  gregorianDate,
}: DateDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-10 shadow-2xl mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-slate-700/50 rounded-2xl p-10">
          <p className="text-4xl text-slate-300 text-center mb-4">
            التاريخ الهجري
          </p>
          <p className="text-6xl font-bold text-white text-center">
            {hijriDate}
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-2xl p-10">
          <p className="text-4xl text-slate-300 text-center mb-4">
            التاريخ الميلادي
          </p>
          <p className="text-6xl font-bold text-white text-center">
            {gregorianDate}
          </p>
        </div>
      </div>
    </div>
  );
}
