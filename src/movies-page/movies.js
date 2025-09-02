import './movies.css';
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MovieContext } from '../globalcontext/MovieContextComponent';

//rename this directory to all-movies
export default function Movies() {
//remove unused variables,imports...
  const { currentMovie, setCurrentMovie, selectedLocation } = useContext(MovieContext);
  const navigate = useNavigate();

  const { isPending, error, data: filteredMovies } = useQuery({
    queryKey: ['movies', selectedLocation],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5001/movies`);
      const allMovies = await res.json();

      console.log("Current Location: " + selectedLocation);

      return allMovies.filter(movie =>
        movie.location.includes(selectedLocation.toLowerCase())
      );
    },
  })

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  //naming
  const handleBookingTickets = (movie) => {
    setCurrentMovie(movie);
    navigate(`/movies/${movie.id}/theatres`);
  };

  return (
    <div className='whole-movies-section'>
      <h2>Movies in {selectedLocation}</h2>
      <div className='movies-group'>
        {filteredMovies.map(movie => (
          <div key={movie.id} className='each-movie-card'>
            <img src={movie.poster} alt={movie.title} className='each-movie-img' />
            <h3 className='each-movie-title'>{movie.title}</h3>
            <p className='each-movie-language'>{movie.language}</p>

            <button className="each-movie-button" onClick={() => handleBookingTickets(movie)}>View Theatres</button>

          </div>
        ))}
      </div>
    </div>
  );
}