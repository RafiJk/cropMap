import React from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, Box, Typography, styled } from '@mui/material';
import styles from './selectorModal.module.css';
import Legend from './legend';


const SelectorButtonModal = ({ maps, selectedMap, handleMapSelect, handleColorFieldChange, selectedButton, selectedCounty, colorField, crop }) => {
  return (
    <Box className={styles.buttonBox}>
        {/* Crop Name */}
        <Typography className={styles.cropName} style={{ fontSize: '40px', fontWeight: 'bold' }}>
          {crop}
        </Typography>

        <div className={styles.mapInfoButtons}>
          <Button
            variant="contained"
            className={`${styles.mapInfoButton} ${selectedButton === "harvestPercent" ? styles.selected : ""}`}
            onClick={() => handleColorFieldChange("harvestPercent")}
          >
            Harvested
          </Button>
          <Button
            variant="contained"
            className={`${styles.mapInfoButton} ${selectedButton === "plantedPercent" ? styles.selected : ""}`}
            onClick={() => handleColorFieldChange("plantedPercent")}
          >
            Planted
          </Button>
          <Button
            variant="contained"
            className={`${styles.mapInfoButton} ${selectedButton === "emergencePercent" ? styles.selected : ""}`}
            onClick={() => handleColorFieldChange("emergencePercent")}
          >
            Emerged
          </Button>
        </div>
        <FormControl fullWidth className={styles.mapSelect}>
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
        <Legend />
        {selectedCounty ? (
          <Box className={styles.mapInfoBoxSelected}>
            {`${selectedCounty.county}: ${selectedCounty[colorField]}%`}
          </Box>
        ) : (
          <Box className={styles.mapInfoBoxSelected}>
            {`Hover over a map to view %`}
          </Box>
        )}
        <Box style={{ width: '100%', height: 'auto' }}>
          <img
            src={"./../logo.jpeg"}
            alt="Crop Image"
            style={{ width: "100%", height: "auto", objectFit: "cover", paddingTop: "20px" }}
          />
        </Box>
    </Box>
  );
}

export default SelectorButtonModal;
