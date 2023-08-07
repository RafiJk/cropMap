//B"SD

import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import Header from './components/Header';
import Link from 'next/link';
import { styled } from '@mui/system';

const options = [
  { label: 'Corn', image: './singlecorn.jpeg', slug: 'corn' },
  { label: 'Wheat', image: './wheat.jpeg', slug: 'wheat' },
  { label: 'Soy', image: './singlesoybean.jpeg', slug: 'soy' },
];

const stateOptions = [
  { label: 'Delaware', value: 'DE' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Virginia', value: 'VA' },
  { label: 'West Virginia', value: 'WV' },
 
  // Add more state options as needed
];

const percentTypeOptions = [
  { label: 'Harvested', value: 'harvestPercent' },
  { label: 'Emergence', value: 'emergencePercent' },
  { label: 'Planted', value: 'plantedPercent' },
  // Add more state options as needed
];

const MainContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '90vh',
  overflow: 'hidden', // Prevents scrolling
});


const Image = styled('img')({
  width: '100%',
  height: 'auto',
  zIndex: 0,
  filter: 'blur(8px)',
});

const ContentBox = styled(Box)({
  width: '500px', // Adjust the width to your desired value
  padding: '20px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled('p')({
  color: 'black',
  fontSize: '36px',
  marginBottom: '8px',
  fontFamily: 'Arial, sans-serif',
  whiteSpace: 'nowrap', // Prevents line breaks
});

const Subtitle = styled('p')({
  color: '#black',
  fontSize: '22px',
  fontFamily: 'Arial, sans-serif', // Change the font family
});

const Home = () => {
  const router = useRouter();

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedPercentType, setSelectedPercentType] = useState(null);

  const handleStateChange = (event, value) => {
    setSelectedState(value);
  };

  const handlePercentTypeChange = (event, value) => {
    setSelectedPercentType(value);
  };

  const handleOptionChange = (event, value) => {
    setSelectedCrop(value);
  };

  const handleGoClick = () => {
    if (selectedState && selectedCrop && selectedPercentType) {
      router.push({
        pathname: `/add${selectedCrop.slug}MapDate`,
        query: {
          state: selectedState.value,
          crop: selectedCrop.slug,
          percentType: selectedPercentType.value,
        },
      });
    }
  };



  return (
    <div>
      <Header />
      <MainContainer>
        <Image src="/theMap.png" alt="Map" />
        <Box position="absolute" textAlign="center" zIndex={1}>
          <ContentBox>
            <Box>
              <Title>Welcome to the Update Screen</Title>
              <Subtitle>Select a state and then a crop to begin</Subtitle>
            </Box>
            <Box width="300px" marginTop="20px">
              <Autocomplete
                id="state-combo-box"
                options={stateOptions}
                getOptionLabel={(option) => option.label}
                onChange={handleStateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a state"
                    variant="outlined"
                  />
                )}
              />
            </Box>
            <Box width="300px" marginTop="20px">
              <Autocomplete
                id="percentType-combo-box"
                options={percentTypeOptions}
                getOptionLabel={(option) => option.label}
                onChange={handlePercentTypeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a Percent Type"
                    variant="outlined"
                  />
                )}
              />
            </Box>
            {selectedState !== null && (
              <Box width="300px" marginTop="20px">
                <Autocomplete
                  id="crop-combo-box"
                  options={options}
                  getOptionLabel={(option) => option.label}
                  value={selectedCrop} // Set the selected crop value
                  getOptionSelected={(option, value) => option.label === value.label} // Compare selected option
                  renderOption={(props, option) => (
                    <Box
                      display="flex"
                      alignItems="center"
                      cursor="pointer"
                      direction="down"
                      onClick={() => {
                        handleOptionChange(null, option);
                      }}
                    >
                      <img
                        src={option.image}
                        alt={option.label}
                        style={{ marginRight: 8, width: 40, height: 40 }}
                      />
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Update wheat, corn, or soy"
                      variant="outlined"
                    />
                  )}
                  onChange={handleOptionChange}
                />
              </Box>
            )}
            {selectedCrop !== null || selectedState !== null ? (
              <Button
                variant="contained"
                onClick={handleGoClick}
                style={{ marginTop: '20px', color: '#ffffff', borderColor: '#ffffff' }}
              >
                Go
              </Button>
            ) : null}
          </ContentBox>
        </Box>
      </MainContainer>
    </div>
  );
  
};

export default Home;
