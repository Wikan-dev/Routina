import "../App.css";
import arrow from "../assets/icon/arrow.svg";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Menu from "../component/menu";
import WeeklyGrid from "../component/habit";
import DailyCard from "../component/card";
import jsonData from "../../backend/data/habits.json";
import { User, CircleQuestionMark, CircleAlert } from "lucide-react";
// import AddHabit from "../component/add_habit";
import { Link } from "react-router";
import MenuIcon from "../assets/icon/menu.svg";
import ChangeName from "../component/changeName";

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
  const [changeNameState, setChangeNameState] = useState(false);

  // Hari sekarang
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(
    new Date().getDay()
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const TanggalSekarang = new Date();

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

  const [username, setUsername] = useState(getUsername());

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(getUsername());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Filter habit yang muncul di DailyCard
  const todaysHabits = habits
    .map((h) => ({
      id: h.id,
      title: h.title,
      description: h.description,
      color: h.color,
      todayStatus: h.week[currentDayIndex],
    }))
    .filter((h) => h.todayStatus !== "none");

  // Calculate daily percentage
  const dailyHabitsDone = todaysHabits.filter(h => h.todayStatus === 'done').length;
  const totalDailyHabits = todaysHabits.length;
  const dailyPercentage = totalDailyHabits > 0 ? (dailyHabitsDone / totalDailyHabits) * 100 : 0;

  // Calculate weekly percentage
  const weeklyHabitsDone = habits.reduce((acc, habit) => {
    return acc + habit.week.filter(day => day === 'done').length;
  }, 0);
  const totalWeeklyHabits = habits.reduce((acc, habit) => {
    return acc + habit.week.filter(day => day !== 'none').length;
  }, 0);
  const weeklyPercentage = totalWeeklyHabits > 0 ? (weeklyHabitsDone / totalWeeklyHabits) * 100 : 0;

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

  console.log(changeNameState)

  return (
    <div className="bg-white w-full h-screen flex flex-col lg:px-[35px] px-5">
      {changeNameState && <ChangeName setChangeNameState={setChangeNameState} />}

        <div
          className="rounded-full border-2 border-[#DFDFDF] w-20 h-20 bottom-20 right-5 z-40 bg-white cursor-pointer lg:hidden flex absolute p-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
            <h2 className="text-xl font-bold mb-10 mt-10">Menu</h2>
            <ul className="space-y-10">
              <motion.li onClick={() => setChangeNameState(!changeNameState)} className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><User size={20} className="inline mr-2" /> Profile</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><CircleQuestionMark size={20} className="inline mr-2" /> Help</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><CircleAlert size={20} className="inline mr-2" /> About</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}>Toggle dark mode</motion.li>
            </ul>
          </Menu>
          <img src={MenuIcon} alt="menu" />
        </div>

      {/* Avatar + Menu */}
      <div className="h-20 absolute lg:top-12 top-5 lg:left-12 lg:flex items-center gap-10">
        <div
          className="rounded-full border-2 border-[#DFDFDF] w-20 h-20 bg-[#DFDFDF] cursor-pointer hidden lg:flex"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
            <h2 className="text-xl font-bold mb-10 mt-10">Menu</h2>
            <ul className="space-y-10">
              <motion.button onClick={() => setChangeNameState(!changeNameState)}className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><User size={20} className="inline mr-2" /> Profile</motion.button>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><CircleQuestionMark size={20} className="inline mr-2" /> Help</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><CircleAlert size={20} className="inline mr-2" /> About</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}>Toggle dark mode</motion.li>
            </ul>
          </Menu>
        </div>

        <h1 className="lg:text-[30px] text-4xl font-bold">Hey There, {username}</h1>
      </div>
        <div className="w-[60%] h-auto relative mt-50 left-6 lg:flex hidden justify-between items-center flex-row">
            <div className='flex flex-row items-center gap-9'>
                <div className='flex flex-row gap-3'>
                    <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center cursor-pointer' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}} onClick={goPrevWeek}>
                        <img src={arrow} alt="arrow left" className='w-4 h-auto' />
                        </motion.button>
                        <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center cursor-pointer' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}} onClick={goNextWeek}>                            <img src={arrow} alt="arrow right" className='w-4 h-auto' style={{ transform: "rotate(180deg)" }} />
                        </motion.button>
                </div>
                <h1 className='text-black text-[18px] font-bold w-50'>{weekDisplay}</h1>
            </div>
            <Link to={'/addHabit'}>
              <motion.button className="rounded-full border-2 border-gray-300 w-50 h-12 ml-auto text-blue-500 cursor-pointer" whileHover={{scale: 1.1}} whileTap={{scale:0.95}}>Add habit +</motion.button>
            </Link>
            {/* Progress Bar */}
            <div className="absolute mt-40 w-full">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className='h-full bg-blue-500 transition-all duration-300' style={{width: `${weeklyPercentage}%`}}></div>
                    </div>
            </div>
        </div>


      {/* WEEKLY GRID */} 
      <div className="mt-20 ml-6 lg:block hidden">
        <WeeklyGrid habits={habits} />
      </div>

      {/* DAILY CARD */}
      <div>
        <div className="lg:w-[32%] lg:h-[30%] lg:absolute mt-20 lg:mt-0 w-full lg:right-[35px] lg:top-[35px]">
          <h1 className="font-bold text-xl lg:text-4xl">{TanggalSekarang.toDateString()}</h1>
          <div className="w-full h-3 rounded-full bg-gray-400 relative">
            <div className="h-3 rounded-full bg-blue-500 lg:mt-5 mt-2 " style={{width: `${dailyPercentage}%`}}>
              <h1 className=" top-3 lg:right-2 -right-3 absolute font-bold lg:text-xl lg:w-36 w-30">{dailyPercentage.toFixed(0)}% Complete</h1>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[32%] lg:h-[70%] mt-15 lg:absolute lg:right-[35px] lg:bottom-[35px] bg-white lg:border-2 border-[#dfdfdf] rounded-2xl p-5">
          <DailyCard
            habits={todaysHabits}
            currentDayIndex={currentDayIndex}
            onUpdate={updateHabitStatus}
            onPrevDay={goPrevDay}
            onNextDay={goNextDay}
          />
        </div>
      </div>
    </div>
  );
}
