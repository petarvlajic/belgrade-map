import { FC, useState, ChangeEvent, FormEvent } from 'react';
import fetchService from '../../../services/api';

interface FormData {
  FixImageBefore: File | null;
  FixImageAfter: File | null;
  FixDescription: string;
  Id: number | undefined;
  FixTypes: string[];
  RepairDateTime: string;
}

interface Props {
  stationId: number | undefined;
}

const AddOrderInfoForm: FC<Props> = ({ stationId }) => {
  const [formData, setFormData] = useState<FormData>({
    FixImageBefore: null,
    FixImageAfter: null,
    FixDescription: '',
    Id: stationId,
    FixTypes: [],
    RepairDateTime: '',
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    }
  };

  const handleDateTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData((prevData) => ({
      ...prevData,
      FixTypes: selectedOptions,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    if (formData.FixImageBefore)
      formDataToSend.append('FixImageBefore', formData.FixImageBefore);
    if (formData.FixImageAfter)
      formDataToSend.append('FixImageAfter', formData.FixImageAfter);
    formDataToSend.append('FixDescription', formData.FixDescription);
    if (formData.Id !== undefined) {
      formDataToSend.append('Id', formData.Id.toString());
    }
    formData.FixTypes.forEach((type) => {
      formDataToSend.append('FixTypes[]', type);
    });
    formDataToSend.append('RepairDateTime', formData.RepairDateTime);

    try {
      console.log('object', formData);
      const response = await fetchService.post(
        'update-work-order',
        formDataToSend
      );
      console.log(response);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="FixImageBefore" className="text-gray-900">
          Slika pre:
        </label>

        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="FixImageBefore"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="FixImageBefore"
              onChange={handleFileChange}
              type="file"
              className="hidden"
              name="FixImageBefore"
            />
          </label>
        </div>
      </div>
      <div>
        <label
          htmlFor="countries_multiple"
          className="block my-2 text-sm font-medium text-gray-900"
        >
          Tip kvara:
        </label>
        <select
          multiple
          id="countries_multiple"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleMultiSelectChange}
          value={formData.FixTypes}
        >
          <option value="Infopanel ne dobija napajanje">
            Infopanel ne dobija napajanje, nema ulicne rasvete
          </option>
          <option value="Stajaliste ponovo povezano">
            Stajaliste ponovo povezano na ulicnu rasvetu
          </option>
          <option value="Restart">Restart</option>
          <option value="Zamena DC - DC konvertora">
            Zamena DC - DC konvertora
          </option>
          <option value="Zamena AC - DC konvertora">
            Zamena AC - DC konvertora
          </option>
          <option value="Zamena Baterije">Zamena Baterije</option>
          <option value="Zamena Racunara">Zamena Racunara</option>
          <option value="Zamena HDMI/UTP kabla">Zamena HDMI/UTP kabla</option>
          <option value="Zamena Playera">Zamena Playera</option>
          <option value="Zamena Rutera">Zamena Rutera</option>
          <option value="Zamena Hladjenja">Zamena Hladjenja</option>
          <option value="Zamena Kabineta">Zamena Kabineta</option>
          <option value="Zamena SD kartice">Zamena SD kartice</option>
          <option value="Ugradjen Hardver">Ugradjen Hardver</option>
          <option value="Zamena Panela">Zamena Panela</option>
          <option value="Zamena Receiving kartice">
            Zamena Receiving kartice
          </option>
          <option value="Zamena Lightboxa">Zamena Lightboxa</option>
        </select>
      </div>
      <div>
        <label htmlFor="RepairDateTime" className="text-gray-900 block my-2">
          Datum i vreme popravke:
        </label>
        <input
          type="datetime-local"
          id="RepairDateTime"
          name="RepairDateTime"
          value={formData.RepairDateTime}
          onChange={handleDateTimeChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      <div>
        <label htmlFor="FixImageBefore" className="text-gray-900">
          Slika posle:
        </label>
        <label
          htmlFor="FixImageAfter"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="FixImageAfter"
            onChange={handleFileChange}
            type="file"
            name="FixImageAfter"
            className="hidden"
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddOrderInfoForm;
