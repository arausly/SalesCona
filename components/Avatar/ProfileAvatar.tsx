import Image, { StaticImageData } from "next/image";

import styles from "./avatar.module.css";

interface IProps {
    src: StaticImageData;
    className: string;
}

export const ProfileAvatar: React.FC<IProps> = ({
    src,
    className,
    ...otherProps
}) => {
    return (
        <div
            className={`w-8 h-8 rounded-full object-cover ${className}`}
            {...otherProps}
        >
            <Image
                className="w-full h-full rounded-full"
                src={src}
                alt="profile"
            />
        </div>
    );
};
