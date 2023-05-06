import { truncateString } from "@lib/format-utils";

interface TableProps {
    title: string;
    headers: Array<{
        id: string;
        label: string;
    }>;
    rows: { [key: string]: string | JSX.Element }[];
    pagination: {
        finalPage: number;
        totalItemsCount: number;
        pageItemCount: number;
    };
    onSearch: (query: string) => void;
    onPaginate: (page: number) => void;
}

export const Table: React.FC<TableProps> = ({
    title,
    headers,
    rows,
    pagination,
    onPaginate,
    onSearch,
}) => {
    return (
        <div className="relative overflow-x-auto w-full">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <p className="mb-2 md:mb-0">{title}</p>
                <div className="pb-4 bg-white">
                    <label htmlFor="table-search" className="sr-only">
                        Search
                    </label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            className="block p-2 pl-10 text-sm text-black border border-gray-100 rounded-lg w-80 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search items"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-slate-100">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header.id}
                                scope="col"
                                className="px-6 py-3"
                            >
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr
                            key={i}
                            className="bg-white border-b hover:bg-gray-50 dark:hover:bg-slate-50"
                        >
                            {headers.map((header) => (
                                <td
                                    key={header.id}
                                    className="px-6 text-gray-600 py-4"
                                >
                                    {truncateString(row[header.id], 40)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav
                className="flex items-center justify-between pt-4"
                aria-label="Table navigation"
            >
                <span className="text-sm font-normal text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-sm text-gray-600">
                        1-{pagination.pageItemCount}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-sm text-gray-600">
                        {pagination.totalItemsCount}
                    </span>
                </span>
                <ul className="inline-flex items-center -space-x-px">
                    <li>
                        <a
                            href="#"
                            className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg"
                        >
                            <span className="sr-only">Previous</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </a>
                    </li>
                    {new Array(Math.min(5, pagination.finalPage))
                        .fill(1)
                        .map((_, pageIndex) => (
                            <li key={pageIndex}>
                                <a
                                    href="#"
                                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                                >
                                    {pageIndex + 1}
                                </a>
                            </li>
                        ))}
                    {pagination.finalPage > 6 && (
                        <li>
                            <a
                                href="#"
                                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            >
                                ...
                            </a>
                        </li>
                    )}
                    <li>
                        <a
                            href="#"
                            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        >
                            {pagination.finalPage}
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg"
                        >
                            <span className="sr-only">Next</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
