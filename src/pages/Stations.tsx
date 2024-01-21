import { useEffect, useState, KeyboardEvent } from "react";
import Map from "../components/Map";
import parseJwt from "../lib/parseJwt";
import fetchService from "../services/api";
import { MarkerType } from "../types/Marker";
import Counter from "../components/Counter";
import ModalForm from "../components/AddPinForm";
import { useNavigate } from "react-router-dom";

const Stations = () => {
  const [isEditor, setIsEditor] = useState<boolean | undefined>(false);
  const navigate = useNavigate();
  const [markers, setMarkers] = useState<MarkerType[] | undefined | null>(
    undefined
  );
  const [showSpinner, setShowSpinner] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const [searchStationData, setSearchStationData] = useState<
    MarkerType | undefined | null
  >(undefined);

  const handleSearchInputSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(event?.target?.value);
  };

  useEffect(() => {
    setIsEditor(parseJwt(localStorage.getItem("token")));
    const fetchData = async () => {
      try {
        const { data } = await fetchService.get<MarkerType[]>("stations");
        setMarkers(data);
      } catch (error) {
        console.log("An unexpected error occurred.");
      }
    };

    const checkJWT = async () => {
      try {
        const { status } = await fetchService.get<MarkerType[]>("login/ping");
        console.log(status);
        if (status == 401) {
          navigate("/");
        }
      } catch (error) {
        console.log("An unexpected error occurred.");
      }
    };

    checkJWT();

    fetchData();
  }, [navigate]);

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchOtherStations = async (type: string) => {
    setShowSpinner(true);
    const { data } = await fetchService.get<MarkerType[]>(type);
    data && markers && setMarkers(data);
    setTimeout(() => {
      setShowSpinner(false);
    }, 7500);
  };

  const searchForStation = async () => {
    if (searchValue) {
      const { data } = await fetchService.get<MarkerType[]>(
        `search/?id=${searchValue}`
      );
      data && setSearchStationData(data[0]);
    }
  };

  const handleEnterKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchForStation();
    }
  };

  return (
    <div className="container mx-auto  px-4 mt-12">
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
                  onClick={() => fetchOtherStations("planed-stations")}
                >
                  Planirane stanice
                </button>

                <button
                  className="rounded-xl py-2 px-4 border w-full"
                  onClick={() => fetchOtherStations("wthout-plan-stations")}
                >
                  Neplanirane stanice
                </button>
              </div>
            )}
            <button
              onClick={openModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md border"
            >
              Add Location
            </button>
            <ModalForm isOpen={isModalOpen} onClose={closeModal} />

            <button
              className="rounded-xl py-2 px-4 border bg-red-600"
              onClick={() => window.location.reload()}
            >
              Restart
            </button>
          </div>
        </div>
        <div className="xl:w-[80%]  w-full relative">
          {showSpinner && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-10">
              <div className="bg-white p-5 rounded-lg">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
                <p className="mt-2 text-gray-700 text-center">Loading..</p>
              </div>
            </div>
          )}
          <Map markers={markers} searchStation={searchStationData} />
        </div>
        <div className="text-white xl:w-[10%] w-full self-start my-6">
          <Counter />
        </div>
      </div>
    </div>
  );
};

export default Stations;
