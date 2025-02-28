import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import Art from "../assets/Art.json"
const Landing = () => {
  return (
    <div className="min-h-screen md:px-32 p-16 grid grid-cols-1 md:grid-cols-2 items-center w-full">
      <div className="flex flex-col space-y-4 text-center md:text-left">
        <div className="text-5xl font-bold">GlucoGuard</div>
        <div className="text-2xl font-semibold text-purple-500">Check for Diabetic Retinopathy with AI</div>
        <div className="text-[#4b5563]">Our AI-powered Diabetic Retinopathy Detection platform analyzes retinal images to identify early signs of DR with precision. Upload an image, get instant results, and take proactive steps toward better eye health.</div>
        <div>
        </div>
        <Link to="/patient-details">
          <button className="bg-purple-500 hover:bg-purple-600 p-2 w-1/2 rounded-md mx-auto md:mx-0 text-white font-semibold text-xl">
            Get
          </button>
        </Link>
      </div>
      <Lottie animationData={Art} loop={true} />
    </div>
  );
}

export default Landing;
