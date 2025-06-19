import React, {useState} from 'react';
import {db} from '../firebase';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';


const SubmissionForm = ({onSubmitComplete}) => {
    const [location, setLocation] = useState('');
    const [strength, setStrength] = useState(3);
    const [coords, setCoords] = useState(null);
    const [usingGPS, setUsingGPS] = useState(false);



      const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!usingGPS && !location) {
          return alert("Please select a location or use your current location.");
        }
      
        let latLng;
        if (usingGPS) {
          latLng = coords;
        } else {
          const locationCoordinates = {
            "Student Center South": { lat: 29.7201, lng: -95.3407 },
            "M.D. Anderson Library": { lat: 29.7211, lng: -95.3418 },
            "PGH Building": { lat: 29.7215, lng: -95.3437 },
            "Engineering Building 1": { lat: 29.7231, lng: -95.3445 },
            "Moody Towers": { lat: 29.7177, lng: -95.3422 }
          };
          latLng = locationCoordinates[location];
        }
      
        await addDoc(collection(db, "submissions"), {
          location: usingGPS ? "User GPS Location" : location,
          strength,
          lat: latLng.lat,
          lng: latLng.lng,
          timestamp: serverTimestamp()
        });
      
        alert("Thank you for your submission!");
        onSubmitComplete();
      };
  return (
    <form onSubmit={handleSubmit} className = "p-6 bg-white rounded shadow max-w-md mx-auto">
        <h2 className ="text-xl font-bold mb-4">Rate Wifi Strength</h2>

        <button
                type="button"
                onClick={() => {
                    if (!navigator.geolocation) {
                        alert("Geolocation is not supported by this browser.");
                        return;
                    }
                    navigator.geolocation.getCurrentPosition((pos) => {
                        const {latitude, longitude} = pos.coords;
                        setCoords({lat: latitude, lng:longitude});
                        setUsingGPS(true);
                        alert('location set!');
                    },
                    (err) =>{
                        console.error(err);
                        alert("failed to get location");
                    }
                );
                }}
                className = "cursor-pointer bg-green-600 text-white px-4 py-2 rounded">
                    Use My Location
                </button>
        {!usingGPS && (

            <>
                <label className = "block mb-2 font-medium">Location</label>
                <select
                    id = "location"
                    className = "w-full p-2 border"
                    value = {location}
                    onChange = {(e) => setLocation(e.target.value)}
                    >
                        <option value="">Select a location</option>
                        <option>Student Center South</option>
                        <option>M.D. Anderson Library</option>
                        <option>PGH Building</option>
                        <option>Engineering Building 1</option>
                        <option>Moody Towers</option>
                    </select>
            </>
        )}

            

            <label className = "block mb-2 font-medium">WiFi Strength: {strength}</label>
            <input
                id = "strength"
                type = "range"
                min = "1"
                max = "5"
                value = {strength}
                onChange = {(e) => setStrength(e.target.value)}
                className = "w-full mb-4"
            />

            <button type="submit" className = "cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
                Submit
            </button>
    </form>
  )
}

export default SubmissionForm
