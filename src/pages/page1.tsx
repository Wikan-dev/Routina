import "../App.css";
import arrow from "../assets/icon/arrow.svg";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Menus from "../component/menu";
import WeeklyGrid from "../component/habit";
import DailyCard from "../component/card";
import jsonData from "../../backend/data/habits.json";
import { User, CircleQuestionMark, CircleAlert, LogOut, Menu, ChevronLeft } from "lucide-react";
// import AddHabit from "../component/add_habit";
import { Link } from "react-router";
import ChangeName from "../component/changeName";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client/supabaseClient";

interface Habit {
  id: string;
  title: string;
  description: string;
  week: ("done" | "not_done" | "none")[];
  color?: string;
  created_at: string;
}

export default function Page1() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changeNameState, setChangeNameState] = useState(false);

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

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); // Arahkan ke halaman login setelah logout
  };

  const handleDeleteHabit = (habitId: string) => {
  setHabits(prev => prev.filter(h => h.id !== habitId));
};


  return (
    <div className="bg-white dark:bg-gray-900 w-full h-screen overflow-hidden flex flex-col lg:px-[35px] px-5">
      {changeNameState && <ChangeName setChangeNameState={setChangeNameState} />}

        <div
          className="fixed rounded-full border-2 border-[#DFDFDF] w-12 h-12 bottom-10 right-5 z-40 bg-white dark:bg-gray-900 cursor-pointer lg:hidden flex absolute p-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menus isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
            <h2 className="text-xl font-bold mb-10 mt-10">Menu</h2>
            <ul className="space-y-10">
              <motion.li onClick={() => setChangeNameState(!changeNameState)} className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><User size={20} className="inline mr-2" /> Profile</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><CircleQuestionMark size={20} className="inline mr-2" /> Help</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><CircleAlert size={20} className="inline mr-2" /> About</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}>Toggle dark mode</motion.li>
              <Link to={'/addHabit'}>
                <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}>Add Habit +</motion.li>
              </Link>
              <button
              onClick={handleLogout}
              className="absolute bottom-0 w-auto text-left py-12 text-md text-red-500 font-semibold cursor-pointer"
              >
                Logout <LogOut size={20} className="inline ml-2 color-red-500" />
              </button>
            </ul>
          </Menus>
            <Menu size={30} className="absolute right-2 bottom-2 inline color-[#DFDFDF] dark:text-white"/>
        </div>

      {/* Avatar + Menu */}
      <div className="h-20 absolute lg:top-12 top-5 lg:left-12 lg:flex items-center gap-10">
        <div
          className="rounded-full border-2 border-[#DFDFDF] w-20 h-20 bg-[#DFDFDF] cursor-pointer hidden lg:flex"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menus isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
            <h2 className="text-xl font-bold mb-10 mt-10">Menu</h2>
            <ul className="space-y-10 h-screen">
              <motion.button onClick={() => setChangeNameState(!changeNameState)}className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><User size={20} className="inline mr-2" /> Profile</motion.button>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><CircleQuestionMark size={20} className="inline mr-2" /> Help</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}><CircleAlert size={20} className="inline mr-2" /> About</motion.li>
              <motion.li className="font-medium cursor-pointer" whileHover={{scale: 1.05}}>Toggle dark mode</motion.li>
              <button
              onClick={handleLogout}
              className="absolute bottom-0 w-auto text-left py-12 text-md text-red-500 font-semibold cursor-pointer"
              >
                Logout <LogOut size={20} className="inline ml-2 color-red-500" />
              </button>
            </ul>
          </Menus>
        </div>
        <h1 className="text-[30px] text-4xl text-white dark:text-white font-bold relative">Hey There, {username}</h1>
        <h1 className="text-[20px] font-bold fixed z-7 lg:hidden bg-white dark:bg-gray-900 py-5 left-0 px-5 dark:text-white w-full h-60 top-0">Hey There, {username}</h1>
      </div>
        <div className="w-[60%] h-auto relative mt-50 left-6 lg:flex hidden justify-between items-center flex-row">
            <div className='flex flex-row items-center gap-9'>
                <div className='flex flex-row gap-3'>
                    <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center cursor-pointer' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}} onClick={goPrevWeek}>
                        <ChevronLeft size={20} className="text-black dark:text-white" />
                        </motion.button>
                        <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center cursor-pointer' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}} onClick={goNextWeek}>
                          <ChevronLeft size={20} className="text-black dark:text-white" style={{ transform: "rotate(180deg)" }} />
                        </motion.button>
                </div>
                <h1 className='text-black dark:text-white text-[18px] font-bold w-50'>{weekDisplay}</h1>
            </div>
            <Link to={'/addHabit'}>
              <motion.button className="rounded-full border-2 border-gray-300 w-50 h-12 ml-auto text-blue-500 cursor-pointer sm:absolute lg:relative sm:bottom-0 sm:show" whileHover={{scale: 1.1}} whileTap={{scale:0.95}}>Add habit +</motion.button>
            </Link>
            {/* Progress Bar */}
            <div className="lg:absolute mt-40 w-full sm:fixed">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className='h-full bg-blue-500 transition-all duration-300' style={{width: `${weeklyPercentage}%`}}></div>
                    </div>
            </div>
        </div>


      {/* WEEKLY GRID */} 
      <div className="mt-20 ml-6 lg:block hidden text-black dark:text-white">
        <WeeklyGrid habits={habits} />
      </div>

      {/* DAILY CARD */}
      <div>
        <div className="lg:w-[32%] lg:h-[30%] lg:absolute mt-20 lg:mt-0 h-auto w-full lg:right-[35px] lg:top-[35px] sm:flex sm:flex-col z-8">
          <h1 className="font-bold text-xl lg:text-4xl lg:relative fixed z-8 lg:top-2 text-black dark:text-white">{TanggalSekarang.toDateString()}</h1>
          <div className="lg:relative lg:top-1 lg:w-full w-[90%] h-3 rounded-full z-8 bg-gray-400 fixed mt-10">
            <div className="h-3 rounded-full bg-blue-500 mt-0 text-black dark:text-white" style={{width: `${dailyPercentage}%`}}>
              <h1 className="lg:absolute lg:top-5 top-3 lg:right-2 -right-3 absolute font-bold lg:text-xl lg:w-auto w-30 text-black dark:text-white">{dailyPercentage.toFixed(0)}% Complete</h1>
            </div>
          </div>
        </div>
        <div className="overflow-scroll bg-white dark:bg-gray-900 scrlnone w-full h-[55%] lg:w-[32%] lg:h-[70%] lg:mt-15 mt-50 lg:absolute lg:right-[35px] lg:bottom-[35px] bg-white dark:bg-gray-900 lg:border-2 border-[#dfdfdf] rounded-2xl p-5">
          <DailyCard
            habits={todaysHabits}
            currentDayIndex={currentDayIndex}
            onUpdate={updateHabitStatus}
            onDelete={handleDeleteHabit}
            onPrevDay={goPrevDay}
            onNextDay={goNextDay}
          />
        </div>
      </div>
    </div>
  );
}
