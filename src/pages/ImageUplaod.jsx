import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { UploadIcon, XIcon } from "lucide-react";
import axios from "axios";

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [patientDetails, setPatientDetails] = useState({ name: "", age: "", email: "" });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const storedDetails = JSON.parse(localStorage.getItem("patientDetails")) || {};
        setPatientDetails({
            name: storedDetails.name || "",
            age: storedDetails.age || "",
            email: storedDetails.email || "",
        });
    }, []);

    const onDrop = useCallback((acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select an image before analyzing.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("name", patientDetails.name);
        formData.append("email", patientDetails.email);
        formData.append("age", patientDetails.age);

        setLoading(true);
        try {
            const res = await axios.post("http://127.0.0.1:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResponse(res.data);
        } catch (error) {
            console.error("Error analyzing image:", error);
            setResponse({ error: "Failed to analyze image." });
        }
        setLoading(false);
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen py-24 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center py-6 w-full"
            >
                <div className="w-full max-w-lg p-3 sm:p-6 border border-gray-300 rounded-lg shadow-md bg-white">
                    <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">Upload Retinal Image</h2>
                    <form onSubmit={handleAnalyze} className="space-y-3 sm:space-y-4">
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-3 sm:p-8 text-center cursor-pointer transition-colors 
                            ${isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-500"}
                            flex flex-col items-center justify-center`}
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <div className="relative w-full">
                                    <img
                                        src={preview || "/placeholder.svg"}
                                        alt="Preview"
                                        className="max-w-full h-auto mx-auto rounded-lg object-cover max-h-[200px] sm:max-h-[300px] md:max-h-[400px]"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <XIcon size={16} className="sm:size-8" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <UploadIcon size={32} className="text-gray-400 mb-2 sm:mb-4 sm:size-48" />
                                    <p className="text-sm sm:text-lg font-semibold">
                                        {isDragActive ? "Drop the image here" : "Drag & drop an image here, or click to select"}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Supported formats: JPEG, PNG, GIF</p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm sm:text-lg"
                            disabled={!file || loading}
                        >
                            {loading ? "Analyzing..." : "Upload and Analyze"}
                        </button>
                    </form>

                    {response && (
                        <div className="mt-4 p-4 bg-white shadow rounded-md text-sm">
                            <h3 className="font-bold">Response:</h3>
                            <pre className="text-gray-600">DR Grade : {JSON.stringify(response["prediction"]["dr_grade"], null, 2)}</pre>
                            <pre className="text-gray-600">Confidence Level : {JSON.stringify(((response["prediction"]["confidence"])*100).toFixed(2), null, 2)}%</pre>
                            <pre className="text-gray-600">Test Report Sent to your registered email.</pre>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ImageUpload;
