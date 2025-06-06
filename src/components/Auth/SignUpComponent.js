//BSD
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
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
  const [openDialog, setOpenDialog] = useState(false);
  const [signUpsDisabled, setSignUpsDisabled] = useState(true); // Add this state to close sign up


  const allowedDomains = ["@terpmail.umd.edu", "@umd.edu"]; //can't create gmail...or @umd.edu...

  const isAllowedDomain = (email) => {
      return allowedDomains.some(domain => email.endsWith(domain));
  };

  const handleSignUp = async () => {
    if (signUpsDisabled) {
      setOpenDialog(true);
      return; // Stop further processing
    }

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
        verified: false,
        selectedState: selectedState,
        selectedCounties: selectedCounties,
      };

      // Store the data in the myUsers collection
      await setDoc(doc(db, "myUsers", user.uid), userData);

      setOpenDialog(true);

      /*right here - assuming everything else has finisehd updating,
      make a pop up window that'll display. It'll say please check email to finish 
      signing up, then there will be a button that says ok, and it'll reroute you to
      home
      */

    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    await handleSignUp(); // Execute sign up logic
  };

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleFormSubmit}>
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
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "1rem" }}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
        </form>
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">{"Email Verification"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please check your email to finish signing up.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenDialog(false);
              router.push("/"); // Navigate to home page after pressing "OK"
            }} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>  
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Sign-up Disabled"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Sign-ups are disabled until after the demonstration.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </StyledContainer>
  );
};

export { SignUp };
