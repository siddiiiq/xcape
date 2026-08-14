import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadGoogleMaps } from "../../utils/loadGoogleMaps.js";
import { MAP_STYLE } from "../../constants/mapStyle.js";

const EMBER = "#c98a4b";
const INK = "#0a0a0a";

// A teardrop pin drawn as an SVG path so it can be recolored to match the
// site's accent, rather than using Google's default red marker.
const pinIcon = (maps) => ({
  path: "M12 0C7.03 0 3 4.03 3 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.97-4.03-9-9-9z",
  fillColor: EMBER,
  fillOpacity: 1,
  strokeColor: INK,
  strokeWeight: 1.5,
  scale: 1.5,
  anchor: new maps.Point(12, 24),
});

// Shows every published place that has coordinates on a custom dark map.
// Hovering a pin shows the place name; clicking it navigates to that place's
// dedicated page. Renders a friendly message instead of a blank box if the
// API key isn't configured yet, or if no places have coordinates.
const PlacesMap = ({ places = [] }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | ready | no-key | error

  const pinned = places.filter(
    (p) => typeof p.coordinates?.lat === "number" && typeof p.coordinates?.lng === "number"
  );

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      setStatus("no-key");
      return undefined;
    }
    if (pinned.length === 0) return undefined;

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !containerRef.current) return;

        const bounds = new maps.LatLngBounds();
        pinned.forEach((p) => bounds.extend({ lat: p.coordinates.lat, lng: p.coordinates.lng }));

        const map = new maps.Map(containerRef.current, {
          center: bounds.getCenter(),
          zoom: 6,
          styles: MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          backgroundColor: INK,
        });

        const infoWindow = new maps.InfoWindow({ disableAutoPan: true });

        pinned.forEach((place) => {
          const marker = new maps.Marker({
            position: { lat: place.coordinates.lat, lng: place.coordinates.lng },
            map,
            title: place.title,
            icon: pinIcon(maps),
            animation: maps.Animation.DROP,
          });

          marker.addListener("mouseover", () => {
            infoWindow.setContent(
              `<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:600;color:#0a0a0a;padding:2px 6px;">${place.title}</div>`
            );
            infoWindow.open({ map, anchor: marker });
          });
          marker.addListener("mouseout", () => infoWindow.close());
          marker.addListener("click", () => navigate(`/places/${place.slug}`));
        });

        if (pinned.length > 1) {
          map.fitBounds(bounds, 64);
        } else {
          map.setZoom(9);
        }

        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned.map((p) => p._id).join(",")]);

  if (pinned.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm text-fog/50">
          No places have coordinates yet — add a latitude and longitude to a place in the admin to plot it here.
        </p>
      </div>
    );
  }

  if (status === "no-key") {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm text-fog/50">
          The map isn't configured yet. Add a <code className="text-ember">VITE_GOOGLE_MAPS_API_KEY</code> to{" "}
          <code className="text-ember">frontend/.env</code> to show pinned places here.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm text-fog/50">Couldn't load the map. Double-check your Google Maps API key and that billing is enabled.</p>
      </div>
    );
  }

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 sm:h-[480px]">
      <div ref={containerRef} className="h-full w-full" />
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-charcoal text-sm text-fog/40">
          Loading map...
        </div>
      )}
    </div>
  );
};

export default PlacesMap;
