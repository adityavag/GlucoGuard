import React from "react";
import PatientDetails from "./pages/PatientDetails"
import ImageUpload from "./pages/ImageUplaod";
import Landing from "./pages/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route index element = {<Layout/>}></Route>
        <Route path="/" element = {<Layout/>}></Route>
        <Route path="/patient-details" element = {<PatientDetails/>}></Route>
        <Route path="/image-upload" element = {<ImageUpload/>}></Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App;
