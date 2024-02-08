const express = require('express');
const apicache = require('apicache');

const { post_data_form, get_register, get_data_dibujo, get_participantes, post_data_instituciones, put_codigo_dane, get_login, post_image_mural, get_data_murales, get_data_murales_jurado_1, get_data_murales_jurado_2 } = require('../midellware/controller_database');
const { aws_files_upload, aws_get_files } = require('../midellware/aws');
const { csv_read_file, download_csv } = require('../midellware/csv');
const { upload_files } = require('../midellware/file_upload');
const { get_data_auth } = require('../midellware/get_data_auth');
const { verificarToken } = require('../midellware/token');
const { parse_data } = require('../midellware/parse_data');
const { send_image } = require('../midellware/send_image');

const app = express();
const cache = apicache.middleware;

app.get('/', (req, res) => {
   res.send('Funcionando!!!')
})

// Rutas de las intituciones
app.get('/login', get_data_auth, get_login);
app.get('/plantilla', download_csv);
app.get('/participantes', verificarToken, get_participantes, aws_get_files, csv_read_file);
app.post('/legal_directivos', verificarToken, upload_files, parse_data, aws_files_upload, post_data_instituciones);
app.post('/mural', verificarToken, upload_files, parse_data, aws_files_upload, post_image_mural);
app.put('/codigo_dane', verificarToken, put_codigo_dane);

app.get('/dibujos/:tipo/:page', get_data_dibujo);
app.get('/murales/:tipo/:page', get_data_murales);
app.get('/murales/j1/:tipo/:page', get_data_murales_jurado_1);
app.get('/murales/j2/:tipo/:page', get_data_murales_jurado_2);
// app.get('/images', aws_get_files, send_image);
app.get('/images', cache('10 minutes'), aws_get_files, send_image);
// app.get('/files', verificarToken, aws_get_files, csv_read_file);
app.post('/form', upload_files, parse_data, get_register, aws_files_upload, post_data_form);
// app.post('/instituciones', csv_upload, images_upload, aws_files_upload, post_data_form);


module.exports = app;