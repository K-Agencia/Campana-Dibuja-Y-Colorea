import { Typography } from '@mui/material';
import React from 'react';

import '../css/TextField.css';

const TextField = ({ children, type, align }) => {
   return (
      <Typography className={`TextField ${type} ${align}`} variant={type} gutterBottom>
         {children}
         <br />
      </Typography>
   );
};

export default TextField;