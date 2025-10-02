import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  //   const [email, setEmail] = useState("nites@gmail.com");
  const email = localStorage.getItem("otpEmail");

  const [otp, setOtp] = useState("");
  const url = "http://localhost:1111";
  const navigate = useNavigate();

  const verifyOtp = async (email, otp) => {
    try {
      const res = await axios.post(
        `${url}/verify`,
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      return res;
    } catch (error) {
      console.error(error);
      return { data: { success: false, message: "Verification failed" } };
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await verifyOtp(email, otp);

    if (res.data.success) {
      alert(res.data.message || "OTP Verified Successfully!");
      navigate("/");
    } else {
      alert(res.data.message || "OTP verification failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Verify OTP
        </h1>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
            <h3 className="text-gray-700 font-medium">{email}</h3>
          </div>

          <div className="flex flex-col">
            <label htmlFor="otp" className="mb-2 font-medium text-gray-700">
              Enter OTP Here
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              id="otp"
              placeholder="Enter OTP"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </main>
  );
};

export default VerifyOtp;
