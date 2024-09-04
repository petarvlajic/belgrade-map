import { useEffect, useState, KeyboardEvent } from 'react';
import Map from '../components/Map';
import parseJwt from '../lib/parseJwt';
import fetchService from '../services/api';
import { MarkerType } from '../types/Marker';
import Counter from '../components/Counter';
import ModalForm from '../components/AddPinForm';
import { useNavigate } from 'react-router-dom';
import useMarkers from '../hooks/useMarkers';
import Chip from '../components/Chips';
import StatusCounter from '../components/Stations/StatusCounter';

const Stations = () => {
  const [isEditor, setIsEditor] = useState<boolean | undefined>(false);
  const navigate = useNavigate();
  const {
    markers,
    setMarkers,
    getMarkersByIds,
    filteredMarkers,
    setFilteredMarkers,
  } = useMarkers();

  const [searchValue, setSearchValue] = useState<string>('');
  const [currentStationType, setCurrentStationType] =
    useState<string>('stations');
  const [searchStationData, setSearchStationData] = useState<
    MarkerType | undefined | null
  >(undefined);

  const [displayedMarkers, setDisplayedMarkers] = useState<MarkerType[] | null>(
    []
  );

  const handleSearchInputSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(event?.target?.value);
  };

  useEffect(() => {
    setIsEditor(parseJwt(localStorage.getItem('token')));
    const fetchData = async () => {
      try {
        const { data } = await fetchService.get<MarkerType[]>(
          currentStationType
        );
        setMarkers(data);
      } catch (error) {
        console.log('An unexpected error occurred.');
      }
    };

    const checkJWT = async () => {
      try {
        const { status } = await fetchService.get<MarkerType[]>('login/ping');
        console.log(status);
        if (status == 401) {
          navigate('/');
        }
      } catch (error) {
        console.log('An unexpected error occurred.');
      }
    };

    checkJWT();

    fetchData();

    // Polling function to fetch data every five minutes
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Clear the interval on component unmount to prevent memory leaks
    return () => clearInterval(pollingInterval);
  }, [currentStationType, navigate]);

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  const fetchOtherStations = async (type: string) => {
    setCurrentStationType(type);
    // console.log(type);
    // const { data } = await fetchService.get<MarkerType[]>(type);
    // data && markers && setMarkers(data);
  };

  const searchForStation = async () => {
    if (searchValue) {
      let query: string = '';
      isNaN(Number(searchValue))
        ? (query = `type=string&value=${searchValue}`)
        : (query = `type=number&value=${searchValue}`);
      const { data } = await fetchService.get<MarkerType[]>(`search/?${query}`);
      data && setSearchStationData(data[0]);
    }
  };

  const handleEnterKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchForStation();
    }
  };

  const getCurrentStationTypeHeadline = () => {
    switch (currentStationType) {
      case 'stations':
        return 'Postavljene Stanice';
      case 'wthout-plan-stations':
        return 'Neplanirane stanice';
      case 'planed-stations':
        return 'Planirane stanice';
      default:
        return 'Stanice';
    }
  };

  useEffect(() => {
    filteredMarkers?.length == 0
      ? setDisplayedMarkers(markers)
      : setDisplayedMarkers(filteredMarkers);
  }, [filteredMarkers, markers]);

  // Chips
  const [chips, setChips] = useState<number[]>([]);

  useEffect(() => {
    chips.length === 0 ? setFilteredMarkers([]) : '';
  }, [chips]);

  const handleDelete = (index: number) => {
    const newChips = [...chips];
    newChips.splice(index, 1);
    setChips(newChips);
  };

  const [newChip, setNewChip] = useState<string>('');

  const handleAddChip = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const chipValues = newChip.split(' ').map((value) => value.trim());
      const validChips = chipValues
        .filter((value) => !isNaN(Number(value)))
        .map(Number);

      if (validChips.length > 0) {
        setChips((prevChips) => [...prevChips, ...validChips]);
        setNewChip('');
      }
    }
  };

  return (
    <div className="container mx-auto   mt-12">
      <div className="flex xl:flex-row flex-col gap-4">
        <div className="xl:w-[20%] w-full">
          <div className="justify-center  mt-4 flex gap-3 text-white flex-col">
            <div className=" mt-4 flex text-white h-full w-full">
              <input
                type="text"
                className="rounded-l-md  text-black h-[42px] w-3/4"
                onChange={handleSearchInputSearch}
                value={searchValue}
                onKeyDown={handleEnterKeyPress}
              />
              <button
                className="border  rounded-r-md py-2 px-3 w-1/4"
                onClick={searchForStation}
              >
                Search
              </button>
            </div>
            {isEditor && (
              <div className="justify-center  mt-4 flex gap-3 text-white items-start flex-col">
                <button
                  className="rounded-xl py-2 px-4 border w-full"
                  onClick={() => window.location.reload()}
                >
                  Postavljene stanice
                </button>

                <button
                  className="rounded-xl py-2 px-4 border w-full"
                  onClick={() => fetchOtherStations('planed-stations')}
                >
                  Planirane stanice
                </button>

                <button
                  className="rounded-xl py-2 px-4 border w-full"
                  onClick={() => fetchOtherStations('wthout-plan-stations')}
                >
                  Neplanirane stanice
                </button>
              </div>
            )}
            <button
              onClick={openModal}
              className="bg-green-500 text-white px-4 py-2 rounded-md border"
            >
              Dodaj novo stajaliste
            </button>
            <ModalForm isOpen={isModalOpen} onClose={closeModal} />

            {/* <button
              className="rounded-xl py-2 px-4 border bg-red-600"
              onClick={() => window.location.reload()}
            >
              Restart vise stanica
            </button> */}

            <input
              type="text"
              placeholder="Id stanice"
              value={newChip}
              onChange={(e) => setNewChip(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2  text-black"
              onKeyDown={handleAddChip}
            />

            <div className="flex flex-wrap mt-4">
              {chips.map((label, index) => (
                <Chip
                  key={index}
                  label={`${label}`}
                  onDelete={() => handleDelete(index)}
                />
              ))}
            </div>

            <button
              onClick={async () => {
                await getMarkersByIds(chips);
              }}
              disabled={chips.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Primeni prikaz odredjenih stranica
            </button>
          </div>
        </div>
        <div className="xl:w-[75%]  w-full relative">
          {/* {showSpinner && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
              <div className="bg-white p-5 rounded-lg">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
                <p className="mt-2 text-gray-700 text-center">Loading..</p>
              </div>
            </div>
          )} */}
          <h2 className="text-white text-2xl font-semibold text-center mb-5">
            {getCurrentStationTypeHeadline()}
          </h2>
          <Map markers={displayedMarkers} searchStation={searchStationData} />
        </div>
        <div className="text-white xl:w-[15%] w-full self-start my-6">
          <Counter />
          <StatusCounter />
        </div>
      </div>
    </div>
  );
};

export default Stations;
