import React from 'react';
import Header from '../components/misc/Header'; // Assuming Header.js is inside a 'components' directory
import { Container, Typography, Paper, Box } from '@mui/material';
import { styled } from '@mui/material';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  height: '100vh',
});

const StyledPaper = styled(Paper)({
  padding: '2rem',
  width: '80%',
  maxWidth: '800px',
});

const About = () => {
  return (
    <div>
      <Header />
      <StyledContainer>
        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom>
            The Crop Map
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to The Crop Map, a cutting-edge platform that provides insights into the agricultural landscape. Our mission is to empower farmers, researchers, and enthusiasts with accurate and timely data on crop cycles.
          </Typography>
          <Typography variant="body1" paragraph>
            This map is an interface designed to reflect the rates of planting, emergence, and harvesting of wheat, soy, and corn. The data is regularly updated by Agriculture Extension Educators and Specialists. It's displayed on the map using a color scale of different shades of green, indicating the percentage of each type of crop that has reached each stage.
          </Typography>
          <Typography variant="body1" paragraph>
            We believe in the power of data-driven decisions. By providing this platform, we aim to support the agricultural community in optimizing their practices, predicting trends, and ensuring sustainable and efficient farming.
          </Typography>
          <Typography variant="body1" paragraph>
            For any inquiries, feedback, or suggestions, please feel free to contact our dedicated support team. We're here to help and continuously improve The Crop Map for our users.
          </Typography>
        </StyledPaper>
      </StyledContainer>
    </div>
  );
}

export default About;
