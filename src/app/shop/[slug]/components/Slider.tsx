"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

//dummy sliders images
import slider1 from "@assets/images/slider1.jpeg";
import slider2 from "@assets/images/slider2.jpeg";
import slider3 from "@assets/images/slider3.jpeg";
import slider4 from "@assets/images/slider4.jpeg";

import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon
} from "@heroicons/react/24/outline";

const slideImages = new Map([
    [0, slider1],
    [1, slider2],
    [2, slider3],
    [3, slider4]
]);

export const Slider = () => {
    const [slides, setSlides] =
        React.useState<Map<number, StaticImageData>>(slideImages);
    const [currentAboveFoldBannerIndex, setCurrentAboveFoldBannerIndex] =
        React.useState<number>(0);

    const handleBannerNavigation = React.useCallback(
        (direction: "backward" | "forward") => {
            setCurrentAboveFoldBannerIndex((prevIndex) =>
                direction === "backward"
                    ? Math.max(0, prevIndex - 1)
                    : Math.min(slides.size - 1, prevIndex + 1)
            );
        },
        []
    );

    return (
        <div className="h-2/5 w-screen relative">
            <div className="absolute z-10 top-0 left-0 bottom-0 right-0 bg-black opacity-20" />
            {currentAboveFoldBannerIndex !== 0 ? (
                <div
                    className="absolute z-10 cursor-pointer top-1/2 left-8 w-12 h-12 flex items-center justify-center text-white primary-bg rounded-full shadow-sm shadow-[#6d67e4]"
                    onClick={() => handleBannerNavigation("backward")}
                >
                    <ArrowLongLeftIcon className="h-6 w-6" />
                </div>
            ) : null}

            {currentAboveFoldBannerIndex !== slides.size - 1 ? (
                <div
                    className="absolute z-10 cursor-pointer right-8 top-1/2 w-12 h-12 flex items-center justify-center text-white primary-bg rounded-full shadow-sm shadow-[#6d67e4]"
                    onClick={() => handleBannerNavigation("forward")}
                >
                    <ArrowLongRightIcon className="h-6 w-6" />
                </div>
            ) : null}
            <Image
                src={slides.get(currentAboveFoldBannerIndex)!}
                alt="banner slide"
                fill
                className="object-cover"
            />
        </div>
    );
};
