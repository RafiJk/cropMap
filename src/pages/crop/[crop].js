import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { getFirestore, collection, getDocs, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD-LpxW3J2ztr1Q1cE_x8pPHv7JRNa4M9g",
  authDomain: "ag-map-d4af3.firebaseapp.com",
  projectId: "ag-map-d4af3",
  storageBucket: "ag-map-d4af3.appspot.com",
  messagingSenderId: "574258608297",
  appId: "1:574258608297:web:4dc19cc58b6aff298dd1b8"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const geoUrl = "/TheGreatStateofMaryland.Json";

const MapChart = () => {
  const [data, setData] = useState([]);
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);

  // Fetch list of maps on component mount
  useEffect(() => {
    const mapCollectionRef = collection(db, 'Map');
    const q = query(mapCollectionRef, orderBy("date", "desc")); // sort by date in descending order
    onSnapshot(q, (snapshot) => {
      const mapsData = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
      setMaps(mapsData);
      setSelectedMap(mapsData[0]); // set the first document (most recent) as selected
    });
  }, []);

  // Fetch data whenever selectedMap changes
  useEffect(() => {
    if (selectedMap) {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, 'Map', selectedMap.id, 'CountyHarvests'));
        const counties = querySnapshot.docs.map((doc) => doc.data());
        setData(counties);
      };
  
      fetchData();
    }
  }, [selectedMap]);

  const colorScale = scaleQuantize()
    .domain([1, 10])
    .range([
      "#ffedea",
      "#ffcec5",
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618"
    ]);

  const handleMapSelect = (event) => {
    const mapId = event.target.value;
    const map = maps.find(map => map.id === mapId);
    setSelectedMap(map);
  };

  return (
    <>
      <select onChange={handleMapSelect}>
        {maps.map(map => (
          <option key={map.id} value={map.id}>{map.data.date.toDate().toDateString()}</option>
        ))}
      </select>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const cur = data.find(s => s.county === geo.properties.NAME);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(cur ? cur.percent : "#EEE")}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </>
  );
};

export default MapChart;