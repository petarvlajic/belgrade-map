import {
  GoogleMap,
  Marker,
  InfoWindow,
  MarkerClusterer,
  useLoadScript,
} from "@react-google-maps/api";
import JsonData from "../../data/dummy.json";
import { useEffect, useState } from "react";
import fetchService from "../../services/api";
import { center, mapContainerStyle, mapOptions } from "./const";
import { MarkerType } from "../../types/Marker";

const getPinColor = (status: number): string => {
  switch (status) {
    case 1:
      return "green";
    case 2:
      return "red";
    default:
      return "error";
  }
};

const Map = () => {
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);
  const [pinInfoDetails, setPinInfoDetails] = useState<MarkerType | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDFChsu6DMeZSUk06u1WeXnJqkCXhYnENc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetchService.get<MarkerType[]>(
          "stations?key=lkajdshfadjskh1234jkahsdfl23319807"
        );
        console.log(data);
      } catch (error) {
        console.log("An unexpected error occurred.");
      }
    };

    fetchData();
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const handlePinClick = (pinInfo: MarkerType) => {
    setPinInfoDetails(pinInfo);
    setIsInfoWindowOpen(true);
  };

  const handleZoomChanged = () => {
    if (!pinInfoDetails) return;
    console.log(pinInfoDetails);
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      onZoomChanged={handleZoomChanged}
      zoom={12}
      center={center}
      options={mapOptions}
    >
      <MarkerClusterer
        imagePath="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png"
        minimumClusterSize={2}
        averageCenter={true}
        gridSize={50}
      >
        {(clusterer) => (
          <div>
            {JsonData.map((pin) => (
              <Marker
                key={pin.id}
                position={{ lat: pin.gpsx, lng: pin.gpsy }}
                onClick={() => handlePinClick(pin)}
                icon={{
                  url: `http://maps.google.com/mapfiles/ms/icons/${getPinColor(
                    pin.status
                  )}-dot.png`,
                }}
                clusterer={clusterer}
              />
            ))}
          </div>
        )}
      </MarkerClusterer>

      {isInfoWindowOpen && (
        <InfoWindow
          position={{
            lat: pinInfoDetails?.gpsx || 0,
            lng: pinInfoDetails?.gpsy || 0,
          }}
          options={{ pixelOffset: new window.google.maps.Size(0, -35) }}
          onCloseClick={() => setIsInfoWindowOpen(false)}
        >
          <div className="super">
            <h2>{pinInfoDetails?.name}</h2>
            <p>Zona: {pinInfoDetails?.zone}</p>
            <p>Status: {pinInfoDetails?.status}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Map;
