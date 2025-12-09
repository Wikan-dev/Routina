import React from 'react';

interface DayMarkersProps {
    week: string[];
    habitColor?: string;
}

const DayMarkers: React.FC<DayMarkersProps> = ({ week, habitColor }) => {
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDayColor = (dayStatus: string, color?: string): string => {
        if (dayStatus === "done") {
            return color || "#3B82F6";
        } else if (dayStatus === "not_done") {
            return "#D1D5DB";
        } else {
            return "transparent";
        }
    };

    return (
        <div className='flex gap-17 ml-15'>
            {week.map((day, index) => (
                <div key={index} className='flex flex-col items-center'>
                    <span className='text-xs text-gray-600 font-semibold mb-1'>
                        {dayLabels[index]}
                    </span>
                    <div
                        className={`w-8 h-8 rounded ${day === 'none' ? 'opacity-0' : 'opacity-100'}`}
                        style={{backgroundColor: getDayColor(day, habitColor)}}
                        title={dayLabels[index]}
                    ></div>
                </div>
            ))}
        </div>
    );
};

export default DayMarkers;
