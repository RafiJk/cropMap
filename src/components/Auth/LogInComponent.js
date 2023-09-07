import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { useUpdater } from '../../userContext';
import { Button, TextField, Container, Typography, Link, Paper } from '@mui/material';
import { styled } from '@mui/material';

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
  } = useUpdater();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const userDocRef = doc(db, 'myUsers', auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const isAdmin = userData.Admin? true : false;
        const isVerified = userData.verified;
        setAdmin(isAdmin); 
        setVerified(isVerified);

        // Redirect based on admin status
        if (isVerified) {
          console.log('You are signed up and verified!');
          router.push({
            pathname: '../selectedMapDatePlebian',
          });
        } else {
          console.log("You're not signed up or verified. Error message needs to pop up @Yoni Singer");
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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