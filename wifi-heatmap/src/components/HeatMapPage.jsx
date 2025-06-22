import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, useMap} from 'react-leaflet';
import {db} from '../firebase';
import {collection, getDocs} from 'firebase/firestore';
import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'heatmap.js';
import 'leaflet.heat';

const HeatMapOverlay = ({points}) =>{
    const map = useMap();

    useEffect(() => {
        if (!map || points.length === 0) return;

        console.log("Heatmap points:", points);

        const heatLayer = L.heatLayer(
            points.map(p => [p.lat, p.lng, p.strength]),
            {
              radius: 40,
              blur: 20,
              gradient: {
                0.1: 'rgba(0, 0, 255, 0.4)',   // blue (low)
                0.3: 'rgba(0, 255, 0, 0.4)',   // green
                0.6: 'rgba(255, 165, 0, 0.4)', // orange
                1.0: 'rgba(255, 0, 0, 0.4)'    // red (strong)
              },
              maxOpacity: 0.2,
              maxZoom: 17,
              max: 5
            }
          );

        heatLayer.addTo(map);
        return () => {
            heatLayer.remove();
        };
    }, [map,points]);
    return null;
}

const HeatMapPage = () => {

    const [submissions, setSubmissions] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await getDocs(collection(db, "submissions"));
            const data = snapshot.docs.map(doc => doc.data());
            setSubmissions(data);
            console.log("Fetched data:", data);
        };
        fetchData();
    }, [])

  return (
    <div className = 'w-full h-screen'>
        <MapContainer
            center = {[29.7206, -95.3437]}
            zoom = {17}
            style = {{ height:'100%', width: '100%'}}
            >
                <TileLayer
                    attribution = '&copy; OpenStreetMap contributors'
                    url ="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                <HeatMapOverlay points={submissions} />
            </MapContainer>
      
    </div>
  )
}

export default HeatMapPage
