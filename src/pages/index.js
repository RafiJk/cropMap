import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Container, Typography, styled, Button } from "@mui/material";
import { useRouter } from "next/router";
import Header from "../components/misc/Header";

const options = [
  { label: "Corn", image: "./singlecorn.jpeg", slug: "Corn" },
  { label: "Wheat", image: "./wheat.jpeg", slug: "Wheat" },
  { label: "Soy Bean", image: "./singlesoybean.jpeg", slug: "Soy" },
];

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  minHeight: "80vh",
  marginLeft: "1rem",
  marginRight: "1rem",
  "@media (max-width: 600px)": {
    marginLeft: "0.3rem",
    marginRight: ".3rem",
    marginTop: "70px",
  },
  position: "relative",
});

const ImageBox = styled(Box)({
  position: "fixed", // Change to fixed for a full-screen background image.
  top: 0,
  left: 0,
  width: "100vw", // Use viewport width for full width.
  height: "100vh", // Use viewport height for full height.
  zIndex: -1, // Put it behind all other content.
  overflow: "hidden",
});


const StyledTextField = styled(TextField)({
  backgroundColor: "#FAFAFA",
  borderRadius: "15px",
  width: "100%",
  "@media (max-width: 600px)": {
    fontSize: "0.8rem", // Reduce font size for mobile.
  },
});

const GoButton = styled(Button)({
  marginTop: "1rem",
  background: "#0E5125A6",
  color: "black",
  opacity: 0.65,
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#0E5125A6",
  },
  marginLeft: "auto",
  marginRight: "auto",
  "@media (max-width: 600px)": {
    fontSize: "0.9rem", // Reduce font size for mobile.
  },
});

const ContentBox = styled(Box)({
  zIndex: 2,
  padding: "2rem",
  width: "500px",
  minHeight: "auto",
  borderRadius: "15px",
  background: "rgba(255, 255, 255, 0.8)",
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
  "@media (max-width: 600px)": {
    width: "85vw", // Make it relative to the viewport width for mobile.
    padding: "1rem", // Reduce padding for mobile.
  },
});

const WhiteTypography = styled(Typography)(({ theme }) => ({
  color: "white",
  "&.MuiTypography-h2": {
    fontSize: "100px", // Set this to the desired font size for h2
    textShadow: "4px 4px 8px rgba(0, 0, 0, 0.5)",
  },
  "&.MuiTypography-h1": {
    fontSize: "130px", // Set this to the desired font size for h1
    textShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
  },
  fontWeight: 900,
}));

const Home = () => {
  const router = useRouter();
  const [selectedCrop, setSelectedCrop] = React.useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleOptionChange = (event, value) => {
    setSelectedCrop(value);
    setIsDropdownOpen(false); // Close the dropdown
  };

  const goToCropMap = () => {
    if (selectedCrop) {
      router.push(`/cropMap/${selectedCrop.slug}`);
    }
  };

  return (
    <div>
      <Header />
      <StyledContainer>
        <ImageBox>
          <img
            src={"./HomePageBackground.jpeg"}
            alt="Crop Image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </ImageBox>
        <WhiteTypography variant="h2" gutterBottom align="left">
          The
        </WhiteTypography>
        <WhiteTypography variant="h1" gutterBottom align="left">
          Crop Map
        </WhiteTypography>
        <ContentBox display="flex" flexDirection="column" alignItems="center">
          <Autocomplete
            id="combo-box-demo"
            options={options}
            open={isDropdownOpen}
            onOpen={() => setIsDropdownOpen(true)}
            getOptionLabel={(option) => option.label}
            blurOnSelect
            onInputChange={(event, value, reason) => {
              if (reason === "reset") {
                setSelectedCrop(null);
              }
            }}
            renderOption={(props, option) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                {...props}
                onClick={() => {
                  setSelectedCrop(option);
                  setIsDropdownOpen(false);
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
            style={{ width: "100%" }} // Make the Autocomplete take full width of its container.
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label={
                  selectedCrop
                    ? selectedCrop.label
                    : "Search a Map: wheat, corn, or soy"
                }
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => handleOptionChange(event, newValue)} // Properly set up the onChange handler.
          />
          <GoButton variant="text" onClick={goToCropMap}>
            Go
          </GoButton>
        </ContentBox>
      </StyledContainer>
    </div>
  );
};
export default Home;
