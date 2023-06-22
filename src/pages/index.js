import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, styled } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from './components/Header';

const options = [
  { label: 'Corn', image: './singlecorn.jpeg', slug: 'corn' },
  { label: 'Wheat', image: './wheat.jpeg', slug: 'wheat' },
  { label: 'Soy', image: './singlesoybean.jpeg', slug: 'soy' },
];

const MainContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
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

  return (
    <div>
      <Header />
      <MainContainer>
        <Autocomplete
          id="combo-box-demo"
          options={options}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={option.image} alt={option.label} style={{ marginRight: 8, width: 40, height: 40 }} />
              {option.label}
            </Box>
          )}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search wheat, corn, or soy"
              variant="outlined"
              onChange={handleInputChange}
            />
          )}
          onChange={handleOptionChange}
        />
      </MainContainer>
    </div>
  );
}

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

 