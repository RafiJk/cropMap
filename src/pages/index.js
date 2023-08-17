
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Button, styled } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';



const options = [
  { label: 'Corn', image: './singlecorn.jpeg', slug: 'Corn' },
  { label: 'Wheat', image: './wheat.jpeg', slug: 'Wheat' },
  { label: 'Soy Bean', image: './singlesoybean.jpeg', slug: 'Soy' },
];

const MainContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh', // Step 2: Change height to minHeight
});



const ContentBox = styled(Box)({
  width: '500px',
  padding: '10px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '50%',
  right: '50%',
  transform: 'translate(50%, 50%)',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)', // Add box-shadow to create the shadow effect
  zIndex: '2',
});

const ImageBox = styled(Box)({
  height: '550px',
  width: '1400px',
  padding: '1px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute', // Change to 'relative' to allow for positioning within the container
  top: '290%', // Adjust this value to move the ImageBox higher or lower (e.g., '60%', '50%', etc.)
  left: '50%', // Center the ImageBox horizontally
  transform: 'translate(-50%, -70%)', // Center the ImageBox perfectly in the middle
  zIndex: '1', 
});

const AboveImageText = styled(Box)({
  position: 'relative', // Position the text absolutely within the container
  top: '-220px', // Adjust this value to move the text higher or lower above the image
  left: '50%', // Center the text horizontally
  transform: 'translateX(-50%)', // Center the text perfectly in the middle horizontally
  textAlign: 'center',
  color: 'white',
  fontFamily: 'Braggadacio',
  fontSize: '40px',
  zIndex: '2', // Set a higher z-index to ensure the text appears above the ImageBox
});

const BelowImageText = styled(Box)({
  position: 'absolute', // Position the text absolutely within the container
  top: '-180px', // Adjust this value to move the text higher or lower above the image
  left: '50%', // Center the text horizontally
  transform: 'translateX(-50%)', // Center the text perfectly in the middle horizontally
  textAlign: 'center',
  color: 'white',
  fontFamily: 'Braggadacio',
  fontSize: '30px',
  zIndex: '2', // Set a higher z-index to ensure the text appears above the ImageBox
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

  const handleGoClick = () => {
    // You can add your logic here when the "Go" button is clicked
    // For example, if you need to handle some action or navigate to a specific page.
  };

  return (
    <div>
      <Header />
      <MainContainer>
        <Box position="absolute" textAlign="center" zIndex={1}>
           <AboveImageText>
            <strong>Welcome to The Crop Map</strong>
          </AboveImageText>
          {/* <BelowImageText>
            pick a crop to begin
          </BelowImageText> */}
          <ImageBox>
            <img src={'./Barley.jpg'} alt="Image" style={{ width: '100%', height: '100%', top: '-150%', objectFit: 'cover' }} />
            <ContentBox>
            {/* <h1>Welcome to the Map</h1>
            <h4>Search below to view</h4> */}
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
            <Button
              variant="contained"
              onClick={handleGoClick}
              style={{ marginTop: '20px', color: '#ffffff', borderColor: '#ffffff' }}
            >
              Go
            </Button>
          </ContentBox>
          </ImageBox>
        </Box>
      </MainContainer>
      <Footer>
        {/* Add any footer content here */}
      </Footer>
    </div>
  );
};

export default Home;


// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Autocomplete from '@mui/material/Autocomplete';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import { useRouter } from 'next/router';





// // TODO remove, this demo shouldn't need to reset the theme.

// const defaultTheme = createTheme();


// const options = [
//   { label: 'Corn', image: './singlecorn.jpeg', slug: 'corn' },
//   { label: 'Wheat', image: './wheat.jpeg', slug: 'wheat' },
//   { label: 'Soy', image: './singlesoybean.jpeg', slug: 'soy' },
// ];

// export default function SignInSide() {
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     console.log({
//       email: data.get('email'),
//       password: data.get('password'),
//     });
//   };

//   const handleOptionChange = (event, value) => {
//     if (value) {
//       router.push(`/crop/${value.slug}`);
//     }
//   };

//   const handleInputChange = (event) => {
//     const inputValue = event.target.value.toLowerCase();
//     if (inputValue === 'wheat' || inputValue === 'corn' || inputValue === 'soy') {
//       router.push(`/crop/${inputValue}`);
//     }
//   };

//   const handleGoClick = () => {
//     // You can add your logic here when the "Go" button is clicked
//     // For example, if you need to handle some action or navigate to a specific page.
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Header></Header>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//        <CssBaseline />

//         <Grid item xs={false} sm={4} md={7} component={Paper} elevation={6} square>
//           <Box
//             sx={{
//               my: 1,
//               mx: 17,
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Typography component="h1" variant="h5">
//               Welcome To The Crop Map
//             </Typography>
//             <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt:28 }}>
//             <Autocomplete
//               id="combo-box-demo"
//               options={options}
//               getOptionLabel={(option) => option.label}
//               renderOption={(props, option) => (
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     cursor: 'pointer',
//                   }}
//                   onClick={() => {
//                     router.push(`/crop/${option.label}`);
//                   }}
//                 >
//                   <img src={option.image} alt={option.label} style={{ marginRight: 8, width: 40, height: 40 }} />
//                   {option.label}
//                 </Box>
//               )}
//               style={{ width: 300 }}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Search a Map: wheat, corn, or soy"
//                   variant="outlined"
//                   onChange={handleInputChange}
//                 />
//               )}
//               onChange={handleOptionChange}
              
//             />
//              <Button
//                   variant="contained"
//                   onClick={handleGoClick}
//                   style={{ marginTop: '20px', color: '#ffffff', borderColor: '#ffffff' }}
//                 >
//                   Go
//                 </Button>
         
//               <Grid container>
//                 <Grid item>
              
//                 </Grid>
//                 <Grid item>
//                 </Grid>
//               </Grid>
//               {/* <Copyright sx={{ mt: 5 }} /> */}
//             </Box>
//           </Box>
//         </Grid>
//         <Grid
//           item
//           xs={false}
//           sm={8}
//           md={5}
//           sx={{
//             backgroundImage: `url('/Barley.jpg')`, // Use the correct path to your image
//             backgroundRepeat: 'no-repeat',
//             backgroundColor: (t) =>
//               t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         />
//       </Grid>
//       <Footer></Footer>
//     </ThemeProvider>
//   );
// }
