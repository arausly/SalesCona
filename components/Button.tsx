interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    text: string;
    loadingText?: string;
    textClassNames?: string;
    leftIcon?: JSX.Element;
}

export const Button: React.FC<ButtonProps> = ({
    loading,
    text,
    loadingText,
    leftIcon,
    textClassNames,
    ...otherBtnProps
}) => {
    return (
        <button type="button" {...otherBtnProps}>
            {loading ? (
                <svg
                    className="animate-spin h-5 w-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        d="M12 2a10 10 0 0 1 0 20"
                    ></path>
                </svg>
            ) : (
                leftIcon
            )}
            <p className={textClassNames}> {loading ? loadingText : text} </p>
        </button>
    );
};
