import { useState } from "react";
import jsonData from "../../backend/data/habits.json"; // sesuaikan path

interface Habit {
  id: string;
  title: string;
  description: string;
  week: ("done" | "not_done" | "none")[];
  color?: string;
  created_at: string;
}


const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(jsonData.habits);

  // current day (0 = Sun, 1 = Mon, ...)
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(
    new Date().getDay()
  );

  // Get habits that have something on today (filter 'none')
  const todaysHabits = habits
    .map((h) => ({
      ...h,
      todayStatus: h.week[currentDayIndex],
    }))
    .filter((h) => h.todayStatus !== "none");

  // Update habit status (sync weekly grid & daily card)
  const updateHabitStatus = (
    habitId: string,
    newStatus: "done" | "not_done" | "none"
  ) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;

        const updatedWeek = [...h.week];
        updatedWeek[currentDayIndex] = newStatus;

        return { ...h, week: updatedWeek };
      })
    );
  };

  // Navigate between days
  const goPrevDay = () => {
    setCurrentDayIndex((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const goNextDay = () => {
    setCurrentDayIndex((prev) => (prev === 6 ? 0 : prev + 1));
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex gap-8 p-6 text-black">

      {/* LEFT WEEKLY GRID */}
      <div>
        <h2 className="font-bold text-xl mb-3">Weekly View</h2>

        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {dayLabels.map((label) => (
            <div key={label} className="font-semibold">{label}</div>
          ))}
        </div>

        {habits.map((habit) => (
          <div key={habit.id} className="grid grid-cols-7 gap-2 mb-3">
            {habit.week.map((status, dayIdx) => (
              <div
                key={dayIdx}
                className={`w-6 h-6 rounded ${
                  status === "done"
                    ? "bg-green-500"
                    : status === "not_done"
                    ? "bg-red-400"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* RIGHT DAILY CARD */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <button onClick={goPrevDay}>◀</button>
          <h2 className="text-lg font-bold">{dayLabels[currentDayIndex]}</h2>
          <button onClick={goNextDay}>▶</button>
        </div>

        <h3 className="font-semibold mb-3">Today’s Habits</h3>

        {todaysHabits.length === 0 && (
          <p className="opacity-60">Ga ada habit untuk hari ini 😴</p>
        )}

        <div className="flex flex-col gap-4">
          {todaysHabits.map((habit) => (
            <div
              key={habit.id}
              className="p-4 rounded-xl border shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="font-bold">{habit.title}</div>
                <div className="text-sm opacity-70">{habit.description}</div>
              </div>

              {habit.todayStatus === "done" ? (
                <button
                  onClick={() => updateHabitStatus(habit.id, "not_done")}
                  className="px-3 py-1 bg-red-400 text-white rounded"
                >
                  Undo
                </button>
              ) : (
                <button
                  onClick={() => updateHabitStatus(habit.id, "done")}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Mark Done
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HabitTracker;
