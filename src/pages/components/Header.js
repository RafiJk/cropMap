import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    text: {
      primary: "#333",
      secondary: "#555",
    },
  },
});

const StyledAppBar = styled(AppBar)({
  background: 'rgba(255, 255, 255, 0.8)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '8px',
});

const StyledButton = styled(Button)(({ theme, active }) => ({
  marginLeft: '1rem',
  color: theme.palette.text.primary,
  backgroundColor: active ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const StyledTypography = styled(Typography)({
  flexGrow: 1,
  color: '#333',
});

const Header = () => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <ThemeProvider theme={theme}>
      <StyledAppBar position="static" elevation={0}>
        <Toolbar>
          <StyledTypography variant="h6">
            <Typography variant="caption">Powered by</Typography>
            <br />
            Phritzda
          </StyledTypography>
          <Link href="/Auth/LogInPage" passHref>
            <StyledButton active={router.pathname === "/Auth/LogInPage"}>Update Harvest</StyledButton>
          </Link>
          <Link href="/about" passHref>
            <StyledButton active={router.pathname === "/about"}>About</StyledButton>
          </Link>
            <Link href="/" passHref>
              <StyledButton active={router.pathname === "/"}>Home</StyledButton>
            </Link>
        </Toolbar>
      </StyledAppBar>
    </ThemeProvider>
  );
}

export default Header;
