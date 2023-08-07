import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Button, styled } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';



const options = [
  { label: 'Corn', image: './singlecorn.jpeg', slug: 'corn' },
  { label: 'Wheat', image: './wheat.jpeg', slug: 'wheat' },
  { label: 'Soy', image: './singlesoybean.jpeg', slug: 'soy' },
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
      router.push(`/crop/${value.slug}`);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    if (inputValue === 'wheat' || inputValue === 'corn' || inputValue === 'soy') {
      router.push(`/crop/${inputValue}`);
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
            <strong>Welcome To The Crop Map</strong>
          </AboveImageText>
          {/* <BelowImageText>
            pick a crop to begin
          </BelowImageText> */}
          <ImageBox>
            <img src={'./pano1.jpeg'} alt="Image" style={{ width: '100%', height: '100%', top: '-150%', objectFit: 'cover' }} />
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
                    router.push(`/crop/${option.label}`);
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

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import styles from '/Users/rjkigner/projects/pest-map/src/pages/index.module.css';
// import Downshift from 'downshift';

// const crops = ["wheat", "corn", "soybean"];

// const HomePage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "Enter") {
//         router.push(`/crop/${searchTerm.toLowerCase()}`);
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [searchTerm, router]);

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.logo}>
//           <div className={styles.sublogo}>powered by</div>Phritzda
//         </div>
//         <div className={styles.links}>
//           <button
//             className={styles.tabButton}
//             onClick={() => router.push("/addMapDate")}
//           >
//             Update Harvest
//           </button>
//         </div>
//       </div>
//       <div className={styles.content}>
//         <h1 className={styles.title}>Crop Map</h1>
//         <Downshift
//           selectedItem={searchTerm}
//           onChange={setSearchTerm}
//           itemToString={item => (item ? item : '')}
//         >
//           {({
//             getInputProps,
//             getItemProps,
//             getMenuProps,
//             isOpen,
//             inputValue,
//             highlightedIndex,
//           }) => (
//             <div className={styles.searchInput}>
//               <input {...getInputProps({ placeholder: "Search Wheat, Soybean, or Corn" })} />
//               <ul {...getMenuProps()}>
//                 {isOpen
//                   ? crops
//                       .filter(item => !inputValue || item.includes(inputValue))
//                       .map((item, index) => (
//                         <li
//                           {...getItemProps({ key: item, index, item })}
//                           style={{
//                             backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
//                             fontWeight: highlightedIndex === index ? 'bold' : 'normal',
//                           }}
//                         >
//                           {item}
//                         </li>
//                       ))
//                   : null}
//               </ul>
//             </div>
//           )}
//         </Downshift>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

 