import { useEffect, useState } from "react";
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
          console.log("e");
          navigate("/");
        }
      } catch (error) {
        console.log("An unexpected error occurred.");
      }
    };

    checkJWT();

    fetchData();
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchOtherStations = async (type: string) => {
    const { data } = await fetchService.get<MarkerType[]>(type);
    data && markers && setMarkers(data);
  };

  const searchForStation = async () => {
    if (searchValue) {
      const { data } = await fetchService.get<MarkerType[]>(
        `search/?id=${searchValue}`
      );
      data && setSearchStationData(data[0]);
    }
  };

  return (
    <div className="container mx-auto  px-4">
      <div className="flex xl:flex-row md:flex-col">
        <div className="md:w-full xl:order-1">
          <Map markers={markers} searchStation={searchStationData} />
          <div className="justify-center  mt-4 flex gap-3 text-white items-center">
            <Counter />

            <button
              onClick={openModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Location
            </button>
            <ModalForm isOpen={isModalOpen} onClose={closeModal} />
            <div className="justify-center  mt-4 flex  text-white items-center">
              <input
                type="text"
                className="rounded-l-md h-full text-black"
                onChange={handleSearchInputSearch}
                value={searchValue}
              />
              <button
                className="border py-2 px-4 rounded-r-md"
                onClick={searchForStation}
              >
                Search
              </button>
            </div>
            {isEditor && (
              <div className="justify-center  mt-4 flex gap-3 text-white items-center">
                <button
                  className="rounded-xl py-2 px-4 border"
                  onClick={() => window.location.reload()}
                >
                  Restart
                </button>

                <label htmlFor="prikaziStanice">
                  <input
                    type="radio"
                    name="prikaziStanice"
                    id=""
                    onClick={() => fetchOtherStations("planed-stations")}
                  />
                  Planirane stanice
                </label>

                <label htmlFor="prikaziStanice">
                  <input
                    type="radio"
                    name="prikaziStanice"
                    id=""
                    onClick={() => fetchOtherStations("wthout-plan-stations")}
                  />
                  Neplanirane stanice
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stations;
