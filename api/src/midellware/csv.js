const XLSX = require('xlsx');
const path = require('path');

exports.csv_read_file = (req, res, next) => {

   const { file } = req.aws;

   const workbook = XLSX.read(file.Body, { type: "buffer" });
   const sheet_name_list = workbook.SheetNames;
   const sheet = workbook.Sheets[sheet_name_list[0]];
   const json_data = XLSX.utils.sheet_to_json(sheet);

   res.send(json_data);

}

exports.download_csv = (req, res, next) => {
   res.download(path.join(__dirname, '..', './uploads/alumnos/Lista_de_participantes_-_Colgate_Pinta_Un_Mural.xlsx'));
}