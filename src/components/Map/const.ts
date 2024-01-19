export const center = {
  lat: 44.8125,
  lng: 20.4612,
};

export const mapContainerStyle = {
  width: "100%",
  height: "71vh",
};

export const mapOptions = {
  styles: [
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
  ],
};
