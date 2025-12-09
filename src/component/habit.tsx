import React from "react";

interface Habit {
  id: string;
  title: string;
  description: string;
  week: ("done" | "not_done" | "none")[];
  color?: string;
  created_at?: string;
}

interface Props {
  habits: Habit[];
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WeeklyGrid: React.FC<Props> = ({ habits }) => {
  if (!habits || habits.length === 0) {
    return <div className="text-sm opacity-60">No habits yet</div>;
  }

  return (
    <div className="w-full">
      {/* header hari */}
      <div className="flex items-center mb-2 ">
        <div className="w-31 grid grid-cols-7 font-semibold text-sm"></div> {/* Header untuk kolom judul */}
        <div className="grid grid-cols-7">
          {dayLabels.map((label) => (
            <div key={label} className="w-28 text-center font-semibold text-sm">
              {label.slice(0,1)}
            </div>
          ))}
        </div>
      </div>

      {/* setiap habit jadi row */}
      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
            <div key={habit.id} className="flex items-center">
                            <div 
                className="h-5 w-5 mr-5 rounded-full"
                style={{ backgroundColor: habit.color }}
              ></div>
            <div className="w-32 pr-2 text-sm truncate" title={habit.title}>{habit.title}</div>
            <div className="grid grid-cols-7 gap-22">
              {habit.week.map((status, dayIdx) => {
                if (status === "none") {
                  return <div key={dayIdx} className="w-6 h-6" />; // Tetap ada spasi
                }

                const bgStyle =
                  status === "done"
                    ? { backgroundColor: habit.color || "#34D399" }
                    : { backgroundColor: "#D1D5DB" };

                return (
                  <div
                    key={dayIdx}
                    className="w-6 h-6 rounded-md"
                    style={bgStyle}
                    title={`${habit.title} — ${dayLabels[dayIdx]}: ${status}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyGrid;
