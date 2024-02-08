import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

import '../css/WindowModal.css';

const WindowModal = ({ show, handleClose, children }) => {

   return (
      <Dialog
         open={show}
         fullWidth={true}
         fullScreen
         onClose={handleClose}
         className='WindowModal'
      >
         <DialogTitle>
            {"Mi dibujo"}
            <IconButton
               aria-label="close"
               onClick={handleClose}
               sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
               }}
            >
               <CloseIcon />
            </IconButton>
         </DialogTitle>
         <DialogContent className='DialogContent-modal'>
            {children}
         </DialogContent>
      </Dialog>

      // <Dialog
      //    open={show}
      //    onClose={handleClose}
      //    className='WindowModal'
      // >
      //    <Box className='box-WindowModal'>
      //       {children}
      //    </Box>
      // </Dialog>
   );
};

export default WindowModal;