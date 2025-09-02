import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function ViewReviews({ open, onClose, movieId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!open) return;

        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://localhost:5001/reviews/?movieId=${movieId}`);
                const data = await res.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [open, movieId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Reviews</DialogTitle>
            <DialogContent dividers>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
                            <strong>{review.userName}  {review["rating"]}/10</strong> 
            
                            <p>{review["review-description"]}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet for this movie.</p>
                )}
            </DialogContent>
            <DialogActions>
                <button className="cancel-button" onClick={onClose}>Close</button>
            </DialogActions>
        </Dialog>
    );
}
