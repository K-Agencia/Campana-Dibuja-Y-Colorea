import React from 'react';
import { FormHelperText, TextField } from '@mui/material';

import '../css/InputText.css';

const InputText = React.forwardRef(({ name, label, type, required, accept, onChange, onBlur, error }, ref) => (
   <div className='InputText'>
      <TextField
         ref={ref}
         type={type ? type : 'text'}
         id={name}
         name={name}
         accept={accept}
         onChange={onChange}
         onBlur={onBlur}
         label={`${label}:`}
         variant="standard"
         error={error && true}
      />
      {error && <FormHelperText error>{error.message}</FormHelperText>}
   </div>
));

export default InputText;