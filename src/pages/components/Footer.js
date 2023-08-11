import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Link as MuiLink } from '@mui/material';

const Footer = () => {
  return (
    <AppBar position="fixed" color="primary" style={{ top: 'auto', bottom: 0, width: '100%' }}>
      <Toolbar>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
