import React from "react";
import { truncateString } from "@lib/format-utils";
import { SearchField } from "@components/Input/SearchField";

interface TableProps {
    title: string | JSX.Element;
    headers: Array<{
        id: string;
        label: string | JSX.Element;
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

//Todo pagination is broken, fix after launch
export const Table: React.FC<TableProps> = ({
    title,
    headers,
    rows,
    pagination,
    onPaginate,
    onSearch,
}) => {
    const [paginationRange, setPaginationRange] = React.useState([1, 5]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);

    const updateCurrentPage = React.useCallback(
        (page: number) => {
            onPaginate(page);
            setCurrentPage(page);
        },
        [onPaginate]
    );

    const handlePageSelection = React.useCallback(
        (action: string) => {
            if (typeof action === "string") {
                switch (action) {
                    case "back":
                        setPaginationRange(([start, end]) => {
                            const newStart = Math.max(1, start - 1);
                            updateCurrentPage(newStart);
                            return [newStart, Math.max(5, end - 1)];
                        });
                        break;
                    case "forward":
                        setPaginationRange(([start, end]) => {
                            const newStart = Math.min(
                                pagination.finalPage - 4,
                                start + 1
                            );
                            updateCurrentPage(newStart);
                            return [
                                newStart,
                                Math.min(pagination.finalPage - 1, end + 1),
                            ];
                        });
                        break;
                }
            }
        },
        [updateCurrentPage, pagination.finalPage]
    );

    const paginationNumbers = React.useCallback(() => {
        const pageNumbers = [];
        const [start, end] = paginationRange;

        for (let page = start; page <= end; page++) {
            pageNumbers.push(
                <li
                    onClick={() => updateCurrentPage(page)}
                    className={`px-3 cursor-pointer py-2 ${
                        currentPage === page ? "bg-gray-100" : "bg-white"
                    } leading-tight text-gray-500  border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                    key={page}
                >
                    {page}
                </li>
            );
        }
        return pageNumbers;
    }, [paginationRange, currentPage, updateCurrentPage]);

    return (
        <div className="relative overflow-x-auto w-full">
            <div className="flex flex-col md:flex-row items-center justify-between">
                {typeof title === "string" ? (
                    <p className="mb-2 md:mb-0 font-semibold">{title}</p>
                ) : (
                    title
                )}
                <div className="pb-4 bg-white">
                    <label htmlFor="table-search" className="sr-only">
                        Search
                    </label>
                    <SearchField
                        className="w-80"
                        placeholder="Search"
                        onChange={(e) => onSearch(e.target.value)}
                    />
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
                                    className="px-6 text-gray-600 py-4 truncate"
                                >
                                    {truncateString(row[header.id], 40)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav
                className="flex flex-col md:flex-row items-center justify-between pt-4"
                aria-label="Table navigation"
            >
                <span className="text-sm font-normal text-sm text-gray-600 mb-2 md:md-0">
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
                    <li onClick={() => handlePageSelection("back")}>
                        <a
                            href="#"
                            className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 rounded-l-lg"
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
                    {paginationNumbers()}
                    {pagination.finalPage > 6 &&
                        pagination.finalPage - 1 !== paginationRange[1] && (
                            <li className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">
                                ...
                            </li>
                        )}
                    <li
                        onClick={() => updateCurrentPage(pagination.finalPage)}
                        className={`px-3 cursor-pointer py-2 leading-tight text-gray-500 ${
                            currentPage === pagination.finalPage
                                ? "bg-gray-100"
                                : "bg-white"
                        } border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                    >
                        {pagination.finalPage}
                    </li>
                    <li onClick={() => handlePageSelection("forward")}>
                        <a
                            href="#"
                            className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100"
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
