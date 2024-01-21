export const center = {
  lat: 44.8125,
  lng: 20.4612,
};

export const mapContainerStyle = {
  width: "100%",
  height: "80vh",
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

export const mapPins: string[] = [
  "https://maps.google.com/mapfiles/kml/paddle/purple-circle-lv.png",
  "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  "https://maps.google.com/mapfiles/ms/icons/pink-dot.png",
  "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
  "http://alma.sodalis.rs/navy-dot.png",
  "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
];
