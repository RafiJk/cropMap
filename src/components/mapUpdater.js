//BSD
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  limit,
  orderBy,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import {
  countiesListDE,
  countiesListMD,
  countiesListPA,
  countiesListVA,
  countiesListWV,
} from "./countiesList.js";
import Header from "./misc/Header.js";
import { LogIn } from "./Auth/LogInComponent.js";
import { SignUp } from "./Auth/SignUpComponent.js";
import { useUpdater } from "../userContext.js";
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material";
import { db } from "../firebase.js";

const StyledPaper = styled(Paper)({
  backgroundColor: "#C0C5CEB2",
  borderRadius: "25px",
  padding: "2rem",
  margin: "auto", // centering the card vertically
  marginTop: "200px", // added to center vertically
  width: "60%", // increased width
  maxHeight: "500px",
  color: "white", // making text white
  // Customizing the scrollbar
  "&::-webkit-scrollbar": {
    width: "15px", // making scrollbar thicker
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,.3)", // lighter color
    borderRadius: "20px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(255,255,255,.5)", // lighter color on hover
  },
  "&::-webkit-scrollbar-track": {
    marginRight: "5px", // reducing space to the right of the scrollbar
  },
});

const StyledDiv = styled('div')({
  maxHeight: "400px",
  overflowY: "scroll", // Ensuring scrollbar always shows
  // Customizing the scrollbar
  "&::-webkit-scrollbar": {
    width: "20px", // making scrollbar thicker
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,.3)", // lighter color
    borderRadius: "20px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(255,255,255,.5)", // lighter color on hover
  },
  "&::-webkit-scrollbar-track": {
    marginRight: "10px", // reducing space to the right of the scrollbar
  },
});


const stateUrlMap = {
  DE: "/theRealStateOfDE.json",
  MD: "/theRealStateOfMD.json",
  WV: "/theRealStateOfWV.json",
  VA: "/theRealStateOfVA.json",
  PA: "/theRealStateOfPA.json",
};

const countiesByState = {
  DE: countiesListDE,
  MD: countiesListMD,
  WV: countiesListWV,
  VA: countiesListVA,
  PA: countiesListPA,
};

const Updater = () => {
  const {
    verified,
    admin,
    percentType,
    cropType,
    setCropType,
    setAdmin,
    contextSelectedCounties,
    setSelectedCounty,
    selectedState,
    setSelectedState,
  } = useUpdater();
  console.log("Admin: ", admin);
  const [countyData, setCountyData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // const [userSelectedCounties, setUserSelectedCounties] = useState([]);

  const selectedPercentType = percentType.slug || null;
  const selectedCrop = cropType.slug || null;

  const countiesList = contextSelectedCounties || countiesByState;
  let url = stateUrlMap[selectedState] || "";

  const [editableCounties, setEditableCounties] = useState([]);

  // State variable to hold the currently chosen county for editing
  const [currentCounty, setCurrentCounty] = useState("");

  const getOrSetDoc = async () => {
    //might not want asynch??
    let sC = selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1);
    const collectionName = `${sC}Map`;
    const cropMapCollection = collection(db, collectionName);
    const cmq = query(cropMapCollection, orderBy("date", "desc"), limit(1)); //get most recent doc
    try {
      const querySnapshot = await getDocs(cmq);
      const snapshot = querySnapshot.docs[0];
      //there used to be a try catch to see if there was a snapshot...i got rid of it... maybe shou;dn thave
      let currentDate = Math.floor(Date.now()) / 1000; //where we are currently
      let snapshotDate = await snapshot.data().date.seconds; //get DateFrom most recent doc
      const diffInDays = currentDate - snapshotDate; //do we need to make a newfile
      if (diffInDays >= 604800) {
        //rn this is testing if it's less then 7 day
        console.log("here goof");
        makeNewDoc();
      } else {
        console.log("here bad");
      }
    } catch (error) {
      console.error("Error retrieving the most recent document:", error); //this should catch everything
    }
  };

  const makeNewDoc = () => {
    //access collection and iterate through and create it in form
    let sC = selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1);
    const collectionName = `${sC}Map`;
    const cropMapCollection = collection(db, collectionName);

    const newMapDocRef = doc(collection(db, collectionName.toString()));
    setDoc(newMapDocRef, { date: Timestamp.now() }).then(() => {
      const countyHarvestsCollectionRef = collection(
        newMapDocRef,
        "CountyHarvests"
      );
      for (const state in countiesByState) {
        const stateCounties = countiesByState[state];
        for (const county of stateCounties) {
          const newHarvestDocRef = doc(countyHarvestsCollectionRef, county);
          setDoc(newHarvestDocRef, {
            state: state,
            county: county,
            plantedPercent: 0,
            emergencePercent: 0,
            harvestPercent: 0,
          });
        }
      }
    });
  };

  useEffect(() => {
    // Fetch data for all editable counties when the component mounts
    if (editableCounties.length) {
      editableCounties.forEach((county) => {
        fetchCountyData(county);
      });
    }
  }, [editableCounties]);

  useEffect(() => {
    getOrSetDoc();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setAdmin(authUser);
      if (authUser) {
        try {
          const userDocRef = doc(db, "myUsers", authUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const userCounties = contextSelectedCounties || [];
            setEditableCounties(userCounties);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
    return () => {
      unsubscribe();
    };
    ``;
  }, []);

  const updateHarvest = async (county) => {
    let sC = selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1);
    const collectionName = `${sC}Map`; // Dynamically set the collection name based on the selected crop

    const cropMapCollection = collection(db, collectionName);
    const querySnapshot = await getDocs(
      query(cropMapCollection, orderBy("date", "desc"), limit(1))
    );
    const mostRecentName = querySnapshot.docs[0].id.toString();

    const documentRef = doc(cropMapCollection, mostRecentName);
    const countyDocumentRef = doc(
      collection(documentRef, "CountyHarvests"),
      county
    );

    try {
      const countyDocumentSnapshot = await getDoc(countyDocumentRef);

      if (countyDocumentSnapshot.exists()) {
        await updateDoc(countyDocumentRef, countyData[county]);
        console.log("Harvest percent updated successfully.");
      } else {
        console.log("County document does not exist.");
      }
    } catch (error) {
      console.error("Error updating harvest percent:", error);
    }
  };

  const handleUpdateClick = async () => {
    // Loop through the keys of countyData (the counties the user has updated)
    for (const county of Object.keys(countyData)) {
      console.log(county);
      setIsUpdating(true);
      console.log(county);
      await updateHarvest(county); // Just send the county name
      setIsUpdating(false);
    }
    // router.push('/');
  };

  const handleInputChange = (event, county, type) => {
    const { name, value } = event.target;
    let newValue = Number(value);

    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 100) {
      newValue = 100;
    }

    setCountyData((prevData) => ({
      ...prevData,
      [county]: {
        ...prevData[county],
        [type]: newValue, // Use selectedPercentType here
      },
    }));
  };

  useEffect(() => {
    if (currentCounty) {
      fetchCountyData(currentCounty);
    }
  }, [currentCounty]);

  const fetchCountyData = async (county) => {
    // Check if data for this county is already in state
    if (countyData[county]) {
      return; // Data is already there, so return early
    }

    let sC = selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1);
    const collectionName = `${sC}Map`;
    const cropMapCollection = collection(db, collectionName);
    const querySnapshot = await getDocs(
      query(cropMapCollection, orderBy("date", "desc"), limit(1))
    );
    const mostRecentName = querySnapshot.docs[0].id.toString();

    const documentRef = doc(cropMapCollection, mostRecentName);
    const countyDocumentRef = doc(
      collection(documentRef, "CountyHarvests"),
      county
    );

    try {
      const countyDocumentSnapshot = await getDoc(countyDocumentRef);
      if (countyDocumentSnapshot.exists()) {
        const data = countyDocumentSnapshot.data();
        setCountyData((prevData) => ({
          ...prevData,
          [county]: data,
        }));
      } else {
        console.log("County document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching county data:", error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCounties = editableCounties.filter((county) =>
    county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEditableCounties = [...editableCounties].sort();
  return (
    <div>
      <Header />
      <StyledPaper elevation={3}>
        {verified ? (
          <>
            {/* Stationary Titles */}
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ marginBottom: "8px" }}
                  fontWeight="bold"
                >
                  Counties
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ marginBottom: "8px" }}
                  fontWeight="bold"
                >
                  Planted
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ marginBottom: "8px" }}
                  fontWeight="bold"
                >
                  Emerged
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ marginBottom: "8px" }}
                  fontWeight="bold"
                >
                  Harvested
                </Typography>
              </Grid>
            </Grid>
            {/* Scrolling Counties */}
            <StyledDiv>
              {sortedEditableCounties.map((county) => (
                <Grid
                  container
                  spacing={6}
                  key={county}
                  justifyContent="center"
                >
                  {" "}
                  {/* Increased spacing */}
                  <Grid item xs={3}>
                    <Box display="flex" alignItems="center" height="100%">
                      <Typography variant="h6" align="center" fontWeight="bold">
                        {county.slice(0, -3)}
                      </Typography>
                    </Box>
                  </Grid>
                  {/* Planted Data Input */}
                  <Grid item xs={3}>
                    <TextField
                      onChange={(event) =>
                        handleInputChange(event, county, "plantedPercent")
                      }
                      type="number"
                      InputProps={{
                        endAdornment: <Typography>%</Typography>,
                        style: { fontWeight: "bold" }, // Added fontWeight here
                      }}
                      value={Math.ceil(countyData[county]?.plantedPercent || 0)}
                      size="small" // smaller size
                      sx={{
                        backgroundColor: "#E0E5EEB2", // Lighter background color with transparency
                        color: "white",
                        marginBottom: "20px",
                        border: "1px solid #D0D5DE", // Lighter border color
                      }}
                    />
                  </Grid>
                  {/* Emerged Data Input */}
                  <Grid item xs={3}>
                    <TextField
                      onChange={(event) =>
                        handleInputChange(event, county, "emergencePercent")
                      }
                      type="number"
                      InputProps={{
                        endAdornment: <Typography>%</Typography>,
                        style: { fontWeight: "bold" }, // Added fontWeight here
                      }}
                      value={Math.ceil(countyData[county]?.emergencePercent || 0)}
                      size="small" // smaller size
                      sx={{
                        backgroundColor: "#E0E5EEB2", // Lighter background color with transparency
                        color: "white",
                        marginBottom: "20px",
                        border: "1px solid #D0D5DE", // Lighter border color
                      }}
                    />
                  </Grid>
                  {/* Harvested Data Input */}
                  <Grid item xs={3}>
                    <TextField
                      type="number"
                      onChange={(event) =>
                        handleInputChange(event, county, "harvestPercent")
                      }
                      InputProps={{
                        endAdornment: <Typography>%</Typography>,
                        style: { fontWeight: "bold" }, // Added fontWeight here
                      }}
                      size="small" // smaller size
                      value={Math.ceil(countyData[county]?.harvestPercent || 0)}
                      sx={{
                        backgroundColor: "#E0E5EEB2", // Lighter background color with transparency
                        color: "white",
                        marginBottom: "20px",
                        border: "1px solid #D0D5DE", // Lighter border color
                      }}
                    />
                  </Grid>
                </Grid>
              ))}
            </StyledDiv>
            {/* Update Button */}
            <Button
              onClick={() => handleUpdateClick()}
              disabled={isUpdating}
              variant="contained"
              sx={{
                borderRadius: "25px",
                backgroundColor: "lightgreen", // making button light green
                color: "white", // making text white
                fontWeight: "bold", // making font weight bolder
                marginTop: "2rem", // ensuring it is always below the counties list
                width: "100%", // centering the button
              }}
            >
              {isUpdating ? "Updating..." : "Update Harvest Percents"}
            </Button>
          </>
        ) : (
          <>
            <SignUp />
            <LogIn />
          </>
        )}
      </StyledPaper>
    </div>
  );
};

export { Updater };
