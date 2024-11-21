import axios from "axios";
import React, { useState } from "react";


function TextToImage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const apikey = import.meta.env.VITE_RAPID_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setImageUrl("");

    try {
      const response = await axios.post(
        "https://ai-text-to-image-generator-api.p.rapidapi.com/realistic",
        { inputs: prompt },
        {
          headers: {
            "x-rapidapi-key": apikey,
            "x-rapidapi-host": "ai-text-to-image-generator-api.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.url) {
        setImageUrl(response.data.url);
      } else {
        throw new Error("Image URL not found in the API response.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "generated-image.jpg";
      link.click();
    } catch (error) {
      console.error("Error downloading the image:", error);
      setError("Failed to download the image. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
          AI Text to Image Generator
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Generate stunning images from your imagination with a single prompt.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              aria-label="Image description"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your image..."
              required
              className="w-full p-4 pl-12 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.5 10a7.5 7.5 0 1015 0 7.5 7.5 0 00-15 0zm10.5 1.5a1 1 0 00-1-1h-3a1 1 0 000 2h3a1 1 0 001-1z" />
              </svg>
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-lg hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-blue-400 disabled:bg-gray-400"
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </form>
        {isLoading && (
          <div className="flex justify-center mt-6">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500">
            <p>Error: {error}</p>
            <p className="text-sm">
              Please check the console for more detailed error information.
            </p>
          </div>
        )}
        {imageUrl && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-lg">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full rounded-lg transform transition duration-500 hover:scale-105"
            />
            <button
              onClick={handleDownload}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2024 EZZAOUYA. Powered by AI Text to Image API.</p>
      </footer>
    </div>
  );
}

export default TextToImage;
