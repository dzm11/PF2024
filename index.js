const express = require('express');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN
});

// Funkcja do odświeżania tokenów Spotify
async function refreshTokens() {
  try {
    const { data } = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }
    });

    spotifyApi.setAccessToken(data.access_token);
  } catch (error) {
    console.error('Błąd odświeżania tokenów Spotify:', error.response ? error.response.data : error.message);
  }
}

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/authorize', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(['user-read-currently-playing'], 'some-state');
  res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    res.send('Autoryzacja zakończona pomyślnie. Możesz teraz zamknąć to okno.');
  } catch (error) {
    console.error('Błąd autoryzacji:', error);
    res.status(500).send('Wystąpił błąd podczas autoryzacji.');
  }
});

app.get('/current-track', async (req, res) => {
  try {
    await refreshTokens();
    const data = await spotifyApi.getMyCurrentPlayingTrack();
    const track = data.body;

    // Jeśli obiekt item jest pusty, pobierz informacje o ostatnio odtwarzanej piosence
    if (!track) {
      const lastTrackData = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
      const lastTrack = lastTrackData.body.items[0];
      res.json(lastTrack.track);
    } else {
      res.json(track);
    }
  } catch (error) {
    console.error('Błąd pobierania aktualnej piosenki:', error);
    res.status(error.statusCode || 500).send(error.message || 'Wystąpił błąd podczas pobierania aktualnie odtwarzanej piosenki.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Serwer uruchomiony na http://localhost:${port}`);
});


async function getCurrentTrack() {
  try {
    const response = await fetch('/current-track');

    // Sprawdzenie, czy odpowiedź jest poprawna (status 200)
    if (!response.ok) {
      throw new Error('Nie można pobrać danych');
    }

    const data = await response.json();
    const currentTrackElement = document.getElementById('spotifyContainer');
    const isLiveContainer = document.getElementById('isLiveContainer');

    if (data.is_playing) {
      // Jeśli odtwarzana jest piosenka
      isLiveContainer.innerHTML = 'LIVE';
      isLiveContainer.classList.add('live');
    } else {
      const lastPlayedTimestamp = new Date(data.timestamp).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastPlayedTimestamp;

      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;

      if (timeDifference < hour) {
        const minutesAgo = Math.floor(timeDifference / minute);
        isLiveContainer.innerHTML = `${minutesAgo} minutes ago`;
      } else if (timeDifference < day) {
        const hoursAgo = Math.floor(timeDifference / hour);
        isLiveContainer.innerHTML = `${hoursAgo} hours ago`;
      } else {
        const daysAgo = Math.floor(timeDifference / day);
        isLiveContainer.innerHTML = `${daysAgo} days ago`;
      }
    }

    currentTrackElement.innerHTML = `
      <img src="${data.item.album.images[0].url}" id="imgContainer" alt="" height="60px" width="60px">
      <div class="song">
          <div class="song__title" id="titleContainer">${data.item.name}</div>
          <div class="song__author" id="authorContainer">${data.item.artists[0].name}</div>
      </div>
    `;
  } catch (error) {
    console.error('Błąd pobierania aktualnej piosenki:', error);

    // Obsługa błędów dla użytkownika (może być wyświetlony jakiś komunikat)
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Wystąpił błąd podczas pobierania danych.';
    document.body.appendChild(errorMessage);
  }
}

getCurrentTrack();