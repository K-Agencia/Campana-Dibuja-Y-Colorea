import { ImageListItemBar } from '@mui/material';
import React from 'react';

const ItemNameBar = ({ item }) => {
   return (
      <ImageListItemBar
         title={`Artista: ${item.infantes}`}
         subtitle={
            <>
               <span>Acudiente: {item.padres}</span>
               <br />
               <span>Odontologo: {item.odontologo}</span>
            </>
         }
      />
   );
};

export default ItemNameBar;