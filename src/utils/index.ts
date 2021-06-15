export const toTitleCase = (str: string) => {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export const deepCopy = (source: any) => {
    return JSON.parse(JSON.stringify(source));
}

export const isEmpty = (obj: any) => {
    if (typeof obj === 'string' && obj.length > 0) return false;
    if (Array.isArray(obj) && obj.length > 0) return false;
    if (obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0) return false;
    return true;
}

export const validURL = (url: string) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
}