export const preventCopy = (event: React.ClipboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
};
