import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

const PatientDetails = () => {
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
        console.log(patientDetails);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Patient Details</h2>
                <div className="flex justify-between mb-4">
                    {steps.map((step, index) => (
                        <div key={step} className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-500"
                                    }`}
                            >
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
                                <label className="block font-medium">Full Name</label>
                                <input id="name" value={patientDetails.name} onChange={handleChange} className="w-full border p-2 rounded-md" required />
                            </div>
                            <div>
                                <label className="block font-medium">Age</label>
                                <input id="age" type="number" value={patientDetails.age} onChange={handleChange} className="w-full border p-2 rounded-md" required />
                            </div>
                            <div>
                                <label className="block font-medium">Gender</label>
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
                                <label className="block font-medium">Blood Type</label>
                                <input id="bloodType" value={patientDetails.bloodType} onChange={handleChange} className="w-full border p-2 rounded-md" required />
                            </div>
                            <div>
                                <label className="block font-medium">Contact Number</label>
                                <input id="contactNumber" type="tel" value={patientDetails.contactNumber} onChange={handleChange} className="w-full border p-2 rounded-md" required />
                            </div>
                        </div>
                    )}
                    {currentStep === 1 && (
                        <div>
                            <label className="block font-medium">Medical History</label>
                            <textarea id="medicalHistory" value={patientDetails.medicalHistory} onChange={handleChange} className="w-full h-32 border p-2 rounded-md" required></textarea>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Confirm Patient Details</h3>
                            <p><strong>Name:</strong> {patientDetails.name}</p>
                            <p><strong>Age:</strong> {patientDetails.age}</p>
                            <p><strong>Gender:</strong> {patientDetails.gender}</p>
                            <p><strong>Blood Type:</strong> {patientDetails.bloodType}</p>
                            <p><strong>Contact Number:</strong> {patientDetails.contactNumber}</p>
                            <p><strong>Medical History:</strong> {patientDetails.medicalHistory}</p>
                        </div>
                    )}
                    <div className="flex justify-between mt-6">
                        {currentStep > 0 && (
                            <button type="button" onClick={handleBack} className="px-4 py-2 border rounded-md">Back</button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <button type="button" onClick={handleNext} className="px-4 py-2 bg-purple-500 text-white rounded-md">Next</button>
                        ) : (
                            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md">Submit</button>
                        )}
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default PatientDetails;