import { Button, FormHelperText } from '@mui/material';
import React from 'react';

import '../css/InputFile.css';

/**
 * Un componente de entrada de archivo que permite al usuario seleccionar un archivo de imagen.
 * 
 * @param {object} props - Las propiedades del componente.
 * @param {function} props.onChange - La función que se llama cuando el archivo seleccionado cambia.
 * @param {function} props.onBlur - La función que se llama cuando el componente pierde el foco.
 * @param {string} props.name - El nombre del campo de entrada.
 * @param {object} props.error - El objeto de error asociado al campo.
 * @param {React.Ref} ref - La referencia al componente de entrada de archivo.
 * @returns {JSX.Element} - El componente de entrada de archivo.
 */
const InputFile = React.forwardRef(({ onChange, onBlur, name, error, selectedFile, label, color }, ref) => (
   <div className='InputFile'>
      <Button color={color} className='btn-file' variant="contained" component="label" disableElevation>
         {label}
         <input
            ref={ref}
            name={name}
            type="file"
            accept={'image/png, image/jpeg'}
            onChange={onChange}
            onBlur={onBlur}
            style={{ display: "none" }}
         />
      </Button>

      {selectedFile.length !== 0 && (
         <img className='img-dibujo' src={URL.createObjectURL(selectedFile[0])} alt="Imagen seleccionada" />
      )}

      {error && <FormHelperText error>{error.message}</FormHelperText>}

   </div>
));

export default InputFile;
