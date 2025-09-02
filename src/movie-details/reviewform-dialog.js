import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import { useContext, useState } from 'react';
import { AuthContext } from '../authentication/authcontext';
export default function ReviewPopup({ setViewReviewForm, open, onClose, currentMovie,setIsReviewSubmitted }) {
    const [rating, setRating] = useState();
    const { user } = useContext(AuthContext);


    const handleRating = async (e, newValue) => {
        setRating(newValue)
    }

    const handlePost = async (e) => {
        e.preventDefault();
        const review = {
            "userId": user.uid,
            "rating": rating,
            "review-description": e.target.review.value,
            "userName": user.displayName,
            "movieId": currentMovie.id,
        };
        try {
            const res = await fetch(`http://localhost:5001/reviews/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(review),

            });
            if (!res.ok)
                throw new Error("Failed to add a review");
            toast.success("Review added successfully");
            setIsReviewSubmitted(true);
            e.target.reset();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add review");
        } finally {
            setViewReviewForm(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Your Review</DialogTitle>
            <Box sx={{ width: 300, p: 3 }}>
                <Typography variant="h6">Rate this movie</Typography>
                <Slider value={rating} onChange={handleRating}
                    name="rating"
                    valueLabelDisplay="on"
                    step={0.5}
                    marks
                    min={1}
                    max={10} />

                <Typography sx={{ mt: 1 }}>Your Rating: {rating}/10</Typography>
            </Box>
            <form onSubmit={handlePost}>
                <DialogContent>
                    <TextField
                        name="review"
                        label="Write your review"
                        placeholder="Add your review here!!"
                        multiline
                        rows={4}
                        fullWidth
                    />

                </DialogContent>

                <DialogActions>
                    <button className="cancel-button" type="button" onClick={onClose}>CANCEL </button>
                    <button className="post-button" type="submit">POST</button>&nbsp;
                </DialogActions>
            </form>
        </Dialog>);
}