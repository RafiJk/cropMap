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
import { useRouter } from "next/router";
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
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material";
import { db } from "../firebase.js";
import { truncate } from "fs/promises";
import {
  StyledPaper,
  StyledDiv,
  SelectCropBox,
  CountyTypography,
  StyledTextField,
  StyledButton,
} from "./misc/UpdaterStyledComponents.js"; // Import separated styled components

const cropTypeOptions = [
  { label: "Corn", image: "../../public/singlecorn.jpeg", slug: "corn" },
  { label: "Wheat", image: "../../public/wheat.jpeg", slug: "wheat" },
  { label: "Soy Bean", image: "../../public/singlesoybean.jpeg", slug: "soy" },
];

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
    cropType,
    setCropType,
    setAdmin,
    contextSelectedCounties,
    selectedState,
  } = useUpdater();
  const router = useRouter();
  const [countyData, setCountyData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleCropChange = (event, value) => {
    handleUpdateClick(false)
    setCropType(value.slug);
  };

  const [editableCounties, setEditableCounties] = useState([]);

  const getOrSetDoc = async () => {
    let sC = null;
    if (cropType != null) {
      sC = cropType.charAt(0).toUpperCase() + cropType.slice(1);
    }
    const collectionName = `${sC}Map`;
    const cropMapCollection = collection(db, collectionName);
    const cmq = query(cropMapCollection, orderBy("date", "desc"), limit(1)); //get most recent doc
    try {
      const querySnapshot = await getDocs(cmq);
      const snapshot = querySnapshot.docs[0];
      console.log("Snapshot:  ", snapshot.data());
      let currentDate = Math.floor(Date.now()) / 1000; //where we are currently
      let snapshotDate = await snapshot.data().date.seconds; //get DateFrom most recent doc
      const diffInDays = currentDate - snapshotDate; //do we need to make a newfile
      if (diffInDays >= 604800) {
        //rn this is testing if it's less then 7 days
        console.log("here good");
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
    let sC = cropType.charAt(0).toUpperCase() + cropType.slice(1);
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
    console.log("Changing editable counties");
    if (editableCounties.length) {
      editableCounties.forEach((county) => {
        fetchCountyData(county);
      });
    }
  }, [editableCounties]);

  useEffect(() => {
    if (cropType != null) {
      setLoading(true);
      setEditableCounties([]);
      console.log("Changed crops, updating data");
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
              setLoading(false);
              console.log("Editable counties edited");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [cropType]);

  const updateHarvest = async (county) => {
    let sC = cropType.charAt(0).toUpperCase() + cropType.slice(1);
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

  const handleUpdateClick = async (leavePage) => {
    // Loop through the keys of countyData (the counties the user has updated)
    for (const county of Object.keys(countyData)) {
      setIsUpdating(true);
      await updateHarvest(county); // Just send the county name
      setIsUpdating(false);
    }
    if (leavePage) {
      router.push(`${location.origin}`);
    }
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

  const fetchCountyData = async (county) => {
    // Check if data for this county is already in state
    // if (countyData[county]) {
    //   return; // Data is already there, so return early
    // }

    let sC = cropType.charAt(0).toUpperCase() + cropType.slice(1);
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
  return (
    <div>
      <Header />
      <SelectCropBox>
        <Autocomplete
          id="percent-combo-box"
          options={cropTypeOptions}
          getOptionLabel={(option) => option.label}
          onChange={handleCropChange}
          renderInput={(params) => (
            <TextField {...params} label="Select a Crop" variant="outlined" />
          )}
        />
      </SelectCropBox>
      <StyledPaper elevation={3}>
        {verified ? (
          <>
            {cropType && !isLoading && (
              <>
                <Grid container spacing={3}>
                  {["Counties", "Planted", "Emerged", "Harvested"].map(
                    (header) => (
                      <Grid item xs={3} key={header}>
                        <CountyTypography>{header}</CountyTypography>
                      </Grid>
                    )
                  )}
                </Grid>
                {/* Scrolling Counties */}
                <StyledDiv>
                  {[...editableCounties].sort().map((county) => (
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
                          <Typography
                            variant="h6"
                            align="center"
                            fontWeight="bold"
                          >
                            {county.slice(0, -3)}
                          </Typography>
                        </Box>
                      </Grid>
                      {/* Planted Data Input */}
                      <Grid item xs={3}>
                        <StyledTextField
                          onChange={(event) =>
                            handleInputChange(event, county, "plantedPercent")
                          }
                          type="number"
                          InputProps={{
                            endAdornment: "%",
                          }}
                          value={Math.ceil(
                            countyData[county]?.plantedPercent || 0
                          )}
                          size="small"
                        />
                      </Grid>
                      {/* Emerged Data Input */}
                      <Grid item xs={3}>
                        <StyledTextField
                          onChange={(event) =>
                            handleInputChange(event, county, "emergencePercent")
                          }
                          type="number"
                          InputProps={{
                            endAdornment: "%",
                          }}
                          value={Math.ceil(
                            countyData[county]?.emergencePercent || 0
                          )}
                          size="small" // smaller size
                        />
                      </Grid>
                      {/* Harvested Data Input */}
                      <Grid item xs={3}>
                        <StyledTextField
                          type="number"
                          onChange={(event) =>
                            handleInputChange(event, county, "harvestPercent")
                          }
                          InputProps={{
                            endAdornment: "%",
                          }}
                          size="small" // smaller size
                          value={Math.ceil(
                            countyData[county]?.harvestPercent || 0
                          )}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </StyledDiv>
                <CountyTypography align="center" style={{margin:"0px", color: "black"}}>
                  NOTE: Only the crop which is currently selected will be updated
                </CountyTypography>
                {/* Update Button */}
                <StyledButton
                  onClick={() => handleUpdateClick(true)}
                  disabled={!cropType || isUpdating}
                  variant="contained"
                >
                  {isUpdating
                    ? "Updating..."
                    : "Update Harvest Percents"}
                </StyledButton>
              </>
            )}
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
