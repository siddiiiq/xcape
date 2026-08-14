// Loads the Google Maps JS API exactly once, however many components ask for
// it, and resolves with the `google.maps` namespace. Plain script injection
// rather than an extra npm dependency, since this is the only place it's used.
let loadPromise = null;

export const loadGoogleMaps = (apiKey) => {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-google-maps]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google.maps));
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Google Maps"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
};

export default loadGoogleMaps;
