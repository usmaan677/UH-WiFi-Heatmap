import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, useMap} from 'react-leaflet';
import {db} from '../firebase';
import {collection, getDocs,query, where} from 'firebase/firestore';
import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'heatmap.js';
import 'leaflet.heat';

const averageForLocation = async (location) =>{
    try{
        const collectionRef = collection(db,"submissions");
        const q = query (collectionRef, where("location", "==", location));
        const snapshot = await getDocs(q);
        let sum = 0;
        let count = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            const strength = Number(data.strength);
            console.log(`Strength for ${location}:`, strength);
            sum += strength;
            count++;
        })

        return count > 0 ? (sum/count) :0;
    
    }catch(error){
        console.error("Error calculating average strength:", error);
        return 0;
    }
}

const HeatMapOverlay = ({points}) =>{
    const map = useMap();

    useEffect(() => {
        if (!map || points.length === 0) return;

        console.log("Heatmap points:", points);

        const heatLayer = L.heatLayer(
            points.map(p => [p.lat, p.lng, p.strength]),
            {
              radius: 60,
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
    const [heatmapData, setHeatmapData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await getDocs(collection(db, "submissions"));
            const data = snapshot.docs.map(doc => doc.data());
            setSubmissions(data);
            console.log("Fetched data:", data);
        };
        fetchData();
    }, [])

    useEffect(() => {
        const fetchHeatmapData = async () => {
            setIsLoading(true);
            const locations = [...new Set(submissions.map(sub=>sub.location))];

            const allHeatmapData = [];

            for(const location of locations){
                const avg = parseFloat(await averageForLocation(location));
                console.log(`Average for ${location}:`, avg);

                const referencePoint = submissions.find(sub=> sub.location === location);

                if(referencePoint){
                    const heatPoint = {
                        lat: referencePoint.lat,
                        lng: referencePoint.lng,
                        strength: avg   
                    };
                    allHeatmapData.push(heatPoint);
                }


                    
            }
            setHeatmapData(allHeatmapData);
            setIsLoading(false);
        };
        if(submissions.length > 0){
            fetchHeatmapData();
        }
    }, [submissions]);

  return (
    <div className = 'w-full h-screen'>
        {isLoading ? (
            <div>Loading...</div>
        ) : (
            <MapContainer
                center = {[29.7206, -95.3437]}
                zoom = {17}
                style = {{ height:'100%', width: '100%'}}
                >
                    <TileLayer
                        attribution = '&copy; OpenStreetMap contributors'
                        url ="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    <HeatMapOverlay points={heatmapData} />
            </MapContainer>
        )}
        
      
    </div>
  )
}

export default HeatMapPage
