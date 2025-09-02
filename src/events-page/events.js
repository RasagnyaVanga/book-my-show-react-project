import './events.css';
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MovieContext } from '../globalcontext/MovieContextComponent';

export default function Events() {

    const { currentEvent, setCurrentEvent, selectedLocation } = useContext(MovieContext);
    const navigate = useNavigate();

    const { isPending, error, data } = useQuery({
        queryKey: ['events', selectedLocation,currentEvent.availableTickets],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5001/events?location=${selectedLocation.toLowerCase()}`);
            return await res.json();
        }
    });

    if (isPending) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleBookingEvents = (event) => {
        setCurrentEvent(event);
        navigate(`/events/${event.id}/details`);
    };

    return (
        <div className='whole-events-section'>
            <h2>Events in {selectedLocation}</h2>
            <div className='events-group'>
                {data.map(event => (
                    <div key={event.id} className='each-event-card'>
                        <img src={event.poster} alt={event.type} className='each-event-img' />
                        <h3 className='each-event-title'>{event.title}</h3>
                        <p className='each-event-language'>{event.location}</p>

                        <button className="each-event-button" onClick={() => handleBookingEvents(event)}>View Details</button>

                    </div>
                ))}
            </div>
        </div>
    );
}

