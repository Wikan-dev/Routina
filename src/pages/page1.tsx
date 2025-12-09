import "../App.css";
import arrow from "../assets/icon/arrow.svg";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Menu from "../component/menu";
import WeeklyGrid from "../component/habit";
import DailyCard from "../component/card";
import jsonData from "../../backend/data/habits.json";

interface Habit {
  id: string;
  title: string;
  description: string;
  week: ("done" | "not_done" | "none")[];
  color?: string;
  created_at: string;
}

export default function Page1() {
  // ⬇ STATE HABITS DI PAGE INI
  const [habits, setHabits] = useState<Habit[]>(jsonData.habits);

  // Hari sekarang
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(
    new Date().getDay()
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  const goPrevWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const goNextWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const getWeekDisplayString = (date: Date) => {
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay()); // Set to Sunday of the week

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };

    const start = sunday.toLocaleDateString("en-US", options);
    const end = saturday.toLocaleDateString("en-US", options);

    return `${start} - ${end}`;
  };

  // Efek ini memastikan hari ini selalu terbarui
  useEffect(() => {
    const updateCurrentDay = () => {
      setCurrentDayIndex(new Date().getDay());
    };
    // Atur interval untuk memeriksa perubahan tanggal secara berkala
    const intervalId = setInterval(updateCurrentDay, 60000); // setiap menit

    // Hapus interval saat komponen dilepas
    return () => clearInterval(intervalId);
  }, []); // Array dependensi kosong memastikan ini hanya berjalan sekali saat mount


  // Ambil username dari localStorage
  const getUsername = () => {
    try {
      const raw = localStorage.getItem("user_profile");
      if (!raw) return "User";
      const parsed = JSON.parse(raw);
      return parsed.name || "User";
    } catch {
      return "User";
    }
  };

  const username = getUsername();

  // Filter habit yang muncul di DailyCard
  const todaysHabits = habits
    .map((h) => ({
      id: h.id,
      title: h.title,
      description: h.description,
      todayStatus: h.week[currentDayIndex],
    }))
    .filter((h) => h.todayStatus !== "none");

  // Update status habit
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

  // Navigasi hari
  const goPrevDay = () =>
    setCurrentDayIndex((prev) => (prev === 0 ? 6 : prev - 1));
  const goNextDay = () =>
    setCurrentDayIndex((prev) => (prev === 6 ? 0 : prev + 1));

  // Menu
  const [menuOpen, setMenuOpen] = useState(false);
  const weekDisplay = getWeekDisplayString(currentDate);

  return (
    <div className="bg-white w-full h-screen flex flex-col px-[35px]">

      {/* Avatar + Menu */}
      <div className="h-20 absolute top-12 left-12 flex items-center gap-10">
        <div
          className="rounded-full border-2 border-[#DFDFDF] w-20 h-20 bg-[#DFDFDF] cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
            <h2 className="text-xl font-bold mb-10 mt-10">Menu</h2>
            <ul className="space-y-10">
              <li>Profile</li>
              <li>Help</li>
              <li>About</li>
              <li>Toggle dark mode</li>
            </ul>
          </Menu>
        </div>

        <h1 className="text-[30px] font-bold">Hey There, {username}</h1>
      </div>
        <div className="w-[60%] h-auto relative mt-50 left-6 flex justify-between items-center flex-row">
            <div className='flex flex-row items-center gap-9'>
                <div className='flex flex-row gap-3'>
                    <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center cursor-pointer' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}} onClick={goPrevWeek}>
                        <img src={arrow} alt="arrow left" className='w-4 h-auto' />
                        </motion.button>
                        <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center cursor-pointer' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}} onClick={goNextWeek}>                            <img src={arrow} alt="arrow right" className='w-4 h-auto' style={{ transform: "rotate(180deg)" }} />
                        </motion.button>
                </div>
                <h1 className='text-black text-[18px] font-bold'>{weekDisplay}</h1>
            </div>
            <motion.button className="rounded-full border-2 border-gray-300 w-50 h-12 ml-70 text-blue-500 cursor-pointer" whileHover={{scale: 1.1}} whileTap={{scale:0.95}}>Add habit +</motion.button>
            {/* Progress Bar */}
            <div className="absolute mt-40 w-full">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className='h-full bg-blue-500 transition-all duration-300' style={{width: `40%`}}></div>
                    </div>
            </div>
        </div>


      {/* WEEKLY GRID */}
      <div className="mt-20 ml-6">
        <WeeklyGrid habits={habits} />
      </div>

      {/* DAILY CARD */}
      <div className="w-[32%] h-[70%] absolute right-[35px] bottom-[35px] bg-white border-2 border-[#dfdfdf] rounded-2xl p-5">
        <DailyCard
          habits={todaysHabits}
          currentDayIndex={currentDayIndex}
          onUpdate={updateHabitStatus}
          onPrevDay={goPrevDay}
          onNextDay={goNextDay}
        />
      </div>
    </div>
  );
}
