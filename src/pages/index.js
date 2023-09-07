import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Container, Typography, styled } from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/misc/Header';

const options = [
  { label: 'Corn', image: './singlecorn.jpeg', slug: 'Corn' },
  { label: 'Wheat', image: './wheat.jpeg', slug: 'Wheat' },
  { label: 'Soy Bean', image: './singlesoybean.jpeg', slug: 'Soy' },
];

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  position: 'relative',
});

const ImageBox = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
  overflow: 'hidden',
});

const ContentBox = styled(Box)({
  zIndex: 2,
  padding: '2rem',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.8)',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
});

const Home = () => {
  const router = useRouter();

  const handleOptionChange = (event, value) => {
    if (value) {
      router.push(`/cropMap/${value.slug}`);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    if (inputValue === 'wheat' || inputValue === 'corn' || inputValue === 'soy') {
      router.push(`/cropMap/${inputValue}`);
    }
  };

  return (
    <div>
      <Header />
      <StyledContainer>
        <ImageBox>
          <img src={'./Barley.jpg'} alt="Crop Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </ImageBox>
        <ContentBox>
          <Typography variant="h4" gutterBottom>
            Welcome to The Crop Map
          </Typography>
          <Autocomplete
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  router.push(`/cropMap/${option.label}`);
                }}
              >
                <img src={option.image} alt={option.label} style={{ marginRight: 8, width: 40, height: 40 }} />
                {option.label}
              </Box>
            )}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search a Map: wheat, corn, or soy"
                variant="outlined"
                onChange={handleInputChange}
              />
            )}
            onChange={handleOptionChange}
          />
        </ContentBox>
      </StyledContainer>

    </div>
  );
};

export default Home;
