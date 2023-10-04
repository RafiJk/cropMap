import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useUpdater } from '../../userContext';
import { Button, TextField, Container, Typography, Link, Paper } from '@mui/material';
import { styled } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const StyledPaper = styled(Paper)({
  padding: '2rem',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
});

const LogIn = () => {
  const router = useRouter();
  const {
    setAdmin,
    setVerified,
    setContextSelectedCounties,
    setSelectedState
  } = useUpdater();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openEmailReminderDialog, setOpenEmailReminderDialog] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState('');


  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const userDocRef = doc(db, 'myUsers', auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const isAdmin = userData.Admin? true : false;
        const isVerified = userData.verified;
        const isStates = userData.selectedState;
        const isCounties = userData.selectedCounties;
        setSelectedState(isStates);
        setContextSelectedCounties(isCounties);
        setAdmin(isAdmin); 
        setVerified(isVerified);

      if (!auth.currentUser.emailVerified) {

        if (isVerified != false){ // this check should be unnecessary but still good
          await updateDoc(userDocRef, {
            verified: false
          });
        }
        console.log("User has not verified their email.");
        console.log("gotta take you home buddy...we want a module here tho in future");
        setOpenEmailReminderDialog(true);
        // router.push(`${location.origin}`);
      } else {
        if (isVerified == false){
          await updateDoc(userDocRef, {
            verified: true
          });
        }
          console.log('You are signed up and verified!');
          router.push({
              pathname: '../selectedMapDatePlebian',
          });
      }
     }
      } catch (error) {
      if (error.code === "auth/wrong-password") {
        setPasswordError(true);
        setPasswordHelperText("Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        setEmail(e => { // Resetting email, you might want to keep the entered email as well
          setPasswordError(true); 
          setPasswordHelperText("No user associated with this email");
          return "";
        });
      } else {
        console.error('Error logging in:', error);
      }
    }
  
  };

  const goToSignUp = () =>{
    router.push('./SignUpPage')
  }

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Log In
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
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          error={passwordError}
          helperText={passwordHelperText}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false); 
            setPasswordHelperText(''); 
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
          onClick={handleLogIn}
        >
          Log In
        </Button>
        <Dialog
          open={openEmailReminderDialog}
          onClose={() => setOpenEmailReminderDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Email Verification"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please verify your email before proceeding. Check your inbox for a verification email.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenEmailReminderDialog(false);
              router.push("/"); // Navigate to home page after pressing "OK"
            }} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Typography variant="body1" style={{ marginTop: '1rem', textAlign: 'center' }}>
          New To The Map?{' '}
          <Link href="#" onClick={goToSignUp} underline="hover">
            Click here to sign up
          </Link>
        </Typography>
      </StyledPaper>
    </StyledContainer>
  );
};

export { LogIn };