import { useEffect, useState, type ChangeEvent } from "react";
import axios from "axios";
import { motion } from "motion/react";

export default function AddHabit() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [week, setWeek] = useState<string[]>([])
    const [color, setColor] = useState("")
    const [showColors, setShowColors] = useState(false);
    const [showDays, setShowDays] = useState(false);

    
    const weekList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const colorList = ["#FF0000", "#00E5FF", "#FFA600", "#FF00EE"];
    function getColorName(hex: string) {
        const map: Record<string, string> = {
          "#FF0000": "Red",
          "#00E5FF": "Cyan",
          "#FFA600": "Orange",
          "#FF00EE": "Magenta",
        };
        return map[hex] || hex; // fallback: kalau belum ada di map
    }
    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }


    const handleWeek = (day: string) => {
        setWeek(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day)
            } else {
                return [...prev, day]
            }
        })
    }
    const handleColor = (selectedColor: string) => {
        setColor(prevColor => {
            if (prevColor === selectedColor) {
                return ""
            } else {
                return selectedColor
            }
        })
    }
    
    const handleAddHabit = async () => {
        if (!title || !description) {
            alert("Title dan description harus diisi")
            return
        }

        const dayNameToNumber: { [key: string]: string } = {
            "Mon": "1",
            "Tue": "2",
            "Wed": "3",
            "Thu": "4",
            "Fri": "5",
            "Sat": "6",
            "Sun": "7"
        };

        const days = week.map(dayName => dayNameToNumber[dayName]);

        try {
            const res =  await axios.post("http://localhost:4000/auth/add_habit", {
                title,
                description,
                days,
                color
            })

            alert(res.data.message);
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        console.log(week);
    }, [week])

    useEffect(() => {
        console.log(color);
    }, [color])

    return (
        <div className="w-full h-screen absolute overflow-hidden p-10">
            <div className="absolute border-b-3 border-gray-300 w-full h-30 left-0">
                <input type="text" value={title} onChange={handleTitle} placeholder="Habit Title" maxLength={33} className="ml-10 placeholder-gray-500/30 font-sans font-bold text-[60px] w-full h-auto rounded-[12px] focus:ring-0 outline-none border-gray-500/30 p-4 "/>
            </div>
            <div className="absolute w-full h-screen items-start flex flex-row mt-30 overflow-hidden">
                <textarea value={description} onChange={handleDescription}  placeholder="description" className=" relative text-left placeholder-gray-500/30 font-sans font-small text-[18px] w-[70%] h-[65%] border-2 rounded-[12px] border-gray-500/30 text-start top-10 resize-none" ></textarea>
                <div className="relative h-screen items-center flex flex-col px-20 top-10">
                    <div className="relative right-10 gap-32 flex flex-row">
                        <span className="font-bold text-[20px]">Colour</span>
                        <button
                        onClick={()=> setShowColors(prev => !prev)}
                        className={`border px-4 py-2 w-40 h-10 cursor-pointer rounded-md flex items-center gap-3 transition-all duration-200 ${showColors ? "scale-105" : "scale-100"}`}
                        >
                            {color ? (<div
                            className="flex items-center gap-5">
                                <div
                                className="h-5 w-5 rounded-full border-1"
                                style={{ backgroundColor: color }}/>
                                <span>{getColorName(color)}</span>
                                </div>):(<span className="text-black text-[15px] w-40 font-md">Select a color</span>)}
                        </button>
                        <div
                        className={`absolute right-0 mt-15 w-[55%] p-3 bg-white shadow-lg rounded-lg flex flex-col gap-3 z-20 transition-all duration-200 ${showColors ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
                        {colorList.map((colorItem:string) => (
                            <div
                            onClick={() => setColor(prev => prev === colorItem ? "" : colorItem)}
                            key={colorItem}
                            className="flex items-center gap-3 cursor-pointer group"
                            >
                                <div
                                className={`h-5 w-5 rounded-full transition-all mr-11 ${color === colorItem ? "ring-3 ring-blue-500 scale-105" : "ring-2 ring-transparent"}`}
                                style={{ backgroundColor: colorItem }}
                                />
                                <span className="text-black group-hover:underline">{getColorName(colorItem)}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className="relative top-10 right-10 gap-27 justify-start flex flex-row">
                        <p className="font-bold text-[20px]">Quantity</p>
                        <motion.button
                        onClick={() => setShowDays(prev => !prev) }
                        className={`border px-4 py-2 rounded-md w-40 right-0 transition-all duration-200 cursor-pointer ${showDays ? "scale-110" : "scale-100"}`}
                        >
                            {week.length > 0 ? `${week.length === 7 ? "Everyday" : `${week.length} times a week`}` : "Select days"}
                        </motion.button>
                        {showDays && (
                            <div className="absolute flex gap-3 mt-20 right-0">
                                {weekList.map((day: string) => (
                                    <div
                                    onClick={() => handleWeek(day)}
                                    key={day}
                                    className={`rounded-full h-10 w-10 flex items-center justify-center cursor-pointer transition ${week.includes(day) ? "text-white font-bold" : "text-black font-sm"}`}
                                    style={{
                                        backgroundColor: week.includes(day) ? (color || "#3B82F6") : "#E5E7EB"
                                    }}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative flex flex-row gap-10 mt-90 right-10">
                        <motion.button onClick={handleAddHabit} className="relative right-0 text-black border-2 rounded-full bg-red-500 border-red-500 h-10 w-40" whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}>Cencel</motion.button>
                        <motion.button onClick={handleAddHabit} className="relative right-0 text-blue-500 border-2 rounded-full border-blue-500 h-10 w-40" whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}>Add Habit +</motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}