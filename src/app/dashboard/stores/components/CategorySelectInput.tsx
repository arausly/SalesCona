import React from "react";

//dummy data
import predefinedCategories from "@data/categories.json"; //todo replace with API data
import MultiSelectInput from "@components/Input/MultiSelectInput";

interface CategorySelectInputProps {
    onSelect: () => void;
}

export const CategorySelectInput: React.FC<CategorySelectInputProps> = ({
    onSelect
}) => {
    const [categories, setCategories] = React.useState(
        predefinedCategories.entries
    );

    //todo this should call real api to update predefined categories
    const handleCreateNewCategoryItem = React.useCallback(
        (label: string) => {
            const newCategory = {
                label,
                id: `${categories.length + 1}`
            };
            setCategories((prev) => [...prev, newCategory]);
            return newCategory;
        },
        [categories.length]
    );

    return (
        <MultiSelectInput
            items={categories}
            onSelect={onSelect}
            createNewItem={handleCreateNewCategoryItem}
        />
    );
};
