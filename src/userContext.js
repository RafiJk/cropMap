
// import { Console } from 'console';
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
  const [contextSelectedCounties, setContextSelectedCounties] = useState();
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const savedData = sessionStorage.getItem('updaterContext');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setVerified(parsedData.verified);
      setAdmin(parsedData.admin);
      setCropType(parsedData.cropType);
      console.log(setCropType);
      setPercentType(parsedData.percentType);
      setContextSelectedCounties(parsedData.contextSelectedCounties);
      setSelectedState(parsedData.selectedState);
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      verified,
      admin,
      cropType,
      percentType,
      contextSelectedCounties,
      selectedState
    };
    sessionStorage.setItem('updaterContext', JSON.stringify(dataToSave));
  }, [verified, admin, cropType, percentType, contextSelectedCounties, selectedState]);

  const value = {
    admin,
    setAdmin,
    verified,
    setVerified,
    cropType,
    setCropType,
    percentType,
    setPercentType,
    contextSelectedCounties,
    setContextSelectedCounties,
    selectedState,
    setSelectedState,
  };
  console.log(cropType);

  return <UpdaterContext.Provider value={value}>{children}</UpdaterContext.Provider>;
};