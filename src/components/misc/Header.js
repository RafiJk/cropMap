import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";

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
      primary: "#fff",
      secondary: "#aaa",
    },
  },
});

const StyledAppBar = styled(AppBar)({
  background: "#2B3F2D",
  boxShadow:"0px 8px 16px rgba(0, 0, 0, 0.3)",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1300, // High z-index to ensure it's above other content
});

const StyledButton = styled(Button)(({ theme, active }) => ({
  marginLeft: "1rem",
  color: theme.palette.text.primary,
  backgroundColor: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
}));

const StyledTypography = styled(Typography)({
  flexGrow: 1,
  color: "#fff",
});

const PhritzdaTypography = styled(Typography)({
  fontSize: "1.2em",
  color: "#fff",
});

const Header = () => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <ThemeProvider theme={theme}>
      <StyledAppBar position="static" elevation={0}>
      <Toolbar style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <StyledTypography variant="h6">
            <Typography variant="caption">Powered by</Typography>
            <br />
            <PhritzdaTypography>Phritzda</PhritzdaTypography>
          </StyledTypography>
          <Link href="/Auth/LogInPage" passHref>
            <StyledButton active={router.pathname === "/Auth/LogInPage"}>
              Update Harvest
            </StyledButton>
          </Link>
          <Link href="/about" passHref>
            <StyledButton active={router.pathname === "/about"}>
              About
            </StyledButton>
          </Link>
          <Link href="/" passHref>
            <StyledButton active={router.pathname === "/"}>Home</StyledButton>
          </Link>
        </Toolbar>
      </StyledAppBar>
    </ThemeProvider>
  );
};

export default Header;
