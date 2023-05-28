
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { csv } from "d3-fetch";

const geoUrl = "/TheGreatStateofMaryland.Json";


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


const MapChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    csv("/harvest.csv").then(counties => {
      setData(counties);
    });
  }, []);

  return (
    <>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const cur = data.find(s => s.name === geo.properties.NAME);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(cur ? cur.harvest_percent : "#EEE")}
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

