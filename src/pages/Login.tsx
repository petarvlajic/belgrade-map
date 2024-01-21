// Login.tsx

import React, { FormEvent, useState } from "react";
import fetchService from "../services/api";

interface LoginResponse {
  token: string;
  success: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const formReqData = new FormData();
    formReqData.append("Username", formData.username);
    formReqData.append("Password", formData.password);
    const { data, status } = await fetchService.post<LoginResponse>(
      "login/Login",
      formReqData
    );

    if (data?.success == "true") {
      localStorage.setItem("token", data.token);
      window.location.replace("/map");
    } else {
      localStorage.removeItem("token");
      if (status == 401) {
        alert("Korisnik ne postoji!");
      } else if (status == 502) {
        alert("Problem sa serverom");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-gray-200 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={(e) => handleLogin(e)}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
