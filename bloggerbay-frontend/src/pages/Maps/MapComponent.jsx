import React, { useEffect, useState } from "react";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const Map = ({ currentLocation, otherLocations }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!currentLocation || !otherLocations || otherLocations.length === 0) {
      return;
    }

    const mapCenter = new window.google.maps.LatLng(
      currentLocation.latitude,
      currentLocation.longitude
    );

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(mapCenter); // Include current location in the bounds

    otherLocations.forEach((location) => {
      bounds.extend(
        new window.google.maps.LatLng(location.latitude, location.longitude)
      );
    });

    const mapElement = document.getElementById("google-map");
    if (!mapElement) {
      console.error("Map element not found.");
      return;
    }

    const newMap = new window.google.maps.Map(mapElement, {
      center: mapCenter,
      zoom: 10, // Default zoom level
    });

    newMap.fitBounds(bounds); // Automatically adjust zoom and center to fit the bounds
    setMap(newMap);

    // Add marker for current location
    const currentLocationMarker = new window.google.maps.Marker({
      position: mapCenter,
      map: newMap,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      label: {
        text: "You are Here",
        color: "darkblue",
      },
    });

    const marker = new window.google.maps.Marker({
      position: mapCenter,
      icon: {
        url: "http://maps.gstatic.com/mapfiles/ms2/micons/green.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      map: newMap,
    });

    const infowindow = new window.google.maps.InfoWindow({
      content: `<div>${currentLocation.locationName}</div>`,
    });

    window.google.maps.event.addListener(marker, "click", function () {
      console.log("Clicked");
      infowindow.open(newMap, marker);
      infowindow.setContent(
        `<div>You are currently in ${currentLocation.locationName}`
      );
    });
    let iconComponent = <MusicNoteIcon />;

    // Add markers for other locations with info windows
    otherLocations.forEach((location, index) => {
      let iconUrl = null; // Default icon URL

      // Determine icon URL based on category
      if (location.category === "sports") {
        iconUrl = "http://maps.gstatic.com/mapfiles/ms2/micons/golfer.png";
      } else if (location.category === "restaurant") {
        iconUrl = "http://maps.gstatic.com/mapfiles/ms2/micons/restaurant.png";
      } else {
        iconUrl = null;
      }

      const marker = new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: newMap,
        icon: {
          url: iconUrl,
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });

      const infowindow = new window.google.maps.InfoWindow({
        content: `<div>${location.locationName}</div>`,
      });

      window.google.maps.event.addListener(marker, "click", function () {
        console.log("Clicked");
        infowindow.open(newMap, marker);
        infowindow.setContent(
          `<div>Name: ${location.locationName}<br/> Timings:${
            location.timings || "Please check it offline"
          } </div>`
        );
      });
    });

    // Zoom in when the user clicks on the current location marker
    currentLocationMarker.addListener("click", () => {
      newMap.setZoom(15); // Set a higher zoom level
      newMap.setCenter(currentLocationMarker.getPosition());
    });
  }, [currentLocation, otherLocations]);

  return <div id="google-map" style={{ height: "400px", width: "100%" }}></div>;
};

export default Map;
