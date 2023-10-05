import styled from "styled-components";
import { Paper, Box, Typography, TextField, Button } from "@mui/material";

export const StyledPaper = styled(Paper)({
  backgroundColor: "#C0C5CEB2",
  borderRadius: "25px",
  padding: "2rem",
  margin: "auto", 
  marginTop: "50px", 
  width: "60%", 
  maxHeight: "500px",
  color: "white", 
  "&::-webkit-scrollbar": {
    width: "15px", 
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,.3)",
    borderRadius: "20px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(255,255,255,.5)", 
  },
  "&::-webkit-scrollbar-track": {
    marginRight: "5px", 
  },
});

export const StyledDiv = styled('div')({
  maxHeight: "400px",
  overflowY: "scroll", 
  "&::-webkit-scrollbar": {
    width: "20px", 
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,.3)", 
    borderRadius: "20px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(255,255,255,.5)", 
  },
  "&::-webkit-scrollbar-track": {
    marginRight: "10px",
  },
});

export const SelectCropBox = styled(Box)({
  width: "300px",
  margin: "auto",
  marginTop: "130px",
  position: "relative",
  zIndex: 1000,
  backgroundColor: "white",
  borderRadius: "20px",
  boxShadow:"0px 8px 25px rgba(0, 0, 0, 0.3)",
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "transparent", // or your desired color
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent", // or your desired color
  },
  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent", // or your desired color
  },
});

export const CountyTypography = styled(Typography)({
  marginBottom: "8px",
  fontWeight: "bold",
  fontSize: "25px",
  align: "center",
});

export const StyledTextField = styled(TextField)({
  backgroundColor: "#E0E5EEB2",
  color: "white",
  marginBottom: "20px",
  border: "1px solid #D0D5DE",
  fontWeight: "bold",
  borderRadius: "25px",
  boxShadow:"0px 4px 5px rgba(0, 0, 0, 0.2)",
  "& input": {
    textAlign: "center",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "transparent", // or your desired color
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent", // or your desired color
  },
  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent", // or your desired color
  },
});

export const StyledButton = styled(Button)({
  borderRadius: "25px",
  backgroundColor: "lightgreen",
  color: "white",
  fontWeight: "bold", 
  marginTop: "2rem", 
  width: "100%", 
});