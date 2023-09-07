import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Header from "../../components/misc/Header";
import { db } from "../../firebase";
import {styled } from '@mui/material';
import SelectorButtonModal from "../../components/mapComponents/SelectorComponent";
import { MapComponent } from "../../components/mapComponents/mapComponent";


const Container = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "@media (max-width: 768px)": {  // Media query for screens up to 768px wide
    flexDirection: "column",     // Change flex direction to column
  }
});


const MapChart = () => {
  const [data, setData] = useState([]);
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [colorField, setColorField] = useState("harvestPercent");
  const [selectedButton, setSelectedButton] = useState("harvestPercent");
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [mapScale, setMapScale] = useState(1300);

  const router = useRouter();
  let { crop } = router.query;
  if (crop) {
    crop = crop.charAt(0).toUpperCase() + crop.slice(1);
    if (crop == "Soy Bean") {
      crop = "S";
    }
  }

  useEffect(() => {
    const adjustScale = () => {
      const screenWidth = window.innerWidth;
      const newScale = Math.max(600, screenWidth*.7);
      setMapScale(newScale);
    };

    adjustScale(); // Initial adjustment
    window.addEventListener("resize", adjustScale); // Adjust scale on window resize

    return () => {
      window.removeEventListener("resize", adjustScale); // Cleanup listener on component unmount
    };
  }, []);

  useEffect(() => {
    const mapCollectionRef = collection(db, `${crop}Map`);
    const q = query(mapCollectionRef, orderBy("date", "desc"));
    onSnapshot(q, (snapshot) => {
      const mapsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setMaps(mapsData);
      setSelectedMap(mapsData[0]);
    });
  }, [crop]);

  useEffect(() => {
    if (selectedMap) {
      const fetchData = async () => {
        const querySnapshot = await getDocs(
          collection(db, `${crop}Map`, selectedMap.id, "CountyHarvests")
        );
        const counties = querySnapshot.docs.map((doc) => doc.data());
        setData(counties);
      };
      fetchData();
    }
  }, [selectedMap, crop]);

  const handleMapSelect = (event) => {
    const mapId = event.target.value;
    const map = maps.find((map) => map.id === mapId);
    setSelectedMap(map);
    setSelectedCounty(null);
  };

  const handleColorFieldChange = (field) => {
    // Updated function
    setColorField(field);
    setSelectedButton(field);
  };

  const handleCountyClick = (county) => {
    setSelectedCounty(county === selectedCounty ? null : county);
  };

  return (
    <>
      <Header />
      <Container>
        <MapComponent
          data={data}
          colorField={colorField}
          handleCountyClick={handleCountyClick}
          mapScale={mapScale}
        />
        <SelectorButtonModal
          maps={maps}
          selectedMap={selectedMap}
          handleMapSelect={handleMapSelect}
          handleColorFieldChange={handleColorFieldChange}
          selectedButton={selectedButton}
          selectedCounty={selectedCounty}
          colorField={colorField}
        />
        
      </Container>
    </>
  );
};
export default MapChart;
