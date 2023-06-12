import React from "react";
import { StarIcon } from "@heroicons/react/24/outline";

const starSize = {
    small: "h-3 w-3",
    normal: "h-5 w-5",
    large: "h-8 w-8"
};

interface RatingProps {
    rating: number;
    size?: keyof typeof starSize;
    isInteractive?: boolean;
    handleRatingChange?: (score: number) => void;
}

export const Rating = ({
    rating,
    size = "normal",
    isInteractive,
    handleRatingChange
}: RatingProps) => {
    const [interactiveScore, setInteractiveScore] = React.useState<number>(1);
    const score = isInteractive ? interactiveScore : rating;

    const handleMouseOver = React.useCallback(
        (ratingScore: number) => {
            if (isInteractive) {
                setInteractiveScore(ratingScore);
                handleRatingChange && handleRatingChange(ratingScore);
            }
        },
        [isInteractive, handleRatingChange]
    );

    return (
        <div className="flex flex-row items-center">
            {new Array(5).fill(1).map((star, i) => (
                <StarIcon
                    key={i}
                    onMouseDown={() => handleMouseOver(i + 1)}
                    onMouseOver={() => handleMouseOver(i + 1)}
                    stroke="#FFA559"
                    fill={Math.round(score) >= i + 1 ? "#FFA559" : "#ffffff"}
                    strokeWidth={1.5}
                    className={`${
                        starSize[size]
                    } mr-px transition ease-in-out ${
                        isInteractive ? "cursor-pointer" : "cursor-default"
                    }`}
                />
            ))}
        </div>
    );
};
