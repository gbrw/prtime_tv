interface DateDisplayProps {
  hijriDate: string;
  gregorianDate: string;
  dayName: string;
  city?: string;
  hijriOffset: number;
  onHijriOffsetChange: (offset: number) => void;
}

export default function DateDisplay({
  hijriDate,
  gregorianDate,
  dayName,
  hijriOffset,
  onHijriOffsetChange,
}: DateDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-2 shadow-2xl">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-700/50 rounded-xl p-2 flex gap-1">
          {/* أزرار تعديل التاريخ الهجري */}
          <div className="flex flex-col gap-0.5 justify-center">
            <button
              onClick={() => onHijriOffsetChange(hijriOffset - 1)}
              className="bg-pink-600/90 hover:bg-pink-700 text-white w-7 h-7 rounded-lg text-lg font-bold shadow-lg transition-all hover:scale-110"
              title="تقليل يوم"
            >
              -
            </button>
            <button
              onClick={() => onHijriOffsetChange(0)}
              className="bg-pink-700/90 hover:bg-pink-800 text-white w-7 h-7 rounded-lg text-sm font-bold shadow-lg transition-all hover:scale-110"
              title="إعادة ضبط"
            >
              0
            </button>
            <button
              onClick={() => onHijriOffsetChange(hijriOffset + 1)}
              className="bg-pink-600/90 hover:bg-pink-700 text-white w-7 h-7 rounded-lg text-lg font-bold shadow-lg transition-all hover:scale-110"
              title="إضافة يوم"
            >
              +
            </button>
          </div>
          {/* التاريخ الهجري */}
          <div className="flex-1">
            <p className="text-base text-slate-300 text-center mb-0.5">
              التاريخ الهجري
            </p>
            <p className="text-xl font-bold text-white text-center">
              {hijriDate}
            </p>
            {hijriOffset !== 0 && (
              <div className="flex justify-center mt-0.5">
                <span className="bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded font-bold">
                  {hijriOffset > 0 ? '+' : ''}{hijriOffset}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-2">
          <p className="text-base text-slate-300 text-center mb-0.5">
            اليوم
          </p>
          <p className="text-xl font-bold text-white text-center">
            {dayName}
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-2">
          <p className="text-base text-slate-300 text-center mb-0.5">
            التاريخ الميلادي
          </p>
          <p className="text-xl font-bold text-white text-center">
            {gregorianDate}
          </p>
        </div>
      </div>
    </div>
  );
}
