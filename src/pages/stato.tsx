import { motion } from "framer-motion";
import arrow2 from "../assets/icon/Arrow2.svg"
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Starto() {
    const [start, setStart] = useState(false);
    const nav = useNavigate();
    return (
        <div className="bg-white w-full h-screen overflow-hidden absolute justify-center items-center flex flex-col px-4">
            <motion.div className="absolute rounded-[100%] bg-gradient-to-b from-[#2DA4FF] to-[#007BFF] pointer-events-none left-1/2 top-[-45vh] -translate-x-1/2 pointer-events-none h-[130vh] w-[300vw] sm:top-[-30vh] sm:w-[250vw] sm:h-[110vh] lg:w-[150vw] lg:h-[120vh]" initial={{opacity: 1}} animate={{opacity: start ? 0 : 1}}></motion.div>

            <motion.div className="select-none relative z-10 flex flex-col items-center text-center mt-[-10vh] sm:mt-[-20vh] lg:mt-[-10vh]" initial={{y: 100, opacity: 0}} animate={{y: start ? -400 : 0 , opacity: start ? 0 : 1}} transition={{y:{type: "spring" , bounce: 0.5, duration: 2}, opacity:{duration: 0.4}}}>
                <p className="text-white text-[2vh] sm:text-[3vh] lg:text-[4vh]">Welcome to</p>
                <h1 className="mt-[-0.2vh] lg:mt-[-2vh] text-white font-bold leading-none text-[64px] sm:text-[120px] lg:text-[200px] my-2 sm:my-4">ROUTINA</h1>
                <p className="text-white text-[2vh] sm:text-[3vh] lg:text-[4vh] max-w-900 sm:max-w-l">Your personal habit training web base app</p>
            </motion.div>
            <motion.button className="bg-white h-[7vh] text-[#0090FF] rounded-md px-10 z-10 py-4 mt-[30vh] sm:mb-[0vh] lg:mt-[20vh] text-lg sm:text-xl font-bold flex items-center gap-3" initial={{scale: 1, y: 100, opacity: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)",}} whileHover={{scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.45)"}} whileTap={{scale: 0.95}} animate={{y: start ? 600 : 0, opacity: start ? 0 : 1}} transition={{y:{type: "spring", duration: 2}, opacity:{duration: 0.4}}} onClick={()=> {setStart(true); setTimeout(() => {nav("/login")}, 800)}}>Start Now <img src={arrow2} className="relative bottom-[-2px] left-3"/></motion.button>
        </div>
    )
}