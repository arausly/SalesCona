import React from "react";
import Image from "next/image";

//image
import storeDefault from "@assets/images/store-default.png";
import store2Image from "@assets/images/store-image2.png";
import store3Image from "@assets/images/store-image3.png";
import store4Image from "@assets/images/store-image4.png";

export const useGetStoreImage = (nrOfImages: number) => {
    const [selectedImages, setSelectedImages] = React.useState<JSX.Element[]>(
        []
    );

    const generateImages = React.useCallback(() => {
        const picked = [];
        const images = [storeDefault, store2Image, store3Image, store4Image];
        for (let i = 1; i <= nrOfImages; i++) {
            const randomIndex = Math.floor(Math.random() * images.length);
            picked.push(
                <Image
                    src={images[randomIndex]}
                    alt="store default"
                    className="h-full w-full object-contain"
                />
            );
        }
        return picked;
    }, [nrOfImages]);

    React.useEffect(() => {
        setSelectedImages(generateImages());
    }, [generateImages, nrOfImages]);

    return selectedImages;
};
