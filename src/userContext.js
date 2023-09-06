import React, { createContext, useContext, useState } from 'react';

const UpdaterContext = createContext();

export const useUpdater = () => {
  return useContext(UpdaterContext);
};

export const UpdaterProvider = ({ children }) => {
  const [verified, setVerified] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [cropType, setCropType] = useState(null);
  const [percentType, setPercentType] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const value = {
    admin,
    setAdmin,
    verified,
    setVerified,
    cropType,
    setCropType,
    percentType,
    setPercentType,
    selectedCounty,
    setSelectedCounty,
    selectedState,
    setSelectedState,
  };

  return <UpdaterContext.Provider value={value}>{children}</UpdaterContext.Provider>;
};