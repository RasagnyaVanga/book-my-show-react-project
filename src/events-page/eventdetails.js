import './eventdetails.css';
import { useContext, useEffect, useRef } from 'react';
import { MovieContext } from '../globalcontext/MovieContextComponent';
import Input from '@mui/material/Input';
import { toast } from 'react-toastify';
import { auth } from '../authentication/firebase';
import { AiOutlineCalendar } from "react-icons/ai";
import { FaRegClock } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { SlPeople } from "react-icons/sl";

export default function EventDetails() {
    const { currentEvent, setCurrentEvent, selectedLocation } = useContext(MovieContext);
    const ticketInputRef = useRef();

    const handleClick = async (e) => {
        e.preventDefault();

        const ticketstobebooked = parseInt(ticketInputRef.current.value);

        if (isNaN(ticketstobebooked) || ticketstobebooked <= 0) {
            toast.error("Please enter a valid number of tickets.");
            return;
        }
        if (ticketstobebooked > currentEvent.availableTickets) {
            toast.error(`Only ${currentEvent.availableTickets} are available`);
            return;
        }

        try {
            //update backend on the booked-data
            const patchRes = await fetch(`http://localhost:5001/events/${currentEvent.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    availableTickets: currentEvent.availableTickets - ticketstobebooked
                })

            });
            if (!patchRes.ok) {
                throw new Error("Failed to update tickets.");
            }

            //  Re-fetch latest event data after updating tickets on backend
            const updatedEvent = await fetch(`http://localhost:5001/events/${currentEvent.id}`)
                .then(res => res.json());

            setCurrentEvent(updatedEvent);

            const bookingData = {
                user_id: auth.currentUser.uid,
                type: "event",
                event_id: currentEvent.id,
                event_title: currentEvent.title,
                event_type: currentEvent.type,
                time: currentEvent.time,
                seats: ticketstobebooked,
                location: selectedLocation,
                booking_time: new Date().toISOString()
            };
            const postRes = await fetch("http://localhost:5001/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingData)
            });

            if (!postRes.ok) {
                const errorData = await postRes.json();
                console.error("Booking log failed:", errorData);
                toast.error("Booking was updated but logging failed.");
            } else {

                toast.success(`Successfully booked ${ticketstobebooked} tickets.`);
            }
        }
        catch (error) {
            console.error("Error while booking:", error);
            alert("Server error occurred while booking.");
        }


    }
    return (
        <div className="event-details">
            <div className='left'><img className="image" src={currentEvent.poster} alt="event picture" /></div>
            <div className='right'>
                <div className="booking-box">
                    <h1 className='title'>{currentEvent.title}</h1>
                    <p style={{ fontSize: "25px" }}>About Event</p>
                    <p className='description'>{currentEvent.description}</p>
                    <div className="booking-details-box">
                        <div className='details-with-icons'>
                        <div className='each-detail'>
                            <AiOutlineCalendar /> {currentEvent.date}
                        </div>
                        <div className='each-detail' >
                            <FaRegClock /> {currentEvent.time}
                        </div>
                        <div className='each-detail'>
                             <SlPeople /> Age Limit - 16 yrs+
                        </div>
                        <div className='each-detail'>
                             <IoLocationOutline /> {currentEvent.location}
                        </div>
                    </div>
                        <h2 style={{ color:" #f84464"}}>Available tickets {currentEvent.availableTickets}</h2>
                        <label htmlFor='tickets-to-be-booked'>Number of tickets to book: </label>
                        <input type="number" id="tickets-to-be-booked" name="tickets" ref={ticketInputRef} />
                        <button onClick={handleClick} className="book-button">Book tickets</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
