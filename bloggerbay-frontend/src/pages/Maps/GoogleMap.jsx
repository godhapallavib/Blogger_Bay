import { Box, Typography } from "@mui/material";
import Map from "./MapComponent";
import React, { useState, useEffect } from "react";

async function getCurrentLocation(props) {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const locationData = await response.json();
    return {
      locationName: locationData.city,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      country: locationData.country,
    };
  } catch (error) {
    console.error("Error fetching current location:", error);
    return null;
  }
}

const CustomGoogleMap = (props) => {
  const [currentLocation, setCurrentLocation] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const locationData = await getCurrentLocation();
      setCurrentLocation(locationData);
    };
    fetchData();
  }, []);

  console.log("Location Details ", props.locationDetails);

  return (
    <Box width={"100%"} height={"90%"} mt={2}>
      <Typography variant="h5" color="primary">
        Google Map with recommended activities:
      </Typography>
      {currentLocation ? (
        <>
          <Typography>
            <b>Current City:</b> {currentLocation.locationName}
          </Typography>
          <Typography>
            <b>Current Country:</b> {currentLocation.country}
          </Typography>
          <Typography>
            <b>Current Coordinates: </b>
            <span>
              Latitude: {currentLocation.latitude}, Longitude:{" "}
              {currentLocation.longitude}
            </span>
          </Typography>
          <Typography>
            <b>Current Weather: </b> {props.weather}
          </Typography>

          <br />
          <Map
            currentLocation={currentLocation}
            otherLocations={props.locationDetails}
          />
        </>
      ) : (
        <Typography>Fetching Map details...</Typography>
      )}
    </Box>
  );
};

export default CustomGoogleMap;
