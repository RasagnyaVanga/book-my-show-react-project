import { useQuery } from "@tanstack/react-query";
export default function Rating({ movieId, latestReviewData }) {
    // console.log("data from rating" + latestReviewData);
    let total = 0;
    for (let i = 0; i < latestReviewData.length; i++) {
        total += parseFloat(latestReviewData[i].rating);
    }
    const averageRating = latestReviewData.length > 0 ? (total / latestReviewData.length).toFixed(1) : "N/A";
    return (
        <div>
            <p>Average Rating : {averageRating} ({latestReviewData.length} votes)</p>
        </div>
    )
}