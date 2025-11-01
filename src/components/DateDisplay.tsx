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
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-4 shadow-2xl mb-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-xl p-4">
          <p className="text-xl text-slate-300 text-center mb-1">
            التاريخ الهجري
          </p>
          <p className="text-3xl font-bold text-white text-center">
            {hijriDate}
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-4">
          <p className="text-xl text-slate-300 text-center mb-1">
            التاريخ الميلادي
          </p>
          <p className="text-3xl font-bold text-white text-center">
            {gregorianDate}
          </p>
        </div>
      </div>
    </div>
  );
}
