import React from "react";
import styles from "./legend.module.css"; // Adjust the import path and use your actual CSS module

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

  return (
    <div className={styles.colorrectangle}>
      {colors.map((color, index) => (
        <React.Fragment key={index}>
          <div className={styles.colorbox} style={{ backgroundColor: color }} />
          {index < colors.length && <p className={styles.percentage}>{index * 10}-{(index + 1) * 10}%</p>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ColorRectangle;
