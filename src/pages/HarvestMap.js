import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';

const HarvestMap = ({ countyData }) => {
  const colorScale = scaleQuantize()
    .domain([0, 100])
    .range([
      '#ffedea',
      '#ffcec5',
      '#ffad9f',
      '#ff8a75',
      '#ff5533',
      '#e2492d',
      '#be3d26',
      '#9a311f',
      '#782618'
    ]);

  return (
    <ComposableMap projection="geoAlbersUsa" style={{ height: 'calc(100vh - 0px)' }}>
      <Geographies geography="/TheGreatStateOfMaryland.json">
        {({ geographies }) =>
          geographies.map((geo) => {
            const curCountyData = countyData.find((data) => data.county === geo.properties.NAME);
            const fillColor = curCountyData ? colorScale(curCountyData.harvestPercent) : '#EEE';
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fillColor}
                style={{
                  default: {
                    outline: 'none',
                    stroke: '#fff',
                    strokeWidth: 0.5,
                  },
                  hover: {
                    outline: 'none',
                    stroke: 'black',
                    strokeWidth: 0.5,
                  },
                  pressed: {
                    outline: 'none',
                    stroke: 'black',
                    strokeWidth: 0.5,
                  },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default HarvestMap;
