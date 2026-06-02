import React, { useState } from 'react';

const MovieUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    description: '',
    genre: '',
    cast: '',
    director: '',
    language: '',
    posterUrl: '',
    rating: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        rating: Number(formData.rating),
        cast: formData.cast
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      };

      const res = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload movie');
      }

      setMessage('Movie uploaded successfully!');
      setFormData({
        name: '',
        year: '',
        description: '',
        genre: '',
        cast: '',
        director: '',
        language: '',
        posterUrl: '',
        rating: ''
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Upload Movie
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Movie Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <input
            type="number"
            name="year"
            placeholder="Release Year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <textarea
            name="description"
            placeholder="Movie Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <input
            type="text"
            name="genre"
            placeholder="Genre (e.g. Action, Drama)"
            value={formData.genre}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <input
            type="text"
            name="cast"
            placeholder="Cast (comma separated)"
            value={formData.cast}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <input
            type="text"
            name="director"
            placeholder="Director"
            value={formData.director}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <input
            type="text"
            name="language"
            placeholder="Language"
            value={formData.language}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <input
            type="text"
            name="posterUrl"
            placeholder="Poster Image URL"
            value={formData.posterUrl}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <input
            type="number"
            step="0.1"
            name="rating"
            placeholder="Rating (e.g. 8.5)"
            value={formData.rating}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg px-4 py-3 text-white transition ${
              loading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-black hover:bg-gray-800'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload Movie'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-5 text-center font-semibold ${
              message.toLowerCase().includes('success')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieUpload;