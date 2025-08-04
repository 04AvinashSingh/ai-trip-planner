import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);

    // Fetch sample map data from OpenStreetMap API
    async function fetchLocations() {
      try {
        const resp = await fetch('https://nominatim.openstreetmap.org/search?q=Paris&format=json');
        const data = await resp.json();
        setLocations(data.slice(0, 3).map(loc => ({
          position: [parseFloat(loc.lat), parseFloat(loc.lon)],
          popup: loc.display_name
        })));
      } catch (err) {
        console.error("Failed to fetch map data", err);
      }
    }

    fetchLocations();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        email: result.user.email,
        uid: result.user.uid,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setOpenDialog(false);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className='shadow-sm flex flex-col gap-6 p-6'>
      <div className='flex justify-between items-center'>
        <img src="/logo.svg" alt="Logo" />
        {user ? (
          <div className='flex items-center gap-3'>
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full">+ Create Trip</Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full">My Trips</Button>
            </a>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="logo" width="100px" className='mx-auto mb-3' />
              <h2 className='font-bold text-lg text-center'>Sign In to Continue</h2>
              <input
                type="email"
                className="border w-full mt-3 p-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="border w-full mt-3 p-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleLogin} className="w-full mt-4">Login</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Map Display */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Map Example (Top 3 Paris Results)</h2>
        <MapContainer center={[48.8566, 2.3522]} zoom={6} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((marker, index) => (
            <Marker key={index} position={marker.position}>
              <Popup>{marker.popup}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Header;
