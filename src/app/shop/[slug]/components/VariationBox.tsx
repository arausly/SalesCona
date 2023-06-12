import { Tooltip } from "@components/BottomTooltip";
import React from "react";

interface VariationProps {
    type: string;
    options: string[];
    //selected variation option
    onSelect: (type: string, option: string) => void;
    selectedOption?: VariationProps["options"][number];
}

export const VariationBox: React.FC<VariationProps> = ({
    type,
    options,
    selectedOption,
    onSelect
}) => {
    return (
        <div className="overflow-x-auto mb-3 flex overflow-y-hidden">
            {type !== "color"
                ? options.map((option) => (
                      <div
                          onClick={() => onSelect(type, option)}
                          className={`${
                              selectedOption === option
                                  ? "bg-black"
                                  : "bg-zinc-200"
                          } flex text-sm items-center justify-center rounded-md shadow-sm transition ease-in-out mr-2 py-1 px-2 cursor-pointer`}
                      >
                          <p
                              className={`${
                                  selectedOption === option
                                      ? "text-white"
                                      : "text-black"
                              } transition ease-in-out`}
                          >
                              {option}
                          </p>
                      </div>
                  ))
                : options.map((option) => (
                      <div
                          onClick={() => onSelect(type, option)}
                          className={`${
                              selectedOption === option
                                  ? "border-black"
                                  : "border-gray-200"
                          }  border relative h-8 w-8 rounded-full shadow-sm flex justify-center items-center transition ease-in-out mr-2 cursor-pointer`}
                      >
                          <div
                              className="rounded-full h-6 w-6"
                              style={{
                                  backgroundColor: option
                                      .split(" ")
                                      .slice(-1)[0]
                                      .toLowerCase()
                              }}
                          />
                      </div>
                  ))}
        </div>
    );
};
