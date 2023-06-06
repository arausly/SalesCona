export const SortBy = () => {
    return (
        <div className="flex flex-col bg-white py-6 px-12">
            <p className="uppercase font-normal tracking-wider mb-4">Sort by</p>
            <div className="flex flex-col">
                {/**by view count */}
                <p className="font-light cursor-pointer hover:text-[#6d67e4] mb-2">
                    Trending
                </p>
                {/** recently stocked increment */}
                <p className="font-light cursor-pointer hover:text-[#6d67e4] mb-2">
                    Latest arrivals
                </p>
                <p className="font-light cursor-pointer hover:text-[#6d67e4] mb-2">
                    Price: Low to high
                </p>
                <p className="font-light cursor-pointer hover:text-[#6d67e4]">
                    Price: High to low
                </p>
            </div>
        </div>
    );
};
