import { useEffect, useState, type ChangeEvent } from "react";
import axios from "axios";

export default function AddHabit() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [week, setWeek] = useState<string[]>([])
    const [color, setColor] = useState("")
    
    const weekList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const colorList = ["#FF0000", "#00E5FF", "#FFA600", "#FF00EE"];

    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleDescription = (e: ChangeEvent<HTMLInputElement>) => {
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
        <div>
            <input type="text" value={title} onChange={handleTitle} placeholder="title" />
            <input type="text" value={description} onChange={handleDescription} placeholder="description" />
            <button onClick={handleAddHabit}>add Habit</button>
            {weekList.map((day:string) => (
                <div onClick={() => handleWeek(day)} className="bg-red-500" key={day}>
                    <h1 className="text-black">{day}</h1>
                </div>
            ))}

            {colorList.map((colorItem:string) => (
                <div onClick={() => handleColor(colorItem) } key={colorItem} style={{backgroundColor: colorItem, width: "100px", height: "100px", border: color === colorItem ? "5px solid black" : ""}}></div>
            ))}
        </div>
    )
}