// recommendedMovies is not making sense
import './recommendedmovies.css';
import { useQueries } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieContext } from '../globalcontext/MovieContextComponent';
export default function RecommendedMovies() {
    const navigate = useNavigate();
    const { setCurrentMovie,setCurrentEvent } = useContext(MovieContext);

    const [movieQuery, eventQuery] = useQueries({
        queries: [
            {
                queryKey: ["allMovies"],
                queryFn: async () => {
                    const res = await fetch(`http://localhost:5001/movies`);
                    if (!res.ok) throw new Error("Failed to fetch movies");
                    return res.json();
                },
            },
            {
                queryKey: ["allEvents"],
                queryFn: async () => {
                    const res = await fetch(`http://localhost:5001/events`);
                    if (!res.ok) throw new Error("Failed to fetch events");
                    return res.json();
                },
            }
        ]
    });

    if (movieQuery.isPending || eventQuery.isPending) return <p>Loading...</p>;
    if (movieQuery.error || eventQuery.error) return <p>Error loading data.</p>;

    const allMovies=movieQuery.data;
    const allEvents=eventQuery.data;

    // better naming - handleMovieClick
    const handleBookingMovieTickets = (movie) => {
        setCurrentMovie(movie);
        navigate(`/movies/${movie.id}/theatres`);
    };

    const handleBookingEventTickets = (event) => {
        setCurrentEvent(event);
        navigate(`/events/${event.id}/details`);
    };

    return (

        //Use a common component CARD for all the movies/events and use it where ever needed
        <div className="whole-recommended-section">
            <h2>Recommended Movies</h2>
            <div className='rec-group'>
                {allMovies.map(movie => (
                    <div key={movie.id} className='rec-each-card'>
                        <img src={movie.poster} alt={movie.title} className='rec-each-img' />
                        <h3 className='rec-each-title'>{movie.title}</h3>
                        <p className='rec-each-language'>{movie.language}</p>

                        <button className="rec-each-button" onClick={() => handleBookingMovieTickets(movie)}>View Theatres</button>
                    </div>
                ))}
            </div>
            <h2>Recommended Events</h2>
            <div className='rec-group'>
                {allEvents.map(event => (
                    <div key={event.id} className='rec-each-card'>
                        <img src={event.poster} alt={event.title} className='rec-each-img' />
                        <h3 className='rec-each-title'>{event.title}</h3>
                        <p className='rec-eacht-language'>{event.location}</p>

                        <button className="rec-each-button" onClick={() => handleBookingEventTickets(event)}>View Event Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
}