const multer = require('multer');
const path = require('path');

const fields = [
   { name: 'dibujos', maxCount: 1 },
   { name: 'firmas', maxCount: 1 },
   { name: 'alumnos', maxCount: 1 }
];

const diskstorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, `src/uploads/${file.fieldname}`)
   },
   filename: (req, file, cb) => {
      const mimetipe = file.fieldname === 'alumnos' ? 'xlsx' : file.mimetype.split('/')[1];
      cb(null, Date.now() + `.${mimetipe}`)
   }
});

const upload_files = multer({
   storage: diskstorage,
   fileFilter: function (req, file, cb) {

      const mg_error = new Error();
      mg_error.name = 'multer';

      if (file.fieldname === 'alumnos') {
         // Verificar que la extensión del archivo sea csv
         const filetypes = /xlsx/;
         const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
         );

         if (!extname) {
            mg_error.message = 'El archivo debe ser de formato .xlsx';
            return cb(mg_error);
         }

         // Verificar que el archivo no supere 1MB
         if (file.size > 1 * 1024 * 1024) {
            mg_error.message = 'El archivo debe tener un tamaño menor o igual a 1 MB';
            return cb(mg_error);
         }

         // Si se pasan todas las validaciones, se acepta el archivo
         cb(null, true);

      } else {
         // Verificar que la extensión del archivo sea jpg o png
         const filetypes = /jpeg|jpg|png/;
         const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
         );
         if (!extname) {
            mg_error.message = 'La imagen debe ser de formato JPG o PNG';
            return cb(mg_error);
         }

         // Verificar que el archivo no supere los 8MB
         if (file.size > 8 * 1024 * 1024) {
            mg_error.message = 'La imagen debe tener un tamaño menor o igual a 8 MB';
            return cb(mg_error);
         }

         // Si se pasan todas las validaciones, se acepta el archivo
         cb(null, true);
      }


   },
}).fields(fields);

module.exports = { upload_files };