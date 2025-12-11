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
        <div className="w-full h-screen items-start flex flex-col gap-5 p-10 overflow-hidden absolute">
            <div className="absolute border-b-3 border-gray-300 w-full h-30 left-0">
                <input type="text" value={title} onChange={handleTitle} placeholder="Habit Title" maxLength={33} className="ml-10 placeholder-gray-500/30 font-sans font-bold text-[60px] w-full h-auto rounded-[12px] focus:ring-0 outline-none border-gray-500/30 p-4 "/>
            </div>
            <textarea value={description} onChange={handleDescription}  placeholder="description" className=" relative mt-40 text-left placeholder-gray-500/30 font-sans font-small text-[18px] w-[70%] h-900 border-2 rounded-[12px] border-gray-500/30 text-start align-top resize-none" ></textarea>
            <motion.button onClick={handleAddHabit} className="absolute bottom-10 right-10 text-blue-500 border-2 rounded-full border-blue-500 h-10 w-40" whileHover={{scale: 1.2}} whileTap={{scale: 0.9}}>Add Habit +</motion.button>
            {colorList.map((colorItem:string) => (
                <div onClick={() => handleColor(colorItem) } key={colorItem} style={{backgroundColor: colorItem, width: "100px", height: "100px", border: color === colorItem ? "5px solid black" : ""}}></div>
            ))}
            <div className="absolute top-90 right-10 gap-27 justify-start flex flex-row">
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
                            className={`rounded-full h-10 w-10 flex items-center justify-center cursor-pointer transition ${week.includes(day) ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}