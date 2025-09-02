import React from "react";
import './generatedates.css';
import { useContext} from "react";
import { MovieContext } from '../globalcontext/MovieContextComponent';

export default function GenrateCurrentDates() {
    const {currentDate,setCurrentDate} = useContext(MovieContext);
    const today = new Date();
    const dates = Array.from({ length: 5 }, (_, i) => {
        const d = new Date(today);

        d.setDate(today.getDate() + i);
        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    });

    const handleDateClick=(date)=>{
        setCurrentDate(date);
    }
    return (
        <div className = "date-navbar">{
            dates.map((date,idx)=>
                <button onClick={()=>handleDateClick(date)}
             className={currentDate === date ? "date-button selected" : "date-button"}
                >
                    {date}
                </button>
            )}
            </div>
    );

}
