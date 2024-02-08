const { query_database } = require("../config/database");
const { delete_images } = require("../helpers/delete_images");
const { crearToken } = require("./token");

exports.post_data_form = async (req, res, next) => {
  const { paciente, odontologo, acudiente, folder } = req.body;

  const images = req.aws;

  const query_insert = `INSERT INTO inscripciones (tipo_documento_infantes, no_documento_infantes, nombres_infantes, apellido_infantes, tipo_documento_padres, no_documento_padres, lugar_documento_padres, nombres_padres, apellido_padres, celular_padres, direccion_padres, departamento_padres, ciudad_padres, correo_padres, firma_padres, nombres_odontologo, apellido_odontologo, celular_odontologo, imagen_dibujo, formulario) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values_query_insert = [
    paciente.documento.tipo.trim(),
    paciente.documento.numero.trim(),
    paciente.nombre.trim(),
    paciente.apellido.trim(),
    acudiente.documento.tipo.trim(),
    acudiente.documento.numero.trim(),
    acudiente.documento.lugar_expedicion.trim(),
    acudiente.nombre.trim(),
    acudiente.apellido.trim(),
    acudiente.celular.trim(),
    acudiente.vivienda.direccion.trim(),
    acudiente.vivienda.departamento.trim(),
    acudiente.vivienda.ciudad.trim(),
    acudiente.correo.trim(),
    images.firmas.Key,
    folder === "odontologos" ? odontologo.nombre.trim() : "-",
    folder === "odontologos" ? odontologo.apellido.trim() : "-",
    folder === "odontologos" ? odontologo.celular.trim() : "-",
    images.dibujos.Key,
    folder,
  ];

  query_database(query_insert, values_query_insert)
    .then(() => {
      res.send("Registro exitoso!");
    })
    .catch((err) => {
      next(err);
    });
};

exports.post_data_instituciones = (req, res, next) => {
  const instituciones = req.auth.data;

  const { documento, nombre, apellido, rol } = req.body;

  const files = req.aws;

  const query_insert_directivos_instituciones = `INSERT INTO directivos_instituciones (id_instituciones, tipo_documento, numero_documento, lugar_documento, nombres, apellidos, firma, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

  const values_query_insert_directivos_instituciones = [
    instituciones.id,
    documento.tipo,
    documento.numero,
    documento.lugar,
    nombre,
    apellido,
    files.firmas.Key,
    rol,
  ];

  query_database(
    query_insert_directivos_instituciones,
    values_query_insert_directivos_instituciones
  )
    .then(() => {
      if (rol === "docente") {
        const query_insert_participantes = `INSERT INTO participantes (id_instituciones, lista_participantes) VALUES (?, ?);`;

        const values_query_insert_participantes = [
          instituciones.id,
          files.alumnos.Key,
        ];

        return query_database(
          query_insert_participantes,
          values_query_insert_participantes
        );
      }
    })
    .then(() => {
      res.send("Registro exitoso!");
    })
    .catch((err) => {
      next(err);
    });
};

exports.post_image_mural = (req, res, next) => {
  const instituciones = req.auth.data;
  const files = req.aws;

  const query_insert_mural = `INSERT INTO murales (id_instituciones, murales) VALUES (?, ?);`;

  const values_query_insert_mural = [instituciones.id, files.dibujos.Key];

  query_database(query_insert_mural, values_query_insert_mural)
    .then(() => {
      res.send("Registro exitoso!");
    })
    .catch((err) => next(err));
};

exports.get_login = (req, res, next) => {
  const { username, password } = req.body;

  const query_select_instituciones = `
   SELECT 
      i.id_instituciones AS id, i.nombre, i.sede, i.codigo_dane,
      CASE WHEN d1.id_directivos IS NOT NULL THEN 'true' ELSE '-' END AS docente,
      CASE WHEN d2.id_directivos IS NOT NULL THEN 'true' ELSE '-' END AS rector,
      CASE WHEN p.id_participantes IS NOT NULL THEN p.lista_participantes ELSE '-' END AS participantes,
      CASE WHEN m.id_murales IS NOT NULL THEN 'true' ELSE '-' END AS mural
   FROM instituciones i
    LEFT JOIN directivos_instituciones d1 ON i.id_instituciones = d1.id_instituciones AND d1.rol = "docente"
    LEFT JOIN directivos_instituciones d2 ON i.id_instituciones = d2.id_instituciones AND d2.rol = "rector"
    LEFT JOIN murales m ON i.id_instituciones = m.id_instituciones
    LEFT JOIN participantes p ON i.id_instituciones = p.id_instituciones
   WHERE 
      usuario = ? AND password = ?;`;

  const values_query_select_instituciones = [username.trim(), password.trim()];

  query_database(query_select_instituciones, values_query_select_instituciones)
    .then((response) => {
      if (response.length > 0) {
        const token = crearToken(response[0]);

        res.send({
          token,
          data: response[0],
        });
      } else {
        res.status(404).send("El usuario y/o la contraseña no son correctos.");
      }
    })
    .catch((err) => next(err));
};

exports.get_register = (req, res, next) => {
  const { paciente } = req.body;

  const files = req.files;

  const query_select = `SELECT EXISTS (SELECT 1 FROM inscripciones WHERE tipo_documento_infantes = ? AND no_documento_infantes = ?) AS existe;`;

  const values_query_select = [
    paciente.documento.tipo.trim(),
    paciente.documento.numero.trim(),
  ];

  query_database(query_select, values_query_select)
    .then((response) => {
      if (response[0].existe === 0) {
        next();
      } else {
        delete_images(files);
        res
          .status(409)
          .send(
            "El niño(a) ya se encuentra registrado en nuestra base de datos"
          );
      }
    })
    .catch((err) => next(err));
};

exports.get_data_dibujo = async (req, res, next) => {
  const { tipo, page } = req.params;

  let data = [];

  const limit = 30;
  const offset = (page - 1) * limit;

  const query_select = `SELECT nombres_infantes, apellido_infantes, nombres_padres, apellido_padres, nombres_odontologo, apellido_odontologo, imagen_dibujo AS url FROM inscripciones WHERE id_inscripciones > 16 AND formulario = ? LIMIT ${limit} OFFSET ${offset};`;

  const info = await query_database(query_select, [tipo])
    .then((response) => {
      return response;
    })
    .catch((err) => next(err));

  for (let i = 0; i < info.length; i++) {
    data.push({
      infantes: `${info[i].nombres_infantes} ${info[i].apellido_infantes}`,
      padres: `${info[i].nombres_padres} ${info[i].apellido_padres}`,
      odontologo: `${info[i].nombres_odontologo} ${info[i].apellido_odontologo}`,
      url: info[i].url,
    });
  }

  res.send(data);
};

exports.get_data_murales = async (req, res, next) => {
  const { tipo, page } = req.params;

  let data = [];

  const limit = 30;
  const offset = (page - 1) * limit;

  const query_select = `
   SELECT DISTINCT I.id_instituciones, I.nombre, I.sede, 
      D.nombres AS nombresD, D.apellidos AS apellidosD,
      R.nombres AS nombresR, R.apellidos AS apellidosR,
      M.murales AS url, M.fecha_registro
   FROM instituciones I
      JOIN directivos_instituciones D ON I.id_instituciones = D.id_instituciones AND D.rol = 'docente'
      JOIN directivos_instituciones R ON I.id_instituciones = R.id_instituciones AND R.rol = 'rector'
      JOIN participantes P ON I.id_instituciones = P.id_instituciones
      JOIN murales M ON I.id_instituciones = M.id_instituciones
      ORDER BY M.fecha_registro ASC
   LIMIT ${limit} 
   OFFSET ${offset};
   `;

  const info = await query_database(query_select, [tipo])
    .then((response) => {
      res.send(response);
    })
    .catch((err) => next(err));
};

exports.get_data_murales_jurado_1 = async (req, res, next) => {
  const { tipo, page } = req.params;

  let data = [];

  const limit = 30;
  const offset = (page - 1) * limit;

  const query_select = `
   SELECT DISTINCT I.id_instituciones, I.nombre, I.sede, 
      D.nombres AS nombresD, D.apellidos AS apellidosD,
      R.nombres AS nombresR, R.apellidos AS apellidosR,
      M.murales AS url, M.fecha_registro
   FROM instituciones I
      JOIN directivos_instituciones D ON I.id_instituciones = D.id_instituciones AND D.rol = 'docente'
      JOIN directivos_instituciones R ON I.id_instituciones = R.id_instituciones AND R.rol = 'rector'
      JOIN participantes P ON I.id_instituciones = P.id_instituciones
      JOIN murales M ON I.id_instituciones = M.id_instituciones
   WHERE I.id_instituciones IN (260, 148, 307, 242, 273, 278, 180, 52, 221, 238, 60, 370, 301, 114, 255, 317, 281, 331, 175, 116, 214, 369, 310, 135, 314, 312, 264, 194, 54, 120, 69, 279, 137, 117, 359, 235, 375, 358, 62, 168, 362, 128, 374, 157, 192, 384, 395, 476, 356, 88, 376, 318, 474, 403, 48, 266, 250, 45, 263, 207, 143, 407, 465, 383, 335)
   ORDER BY M.fecha_registro ASC
   LIMIT ${limit} 
   OFFSET ${offset};
   `;

  const info = await query_database(query_select, [tipo])
    .then((response) => {
      res.send(response);
    })
    .catch((err) => next(err));
};

exports.get_data_murales_jurado_2 = async (req, res, next) => {

  const {  page } = req.params;
  const limit = 30;
  const offset = (page - 1) * limit;

  const query_select = `
   SELECT I.id_instituciones, I.nombre, I.sede, 
      D.nombres AS nombresD, D.apellidos AS apellidosD,
      R.nombres AS nombresR, R.apellidos AS apellidosR,
      M.murales AS url, M.fecha_registro
   FROM instituciones I
      JOIN directivos_instituciones D ON I.id_instituciones = D.id_instituciones AND D.rol = 'docente'
      JOIN directivos_instituciones R ON I.id_instituciones = R.id_instituciones AND R.rol = 'rector'
      JOIN participantes P ON I.id_instituciones = P.id_instituciones
      JOIN murales M ON I.id_instituciones = M.id_instituciones
   WHERE I.id_instituciones IN (242, 180, 307, 148, 60, 255, 278, 312, 273, 370, 317, 137, 264, 375, 235, 194, 168, 476, 88, 45, 335)
   ORDER BY M.fecha_registro ASC
   LIMIT ${limit} 
   OFFSET ${offset};
   `;

  query_database(query_select)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => next(err));
};

exports.get_participantes = async (req, res, next) => {
  const instituciones = req.auth.data;

  const query_select = `SELECT lista_participantes FROM participantes WHERE id_instituciones = ?;`;

  query_database(query_select, instituciones.id)
    .then((response) => {
      req.body.key_aws = response[0].lista_participantes;
      next();
    })
    .catch((err) => next(err));
};

exports.put_codigo_dane = async (req, res, next) => {
  const instituciones = req.auth.data;
  const { codigo } = req.body;

  const query_update = `UPDATE instituciones SET codigo_dane = ? WHERE (id_instituciones = ?);`;
  const values_query_update = [codigo, instituciones.id];

  query_database(query_update, values_query_update)
    .then(() => {
      res.send("Registro exitoso!");
    })
    .catch((err) => next(err));
};
