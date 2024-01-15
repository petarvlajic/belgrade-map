import { useEffect, useState } from "react";
import Map from "../components/Map";
import parseJwt from "../lib/parseJwt";
import fetchService from "../services/api";
import { MarkerType } from "../types/Marker";

const Stations = () => {
  const [isEditor, setIsEditor] = useState<boolean | undefined>(false);

  const [markers, setMarkers] = useState<MarkerType[] | undefined | null>(
    undefined
  );

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

    fetchData();
  }, []);

  const fetchOtherStations = async (type: string) => {
    const { data } = await fetchService.get<MarkerType[]>(type);

    if (data && markers) {
      console.log(data);
      setMarkers(type === "stations" ? data : [...markers, ...data]);
    }
  };

  return (
    <div className="container mx-auto  px-4">
      <div className="flex xl:flex-row md:flex-col">
        <div className="md:w-full xl:order-1">
          <Map markers={markers} />
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
  );
};

export default Stations;
