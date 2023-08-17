import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { getFirestore, collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button, FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";
import styles from "./MapChart.module.css"; // Import the CSS file
import Legend from "./legend"; // Adjust the path

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

const DEUrl = "/theRealStateOfDE.json"; //dude watch the names
const MDUrl = "/theRealStateOfMD.json";
const WVUrl = "/theRealStateOfWV.json";
const VAUrl = "/theRealStateOfVA.json";
const PAUrl = "/theRealStateOfPA.json";


const stateGeographyData = [
  { stateCode: "DE", url: DEUrl },
  { stateCode: "MD", url: MDUrl },
  { stateCode: "WV", url: WVUrl },
  { stateCode: "VA", url: VAUrl },
  { stateCode: "PA", url: PAUrl },
];


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
    if (crop == "Soy Bean") {
      crop = "S";
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
    .domain([0, 100])
    .range([
      "#c0c0c0",
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
      <div className={styles.mapChartContainer}>
        <div className={styles.mapContainer}>
        <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1300 }} style={{ height: "90vh" }}>
            {stateGeographyData.map(({ stateCode, url }) => (
              <Geographies key={stateCode} geography={url}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const cur = data.find((s) => s.county === geo.properties.NAME);
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
                            outline: "none",
                            stroke: "#fff",
                            strokeWidth: 0.5,
                          },
                          hover: {
                            outline: "none",
                            stroke: "black",
                            strokeWidth: 0.5,
                          },
                          pressed: {
                            outline: "none",
                            stroke: "black",
                            strokeWidth: 0.5,
                          },
                          highlight: {
                            fill: "#F53",
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            ))}
          </ComposableMap>
        </div>
        <Box className={styles.buttonBox}> {/* Use the .buttonBox class here */}
        <div className= {styles.mapInfoContainer}>
          <div className={styles.mapInfoButtons}>
              <Button
                variant="contained"
                className={styles.mapInfoButton}
                onClick={() => setColorField("harvestPercent")}
              >
                Harvest
              </Button>
              <Button
                variant="contained"
                className={styles.mapInfoButton}
                onClick={() => setColorField("plantedPercent")}
              >
                Planted
              </Button>
              <Button
                variant="contained"
                className={styles.mapInfoButton}
                onClick={() => setColorField("emergencePercent")}
              >
                Emergence
              </Button>
            </div>
            <FormControl fullWidth className= {styles.mapSelect}>
              <InputLabel id="map-select-label">Select Date</InputLabel>
              <Select
                labelId="map-select-label"
                id="map-select"
                value={selectedMap ? selectedMap.id : ""}
                onChange={handleMapSelect}
              >
                {maps.map((map) => (
                  <MenuItem key={map.id} value={map.id}>
                    {map.data.date.toDate().toDateString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Legend></Legend>
            {selectedCounty && (
              <Box className= {styles.mapInfoBoxSelected}>
                {`${selectedCounty.county}: ${selectedCounty[colorField]}%`}
              </Box>
            ) || (
              <Box className= {styles.mapInfoBoxSelected}>
              {`Hover over map to view %`}
            </Box>
            )
            }
        </div>
        </Box>
        <Footer></Footer>
      </div>
    </>
  );
}

  export default MapChart;

  // [0.0171,0.0123] MD GEO 
  //[0.01862570554,0.012452821289585868] DE GEO
