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
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                required
                onChange={handleSearchInputSearch}
                value={searchValue}
                onKeyDown={handleEnterKeyPress}
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={searchForStation}
              >
                Search
              </button>
            </div>

            {isEditor && (
              <div className="justify-center  mt-4 flex gap-3 text-white items-start flex-col">
                <button
                  type="button"
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="text-gray-900 w-full bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Postavljene stanice
                </button>

                <button
                  type="button"
                  className="text-gray-900 w-full bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => fetchOtherStations('planed-stations')}
                >
                  Planirane stanice
                </button>

                <button
                  type="button"
                  className="text-gray-900 w-full bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => fetchOtherStations('wthout-plan-stations')}
                >
                  Neplanirane stanice
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={openModal}
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
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
                  key={index + label}
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
