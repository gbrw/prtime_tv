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
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-3 shadow-2xl mb-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-700/50 rounded-xl p-3">
          <p className="text-lg text-slate-300 text-center mb-1">
            التاريخ الهجري
          </p>
          <p className="text-2xl font-bold text-white text-center">
            {hijriDate}
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3">
          <p className="text-lg text-slate-300 text-center mb-1">
            التاريخ الميلادي
          </p>
          <p className="text-2xl font-bold text-white text-center">
            {gregorianDate}
          </p>
        </div>
      </div>
    </div>
  );
}
