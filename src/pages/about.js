import React from 'react';
import Header from './components/Header'; // Assuming Header.js is inside a 'components' directory
import Typography from '@mui/material/Typography';

const About = () => {
  return (
    <div>
      <Header />
      <div>
        <Typography variant="h4">The Crop Map</Typography>
        <Typography variant="body1">
          This map is an interface designed reflect the rates of planting,<br/>
          emergence, and harvesting of wheat, soy, and corn. It's data is <br/>
          regularly updated by Agriculture Extension Eduacators and Specialists,<br/>
          and is displayed on the map as a color scale (from white to dark red),<br/>
          projecting the percentage of each type of crop which has reached each
          stage.<br/>
        </Typography>
      </div>
    </div>
  );
}

export default About;
