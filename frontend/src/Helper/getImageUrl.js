export const getImageUrl = (resource, fallback = "/user.png") => {
    if (!resource) return fallback;

    if (typeof resource === "string") return resource;

    // Support both { url: "..." } and {secure_url:"..."}
    if (resource.url) return resource.url;
    if (resource.secure_url) return resource.secure_url;

    return fallback;
};
