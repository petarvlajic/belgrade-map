// ModalForm.tsx

import React, { useState } from "react";
import fetchService from "../services/api";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    gpsx: "",
    gpsy: "",
    zona: "",
    // Add other form fields as needed
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reqFormData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      reqFormData.append(key, String(value));
    });

    const { data } = await fetchService.post<any>("add-station", reqFormData);

    if (data.success == true) {
      alert("Lokacija uspesno dodata!");
      window.location.reload();
    } else {
      alert("Problem prilikom dodavanja stanice!");
    }
    onClose();
  };

  return (
    <div
      className={`modal ${
        isOpen ? "block" : "hidden"
      } bg-gray-500 bg-opacity-50 fixed top-0 left-0 right-0 bottom-0 z-10`}
    >
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container bg-white w-96 mx-auto mt-20 p-6 rounded-md shadow-lg">
        <div className="modal-header flex justify-between items-center">
          <h2 className="text-xl font-semibold">Modal Form</h2>
          <button onClick={onClose} className="text-gray-600">
            Close
          </button>
        </div>
        <div className="modal-body">
          <form className="text-black" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Id
              </label>
              <input
                type="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                X Kordinata (Lat)
              </label>
              <input
                type="gpsx"
                name="gpsx"
                value={formData.gpsx}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Y Kordinata (Lng)
              </label>
              <input
                type="gpsy"
                name="gpsy"
                value={formData.gpsy}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Zona
              </label>
              <input
                type="zona"
                name="zona"
                value={formData.zona}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            {/* Add other form fields as needed */}
            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Dodaj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
