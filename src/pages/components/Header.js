import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Link as MuiLink } from '@mui/material';

const Header = () => {

  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Typography variant="caption">Powered by</Typography>
          <br />
          Phritzda
        </Typography>
        <Link href="/Auth/LogInPage">
          <Button color="inherit" style={{ backgroundColor: 'transparent', color: 'white' }}>Update Harvest</Button>
        </Link>
          <Link href='/about'>
          <Button color="inherit" style={{ backgroundColor: 'transparent', color: 'white' }}>About</Button> 
        </Link>
        {!isHomePage && (
            <Link href="/">
              <Button color="inherit" style={{ backgroundColor: 'transparent', color: 'white' }}>Home</Button>
            </Link>
          )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;