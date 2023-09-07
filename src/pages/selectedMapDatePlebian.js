/* BSD
- NEED TO PREVENT ALL NON ADMINS/AND NON LOGGED IN FROM GETTING IN 
*/

import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import Header from "../components/misc/Header";
import Link from "next/link";
import { styled } from "@mui/system";
import { useUpdater } from "../userContext";

const cropTypeOptions = [
  { label: "Corn", image: "./singlecorn.jpeg", slug: "corn" },
  { label: "Wheat", image: "./wheat.jpeg", slug: "wheat" },
  { label: "Soy Bean", image: "./singlesoybean.jpeg", slug: "soy" },
];

const stateOptions = [
  { label: "Delaware", value: "DE" },
  { label: "Maryland", value: "MD" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Virginia", value: "VA" },
  { label: "West Virginia", value: "WV" },

  // Add more state options as needed
];

const percentTypeOptions = [
  { label: "Harvested", slug: "harvestPercent" },
  { label: "Emergence", slug: "emergencePercent" },
  { label: "Planted", slug: "plantedPercent" },
  // Add more state options as needed
];

const MainContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "90vh",
  overflow: "hidden", // Prevents scrolling
});

const Image = styled("img")({
  width: "100%",
  height: "auto",
  zIndex: 0,
  filter: "blur(8px)",
});

const ContentBox = styled(Box)({
  width: "500px", // Adjust the width to your desired value
  padding: "20px",
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.8)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const Title = styled("p")({
  color: "black",
  fontSize: "36px",
  marginBottom: "8px",
  fontFamily: "Arial, sans-serif",
  whiteSpace: "nowrap", // Prevents line breaks
});

const Subtitle = styled("p")({
  color: "#black",
  fontSize: "22px",
  fontFamily: "Arial, sans-serif", // Change the font family
});

const mapDateSelectorHome = () => {
  const router = useRouter();
  const contextValue = useUpdater();
  console.log(contextValue);
  const {
    verified,
    admin,
    cropType,
    setCropType,
    selectedState,
    setSelectedState,
    percentType,
    setPercentType,
  } = useUpdater();

  const handleStateChange = (event, value) => {
    setSelectedState(value);
  };

  const handlePercentTypeChange = (event, value) => {
    setPercentType(value);
  };

  const handleCropChange = (event, value) => {
    setCropType(value);
  };


  const handleGoClick = () => {
    console.log("GO CLICKED");
    console.log("verified: ", verified, "selectedState: ", selectedState, "cropType: ", cropType, "percentType: ", percentType);
    if (verified && ((admin && selectedState) || !admin) && cropType && percentType) {
      console.log("Router pushed")
      router.push({
        pathname: `addMapDates/updater`,
      });
    }
    console.log("Router not pushed",(verified && ((admin && selectedState) || !admin ) && cropType && percentType) )
  };

  const goToVerifyPage = () => {
    router.push("/verifyAccounts");
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
            {admin && (
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
            )}
            <Box width="300px" marginTop="20px">
              <Autocomplete
                id="percent-combo-box"
                options={percentTypeOptions}
                getOptionLabel={(option) => option.label}
                onChange={handlePercentTypeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a Percent"
                    variant="outlined"
                  />
                )}
              />
            </Box>
            <Box width="300px" marginTop="20px">
              <Autocomplete
                id="percent-combo-box"
                options={cropTypeOptions}
                getOptionLabel={(option) => option.label}
                onChange={handleCropChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a Percent"
                    variant="outlined"
                  />
                )}
              />
            </Box>
            {cropType !== null || selectedState !== null ? (
              <Button
                variant="contained"
                onClick={handleGoClick}
                style={{
                  marginTop: "20px",
                  color: "#ffffff",
                  borderColor: "#ffffff",
                }}
              >
                Go
              </Button>
            ) : null}
            {admin && <button onClick={goToVerifyPage}>Verifier</button>}
          </ContentBox>
        </Box>
      </MainContainer>
    </div>
  );
};

export default mapDateSelectorHome;
