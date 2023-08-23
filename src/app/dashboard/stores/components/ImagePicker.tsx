import FileWidget, { FileWithPreview } from "@components/FileWidget";
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    FolderIcon,
    PhotoIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

//styles
import styles from "../styles/store-create.module.css";
import { formatByteToSize } from "@lib/format-utils";

interface ImagePickerProps {
    maxFiles: number;
    handleFileChange: (files: FileWithPreview[]) => void;
    title: string;
    description?: string;
    dimensionInfo?: string;
    logo?: FileWithPreview;
    presetBanners?: Map<number, FileWithPreview>;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
    maxFiles,
    handleFileChange,
    title,
    description,
    dimensionInfo,
    logo,
    presetBanners
}) => {
    const [aboveFoldBanners, setAboveFoldBanners] = React.useState<
        Map<number, FileWithPreview>
    >(presetBanners ?? new Map());
    const [currentAboveFoldBannerIndex, setCurrentAboveFoldBannerIndex] =
        React.useState<number>(0);

    const handleBannerInputChange = React.useCallback(
        (files: FileWithPreview[]) => {
            /** if the files are multiple  spread across the indexes, else */
            setAboveFoldBanners((prevBanners) => {
                const newBanners = new Map([
                    ...prevBanners,
                    ...files
                        .slice(0, maxFiles - currentAboveFoldBannerIndex)
                        .map(
                            (f, i) =>
                                [currentAboveFoldBannerIndex + i, f] as [
                                    number,
                                    FileWithPreview
                                ]
                        )
                ]);
                handleFileChange(Array.from(newBanners.values()));
                return newBanners;
            });
        },
        [currentAboveFoldBannerIndex]
    );

    const handleBannerNavigation = React.useCallback(
        (direction: "forward" | "backward") => {
            setCurrentAboveFoldBannerIndex((prevIndex) =>
                direction === "backward"
                    ? Math.max(0, prevIndex - 1)
                    : Math.min(maxFiles - 1, prevIndex + 1)
            );
        },
        []
    );

    const handleRemoveBannerSlide = React.useCallback(
        (removeBannerIndex: number) => {
            setAboveFoldBanners((prev) => {
                prev.delete(removeBannerIndex);
                const newBanners = new Map([...prev]);
                handleFileChange(Array.from(newBanners.values()));
                return newBanners;
            });
        },
        []
    );

    return (
        <div className="flex flex-col">
            {/** slider and dropbox */}
            <div className="flex relative h-80">
                {currentAboveFoldBannerIndex !== 0 ? (
                    <div
                        className="absolute z-10 cursor-pointer top-1/2 left-[-1.25rem] w-10 h-10 flex items-center justify-center text-white primary-bg rounded-full"
                        onClick={() => handleBannerNavigation("backward")}
                    >
                        <ArrowLongLeftIcon className="h-5 w-5" />
                    </div>
                ) : null}

                {currentAboveFoldBannerIndex !== maxFiles - 1 ? (
                    <div
                        className="absolute z-10 cursor-pointer right-[-1.25rem] top-1/2  w-10 h-10 flex items-center justify-center text-white primary-bg rounded-full"
                        onClick={() => handleBannerNavigation("forward")}
                    >
                        <ArrowLongRightIcon className="h-5 w-5" />
                    </div>
                ) : null}
                <div className="flex flex-col w-full">
                    <div className="flex mb-1">
                        <p className="mr-1">{title}</p>
                        <span className="text-[#6d67e4]">*</span>
                    </div>
                    <p className="text-xs font-light mb-2">{description}</p>
                    {/**Image picker */}
                    <FileWidget
                        maxFiles={maxFiles}
                        handleFiles={handleBannerInputChange}
                        className="w-full relative h-full border flex flex-col justify-center items-center border-slate-200 border-dashed rounded-md cursor-pointer"
                    >
                        {(logo && (
                            <div className="z-20 absolute top-2 left-2 h-12 w-20">
                                <Image
                                    src={logo.preview}
                                    alt="brand logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )) ||
                            null}
                        <div className="z-20 absolute rounded-l-lg right-0 top-0 bg-gray-800 flex items-center justify-center h-6 w-14 shadow-md">
                            <p className="text-white">
                                {currentAboveFoldBannerIndex + 1} of {maxFiles}
                            </p>
                        </div>
                        {aboveFoldBanners.has(currentAboveFoldBannerIndex) ? (
                            <div className="w-full h-full relative">
                                <Image
                                    src={
                                        aboveFoldBanners.get(
                                            currentAboveFoldBannerIndex
                                        )?.preview!
                                    }
                                    alt="above fold banner"
                                    fill
                                    className={`${styles.aboveFoldBannerAnimation} w-full h-full object-cover rounded-md`}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center p-6">
                                <div className="h-20 w-20 flex items-center rounded-md justify-center bg-slate-50">
                                    <PhotoIcon className="h-11 w-11 text-slate-900" />
                                </div>
                                <p className="text-sm text-slate-600 mt-3">
                                    Drag & drop or
                                    <a className="ml-1 text-[#6d67e4]">
                                        Choose file
                                    </a>{" "}
                                    to upload
                                </p>
                                <p className="text-xs text-slate-400 mt-3">
                                    SVG, PNG, JPG, or GIF {`(${dimensionInfo})`}
                                </p>
                            </div>
                        )}
                    </FileWidget>
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <FolderIcon className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-gray-500">
                    Files ({aboveFoldBanners.size} of {maxFiles} )
                </p>
            </div>
            <div className="mt-4 flex flex-wrap">
                {Array.from(aboveFoldBanners.entries()).map((banner, index) => (
                    <div
                        key={index}
                        className="flex h-20 w-full md:w-2/5 rounded-md shadow-md mb-4 md:mr-4 p-2"
                    >
                        <Image
                            src={banner[1].preview}
                            alt="banner"
                            width={80}
                            height={80}
                            className="object-cover rounded-md"
                        />
                        <div className="flex flex-col ml-2">
                            <p className="text-xs text-gray-800 mb-2 text-ellipsis overflow-hidden">
                                {banner[1].name}
                            </p>
                            {banner[1].size ? (
                                <p className="text-xs text-gray-700">
                                    {formatByteToSize(banner[1].size)}
                                </p>
                            ) : null}
                        </div>
                        <div
                            className="flex ml-auto rounded-sm flex-col items-center justify-center w-8 h-8 hover:bg-red-100"
                            onClick={() => handleRemoveBannerSlide(index)}
                        >
                            <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
