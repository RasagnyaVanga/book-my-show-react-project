import { Link } from "react-router-dom";
import React from "react";
import "./secondnavbar.css";
export default function SecNavbar() {
    return (
        <div className="second-navbar-in-home">
            <div className="left-portion">
                <Link className="each-link" to="movies">Movies</Link>
                <Link className="each-link" to="events">Events</Link> 
            </div >
            <div className="right-portion">
                <Link className="each-link" to="manage-event">Manage Event</Link>
            </div>
        </div>
    )
}