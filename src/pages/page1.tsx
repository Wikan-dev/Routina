import '../App.css';
import arrow from '../assets/icon/arrow.svg'
import { motion } from 'motion/react';
import habits from '../../backend/data/habits.json';
import habit_logs from '../../backend/data/habit_logs.json';
import { useState } from "react";
import Menu from '../component/menu';

const habitData = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
    const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    return d >= firstDay && d <= lastDay;
}

export default function Page1() {
    const totalHabits = habits.length;
    const TARGET = 7;
    const totalTarget = totalHabits * TARGET;
    const totalDone = habit_logs.filter(
        (l) => habitData(l.date) && l.active === true
    ).length;
    const percentage = Math.min(
        Math.round((totalDone / totalTarget) * 100),
        100
    );
    const [menuOpen, setMenuOpen] = useState(false);

    // Ambil username dari localStorage
    const getUsername = () => {
        const profileStr = localStorage.getItem("user_profile");
        if (profileStr) {
            try {
                const profile = JSON.parse(profileStr);
                return profile.name || "User";
            } catch (err) {
                console.error("Error parsing profile:", err);
            }
        }
        return "User";
    };

    const username = getUsername();
    return (
        <div className="bg-white w-full h-screen flex flex-col justify-start items-start">
            <div className="h-20 w-auto max-w-500 absolute top-12 left-12 flex items-center gap-10 flex-row">
                <div className='rounded-full border-2 border-[#DFDFDF] w-20 h-20 bg-[#DFDFDF] cursor-pointer' onClick={() => setMenuOpen(!menuOpen)}>
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
                <h1 className='text-[30px] font-bold'>Hey There, {username}</h1>
            </div>
            <p className='text-black opacity-50 absolute top-40 left-12 text-[18px]'>5 hrs 42 mins till bed time</p>
            <div className="w-[60%] h-auto absolute mt-50 left-12 flex justify-between items-center flex-row">
                <div className='flex flex-row items-center gap-9'>
                    <div className='flex flex-row gap-3'>
                        <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center cursor-pointer' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}}>
                            <img src={arrow} alt="arrow left" className='w-4 h-auto' />
                        </motion.button>
                        <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center cursor-pointer' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}}>
                            <img src={arrow} alt="arrow right" className='w-4 h-auto' style={{ transform: "rotate(180deg)" }} />
                        </motion.button>
                    </div>
                    <h1 className='text-black text-[18px] font-bold'>Mon, feb 11 - Mon, Feb 18</h1>
                </div>
                <motion.button className="rounded-full border-2 border-gray-300 w-50 h-12 ml-70 text-blue-500 cursor-pointer" whileHover={{scale: 1.1}} whileTap={{scale:0.95}}>Add habit +</motion.button>
                {/* Progress Bar */}
                <div className="absolute mt-40 w-full">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className='h-full bg-blue-500 transition-all duration-300' style={{width: `${percentage}%`}}></div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <p className="text-black text-sm">{percentage}% more than last week</p>
                        <p className="text-black opacity-60 text-sm">{percentage}% achieved</p>
                    </div>
                </div>
            </div>
        </div>
    )
}