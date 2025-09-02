import ChairIcon from '@mui/icons-material/Chair';
import { useState, useEffect} from 'react';
import './showscreening.css';
import { useContext } from 'react';
import { MovieContext } from '../globalcontext/MovieContextComponent';
import { useParams } from "react-router-dom";
import { auth } from '../authentication/firebase';
import { toast } from 'react-toastify';

export default function Showscreening() {

    const rows = 14, cols = 20;
    const [selectedSeats, setSelectedSeats] = useState([]); 
    const { currentDate, bookedSeats,setBookedSeats,currentMovie, currentShow, currentTheatre, selectedLocation} = useContext(MovieContext);

    const generateSeatId = (row, col) => `R${row + 1}C${col + 1}`;

    const toggleSeat = (seatId) => {
        if (bookedSeats.includes(seatId)) return; //not able to toggle the booked seats

        setSelectedSeats(prev =>
            prev.includes(seatId) ?
                (prev.filter(seat => seat !== seatId)) : //toggling - removing
                [...prev, seatId] //toggling - adding 
        )
    }
  useEffect(() => {
        const fetchBookedSeats = async () => {
            try {
                const res = await fetch(`http://localhost:5001/bookings?movie_id=${currentMovie.id}&theatre_id=${currentTheatre.theatre_id}&show_time=${currentShow.time}`);
                const data = await res.json();

                const seats = data.flatMap(b => b.seats);
                setBookedSeats(seats); //setting booked seats on every mount
            } catch (err) {
                console.error("Failed to fetch booked seats", err);
            }
        };

        if (currentTheatre && currentShow) {
            fetchBookedSeats();
        }
    }, [currentTheatre, currentShow, setBookedSeats]); //fetching the bookedtickets for every unmount so we will be able to see updated data

    const bookSeats = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat to book.");
            return;
        }
        const bookingData = {
            user_id: auth.currentUser.uid,
            type:"movie",
            movie_id: currentMovie.id,
            movie_name: currentMovie.title,
            theatre_id: currentTheatre.theatre_id,
            theatre_name: currentTheatre.name,
            show_date:currentDate,
            show_time: currentShow.time,
            seats: selectedSeats,
            location: selectedLocation,
            booking_time: new Date().toISOString()
        };
        try {
            const response = await fetch("http://localhost:5001/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                setBookedSeats(prev => [...prev, ...selectedSeats]);
                toast.success(`Successfully booked seats: ${selectedSeats.join(", ")}`);
                setSelectedSeats([]);
                console.log(bookedSeats);
            } else {
                const errorData = await response.json();
                console.error("Booking failed:", errorData);
                alert("Failed to book seats. Please try again.");
            }
        } catch (error) {
            console.error("Error while booking:", error);
            alert("Server error occurred while booking.");
        }
    };

    return (
        <div className='seating-wrapper'>
            <table className='seat-table'>
                <tbody>
                    {Array.from({ length: rows }, (_, row) => (
                        <tr key={row}>
                            {Array.from({ length: cols }, (_, col) => {
                                const seatId = generateSeatId(row, col);
                                const isSelected = selectedSeats.includes(seatId);
                                const isBooked = bookedSeats.includes(seatId);
                                return (
                                    <td key={seatId} className="seat-icon-wrapper" onClick={() => toggleSeat(seatId)}>
                                        <ChairIcon
                                            className={`seat-icon
                                                 ${isSelected ? "selected" : ""}
                                                 ${isBooked ? "booked":""}`}
                                        />
                                    </td>
                                );
                            })}
                        </tr>

                    ))}
                </tbody>
            </table>
            <div className="booking-controls">
                <button className="book-button" onClick={bookSeats}>
                    Book Selected Seats
                </button>

            </div>

        </div>
    );
}
