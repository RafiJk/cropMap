import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { getFirestore, collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useRouter } from 'next/router';
import Header from '../components/Header'; // Assuming Header.js is inside a 'components' directory
import { Button, FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";

const firebaseConfig = {
  apiKey: "AIzaSyD-LpxW3J2ztr1Q1cE_x8pPHv7JRNa4M9g",
  authDomain: "ag-map-d4af3.firebaseapp.com",
  projectId: "ag-map-d4af3",
  storageBucket: "ag-map-d4af3.appspot.com",
  messagingSenderId: "574258608297",
  appId: "1:574258608297:web:4dc19cc58b6aff298dd1b8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const geoUrl = "/TheGreatStateOfMaryland.json";

const MapChart = () => {
  const [data, setData] = useState([]);
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [colorField, setColorField] = useState("harvestPercent");
  const [selectedCounty, setSelectedCounty] = useState(null);

  const router = useRouter();
  let { crop } = router.query;
  if (crop) {
    crop = crop.charAt(0).toUpperCase() + crop.slice(1);
    if (crop === "Soybean"){
      crop = "Soy";
    }
  }

  useEffect(() => {
    const mapCollectionRef = collection(db, `${crop}Map`);
    const q = query(mapCollectionRef, orderBy("date", "desc"));
    onSnapshot(q, (snapshot) => {
      const mapsData = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
      setMaps(mapsData);
      setSelectedMap(mapsData[0]);
    });
  }, [crop]);

  useEffect(() => {
    if (selectedMap) {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, `${crop}Map`, selectedMap.id, 'CountyHarvests'));
        const counties = querySnapshot.docs.map((doc) => doc.data());
        setData(counties);
      };
      fetchData();
    }
  }, [selectedMap, crop]);

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
    setSelectedCounty(null);
  };

  const handleCountyClick = (county) => {
    setSelectedCounty(county === selectedCounty ? null : county);
  };

  return (
    <>
      <Header />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem" }}>
        <div style={{ flex: "0 0 70%", marginRight: "1rem" }}>
          <ComposableMap projection="geoAlbersUsa" style={{ height: "calc(100vh - 0px)" }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const cur = data.find(s => s.county === geo.properties.NAME);
                  const isHighlighted = cur && cur === selectedCounty;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={colorScale(cur ? cur[colorField] : "#EEE")}
                      onMouseEnter={() => handleCountyClick(cur)}
                      onMouseLeave={() => handleCountyClick(cur)}
                      style={{
                        default: {
                          outline: "none"
                        },
                        hover: {
                          outline: "none"
                        },
                        pressed: {
                          outline: "none"
                        },
                        highlight: {
                          fill: "#F53",
                          outline: "none"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
        <div style={{ flex: "0 0 30%" }}>
          <div style={{ marginBottom: "1rem" }}>
            <Button variant="contained" sx={{ marginRight: 1, minWidth: 100 }} onClick={() => setColorField("harvestPercent")}>
              Harvest
            </Button>
            <Button variant="contained" sx={{ marginRight: 1, minWidth: 100 }} onClick={() => setColorField("plantedPercent")}>
              Planted
            </Button>
            <Button variant="contained" sx={{ minWidth: 100 }} onClick={() => setColorField("emergencePercent")}>
              Emergence
            </Button>
          </div>
          <FormControl sx={{ minWidth: 200, marginBottom: "1rem" }}>
            <InputLabel id="map-select-label">Select Date</InputLabel>
            <Select
              labelId="map-select-label"
              id="map-select"
              value={selectedMap ? selectedMap.id : ""}
              onChange={handleMapSelect}
            >
              {maps.map(map => (
                <MenuItem key={map.id} value={map.id}>{map.data.date.toDate().toDateString()}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedCounty && (
            <Box sx={{ marginBottom: "1rem", p: 1, backgroundColor: "#f0f0f0", minWidth: 200 }}>
              {`${selectedCounty.county}: ${selectedCounty[colorField]}%`}
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default MapChart;
