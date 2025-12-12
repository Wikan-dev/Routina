import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { EllipsisVertical } from "lucide-react"
import { useTheme } from "next-themes";


function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}


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
  color: string;
  todayStatus: "done" | "not_done" | "none";
}

const Card: React.FC<DailyCardProps> = ({
  habits,
  onUpdate,
  currentDayIndex,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const baseBg = isDarkMode ? "rgb(255 255 255)" : "rgb(31 41 55)";
  const handleMarkComplete = async (habitId: string) => {
    try {
      await axios.put('http://localhost:4000/habit/done', {
        id: habitId,
        day: currentDayIndex + 1,
      });
      onUpdate(habitId, "done");
    } catch (err: any) {
      console.error("Failed to mark habit as done:", err);
      if (err.response) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert("An error occurred.");
      }
    }
  };

  const handleUndo = async (habitId: string) => {
    try {
      await axios.put('http://localhost:4000/habit/undo', {
        id: habitId,
        day: currentDayIndex + 1,
      });
      onUpdate(habitId, "not_done");
    } catch (err: any) {
      console.error("Failed to undo habit:", err);
      if (err.response) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert("An error occurred while undoing.");
      }
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-900">
      <div className="fixed mt-[-60px] ml-[-10px] font-semibold rounded-xl z-10 text-black bg-white dark:bg-gray-900 w-[31%] h-10">
        <h3 className="mt-3 ml-3 text-black dark:text-white">Today’s Habits</h3>
      </div>
      {habits.length === 0 && <p className="opacity-60">Ga ada habit untuk hari ini 😴</p>}

      <div className="flex flex-col gap-4 mt-10 bg-white dark:bg-gray-900 p-4">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            style={{"--habit-color": habit.color, "--habit-rgb": hexToRgb(habit.color)} as React.CSSProperties}
            initial={{ backgroundColor: habit.todayStatus === "done" ? `rgb(${hexToRgb(habit.color)})` : baseBg}}
            animate={{ backgroundColor: habit.todayStatus === "done" ? `rgb(${hexToRgb(habit.color)})` : baseBg}}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative overflow-hidden h-auto rounded-xl p-4 border-l-[6px] border-[var(--habit-color)] "
          >
            <motion.div className="absolute inset-0 z-0" initial={{ scaleX: 0 }} animate={{scaleX: habit.todayStatus === "done" ? 1 : 0,}} transition={{ duration: 0.45, ease: "easeInOut" }} style={{backgroundColor: habit.color, transformOrigin: "left", }}/>
            <div className="relative z-2 p-1 flex flex-col gap-3 w-full">
              <div>
                <div className={`font-medium text-[30px] ${habit.todayStatus === "done" ? "text-white" : "text-black dark:text-white"}`}>{habit.title}</div>
                <div className={`font-small ${habit.todayStatus === "done" ? "text-white/80" : "text-black opacity-70 dark:text-white/70"}`}>{habit.description}</div>
                <EllipsisVertical className="absolute top-4 right-4" />
              </div>

              {habit.todayStatus === "done" ? (
                <motion.button
                  onClick={() => handleUndo(habit.id)}
                  className="cursor-pointer px-3 ml-auto mt-4 py-1 text-white rounded"
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  Undo
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => handleMarkComplete(habit.id)}
                  className="cursor-pointer px-3 py-1 mt-3 border-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-blue-400 rounded"
                  whileHover={{scale: 1.01}}
                >
                  Mark complete
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Card;
