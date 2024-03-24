import {
  GoogleMap,
  Marker,
  InfoWindow,
  MarkerClusterer,
  useLoadScript,
} from '@react-google-maps/api';
import { FC, useEffect, useState } from 'react';
import fetchService from '../../services/api';
import { center, mapContainerStyle, mapOptions, mapPins } from './const';
import { MarkerHistory, MarkerType } from '../../types/Marker';
import useMarkers from '../../hooks/useMarkers';
import useSpinner from '../../hooks/useSpinner';

interface PlanResponse {
  msg: string;
  success: boolean;
}

interface Props {
  markers: MarkerType[] | undefined | null;
  searchStation: MarkerType | undefined | null;
}

const Map: FC<Props> = ({ searchStation, markers }) => {
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);
  const [pinInfoDetails, setPinInfoDetails] = useState<MarkerType | null>(null);
  const [pinHistoryDetails, setPinHistoryDetails] = useState<
    MarkerHistory[] | null
  >(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDFChsu6DMeZSUk06u1WeXnJqkCXhYnENc',
  });

  const { setShowSpinner, showSpinner } = useSpinner();
  const { deleteMarker, changeMarkerStatus } = useMarkers();

  useEffect(() => {
    const fetchPinDetails = async () => {
      if (!pinInfoDetails) return;
      try {
        const { data } = await fetchService.get<MarkerHistory[]>(
          `station-history/${pinInfoDetails?.id}`
        );
        setPinHistoryDetails(data);
      } catch (error) {
        console.log('An unexpected error occurred.');
      }
    };

    fetchPinDetails();
  }, [pinInfoDetails]);

  useEffect(() => {
    setShowSpinner(false);
  }, [markers, setShowSpinner]);

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

  const handleStationFunction = async (type: 'SLP' | 'RBT' | 'ON') => {
    const formData = new FormData();
    formData.append('id', `${pinInfoDetails?.id}`);
    formData.append('command', type);
    const { data } = await fetchService.post<any>('change-command', formData);

    if (data.success == true && pinInfoDetails?.id) {
      alert('Status stanice uspesno promenjen!');
      changeMarkerStatus(pinInfoDetails.id, data.status);
    }
  };

  const planStation = async () => {
    const { data } = await fetchService.post<PlanResponse>(
      `add-station-to-plan/${pinInfoDetails?.id}`,
      undefined
    );

    if (data?.success == true && pinInfoDetails?.id) {
      alert(data.msg);
      setIsInfoWindowOpen(false);
      deleteMarker(pinInfoDetails.id);
    } else {
      alert('Greska prilikom planiranja stanice!');
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={searchStation ? 20 : 12}
      center={
        searchStation
          ? { lat: searchStation.gpsx, lng: searchStation.gpsy }
          : center
      }
      options={mapOptions}
    >
      <MarkerClusterer
        imagePath="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png"
        minimumClusterSize={2}
        averageCenter={true}
        gridSize={50}
        maxZoom={15}
      >
        {(clusterer) => (
          <div>
            {markers?.map((pin, index) => {
              return (
                <Marker
                  key={pin.id}
                  position={{ lat: pin.gpsx, lng: pin.gpsy }}
                  onClick={() => handlePinClick(pin)}
                  label={{
                    text: pin.id.toString(),
                    className: 'mb-12',
                  }}
                  icon={{
                    url: mapPins[pin.status],
                  }}
                  clusterer={clusterer}
                />
              );
            })}
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
            <ul>
              <li className="flex gap-2">
                <p className="font-semibold">ID:</p>
                <p>{pinInfoDetails?.id}</p>
              </li>
              <li className="flex gap-2">
                <p className="font-semibold">Naziv stajalista:</p>
                <p>{pinInfoDetails?.name}</p>
              </li>
              <li className="flex gap-2">
                <p className="font-semibold">Zona:</p>
                <p>{pinInfoDetails?.zona}</p>
              </li>
              <li className="flex gap-2">
                <p className="font-semibold">Status</p>
                <p>{pinInfoDetails?.statusLabel}</p>
              </li>
            </ul>
            {pinHistoryDetails?.length !== 0 && (
              <table className=" border-blue-500 border-collapse">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Username</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {pinHistoryDetails &&
                    pinHistoryDetails?.map((action) => (
                      <tr
                        className={`border text-center ${
                          action.type == '1'
                            ? 'bg-green-500 text-black'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        <td>{action.type}</td>
                        <td>{action.username}</td>
                        <td>{String(action.time)}</td>
                        <td>{action.description}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            {(pinInfoDetails?.status == 1 ||
              pinInfoDetails?.status == 3 ||
              pinInfoDetails?.status == 2) && (
              <div className="flex gap-3 justify-center my-3">
                <button
                  className="bg-green-500 rounded-md p-3 text-white font-bold"
                  onClick={() => handleStationFunction('ON')}
                >
                  Ukljuci
                </button>
                <button
                  className="bg-red-500 rounded-md p-3 text-white font-bold"
                  onClick={() => handleStationFunction('SLP')}
                >
                  Iskljuci
                </button>
                <button
                  className="bg-blue-500 rounded-md p-3 text-white font-bold"
                  onClick={() => handleStationFunction('RBT')}
                >
                  Restart
                </button>
              </div>
            )}

            {(pinInfoDetails?.status == 0 ||
              pinInfoDetails?.status == 7 ||
              pinInfoDetails?.status == 6) && (
              <div>
                <button
                  className="bg-green-500 rounded-md p-3 text-white font-bold my-3 w-full"
                  onClick={planStation}
                >
                  {pinInfoDetails?.status == 0 ? 'Planiraj' : ' Iskopana rupa'}
                </button>
              </div>
            )}

            <a
              href={`https://www.google.com/maps/place/${pinInfoDetails?.gpsx},${pinInfoDetails?.gpsy}`}
              target="_blank"
              className="bg-blue-500 rounded-md p-3 text-white font-bold w-full block text-center"
            >
              Putanja
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Map;
