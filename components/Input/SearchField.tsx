import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    inputClassName?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
    className,
    inputClassName,
    ...props
}) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            </div>
            <input
                type="text"
                id="table-search"
                className={`block p-2 pl-10 text-sm text-black border border-gray-50 w-full ${inputClassName}`}
                {...props}
            />
        </div>
    );
};
