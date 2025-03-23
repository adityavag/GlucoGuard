import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { UploadIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ImageUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            alert("Image Uploaded Successfully. Processing for diabetic retinopathy screening...");
            setTimeout(() => {
                alert("Analysis Complete. The results are ready for review.");
            }, 3000);
        }
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
                <div className="w-full max-w-lg  p-3 sm:p-6 border border-gray-300 rounded-lg shadow-md bg-white">
                    <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">Upload Retinal Image</h2>
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                                        <XIcon size={16} className="sm:size-20" />
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
                            disabled={!file}
                        >
                            Upload and Analyze
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ImageUpload;