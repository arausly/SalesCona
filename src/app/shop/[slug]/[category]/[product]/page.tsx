"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

import { Rating } from "@components/Rating";
import { useGetLastPathname } from "@hooks/useGetLastPathname";
import {
    convertPathToSpaceSeparatedStr,
    formatTimeAgo,
    formattedPriceInfo,
    spaceSeparatedStrToPath
} from "@lib/format-utils";

//dummy data
import products from "@data/products.json";
import reviews from "@data/reviews.json";

import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    CheckBadgeIcon,
    StarIcon
} from "@heroicons/react/24/outline";
import { VariationBox } from "../../components/VariationBox";
import { ProductQuantityInput } from "../../components/ProductQuantityInput";

//dummy images
import slider1 from "@assets/images/shirts.webp";
import slider2 from "@assets/images/slider2.jpeg";
import slider3 from "@assets/images/slider3.jpeg";
import slider4 from "@assets/images/slider4.jpeg";
import Dropdown from "@components/Menudropdown";
import { RegularAvatar } from "@components/Avatar/RegularAvatar";
import { CustomerReviewForm } from "../../components/CustomerReviewForm";

//constants
const slideImages = new Map([
    [0, slider1],
    [1, slider2],
    [2, slider3],
    [3, slider4]
]);

const ratingSelection = [
    { label: "5 stars rating" },
    { label: "4 stars rating" },
    { label: "3 stars rating" },
    { label: "2 stars rating" },
    { label: "1 star rating" }
];

//dummy function to get product detail
const getProduct = (productName: string) =>
    products.products.find(
        (p) => spaceSeparatedStrToPath(p.product) === productName
    );

export default function Product() {
    const productName = useGetLastPathname();
    const product = getProduct(productName);
    const [selectedVariations, setSelectedVariations] = React.useState<
        Map<string, string>
    >(new Map());
    if (!product) return <></>;
    const { discountedPrice, price } = formattedPriceInfo(
        product?.price,
        product?.discount
    );
    const handleVariationSelection = React.useCallback(
        (type: string, option: string) => {
            setSelectedVariations((prev) => new Map([...prev, [type, option]]));
        },
        []
    );
    const [reviewModalOpen, setReviewModalOpen] =
        React.useState<boolean>(false);

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

    const toggleForm = React.useCallback(() => {
        setReviewModalOpen((m) => !m);
    }, []);

    return (
        <>
            <CustomerReviewForm
                modalOpen={reviewModalOpen}
                toggleModal={toggleForm}
            />
            <div className="flex flex-col gap-10">
                <div className="flex p-6 px-12 gap-10">
                    <div className="flex w-2/4 flex-col">
                        {/** carousel for product images */}
                        <div className="flex-1 flex justify-center">
                            <div className="relative bg-white h-96 w-96 shadow-md rounded-lg">
                                <span className="inline-flex absolute right-0 top-0 h-6 w-14 shadow-md rounded-l-lg justify-center items-center bg-gray-800">
                                    <p className="text-sm text-white">
                                        {currentAboveFoldBannerIndex + 1} of{" "}
                                        {slides.size}
                                    </p>
                                </span>
                                {currentAboveFoldBannerIndex !== 0 ? (
                                    <div
                                        className="absolute z-10 cursor-pointer top-1/2 translate-y-[-50%] left-[-1.5rem] w-12 h-12 flex items-center justify-center text-white primary-bg rounded-full shadow-sm shadow-[#6d67e4]"
                                        onClick={() =>
                                            handleBannerNavigation("backward")
                                        }
                                    >
                                        <ArrowLongLeftIcon className="h-6 w-6" />
                                    </div>
                                ) : null}
                                {currentAboveFoldBannerIndex !==
                                slides.size - 1 ? (
                                    <div
                                        className="absolute z-10 cursor-pointer right-[-1.5rem] top-1/2 translate-y-[-50%] w-12 h-12 flex items-center justify-center text-white primary-bg rounded-full shadow-sm shadow-[#6d67e4]"
                                        onClick={() =>
                                            handleBannerNavigation("forward")
                                        }
                                    >
                                        <ArrowLongRightIcon className="h-6 w-6" />
                                    </div>
                                ) : null}
                                <Image
                                    src={
                                        slides.get(currentAboveFoldBannerIndex)!
                                    }
                                    alt="banner slide"
                                    className="object-cover aspect-square rounded-lg h-full w-full"
                                />
                            </div>
                        </div>
                        {/** reviews */}
                        <div className="flex-1 mt-6">
                            <div className="flex items-center">
                                <StarIcon
                                    stroke="#FFA559"
                                    fill="#FFA559"
                                    strokeWidth={1.5}
                                    className="h-5 w-5 mr-2"
                                />
                                <h3 className="text-xl">
                                    {reviews.overallRating} product rating
                                </h3>
                                <span className="h-5 w-px bg-gray-300 mx-2" />
                                <h3 className="text-xl mr-auto">
                                    {reviews.reviews.length} ratings
                                </h3>
                                <Dropdown
                                    items={ratingSelection}
                                    onSelectItem={(label) => {}}
                                />
                            </div>
                            <button
                                onClick={toggleForm}
                                className="text-white bg-indigo-500 transition border-[#6d67e4] hover:bg-[#6d67e4] w-48 mt-2 flex-1 h-9"
                            >
                                Leave a review
                            </button>
                            <div className="mt-2 flex flex-col overflow-auto h-56">
                                {reviews.reviews.map((review, i) => (
                                    <div
                                        className="flex flex-col mt-3 border-b pb-3 border-gray-200"
                                        key={i}
                                    >
                                        <div className="flex items-center">
                                            <RegularAvatar
                                                name={review.name}
                                                className="mr-2"
                                            />
                                            <div className="flex flex-col">
                                                <p>{review.name}</p>
                                                <div className="flex items-center">
                                                    <Rating
                                                        rating={review.rating}
                                                        size="small"
                                                    />
                                                    <p className="flex text-xs text-gray-500 ml-2">
                                                        {formatTimeAgo(
                                                            new Date(
                                                                review.date
                                                            ).getTime()
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-sm ml-1 overflow-hidden text-ellipsis whitespace-wrap">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex w-2/4 flex-col">
                        <div className="flex flex-col pb-3 border-b border-slate-200">
                            <h3 className="capitalize text-2xl font-semibold break-words">
                                {
                                    convertPathToSpaceSeparatedStr(
                                        product.product
                                    ).fmt
                                }
                            </h3>
                            <div className="flex items-center mt-1">
                                {product.review ? (
                                    <>
                                        <div className="flex items-center">
                                            <Rating
                                                rating={product.review.score}
                                            />
                                            <p className="text-base ml-1 text-gray-500">
                                                {product.review.score}
                                            </p>
                                        </div>
                                        <span className="h-5 w-px bg-gray-300 mx-2" />
                                        <p className="text-sm text-gray-500">
                                            {product.review.count} Reviews
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No reviews yet
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center mt-1">
                                {!!Number(product.inventoryCount) ? (
                                    <div className="flex items-center">
                                        <p className="text-xs font-light text-green-700">
                                            Stock Available
                                        </p>
                                        <span className="h-5 w-px bg-gray-300 mx-2" />
                                        <p className="text-sm text-gray-500">
                                            {product.inventoryCount} units
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs font-light text-red-700">
                                        Sold out
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center mt-1">
                                {product.discount ? (
                                    <span className="mr-2 inline-flex items-center justify-center bg-[#CEE5D0] rounded-full py-0.5 px-1">
                                        <CheckBadgeIcon className="h-5 w-5 text-green-700 mr-0.5" />
                                        <p className="text-xs text-green-700">
                                            {product.discount}%
                                        </p>
                                    </span>
                                ) : null}
                                <p className="text-sm text-gray-400 line-through">
                                    {price}
                                </p>
                                <p className="ml-2 text-lg font-semibold">
                                    {product.discount ? discountedPrice : price}
                                </p>
                            </div>
                            <div className="flex items-center mt-1">
                                <p className="text-gray-700 text-sm">
                                    {product.delivery.free
                                        ? "Free shipping"
                                        : `Shipping from ${product.delivery.cost.toLocaleString(
                                              "en-US",
                                              {
                                                  style: "currency",
                                                  currency: "USD",
                                                  minimumFractionDigits: 2
                                              }
                                          )}`}
                                </p>
                            </div>
                        </div>
                        {product.variations ? (
                            <div className="mt-4 border-b pb-3 border-slate-200">
                                {Object.entries(product.variations).map(
                                    ([type, options], i) => (
                                        <div className="">
                                            <p className="capitalize mb-2">
                                                Select {type}
                                            </p>
                                            <VariationBox
                                                type={type}
                                                options={options}
                                                onSelect={
                                                    handleVariationSelection
                                                }
                                                selectedOption={selectedVariations.get(
                                                    type
                                                )}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : null}
                        <div className="mt-4 flex">
                            <div className="flex items-end gap-10 flex-1">
                                <div className="flex flex-col flex-1">
                                    <p className="mb-2">Quantity</p>
                                    <ProductQuantityInput
                                        isCancelable={false}
                                    />
                                </div>
                                <button className="text-white bg-indigo-500 transition border-[#6d67e4] hover:bg-[#6d67e4] flex-1 h-9">
                                    Add to bag
                                </button>
                            </div>
                            <div className="flex-1"></div>
                        </div>
                        <div className="flex mt-6 flex-col">
                            <p className="mb-2">Description</p>
                            <p className="text-gray-600">
                                {product.description}
                            </p>
                        </div>
                        {product.address ? (
                            <div className="flex mt-6 flex-col">
                                <p className="mb-2">
                                    Pickup Address Information
                                </p>
                                <p className="text-gray-600">
                                    {product.address}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>
                {/** related products */}
                <div></div>
            </div>
        </>
    );
}
