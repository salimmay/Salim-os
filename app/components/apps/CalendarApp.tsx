export const CalendarApp = () => {
  const today = new Date();
  return (
    <div className="h-full bg-white text-slate-900 p-4 flex flex-col items-center justify-center">
      <div className="text-red-500 font-bold text-xl uppercase tracking-widest">{today.toLocaleString('default', { month: 'long' })}</div>
      <div className="text-9xl font-bold">{today.getDate()}</div>
      <div className="text-slate-400 text-2xl">{today.toLocaleString('default', { weekday: 'long' })}</div>
    </div>
  );
};
