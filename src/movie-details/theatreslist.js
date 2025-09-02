import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { MovieContext } from '../globalcontext/MovieContextComponent';
import { useNavigate } from "react-router-dom";
import './theatres.css';
export default function TheatresList() {
    const { currentDate, selectedLocation, currentMovie, currentShow, setCurrentShow, setCurrentTheatre } = useContext(MovieContext);
    const { movieId } = useParams();
    const navigate = useNavigate();
    const { isPending, error, data: filteredTheatres } = useQuery({
        queryKey: ['theatres', selectedLocation, movieId],
        queryFn: async () => {
            console.log("Current Location: " + selectedLocation + "Current Movie " + movieId);
            const res = await fetch(`http://localhost:5001/theatres?location=${selectedLocation.toLowerCase()}`);
            const allTheatres = await res.json();

            return allTheatres.filter(theatre =>
                theatre.movies.includes(movieId)
            );
        }
    });

    if (isPending) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    const handleClick = async (theatre, show) => {
        await setCurrentTheatre(theatre);
        await setCurrentShow(show);
        navigate(`/movies/${currentMovie.id}/theatres/${theatre.theatre_id}/shows/${show.id}`);
        console.log("Selected date "+currentDate);
    }
    return (
        <div>
            {filteredTheatres.length === 0 ?
                (<p className="theatre-card" style={{ fontWeight: "bold" }}>No theatres found for this movie in {selectedLocation}.</p>)
                : (filteredTheatres.map(theatre => (
                    <div key={theatre.theatre_id} className="theatre-card">
                        <div className="theatre-header">
                            <strong>{theatre.name}</strong>
                        </div>
                        <div className="show-buttons">
                            {theatre.shows.map(show => (
                                <button key={show.id} className="show-button" onClick={() => handleClick(theatre, show)}>{show.time}</button>
                            ))}
                        </div>
                    </div>
                )))}
        </div>
    );
}