import React from "react";

interface DailyCardProps {
  habits: HabitToday[];
  currentDayIndex: number;
  onUpdate: (habitId: string, newStatus: "done" | "not_done" | "none") => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}

interface HabitToday {
  id: string;
  title: string;
  description: string;
  todayStatus: "done" | "not_done" | "none";
}

const Card: React.FC<DailyCardProps> = ({
  habits,
  onUpdate,
}) => {

  return (
    <div className="flex-1">

      <h3 className="font-semibold mb-3">Today’s Habits</h3>

      {habits.length === 0 && <p className="opacity-60">Ga ada habit untuk hari ini 😴</p>}

      <div className="flex flex-col gap-4">
        {habits.map((habit) => (
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
                onClick={() => onUpdate(habit.id, "not_done")}
                className="px-3 py-1 bg-red-400 text-white rounded"
              >
                Undo
              </button>
            ) : (
              <button
                onClick={() => onUpdate(habit.id, "done")}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Mark Done
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
