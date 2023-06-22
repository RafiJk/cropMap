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
          This map was designed as an interface to determine the rates of planting,<br />
          emergence, and harvesting for the big three crops: wheat, soy, and corn.<br />
          It's data is regularly updated by Maryland Agriculture Extension agents, and<br />
          is displayed on the map as a color scale (from white to dark red), displaying<br />
          the percantage of success of each type of crop.
        </Typography>
      </div>
    </div>
  );
}

export default About;
