import { createContext, useState } from "react";

export const MovieContext = createContext();

export default function MovieProvider({ children }) {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Hyderabad"); //default hyderabad
  const [currentTheatre, setCurrentTheatre] = useState(null);
  const [currentShow, setCurrentShow] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [currentEvent, setCurrentEvent] = useState([]);
  const [currentDate,setCurrentDate]= useState();

  //We don't need the global context for any of the current states cause we can get the data by calling the API
  //We need it only for selectedLocation as we need it across the Application
  
  return (
    <MovieContext.Provider value={{  currentEvent, setCurrentEvent, bookedSeats, setBookedSeats, 
    currentShow, setCurrentShow, currentTheatre, setCurrentTheatre,currentMovie, setCurrentMovie, 
    selectedLocation, setSelectedLocation , currentDate, setCurrentDate}}>
      {children}
    </MovieContext.Provider>
  );
};
