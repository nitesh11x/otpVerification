import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SendOtp from "./SendOtp";
import VerifyOtp from "./VerifyOtp";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SendOtp />}></Route>
          <Route path="/verify" element={<VerifyOtp />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
