const axios = require("axios");

exports.errorHandling = (err, req, res, next) => {

   if (err.name === 'multer') {
      res.status(500).send(err.message);
      console.log(err);
   }else{
      axios.post('https://servidordeerrores.kagencia.com/reporte-error', {
         nombre: "Dibuja y colorea",
         error: err.message,
         fecha: new Date().toISOString(),
         url: req.url,
         headers: req.headers,
         body: req.body,
         metodo: req.method,
         stacktrace: err.stack
       })
         .then(() => {
           console.log('Se ha enviado el reporte de error al servidor de errores.');
         })
         .catch(() => {
           console.error('Ocurrió un error al intentar enviar el reporte de error al servidor de errores.');
         });
     
        res.status(500).send("¡Ups! Tuvimos un problema interno, inténtalo más tarde");
   }

}