import { toast } from "react-toastify";
import { useState,useContext } from "react";
import { AuthContext } from "../authentication/authcontext";
import './ManageEvent.css';

export default function ManageEvent() {
    const { user } = useContext(AuthContext);
    
    const [loading,setLoading] = useState(false);
    const handleAddition = async (e) => {
        e.preventDefault();
        setLoading(true);

        const addingEvent = {
            managedBy: user.uid,
            type: e.target.type.value,
            title: e.target.title.value,
            location: e.target.location.value.toLowerCase(),
            date: e.target.date.value,
            time: e.target.time.value,
            availableTickets: Number(e.target.tickets.value),
            poster: e.target.poster.value,
            description: e.target.description.value
        };
        try{
            const res=await fetch(`http://localhost:5001/events/`,{
                method : "POST",
                headers : {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(addingEvent),
            });
            if(!res.ok)
                throw new Error("Failed to add event");
            toast.success("Event added successfully");
            e.target.reset();
        } catch(error){
            console.error(error);
            toast.error("Failed to add event");
        } finally{
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <form onSubmit={handleAddition} className="manage-event-form">
                <label className="label" htmlFor="eventType">Event Type:</label>
                <input className="input" type="text" id="eventType" name="type" placeholder="Enter the type of the event you want to add"></input>
               
               <label className="label" htmlFor="eventTitle">Event Title:</label>
                <input className="input" type="text" id="eventTitle" placeholder="Title" name="title"></input>

                <label className="label" htmlFor="location">Event location:</label>
                    <select id="location" name="location">
                        <option>Hyderabad</option>
                        <option>Bangalore</option>
                        <option>Chennai</option>
                        <option>Kerala</option>
                        <option>Mumbai</option>
                    </select>

                <label className="label" htmlFor="date" >Event Date:</label>
                <input className="input" type="date" id="date" name="date" placeholder="When do you want to manage the event?"></input>
               
                <label className="label" htmlFor="time" >Event Time:</label>
                <input className="input" type="time" id="time" name="time" placeholder="When do you want to start to manage the event?"></input>

                <label className="label" htmlFor="available_tickets">Available Tickets:</label>
                <input className="input" type="number" id="available_tickets" name="tickets" placeholder="Number of tickets?"></input>
               
                <label className="label" htmlFor="poster">Poster URL:</label>
                <input className="input" type="text" id="poster" name="poster" placeholder="give an image link that tells about your event"></input>
               
                <label className="label" htmlFor="description">Description:</label>
                <textarea className="textarea" id="description" name="description" placeholder="Write a short description based on the event"></textarea>
               
                <button className="profile-submit-button" type="submit" disabled={loading}>
                    {loading?("Adding..."):("ADD")}
                </button>
            </form>
        </div>
    );
}