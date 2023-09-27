import React from "react";
import styles from "./legend.module.css";
import { styled } from '@mui/material';

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const Row = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: "100%", // Ensure it takes the full width
  flexWrap: "wrap", // Allow wrapping if needed
});

const ColorGroup = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px", // Some spacing between groups
});

const ColorRectangle = () => {
  const colors = [
    "#ffffe0",
    "#eef9bf",
    "#ddf3a0",
    "#ccd28a",
    "#b9bd75",
    "#a3a864",
    "#879254",
    "#6a7b48",
    "#4f633d",
    "#324a32"  
  ];

  const halfLength = Math.ceil(colors.length / 2);
  const firstHalf = colors.slice(0, halfLength);
  const secondHalf = colors.slice(halfLength);

  return (
    <Container className={styles.colorrectangle}>
      <Row>
        {firstHalf.map((color, index) => (
          <ColorGroup key={index}>
            <div className={styles.colorbox} style={{ backgroundColor: color }} />
            <p className={styles.percentage}>{index * 10}-{(index + 1) * 10}%</p>
          </ColorGroup>
        ))}
      </Row>
      <Row>
        {secondHalf.map((color, index) => (
          <ColorGroup key={index + halfLength}>
            <div className={styles.colorbox} style={{ backgroundColor: color }} />
            <p className={styles.percentage}>{(index + halfLength) * 10}-{(index + halfLength + 1) * 10}%</p>
          </ColorGroup>
        ))}
      </Row>
    </Container>
  );
};

export default ColorRectangle;
