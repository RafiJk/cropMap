import React, { createContext, useContext, useState, useEffect } from 'react';

const UpdaterContext = createContext();

export const useUpdater = () => {
  return useContext(UpdaterContext);
};

export const UpdaterProvider = ({ children }) => {
  const [verified, setVerified] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [cropType, setCropType] = useState(null);
  const [percentType, setPercentType] = useState("");
  const [selectedCounty, setSelectedCounty] = useState();
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const savedData = sessionStorage.getItem('updaterContext');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setVerified(parsedData.verified);
      setAdmin(parsedData.admin);
      setCropType(parsedData.cropType);
      setPercentType(parsedData.percentType);
      setSelectedCounty(parsedData.selectedCounty);
      setSelectedState(parsedData.selectedState);
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      verified,
      admin,
      cropType,
      percentType,
      selectedCounty,
      selectedState
    };
    sessionStorage.setItem('updaterContext', JSON.stringify(dataToSave));
  }, [verified, admin, cropType, percentType, selectedCounty, selectedState]);

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
