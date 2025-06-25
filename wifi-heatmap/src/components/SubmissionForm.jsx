import React, {useState} from 'react';
import {db} from '../firebase';
import {addDoc, collection, serverTimestamp, getDocs, query, orderBy, limit, deleteDoc} from 'firebase/firestore';


const SubmissionForm = ({onSubmitComplete}) => {
    const [location, setLocation] = useState('');
    const [strength, setStrength] = useState(3);
    const [coords, setCoords] = useState(null);
    const [usingGPS, setUsingGPS] = useState(false);


    
    const roundToFourDecimals = (num)  =>{
        return Math.round(num*10000)/10000;
    }


      const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!usingGPS && !location) {
          return alert("Please select a location or use your current location.");
        }
      
        let latLng;
        let locationName;
        if (usingGPS) {
          latLng = {
            lat: roundToFourDecimals(coords.lat),
            lng: roundToFourDecimals(coords.lng),
          };
          locationName = `User GPS Location - ${latLng.lat}, ${latLng.lng}`;
        } else {
          const locationCoordinates = {
            "Student Center South": { lat: 29.7201, lng: -95.3407 },
            "M.D. Anderson Library": { lat: 29.7211, lng: -95.3418 },
            "PGH Building": { lat: 29.7215, lng: -95.3437 },
            "Engineering Building 1": { lat: 29.7231, lng: -95.3445 },
            "Moody Towers": { lat: 29.7177, lng: -95.3422 }
          };
          latLng = locationCoordinates[location];
          locationName = location;
        }

        const submissionsRef = collection(db, "submissions");

        const allEntries = await getDocs(submissionsRef);

        if (allEntries.size >=20){
            const oldestEntry = query(submissionsRef, orderBy("timestamp", "asc"), limit(1));
            const oldestSnapshot = await getDocs(oldestEntry);

            if(!oldestSnapshot.empty) {
                const oldestDocs = oldestSnapshot.docs[0];
                await deleteDoc(oldestDocs.ref);
                console.log("Oldest entry deleted:");
        }
    }
      
        await addDoc(collection(db, "submissions"), {
          location: locationName,
          strength,
          lat: latLng.lat,
          lng: latLng.lng,
          timestamp: serverTimestamp()
        });
      
        alert("Thank you for your submission!");
        onSubmitComplete();
      };
  return (
    <div className = " w-full h-screen bg-gradient-to-br from-black via-gray-800 to-black p-10 pt-20 relative">
        <h1 className = "text-4xl font-bold md:text-6xl font-roboto text-center text-white  mb-6">Welcome to the UH Wifi Heatmap</h1>
        <form onSubmit={handleSubmit} className = "p-6 md:mt-30 mt-10  bg-gray-400 rounded shadow max-w-md mx-auto">
            <h2 className ="text-xl font-bold mb-4">Rate Wifi Strength</h2>
            

            {usingGPS && (
                <>
                    <label className = "block mb-2 font-medium">Location Succesfully Set To:</label>
                    <input
                        type = "text"
                        value = {coords ? `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}` : ''}
                        readOnly
                        className = "w-full p-2 mb-4 border bg-gray-200 cursor-not-allowed"
                    />
                </>
            )}
            
            {!usingGPS && (
                <>
                    <label className = "block mb-2 font-medium">Location</label>
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
                            className = "cursor-pointer w-full mb-2  bg-green-600 text-white px-4 py-2 shadow-md rounded">
                                Use My Location
                    </button>
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
        
                <label className = "block mb-2 mt-5 font-medium">WiFi Strength: {strength}</label>
                <input
                    id = "strength"
                    type = "range"
                    min = "1"
                    max = "5"
                    value = {strength}
                    onChange = {(e) => setStrength(e.target.value)}
                    className = "w-full mb-4"
                />
                <div className = "flex justify-center items-center">
                    <button type="submit" className = "cursor-pointer bg-blue-600 justify-center text-center text-white px-4 py-2 rounded">
                        Submit
                    </button>
                </div>
        </form>
        <div className = "absolute bottom-4 left-1/2 transform -translate-x-1/2  bg-blue-500 text-center mt-6 text-white rounded p-3 ">
            <button onClick={() => onSubmitComplete() }>Proceed Without Submitting</button>
        </div>
    </div>
  )
}

export default SubmissionForm
