import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./authentication/signup.js";
import Login from "./authentication/login.js";
import { auth } from './authentication/firebase.js';
import Home from "./homepage/home.js";
import Movies from "./movies-page/movies.js";
import Theatres from "./movie-details/theatres.js";
import Showscreening from './show-details-page/Showscreening.js';
import RecommendedMovies from './homepage/recommendedmovies.js';
import Profile from './profile/profile.js';
import Events from "./events-page/events.js";
import ManageEvent from './manage-event/ManageEvent.js';
import EventDetails from './events-page/eventdetails.js';
import ProtectedRoute from './authentication/protectedroute.js';
import NotFound from './homepage/notfound.js';

function App() {

  //go over all the components and add better namings for comp,variables,functions,classNames wherever possible
  return (

    <Routes>

      <Route path="/" element={<Home />} >
        <Route index element={<RecommendedMovies />} />
        <Route path="movies" element={<Movies />} />
        <Route path="movies/:movieId/theatres" element={<Theatres />} />
        <Route path="movies/:movieId/theatres/:theatreId/shows/:showId" element={<ProtectedRoute><Showscreening /></ProtectedRoute>} />
        <Route path="events" element={<Events />}></Route>
        <Route path="events/:eventId/details" element={<EventDetails />}></Route>
        <Route path="manage-event" element={<ManageEvent />}></Route>
      </Route>
{/* don't show profile button at all when the used is not logged in */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}
export default App;
