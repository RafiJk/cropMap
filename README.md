# Crop Map

Welcome to **Crop Map**, a cutting-edge web application designed to provide valuable insights into the agricultural landscape. The platform empowers farmers, researchers, and agricultural enthusiasts with accurate and up-to-date information about crop progress across various regions.

## Overview

**Crop Map** is an interactive map that visualizes the progress of wheat, soy, and corn crops as they go through different stages, such as planting, emergence, and harvesting. The map displays real-time data using color-coded shading, which reflects the percentage of crops that have reached each growth stage in specific counties. This data is regularly updated by Agriculture Extension Educators and Specialists to ensure that the information provided is both accurate and timely.

The goal of **Crop Map** is to support the agricultural community by helping users make data-driven decisions, optimize farming practices, and predict trends to ensure sustainable and efficient crop management.

## Features

- **Interactive Map**: Navigate through counties to view crop progress across different regions.
- **Real-time Data**: The platform is continuously updated with the latest data, ensuring that users have access to the most current information available.
- **Color-Coded Progress Indicators**: The map uses various shades of green to represent the percentage of crops at different stages of growth (planting, emergence, harvesting).
- **Crop Types**: Track progress for three key crops: wheat, soy, and corn.
- **Timely Updates**: Data provided by Agriculture Extension Educators and Specialists to reflect accurate and region-specific crop statuses.

## Technology Stack

- **React**: The web application is built using React, a powerful JavaScript library for building user interfaces.
- **Vercel**: The platform is hosted on Vercel, ensuring fast and reliable performance for users across the globe.

## Getting Started

To get started with **Crop Map**, simply visit the live application hosted on [Vercel](https://your-app-url.vercel.app).

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge, etc.)
- Internet connection to view the real-time map updates

### How to Use

1. **Navigate the Map**: Zoom in and out to explore different counties and see crop progress in various areas.
2. **View Crop Data**: Each county will display crop progress with color-coded indicators, showing the percentage of crops at each growth stage.
3. **Filter Crop Types**: Toggle between wheat, soy, and corn to focus on specific crops.

## Contributing

We welcome contributions to **Crop Map**. If you'd like to help improve the application, please fork the repository and submit a pull request. You can report any issues, suggest new features, or improve the codebase.

## Credits

- **Developers**: Raphael Kigner and Sam Low
- **Data Providers**: Agriculture Extension Educators and Specialists

For any inquiries or feedback, feel free to reach out via the Issues tab or contact us directly.

---

Thank you for using **Crop Map**, and we hope it helps you make informed decisions in the agricultural field!







This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


<!-- 
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
  backgroundColor: "white", 
  "@media (max-width: 768px)": {
    flexDirection: "column",
    height: "auto",
    padding: "0 10px",  // Reduced padding for smaller screens
    margin: "0px",
  },
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
        <SelectorButtonModal
          maps={maps}
          selectedMap={selectedMap}
          handleMapSelect={handleMapSelect}
          handleColorFieldChange={handleColorFieldChange}
          selectedButton={selectedButton}
          selectedCounty={selectedCounty}
          colorField={colorField}
          crop={crop}
        />
        <MapComponent
          data={data}
          colorField={colorField}
          handleCountyClick={handleCountyClick}
          mapScale={mapScale}
        />
      </Container>
    </>
  );
};
export default MapChart; -->
