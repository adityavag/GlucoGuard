import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientDetails = () => {
    const navigate = useNavigate();
    const steps = ["Personal Info", "Medical History", "Confirmation"];
    const [currentStep, setCurrentStep] = useState(0);
    const [patientDetails, setPatientDetails] = useState({
        name: "",
        age: "",
        gender: "",
        bloodType: "",
        contactNumber: "",
        medicalHistory: "",
    });
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleChange = (e) => {
        setPatientDetails({ ...patientDetails, [e.target.id]: e.target.value });
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep === steps.length - 1 && isConfirmed) {
            console.log(patientDetails);
            navigate("/image-upload");
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen py-24 px-6">
            <div className="w-full max-w-lg mx-auto bg-white p-6 border border-gray-300 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Patient Details</h2>
                <div className="flex justify-between mb-4">
                    {steps.map((step, index) => (
                        <div key={step} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                                {index + 1}
                            </div>
                            <div className="text-xs mt-1">{step}</div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold">Full Name</label>
                                <input id="name" value={patientDetails.name} onChange={handleChange} className="w-full border p-2 rounded-md" required />
                            </div>
                            <div>
                                <label className="block font-bold">Age</label>
                                <input id="age" type="number" value={patientDetails.age} onChange={handleChange} className="w-full border p-2 rounded-md" required />
                            </div>
                            <div>
                                <label className="block font-bold">Gender</label>
                                <div className="flex gap-4">
                                    <label>
                                        <input type="radio" name="gender" id="gender" value="male" checked={patientDetails.gender === "male"} onChange={handleChange} /> Male
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" id="gender" value="female" checked={patientDetails.gender === "female"} onChange={handleChange} /> Female
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" id="gender" value="other" checked={patientDetails.gender === "other"} onChange={handleChange} /> Other
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block font-bold">Blood Type</label>
                                <input id="bloodType" value={patientDetails.bloodType} onChange={handleChange} className="w-full border p-2 rounded-md" required />
                            </div>
                            <div>
                                <label className="block font-bold">Contact Number</label>
                                <input id="contactNumber" type="tel" value={patientDetails.contactNumber} onChange={handleChange} className="w-full border p-2 rounded-md" required />
                            </div>
                        </div>
                    )}
                    {currentStep === 1 && (
                        <div>
                            <label className="block font-bold">Medical History</label>
                            <textarea id="medicalHistory" value={patientDetails.medicalHistory} onChange={handleChange} className="w-full h-32 border p-2 rounded-md" required></textarea>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div>
                            <h3 className="text-lg font-bold mb-4">Confirm Patient Details</h3>
                            <p><strong>Name:</strong> {patientDetails.name}</p>
                            <p><strong>Age:</strong> {patientDetails.age}</p>
                            <p><strong>Gender:</strong> {patientDetails.gender}</p>
                            <p><strong>Blood Type:</strong> {patientDetails.bloodType}</p>
                            <p><strong>Contact Number:</strong> {patientDetails.contactNumber}</p>
                            <p><strong>Medical History:</strong> {patientDetails.medicalHistory}</p>
                            <label className="flex items-center mt-4">
                                <input type="checkbox" checked={isConfirmed} onChange={() => setIsConfirmed(!isConfirmed)} className="mr-2" />
                                I confirm that the details provided are accurate
                            </label>
                        </div>
                    )}
                    <div className="flex justify-between mt-6">
                        {currentStep > 0 && (
                            <button type="button" onClick={handleBack} className="px-4 py-2 border rounded-md">Back</button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <button type="button" onClick={handleNext} className="px-4 py-2 bg-purple-500 text-white rounded-md">Next</button>
                        ) : (
                            <button type="submit" disabled={!isConfirmed} className={`px-4 py-2 rounded-md ${isConfirmed ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>Submit</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientDetails;
