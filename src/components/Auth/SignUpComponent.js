//BSD
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { Autocomplete } from '@mui/material'
import { auth, db } from "../../firebase";

import {
  countiesListDE,
  countiesListMD,
  countiesListPA,
  countiesListVA,
  countiesListWV,
} from "../countiesList";
import {
  Button,
  TextField,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material";

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
});

const StyledPaper = styled(Paper)({
  padding: "2rem",
  width: "100%",
  maxWidth: "400px", // You can adjust this value as per your requirement
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
  borderRadius: "8px",
});

const countiesByState = {
  DE: countiesListDE,
  MD: countiesListMD,
  WV: countiesListWV,
  VA: countiesListVA,
  PA: countiesListPA,
};

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCounties, setSelectedCounties] = useState([]);

  const allowedDomains = ["@terpmail.umd.edu", "@umd.edu"];

  const isAllowedDomain = (email) => {
      return allowedDomains.some(domain => email.endsWith(domain));
  };

  const handleSignUp = async () => {
    try {
      // Check if the email domain is allowed
      if (!isAllowedDomain(email)) {
          console.error("Registration allowed only for specific school domains");
          alert("Registration allowed only for specific school domains");
          return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(userCredential.user, {
         url: `${location.origin}`
      });
      

      // Create the myUsers collection if it doesn't exist
      const collectionRef = collection(db, "myUsers");
      const collectionSnapshot = await getDocs(collectionRef);

      if (collectionSnapshot.size === 0) {
        await setDoc(doc(db, "myUsers", "initialDoc"), { created: true });
      }

      // Store additional user data in Firestore
      const userData = {
        email: email,
        Admin: false,
        credentials: "I like Ice Cream",
        Instuition: "UMD",
        verified: true,
        selectedState: selectedState,
        selectedCounties: selectedCounties,
      };

      // Store the data in the myUsers collection
      await setDoc(doc(db, "myUsers", user.uid), userData);
      
     

    } catch (error) {
      console.error("Error signing up:", error);
    }
  };


  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Select a state</InputLabel>
          <Select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCounties([]); // Reset counties when state is changed
            }}
            >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="DE">Delaware</MenuItem>
            <MenuItem value="MD">Maryland</MenuItem>
            <MenuItem value="PA">Pennsylvania</MenuItem>
            <MenuItem value="VA">Virginia</MenuItem>
            <MenuItem value="WV">West Virginia</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel shrink htmlFor="counties-search">
        Counties
      </InputLabel>
          <Autocomplete
            multiple
            id="counties-search"
            options={countiesByState[selectedState] || []}
            value={selectedCounties}
            onChange={(event, newValue) => {
              setSelectedCounties(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Counties"
                placeholder="Search for a county"
              />
            )}
          />
        </FormControl>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "1rem" }}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </StyledPaper>
    </StyledContainer>
  );
};

export { SignUp };
