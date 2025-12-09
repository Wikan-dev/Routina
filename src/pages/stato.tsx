import { motion } from "framer-motion";
import bluesEllipse from "../assets/icon/ellipse.svg"
import arrow2 from "../assets/icon/Arrow2.svg"
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Starto() {
    const [start, setStart] = useState(false);
    const nav = useNavigate();
    return (
        <div className="bg-white w-full h-screen overflow-hidden absolute justify-center items-center flex flex-col">
            <motion.img src={bluesEllipse} className="h-auto w-[4000px] abso  absolute top-[-400px] max-[1441px]:top-0" initial={{opacity: 1}} animate={{opacity: start ? 0 : 1}} />
            <motion.div className="flex flex-col justify-start z-10 relative top-[-250px] max-[1441px]:top-[-250px] text-left" initial={{y: 100, opacity: 0}} animate={{y: start ? -400 : 0 , opacity: start ? 0 : 1}} transition={{y:{type: "spring" , bounce: 0.5, duration: 2}, opacity:{duration: 0.4}}}>
                <p className="text-[40px] text-white mt-50">Welcome to</p>
                <h1 className="text-white text-[256px] font-bold mt-[-100px]">ROUTINA</h1>
                <p className="text-[40px] text-white mt-[-90px]">Your personal habit training web base app</p>
            </motion.div>
            <motion.button className="text-[#0090FF] bg-white rounded-[2px] w-90 h-20 text-[40px] font-medium relative z-10 top-[-200px] justify-center items-center flex cursor-pointer" initial={{scale: 1, y: 100, opacity: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)"}} whileHover={{scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.45)"}} whileTap={{scale: 0.95}} animate={{y: start ? 600 : 0, opacity: start ? 0 : 1}} transition={{y:{type: "spring", duration: 2}, opacity:{duration: 0.4}}} onClick={()=> {setStart(true); setTimeout(() => {nav("/login")}, 800)}}>Start Now <img src={arrow2} className="relative bottom-[-4px] right-[-40px]"/></motion.button>
        </div>
    )
}