import { StarIcon } from "@heroicons/react/24/outline";

export const Rating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex flex-row items-center">
            {new Array(5).fill(1).map((star, i) => (
                <StarIcon
                    key={i}
                    stroke="#FFD95A"
                    fill={Math.round(rating) >= i + 1 ? "#FFD95A" : "#ffffff"}
                    strokeWidth={1.5}
                    className="h-5 w-5 mr-px"
                />
            ))}
        </div>
    );
};
