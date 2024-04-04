require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});
// Set the refresh token on your Spotify API instance
spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

// Function to refresh the access token using the refresh token
async function refreshAccessToken() {
  try {
    const data = await spotifyApi.refreshAccessToken();
    console.log('The access token has been refreshed:', data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
    return data.body['access_token']; // Return the new access token
  } catch (error) {
    console.error('Could not refresh access token', error);
    throw error; // Re-throw the error to handle it in the calling context
  }
}

// Endpoint to get the currently playing song
app.get('/current-song', async (req, res) => {
  try {
    const result = await spotifyApi.getMyCurrentPlaybackState({});
    if (result.body && Object.keys(result.body).length > 0) {
      res.json(result.body);
    } else {
      res.status(204).send(); // No content to send back
    }
  } catch (error) {
    if (error.statusCode === 401) {
      try {
        await refreshAccessToken();
        const result = await spotifyApi.getMyCurrentPlaybackState({});
        if (result.body && Object.keys(result.body).length > 0) {
          res.json(result.body);
        } else {
          res.status(204).send();
        }
      } catch (refreshError) {
        console.error("Error after trying to refresh access token:", refreshError);
        res.status(refreshError.statusCode).send(refreshError);
      }
    } else {
      console.error("Error fetching current song:", error);
      res.status(error.statusCode).send(error);
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

