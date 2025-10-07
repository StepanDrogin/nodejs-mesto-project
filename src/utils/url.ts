export const isValidUrl = (url: string): boolean => /^https?:\/\/(?:www\.)?[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}(?:\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=0-9]*)?#?$/.test(url) && !/^https?:\/\/(?:www\.)?[A-Za-z0-9-]+$/.test(url);

export default isValidUrl;
