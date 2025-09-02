import { useQuery } from "@tanstack/react-query";
export default function Rating({ movieId }) {
    const { isPending, error, data } = useQuery({
        queryKey: ["ReviewsOfParticularMovie", movieId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5001/reviews/?movieId=${movieId}`);
            if (!res.ok) throw new Error("Failed to fetch reviews");
            return res.json();
        }

    });
    if (isPending) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    let total = 0;
    for (let i = 0; i < data.length; i++) {
        total += parseFloat(data[i].rating);
    }
    const averageRating = data.length > 0 ? (total / data.length).toFixed(1) : "N/A";
    return (
        <div>
            <p>Average Rating : {averageRating} ({data.length} votes)</p>
        </div>
    )
}