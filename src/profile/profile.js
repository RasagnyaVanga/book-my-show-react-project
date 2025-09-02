import { auth } from "../authentication/firebase";
import { useQueries } from "@tanstack/react-query";
import { CgProfile } from "react-icons/cg";
import './profile.css';
import { AuthContext } from "../authentication/authcontext";
import { useContext } from "react";

export default function Profile() {
    const handleLogout = () => {
        auth.signOut();
    }
    const { user } = useContext(AuthContext);
    const [movieQuery, eventQuery, managedEventsQuery] = useQueries({
        queries: [
            {
                queryKey: ["movieBookings", user.uid],
                queryFn: async () => {
                    const res = await fetch(`http://localhost:5001/bookings?user_id=${user.uid}&type=movie`);
                    if (!res.ok) throw new Error("Failed to fetch movie bookings");
                    return res.json();
                }
            },
            {
                queryKey: ["eventBookings", user.uid],
                queryFn: async () => {
                    const res = await fetch(`http://localhost:5001/bookings?user_id=${user.uid}&type=event`);
                    if (!res.ok) throw new Error("Failed to fetch event bookings");
                    return res.json();
                }
            }
            ,
            {
                queryKey: ["managedEvents", user.uid],
                queryFn: async () => {
                    const res = await fetch(`http://localhost:5001/events?managedBy=${user.uid}`);
                    if (!res.ok) throw new Error("Failed to fetch event bookings");
                    return res.json();
                }
            }
        ]
    });

    if (movieQuery.isPending || eventQuery.isPending || managedEventsQuery.isPending) return <p>Loading...</p>;
    if (movieQuery.error || eventQuery.error || managedEventsQuery.error)  return <p>Error loading data.</p>;

    const movieData = movieQuery.data;
    const eventData = eventQuery.data;
    const managedEventsData = managedEventsQuery.data;

    return (
        <div className="profile-box">
            <div className="profile">
                <div style={{ display: "flex", fontSize: "50px", gap: "30px" }}><CgProfile /> {user.displayName.toUpperCase()}</div>
                <div>
                    {movieData.map((movie, index) =>
                    <div className="booking-box">
                        <p>Movie - {movie.movie_name}</p>
                        <p>Location - {movie.location}</p>
                        <p>Theatre - {movie.theatre_name}</p>
                        <p>Show on - {movie.show_date}</p>
                        <p>Show at - {movie.show_time}</p>
                        <p>Seats booked - {movie.seats}</p>
                    </div>
                )}
                </div>
                <div>
                {eventData.map((event, index) =>
                    <div className="booking-box">
                        <p>Event title - {event.event_title}</p>
                        <p>Event type - {event.event_type}</p>
                        <p>At - {event.location}</p>
                        <p>Starts at - {event.time}</p>
                        <p>Seats booked - {event.seats}</p>
                    </div>
                )}
                </div>
                <div>
                    <h3>Managed Events</h3>
                    {managedEventsData && managedEventsQuery.data.length > 0 ? (
                        managedEventsData.map((managedEvent, index) =>
                            <div className="booking-box" key={index}>
                                <p>Event title - {managedEvent.title}</p>
                                <p>Event type - {managedEvent.type}</p>
                                <p>At - {managedEvent.location}</p>
                                <p>On - {managedEvent.date}</p>
                                <p>Starts at - {managedEvent.time}</p>
                            </div>
                        )
                    ) : (
                        <p>No managed events yet.</p>
                    )}
                </div>
                <button className="button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}