export const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    return `${backendUrl}${url}`;
};
