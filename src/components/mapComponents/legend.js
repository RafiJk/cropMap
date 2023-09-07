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
    "#c0c0c0",
    "#ffedea",
    "#ffcec5",
    "#ffad9f",
    "#ff8a75",
    "#ff5533",
    "#e2492d",
    "#be3d26",
    "#9a311f",
    "#782618"
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
