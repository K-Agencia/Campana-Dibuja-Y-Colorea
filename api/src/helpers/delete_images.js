const fs = require('fs');

exports.delete_images = (files) => {

   let data = [];

   for (const property in files) {
      data.push(files[property][0]);
   }

   for (let i = 0; i < data.length; i++) {
      fs.rm(data[i].path, (err) => {
         if (err) next(err);
      })
   }
}