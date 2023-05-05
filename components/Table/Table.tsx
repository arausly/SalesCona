import { truncateString } from "@lib/format-utils";

interface TableProps {
    title: string;
    headers: Array<{
        id: string;
        label: string;
    }>;
    rows: { [key: string]: string | JSX.Element }[];
}

export const Table: React.FC<TableProps> = ({ title, headers, rows }) => {
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
        </div>
    );
};
