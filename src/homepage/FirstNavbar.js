import logo from "./Bookmyshow-logoid.png";
import { useContext } from "react";
import { auth } from '../authentication/firebase';
import './firstnavbar.css';
import { MovieContext } from "../globalcontext/MovieContextComponent";
import { Link } from "react-router-dom";
import { AuthContext } from "../authentication/authcontext";
export default function FirstNavbar() {
    const { selectedLocation, setSelectedLocation } = useContext(MovieContext);
    const { user } = useContext(AuthContext);
    const handleLocationChange = (e) => {
        setSelectedLocation(e.target.value);
    }
    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <div className="first-navbar">
            <div className="left-portion" ><Link to="/"><img className="logo" src={logo} alt="BookMyShow logo" /></Link></div>
            {/* <SearchAppBar/> */}
            <div className="right-portion">   <select className="location-select" value={selectedLocation} onChange={(e) => handleLocationChange(e)}>
                {/*store the data in a datastructure and loop over it to avoid redundancy */}
                <option> Hyderabad</option>
                <option> Bengaluru</option>
                <option> Chennai</option>
                <option> Kerala</option>
                <option> Mumbai</option>
            </select>
            {(user) &&
                <button className="button" onClick={handleLogout}>Logout</button>
            } 
            { (!user) &&
                <Link to="login"><button className="button">Login/Signup</button></Link>
            }
                <Link  to="/profile"><button className="button">Profile</button></Link>
            </div>
        </div>
    );
}