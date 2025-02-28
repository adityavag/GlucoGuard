import React from "react";
import PatientDetails from "./pages/PatientDetails"
import ImageUpload from "./pages/ImageUplaod";
const App = () => {
  return(
    <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen py-24 px-6">
      <PatientDetails/>
      <ImageUpload/>
    </div>
  )
}

export default App;
