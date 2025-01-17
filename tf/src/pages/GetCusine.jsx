import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RestaurantCard from '../components/RestaurantCard'; // Import the RestaurantCard component
import Pagination from '../components/Pagination'; // Import the Pagination component

const API_URL = 'http://localhost:3000/api/getcuisine';

function ImageSearch() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [response, setResponse] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(null); // State for image preview URL

    useEffect(() => {
        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile)); // Set the preview URL
            handleSubmit(); // Fetch data whenever selectedFile or currentPage changes
        }
    }, [selectedFile, currentPage]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // Update the preview URL when a new file is selected
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('image', selectedFile);

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}?page=${currentPage}&limit=15`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Network response was not ok');

            const result = await res.json();
            setResponse(`Cuisine: ${result.cuisine}`);
            setRestaurants(result.restaurants || []);
            setTotalPages(result.pagination.totalPages);
        } catch (error) {
            setResponse(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold text-center mb-6">Upload an Image</h1>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col items-center space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border border-gray-300 rounded-md py-2 px-4"
                        required
                    />
                    {previewUrl && (
                        <div className="mt-4">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-48 h-48 object-cover rounded-md border border-gray-300" // Added CSS classes
                            />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-500 text-white rounded-md px-6 py-2 font-semibold hover:bg-blue-600 transition-colors"
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
                {response && <p className="text-center mt-4 text-lg font-medium">{response}</p>}
                <div className="mt-6">
                    {restaurants.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-center">
                                Restaurants Serving {response.split(': ')[1]}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {restaurants.map((restaurant) => (
                                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                handlePageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ImageSearch;