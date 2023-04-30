export const getHashParams = () => {
    const hash = window.location.hash.substring(1);
    const paramsArray = hash.split("&");
    const params = {} as Record<string, string>;

    for (let i = 0; i < paramsArray.length; i++) {
        const [key, value] = paramsArray[i].split("=");
        params[key] = value;
    }

    return params;
};
