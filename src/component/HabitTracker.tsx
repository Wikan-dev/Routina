import { useState, useEffect } from "react";
import Card from "./card"; // Impor komponen Card

interface Habit {
  id: string;
  title: string;
  description: string;
  week: ("done" | "not_done" | "none")[];
  color?: string;
  created_at: string;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch("http://localhost:4000/habits");
        if (!response.ok) {
          throw new Error("Gagal mengambil data kebiasaan");
        }
        const data = await response.json();
        setHabits(data.habits);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const [currentDayIndex, setCurrentDayIndex] = useState<number>(
    new Date().getDay()
  );

  const todaysHabits = habits
    .map((h) => ({
      ...h,
      todayStatus: h.week[currentDayIndex],
      // Pastikan semua properti yang dibutuhkan Card ada
      color: h.color || "#000000", // default color jika tidak ada
    }))
    .filter((h) => h.todayStatus !== "none");

  const updateHabitStatus = (
    habitId: string,
    newStatus: "done" | "not_done" | "none"
  ) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const updatedWeek = [...h.week];
        updatedWeek[currentDayIndex] = newStatus;
        return { ...h, week: updatedWeek as ("done" | "not_done" | "none")[] };
      })
    );
  };

  const handleHabitDeleted = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const goPrevDay = () => {
    setCurrentDayIndex((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const goNextDay = () => {
    setCurrentDayIndex((prev) => (prev === 6 ? 0 : prev + 1));
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) return <div>Memuat...</div>;
  if (error) return <div>Error: {error}</div>;

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
      <Card
        habits={todaysHabits}
        currentDayIndex={currentDayIndex}
        onUpdate={updateHabitStatus}
        onHabitDeleted={handleHabitDeleted}
        onPrevDay={goPrevDay}
        onNextDay={goNextDay}
      />
    </div>
  );
};

export default HabitTracker;
