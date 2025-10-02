import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SendOtp = () => {
  // const url = "http://localhost:1111";
  const url = "https://otpverification-5qbv.onrender.com";
  const [email, setEmail] = useState("");
  const [setsending, setSetsending] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (email) => {
    const res = await axios.post(
      `${url}/send-otp`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
    return res;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter email");

    try {
      setSetsending(true);
      const res = await sendOtp(email);
      alert(res.data.message || "OTP sent successfully");
      localStorage.setItem("otpEmail", email);
      navigate("/verify");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    } finally {
      setSetsending(false);
    }
  };

  const refresh = () => {
    localStorage.removeItem("otpEmail");
    setEmail("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Welcome to the OTP Verification System
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSendOtp}>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={setsending}
            className={`bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors ${
              setsending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {setsending ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <button
          onClick={refresh}
          className="mt-4 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    </main>
  );
};

export default SendOtp;
