import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Assuming the interfaces Artist and Song are defined in a separate file and imported here
// import { Artist, Song } from './types';
interface Artist {
  name: string;
}

interface Song {
  item: {
    name: string;
    artists: Artist[];
    // Add more properties as needed
  };
}

function CurrentSong() {
  const [song, setSong] = useState<Song | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Access environment variable

  useEffect(() => {
    const fetchCurrentSong = async () => {
      const apiUrl = `${backendUrl}/current-song`; // Construct the API URL using the environment variable
      try {
        const response = await axios.get(apiUrl);
        if (response.status == 200) {
          const data: Song = await response.data;
          setSong(data);
        } else {
          setSong(null); // Handle no content or error
        }
      } catch (error) {
        console.error('Failed to fetch current song:', error);
        setSong(null);
      }
    };

    fetchCurrentSong();
    // Optionally, set up a polling mechanism or use WebSocket for real-time update
  }, []);

  if (!song || !song.item) {
    return <div>No song is currently playing.</div>;
  }

  return (
    <div>
      <h2>Now Playing</h2>
      <p><strong>Title:</strong> {song.item.name}</p>
      <p><strong>Artist:</strong> {song.item.artists.map(artist => artist.name).join(', ')}</p>
      {/* Display more song details as needed */}
    </div>
  );
}

export default CurrentSong;
