import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, Radio } from 'lucide-react';

const VibrantRadioApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState('');
  const [volume, setVolume] = useState(1);
  const [stations, setStations] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('https://de1.api.radio-browser.info/json/stations/search?limit=15&codec=MP3')
      .then(response => response.json())
      .then(data => {
        setStations(data.map(station => ({
          name: station.name,
          value: station.stationuuid,
          url: station.url_resolved
        })));
      })
      .catch(error => console.error('Error fetching stations:', error));
  }, []);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStationChange = (value) => {
    setCurrentStation(value);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (currentStation) {
      const station = stations.find(s => s.value === currentStation);
      if (audioRef.current && station) {
        audioRef.current.src = station.url;
        audioRef.current.play().catch(e => console.error('Playback failed:', e));
      }
    }
  }, [currentStation, stations]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-500 animate-gradient-x">
      <Card className="w-96 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 shadow-xl">
        <CardContent className="flex flex-col items-center p-6">
          <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Radio className="mr-2" /> Vibrant Radio
          </h1>
          <Select onValueChange={handleStationChange} value={currentStation}>
            <SelectTrigger className="w-full mb-6 bg-white bg-opacity-20 border-white border-opacity-30 text-white">
              <SelectValue placeholder="Select a radio station" />
            </SelectTrigger>
            <SelectContent className="bg-purple-600 text-white border border-white border-opacity-20">
              {stations.map((station) => (
                <SelectItem key={station.value} value={station.value} className="hover:bg-purple-700">
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex w-full justify-between mb-6">
            <Button 
              onClick={togglePlayback} 
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              disabled={!currentStation}
            >
              {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
          <div className="w-full flex items-center mb-6">
            <Volume2 className="mr-2 text-white" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-full accent-pink-500"
            />
          </div>
          {isPlaying && currentStation && (
            <div className="mt-4 text-center text-white">
              <p className="text-sm">Now playing:</p>
              <p className="font-semibold">{stations.find(station => station.value === currentStation)?.name}</p>
            </div>
          )}
          <audio ref={audioRef} style={{display: 'none'}} />
        </CardContent>
      </Card>
    </div>
  );
};

export default VibrantRadioApp;
