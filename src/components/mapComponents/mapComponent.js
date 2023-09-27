import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import styles from './MapComponent.module.css';
import { scaleQuantize } from 'd3-scale';

const stateGeographyData = [
  { stateCode: "DE", url: "/theRealStateOfDE.json" },
  { stateCode: "MD", url: "/theRealStateOfMD.json" },
  { stateCode: "WV", url: "/theRealStateOfWV.json" },
  { stateCode: "VA", url: "/theRealStateOfVA.json" },
  { stateCode: "PA", url: "/theRealStateOfPA.json" },
];

const MapComponent = ({ data, colorField, handleCountyClick, mapScale }) => {
  const colorScale = scaleQuantize()
    .domain([0, 100])
    .range([
      "#ffffe0",
      "#eef9bf",
      "#ddf3a0",
      "#ccd28a",
      "#b9bd75",
      "#a3a864",
      "#879254",
      "#6a7b48",
      "#4f633d",
      "#324a32"  
    ]);

  return (
    <div className={styles.mapContainer}>
      <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: mapScale }} style={{ height: "90vh" }}>
        {stateGeographyData.map(({ stateCode, url }) => (
          <Geographies key={stateCode} geography={url}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const cur = data.find((s) => s.county === geo.properties.NAME);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={colorScale(cur ? cur[colorField] : "#EEE")}
                    onMouseEnter={() => handleCountyClick(cur)}
                    onMouseLeave={() => handleCountyClick(null)}
                    style={{
                      default: {
                        outline: "none",
                        stroke: "#000",
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
  );
}

export {MapComponent};
