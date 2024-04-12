const express = require('express');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 10000;

const spotifyAPIBaseUri = 'https://api.spotify.com';
const spotifyAccountsBaseUri = 'https://accounts.spotify.com';

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
let accessToken = '';

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${spotifyAccountsBaseUri}/api/token`,
      `grant_type=refresh_token&refresh_token=${refreshToken}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    accessToken = response.data.access_token;
    console.log('Access token refreshed:', accessToken);
  } catch (error) {
    console.error('Failed to refresh Spotify token:', error.message);
  }
};

const getCurrentPlayingTrack = async () => {
  try {
    const response = await axios.get(`${spotifyAPIBaseUri}/v1/me/player/currently-playing`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch currently playing track:', error.message);
    throw error;
  }
};

const getRecentlyPlayedTracks = async () => {
  try {
    const response = await axios.get(`${spotifyAPIBaseUri}/v1/me/player/recently-played`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recently played tracks:', error.message);
    throw error;
  }
};

app.use((req, res, next) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  if (pathname.endsWith('.html') && fs.existsSync(path.join(__dirname, 'public', pathname))) {
    res.sendFile(path.join(__dirname, 'public', pathname));
  } else if (fs.existsSync(path.join(__dirname, 'public', `${pathname}.html`))) {
    res.sendFile(path.join(__dirname, 'public', `${pathname}.html`));
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/player-info', async (req, res) => {
  try {
    const currentTrack = await getCurrentPlayingTrack();
    const recentTracks = await getRecentlyPlayedTracks();
    res.json({ currentTrack, recentTracks });
  } catch (error) {
    res.status(500).send('Error fetching player info');
  }
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await refreshAccessToken();
  // Refresh access token every hour
  setInterval(refreshAccessToken, 3600000);
});
