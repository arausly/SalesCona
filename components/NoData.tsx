import Image from "next/image";

//Images
import noDataImg from "@assets/images/no-data.jpg";

export const NoData = ({ msg }: { msg: string }) => {
    return (
        <div className="w-full mt-6 flex flex-col items-center justify-center">
            <div className="w-80 h-80">
                <Image
                    src={noDataImg}
                    alt="no data found"
                    className="object-contain"
                />
            </div>
            <p className="text-xl text-slate-600 font-semibold text-center">
                {msg}
            </p>
        </div>
    );
};
