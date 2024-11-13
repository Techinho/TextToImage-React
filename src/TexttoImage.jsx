import React, { useState } from 'react';

function TextToImage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        })
      });

      const data = await response.json();

      if (response.ok && data?.data?.[0]?.url) {
        setImageUrl(data.data[0].url);
      } else {
        throw new Error(data.error?.message || 'Unexpected API response structure');
      }
    } catch (err) {
      console.error('Full error object:', err);
      if (err.response) {
        setError(`Server error: ${err.response.status}. ${err.response.data.error?.message || 'Unknown error'}`);
      } else if (err.request) {
        setError('No response received from server. Please check your internet connection.');
      } else {
        setError(`An error occurred: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-lg shadow-xl text-white">
      <h2 className="text-3xl font-extrabold text-center mb-6">AI Text to Image Generator</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image description"
          required
          className="w-full p-4 border-2 border-white rounded-lg text-black focus:outline-none focus:ring-4 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-semibold disabled:bg-gray-400 hover:bg-blue-600 transition-all"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
      {error && (
        <div className="mt-4 text-red-300">
          <p>Error: {error}</p>
          <p className="text-sm">Please check the console for more detailed error information.</p>
        </div>
      )}
      {imageUrl && (
        <div className="mt-6 flex justify-center">
          <img src={imageUrl} alt="Generated" className="w-full rounded-lg shadow-2xl max-w-4xl" />
        </div>
      )}
    </div>
  );
}

export default TextToImage;
