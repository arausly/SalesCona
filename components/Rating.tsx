import { StarIcon } from "@heroicons/react/24/outline";

const starSize = {
    small: "h-3 w-3",
    normal: "h-5 w-5"
};

export const Rating = ({
    rating,
    size = "normal"
}: {
    rating: number;
    size: "small" | "normal";
}) => {
    return (
        <div className="flex flex-row items-center">
            {new Array(5).fill(1).map((star, i) => (
                <StarIcon
                    key={i}
                    stroke="#FFA559"
                    fill={Math.round(rating) >= i + 1 ? "#FFA559" : "#ffffff"}
                    strokeWidth={1.5}
                    className={`${starSize[size]} mr-px`}
                />
            ))}
        </div>
    );
};
