import { useContext, useEffect, useRef, useState } from "react";
import { MovieContext } from '../globalcontext/MovieContextComponent.js';
import { toast } from "react-toastify";
import './theatres.css';
import GenerateCurrentDates from "./generatedates.js";
import TheatresList from "./theatreslist.js";
import { useParams } from "react-router-dom";
import { AuthContext } from "../authentication/authcontext.js";
import ViewReviews from "./viewreviews.js";
import ReviewPopup from "./reviewform-dialog.js";
import Rating from "./rating.js";

// rename as Movie-Details
export default function Theatres() {
    const { movieId } = useParams();
    const theatreRef = useRef(null);
    const { currentMovie } = useContext(MovieContext);
    const { user } = useContext(AuthContext);

    const [viewReviews, setViewReviews] = useState(false);
    const [viewReviewForm, setViewReviewForm] = useState(false);
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
    const [updatedReviewsData,setUpdatedReviewsData]=useState([]);

    const fetchRatingData = async () => {
        try {
            const res = await fetch(`http://localhost:5001/reviews/?movieId=${movieId}`);
            const ReviewsData = await res.json();
            setUpdatedReviewsData(ReviewsData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect( () => {
       fetchRatingData();
    }, [isReviewSubmitted, movieId]);

    const handleViewReviewButton = () => {
        setViewReviews(true);
    };

    const handleReviewFormButton = async () => {
        try {
            if (!user) {
                toast.error("You should login to add a review");
                return;
            }
            //add better names for response saying what it contains
            const res = await fetch(`http://localhost:5001/bookings/?movie_id=${currentMovie.id}&user_id=${user.uid}`);
            const data = await res.json(); //checking if user saw movie
            //console.log(data);
            const reviewRes = await fetch(`http://localhost:5001/reviews/?movieId=${currentMovie.id}&userId=${user.uid}`)
            const reviewData = await reviewRes.json(); //checking if user already added review
            //console.log(reviewData);

            if (reviewData.length > 0) {
                toast.error("You already added a review for this movie");
            }
            else {
                if (data.length > 0) {
                    //if the particular user has booked and saw the movie
                    setViewReviewForm(true);
                } else {
                    toast.error("You must book tickets before adding a review");
                }
            }
        }
        catch (error) {
            console.error(error);
            toast.error("Failed to check eligibility");
        }
    };

    const handleCloseReviewsDialog = () => {
        setViewReviews(false);
    };

    const handleCancel = () => {
        setViewReviewForm(false);
    }


    return (
        <div>
            {currentMovie ? (
                <>
                    <div className="movie-page">

                        <div className="movie-banner-space" >
                            <div className="movie-banner" style={{ backgroundImage: `url(${currentMovie["background-img"]})` }}></div>
                            <div className="movie-banner-content">
                                <div className="poster-box">
                                    <img src={currentMovie.poster}
                                        alt={currentMovie.title}
                                        className="movie-poster" />
                                    <p style={{ textAlign: "center" }}>in cinemas</p>
                                </div>
                                <div className="movie-info">
                                    <h1 className="movie-title">{currentMovie.title}</h1>
                                    <Rating movieId={currentMovie.id} latestReviewData={updatedReviewsData} />
                                    <div className="movie-languages">
                                        <span className="lang-tag">
                                            {currentMovie.language}
                                        </span>
                                    </div>
                                    <p className="movie-genre">{currentMovie.genre}</p>
                                    <div className="buttons">
                                        <button className="book-btn" onClick={() => theatreRef.current?.scrollIntoView({ behavior: 'smooth' })}>Book tickets</button>
                                        <button className="review-btn" onClick={handleReviewFormButton}>Add a review</button>
                                        <button className="view-reviews-btn" onClick={handleViewReviewButton}>View reviews</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {viewReviewForm &&
                            <ReviewPopup open={viewReviewForm}
                                onClose={handleCancel}
                                setViewReviewForm={setViewReviewForm}
                                setIsReviewSubmitted={setIsReviewSubmitted}
                                currentMovie={currentMovie}
                            />
                        }
                        <ViewReviews
                            open={viewReviews}
                            onClose={handleCloseReviewsDialog}
                            movieId={currentMovie?.id}
                        />

                        <div className="movie-description">
                            <h2>About the movie</h2>
                            <p>{currentMovie.description}</p>
                        </div>
                    </div>
                </>) : (
                <p>No movie selected. Please go back to movies.</p>
            )}
            <div ref={theatreRef}>
                <GenerateCurrentDates />
                <TheatresList />
            </div>

        </div>
    );
}