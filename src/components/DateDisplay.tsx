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
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-3 shadow-2xl">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-700/50 rounded-xl p-3 flex gap-2">
          {/* أزرار تعديل التاريخ الهجري */}
          <div className="flex flex-col gap-1 justify-center">
            <button
              onClick={() => onHijriOffsetChange(hijriOffset - 1)}
              className="bg-pink-600/90 hover:bg-pink-700 text-white w-9 h-9 rounded-lg text-xl font-bold shadow-lg transition-all hover:scale-110"
              title="تقليل يوم"
            >
              -
            </button>
            <button
              onClick={() => onHijriOffsetChange(0)}
              className="bg-pink-700/90 hover:bg-pink-800 text-white w-9 h-9 rounded-lg text-lg font-bold shadow-lg transition-all hover:scale-110"
              title="إعادة ضبط"
            >
              0
            </button>
            <button
              onClick={() => onHijriOffsetChange(hijriOffset + 1)}
              className="bg-pink-600/90 hover:bg-pink-700 text-white w-9 h-9 rounded-lg text-xl font-bold shadow-lg transition-all hover:scale-110"
              title="إضافة يوم"
            >
              +
            </button>
          </div>
          {/* التاريخ الهجري */}
          <div className="flex-1">
            <p className="text-xl text-slate-300 text-center mb-1">
              التاريخ الهجري
            </p>
            <p className="text-3xl font-bold text-white text-center">
              {hijriDate}
            </p>
            {hijriOffset !== 0 && (
              <div className="flex justify-center mt-1">
                <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-lg font-bold">
                  {hijriOffset > 0 ? '+' : ''}{hijriOffset}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3">
          <p className="text-xl text-slate-300 text-center mb-1">
            اليوم
          </p>
          <p className="text-3xl font-bold text-white text-center">
            {dayName}
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3">
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
