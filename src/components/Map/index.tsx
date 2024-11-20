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
import { exportToCSV } from '../../lib/csvExport';

import Modal from '../Modal';
import { addComment } from './api';
import { useModalStore } from '../Modal/hooks/useModal';
import parseJwt from '../../lib/parseJwt';

interface PlanResponse {
  msg: string;
  success: boolean;
}

interface Props {
  markers: MarkerType[] | null;
  searchStation: MarkerType | undefined | null;
}

const Map: FC<Props> = ({ searchStation, markers }) => {
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean>(false);
  const [pinInfoDetails, setPinInfoDetails] = useState<MarkerType | null>(null);
  const [pinHistoryDetails, setPinHistoryDetails] = useState<
    MarkerHistory[] | null
  >(null);
  const [isViewer, setIsViewer] = useState<boolean | undefined>(false);

  const [commentValue, setCommentValue] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDFChsu6DMeZSUk06u1WeXnJqkCXhYnENc',
  });

  const { setShowSpinner } = useSpinner();
  const { deleteMarker, changeMarkerStatus } = useMarkers();

  const { openModal } = useModalStore();

  useEffect(() => {
    const data = parseJwt(localStorage.getItem('token'));
    setIsViewer(data?.Role == 'Viewer');
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

  const handleStationFunction = async (type: 'SLP' | 'RBT' | 'ON' | 'HW') => {
    const formData = new FormData();
    formData.append('id', `${pinInfoDetails?.id}`);
    formData.append('command', type);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await fetchService.post<any>('change-command', formData);

    if (data.success == true && pinInfoDetails?.id) {
      alert('Status stanice uspesno promenjen!');
      changeMarkerStatus(pinInfoDetails.id, data.status);
    }
  };

  const handleExport = () => {
    const { id, name, status, statusLabel, log, amp, voltage, temp, ip } =
      pinInfoDetails || {};
    console.log(pinInfoDetails);
    exportToCSV(
      [{ id, name, status, statusLabel, log, amp, voltage, temp, ip }],
      `${pinInfoDetails?.id}` || 'stanica'
    );
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

  const getPlot = async () => {
    const { data } = await fetchService.get<unknown>(
      `station-history-power/${pinInfoDetails?.id}`
    );

    console.log(data);
  };

  return (
    <>
      <GoogleMap
        key={markers?.length}
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
          styles={[
            {
              textColor: 'black',
              height: 53,
              url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
              width: 53,
              textSize: 12,
            },
            {
              textColor: 'black',
              height: 56,
              url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
              width: 56,
              textSize: 12,
            },
            {
              textColor: 'black',
              height: 66,
              url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
              width: 66,
              textSize: 12,
            },
            {
              textColor: 'black',
              height: 78,
              url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
              width: 78,
              textSize: 12,
            },
          ]}
        >
          {(clusterer) => (
            <div>
              {markers?.map((pin) => {
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

        {isInfoWindowOpen && pinInfoDetails && (
          <InfoWindow
            position={{
              lat: pinInfoDetails.gpsx,
              lng: pinInfoDetails.gpsy,
            }}
            options={{ pixelOffset: new window.google.maps.Size(0, -35) }}
            onCloseClick={() => setIsInfoWindowOpen(false)}
          >
            <div className="super">
              <ul>
                <li className="flex gap-2">
                  <p className="font-semibold">ID:</p>
                  <p>{pinInfoDetails.id}</p>
                </li>
                <li className="flex gap-2">
                  <p className="font-semibold">Naziv stajalista:</p>
                  <p>{pinInfoDetails.name}</p>
                </li>
                {!isViewer && (
                  <>
                    <li className="flex gap-2">
                      <p className="font-semibold">IP:</p>
                      <p>{pinInfoDetails.ip}</p>
                    </li>
                    <li className="flex gap-2">
                      <p className="font-semibold">Temperatura:</p>
                      <p>{pinInfoDetails.temp}</p>
                    </li>
                    <li className="flex gap-2">
                      <p className="font-semibold">Struja i Napon (HW):</p>
                      <p>{pinInfoDetails.voltage}</p>
                    </li>
                    <li className="flex gap-2">
                      <p className="font-semibold">Komentar:</p>
                    </li>
                  </>
                )}
                <li className="flex gap-2">
                  <p className="font-semibold">Status</p>
                  <p>{pinInfoDetails.statusLabel}</p>
                </li>
              </ul>
              {pinHistoryDetails?.length !== 0 && !isViewer && (
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
                    {Array.isArray(pinHistoryDetails) &&
                    pinHistoryDetails.length > 0 ? (
                      pinHistoryDetails.map((action) => (
                        <tr
                          key={action.id}
                          className={`border text-center ${
                            action.type === '1'
                              ? 'bg-green-500 text-black'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          <td>{action.type}</td>
                          <td>{action.username}</td>
                          <td>{String(action.time)}</td>
                          <td>{action.description}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              {pinInfoDetails.status <= 3 && pinInfoDetails.status >= 8 && (
                <div className="grid  grid-cols-3 gap-3 justify-center my-3">
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
                  {!isViewer && (
                    <>
                      <button
                        className="bg-gray-300 rounded-md p-3 col-span-2 text-white font-bold"
                        onClick={() => {
                          openModal('add-comment-modal');
                        }}
                      >
                        Dodaj komentar
                      </button>
                      <a
                        href={`https://www.google.com/maps/place/${pinInfoDetails.gpsx},${pinInfoDetails.gpsy}`}
                        target="_blank"
                        className="bg-blue-500 rounded-md p-3 text-white font-bold  block text-center"
                      >
                        Putanja
                      </a>
                    </>
                  )}
                  <a
                    href={`http://app.sodalis.rs/?id=${pinInfoDetails.id}`}
                    target="_blank"
                    className="bg-blue-500 rounded-md p-3 text-white font-bold  block text-center col-span-3"
                  >
                    Prikaz Uzivo
                  </a>
                </div>
              )}

              {(pinInfoDetails.status === 0 ||
                pinInfoDetails.status === 7 ||
                pinInfoDetails.status === 6) && (
                <div>
                  <button
                    className="bg-green-500 rounded-md p-3 text-white font-bold my-3 w-full"
                    onClick={planStation}
                  >
                    {pinInfoDetails.status === 0
                      ? 'Planiraj'
                      : ' Iskopana rupa'}
                  </button>
                </div>
              )}

              {pinInfoDetails.status === 2 && (
                <div>
                  <ul>
                    <li className="flex gap-2">
                      <p className="font-semibold">Poslednji put online:</p>
                      {pinInfoDetails.log}
                    </li>
                    <li className="flex gap-2">
                      <p className="font-semibold">Poslednja temperatura:</p>
                      {pinInfoDetails.temp}
                    </li>
                    <li className="flex gap-2">
                      <p className="font-semibold">Poslednja struja:</p>
                      {pinInfoDetails.voltage}
                    </li>
                    <li className="flex gap-2">
                      <p className="font-semibold">Poslednji napon:</p>
                      {pinInfoDetails.voltage}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <Modal modalKey="add-comment-modal" headline="Dodaj komentar">
        <form>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Komentar
          </label>
          <textarea
            id="message"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Napisi svoj komentar ovde"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
          ></textarea>
          <div className="my-2">
            <button
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={() => {
                addComment(commentValue, pinInfoDetails.id);
              }}
            >
              Dodaj
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default Map;
