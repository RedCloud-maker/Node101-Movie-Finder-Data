require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

// 1. Morgan Middleware for logging
app.use(morgan('dev'));

// 2. The Cache Object (Requirement: Store data for subsequent requests)
const cache = {};

app.get('/', (req, res) => {
    const movieID = req.query.i;
    const movieTitle = req.query.t;
    const apiKey = process.env.OMDB_API_KEY;

    // Determine which identifier to use for the cache and API call
    const key = movieID || movieTitle;

    // Check if we have a search term at all
    if (!key) {
        return res.status(400).send('Please provide a movie ID (?i=) or Title (?t=)');
    }

    // 3. Cache Logic: Check if we already have this movie data
    if (cache[key]) {
        console.log('Serving from cache:', key);
        return res.status(200).json(cache[key]);
    }

    // 4. Axios API Call: If not in cache, fetch from OMDb
    const url = movieID 
        ? `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}`
        : `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movieTitle)}`;

    axios.get(url)
        .then(response => {
            // Save to cache before sending response
            cache[key] = response.data;
            res.status(200).json(response.data);
        })
        .catch(err => {
            console.error('API Error:', err.message);
            res.status(500).send('Internal Server Error: Could not reach OMDb');
        });
});

module.exports = app;
