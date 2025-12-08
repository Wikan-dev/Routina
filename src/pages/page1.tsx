import '../App.css';
import arrow from '../assets/icon/arrow.svg'
import { motion } from 'motion/react';
import habits from '../../backend/data/habits.json';
import habit_logs from '../../backend/data/habit_logs.json';

const habitData = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
    const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    return d >= firstDay && d <= lastDay;
}

export default function Page1() {
    const totalHabits = habits.filter((h) => h.active).length;
    const TARGET = 7;
    const totalTarget = totalHabits * TARGET;
    const totalDone = habit_logs.filter((l) => habitData(l.date)).length;
    const percentage = Math.min(
        Math.round((totalDone / totalTarget) * 100),
        100
    );
    return (
        <div className="bg-white w-full h-screen flex flex-col justify-start items-start">
            <div className="h-20 w-auto max-w-500 absolute top-12 left-12 flex items-center gap-10 flex-row">
                <div className='rounded-full border-2 border-[#DFDFDF] w-20 h-20 bg-[#DFDFDF]'></div>
                <h1 className='text-[30px] font-bold'>Hey There, User</h1>
            </div>
            <p className='text-black opacity-50 absolute top-40 left-12 text-[18px]'>5 hrs 42 mins till bed time</p>
            <div className="    w-auto h-18 absolute top-55 left-12 flex justify-center items-center gap-4 flex-row">
                <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}}>
                    <img src={arrow} alt="arrow left" className='w-4 h-auto' />
                </motion.button>
                <motion.button className='rounded-full h-12 w-12 border-2 border-gray-300 grid place-items-center' whileHover={{scale: 1.1}} whileTap={{scale: 0.95}}>
                    <img src={arrow} alt="arrow right" className='w-4 h-auto' style={{ transform: "rotate(180deg)" }} />
                </motion.button>
                <h1 className='text-black text-[18px] font-bold'>Mon, feb 11 - Mon, Feb 18</h1>
                <motion.button className="rounded-full border-2 border-gray-300 w-50 h-12 ml-50 text-blue-500" whileHover={{scale: 1.1}} whileTap={{scale:0.95}}>Add habit +</motion.button>
            </div>
            {/* Progress Bar */}
            <div className="absolute top-[200px] left-12 w-[600px]">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    
                </div>
            </div>
        </div>
    )
}