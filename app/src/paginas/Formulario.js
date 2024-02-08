import React from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { Button, Checkbox, FormControlLabel, Paper, ThemeProvider, createTheme } from '@mui/material';

import InputText from '../componentes/InputText';
import InputSelect from '../componentes/InputSelect';
import InputFile from '../componentes/InputFile';
import TextField from '../componentes/TextField';
import Loading from '../componentes/Loading';

import { tipo_documento } from '../constantes/Selects';

import { useApi } from '../hooks/useApi';

import principal from '../css/img/img_principal.png';

import '../css/fonts.css';
import '../css/Formulario.css';

const initialForm = {
   paciente: {
      documento: {
         tipo: '',
         numero: ''
      },
      nombre: '',
      apellido: '',
      dibujo: {
         archivo: []
      },
   },
   acudiente: {
      documento: {
         tipo: '',
         numero: '',
         lugar_expedicion: '',
      },
      nombre: '',
      apellido: '',
      celular: '',
      vivienda: {
         direccion: '',
         ciudad: '',
         departamento: '',
      },
      correo: '',
      firma: []
   },
   odontologo: {
      nombre: '',
      apellido: '',
      celular: '',
   },
   check: false
}

const Formulario = ({ tipo }) => {

   window.document.title = 'Incripciones - Dibuja y Colorea';

   const { register, formState: { errors }, watch, reset, handleSubmit } = useForm({
      defaultValues: initialForm
   });

   const { loading, api_handleSubmit } = useApi();

   const message_required = "Este campo es requerido";

   const theme = createTheme({
      palette: {
         primary: {
            main: '#27d2f0',
         },
         secondary: {
            main: '#82bb00',
         },
         third: {
            main: '#d2010d',
         }
      },
      overrides: {
         MuiInput: {
            underline: {
               '&:before': {
                  borderBottom: '2px solid rgba(0, 0, 0, 0.42)',
               },
               '&:hover:not($disabled):before': {
                  borderBottom: `2px solid #27d2f0`,
               },
               '&:after': {
                  borderBottom: `2px solid #27d2f0`,
               },
            },
         },
      },
      typography: {
         fontFamily: ["Light", "Regular", "Bold"].join(',')
      },
   });

   const onSubmit = (data) => {

      const config = {
         method: 'post',
         url: '/form',
         formData: true
      }

      const formData = new FormData();
      const dibujo = data.paciente.dibujo.archivo[0];
      const firma = data.acudiente.firma[0];
      data.folder = tipo;
      data.paciente.documento.tipo = data.paciente.documento.tipo.split(' ')[0];
      data.acudiente.documento.tipo = data.acudiente.documento.tipo.split(' ')[0];
      delete data.paciente.dibujo.archivo;
      delete data.acudiente.firma;
      delete data.check;

      formData.append('dibujos', dibujo);
      formData.append('firmas', firma);
      formData.append('data', JSON.stringify(data));

      api_handleSubmit(config, formData)
         .then((res) => {
            show_toast('success', res.data);
            reset(initialForm);
         })
         .catch((err) => {

            show_toast('error', err.data);

            if (err.status === 409) {
               reset(initialForm);
            }
         })
   };

   const show_toast = (type, message) => {
      toast[type](message, {
         duration: 10000,
         position: 'top-center',
         style: {
            fontFamily: 'Regular'
         }
      })
   }

   return (
      <div className='Formulario'>
         <div className='portada'>
            <img src={principal} className='img-formulario' alt="" />
            <div className="titulo">
               <TextField type={'h3'} align={'center'}>ACTIVIDAD DIBUJA Y COLOREA</TextField>
               <TextField type={'h4'} align={'center'}>con el Dr. Muelitas</TextField>
            </div>
         </div>
         <ThemeProvider theme={theme}>
            <Paper className='paper-form' elevation={2}>
               <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField type={'h5'} align={'center'}>Formulario de inscripción</TextField>
                  <div className='container'>
                     <TextField type={'h6'} align={'center'}>Información del niño(a)</TextField>

                     <InputSelect {...register('paciente.documento.tipo', {
                        required: {
                           value: true,
                           message: message_required
                        }
                     })} value={watch('paciente.documento.tipo')} options={tipo_documento.infantil} label={"Tipo de documento"} error={errors.paciente?.documento?.tipo} />

                     <InputText {...register('paciente.documento.numero', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 11,
                           message: "Se ha superado el límite máximo de 11 caracteres"
                        }
                     })} type={'number'} label={"Número de documento"} error={errors.paciente?.documento?.numero} />

                     <InputText {...register('paciente.nombre', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 45,
                           message: "Se ha superado el límite máximo de 45 caracteres"
                        }
                     })} label={"Nombres"} error={errors.paciente?.nombre} />

                     <InputText {...register('paciente.apellido', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 45,
                           message: "Se ha superado el límite máximo de 45 caracteres"
                        }
                     })} label={"Apellidos"} error={errors.paciente?.apellido} />
                  </div>

                  <div className='container'>
                     <TextField type={'h6'} align={'center'}>Información del acudiente</TextField>

                     <InputSelect {...register('acudiente.documento.tipo', {
                        required: {
                           value: true,
                           message: message_required
                        }
                     })} value={watch('acudiente.documento.tipo')} options={tipo_documento.acudiente} label={"Tipo de documento"} error={errors.acudiente?.documento?.tipo} />

                     <InputText {...register('acudiente.documento.numero', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 11,
                           message: "Se ha superado el límite máximo de 11 caracteres"
                        }
                     })} type={'number'} label={"Número de documento"} error={errors.acudiente?.documento?.numero} />

                     <InputText {...register('acudiente.documento.lugar_expedicion', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 45,
                           message: "Se ha superado el límite máximo de 45 caracteres"
                        }
                     })} required={true} label={"Lugar de expedición del documento"} error={errors.acudiente?.documento?.lugar_expedicion} />

                     <br />

                     <InputText {...register('acudiente.nombre', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 45,
                           message: "Se ha superado el límite máximo de 45 caracteres"
                        }
                     })} required={true} label={"Nombres"} error={errors.acudiente?.nombre} />

                     <InputText {...register('acudiente.apellido', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 45,
                           message: "Se ha superado el límite máximo de 45 caracteres"
                        }
                     })} required={true} label={"Apellidos"} error={errors.acudiente?.apellido} />

                     <InputText {...register('acudiente.celular', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 10,
                           message: "Se ha superado el límite máximo de 10 caracteres"
                        }
                     })} type={'number'} required={true} label={"Teléfono Celular"} error={errors.acudiente?.celular} />
                     <br />

                     <InputText {...register('acudiente.vivienda.direccion', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 50,
                           message: "Se ha superado el límite máximo de 50 caracteres"
                        }
                     })} label={"Dirección de vivienda"} error={errors.acudiente?.vivienda?.direccion} />

                     <InputText {...register('acudiente.vivienda.departamento', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 45,
                           message: "Se ha superado el límite máximo de 45 caracteres"
                        }
                     })} label={"Departamento de vivienda"} error={errors.acudiente?.vivienda?.departamento} />


                     <InputText {...register('acudiente.vivienda.ciudad', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        maxLength: {
                           value: 60,
                           message: "Se ha superado el límite máximo de 60 caracteres"
                        }
                     })} label={"Municipio de vivienda"} error={errors.acudiente?.vivienda?.ciudad} />

                     <br />

                     <InputText {...register('acudiente.correo', {
                        required: {
                           value: true,
                           message: message_required
                        },
                        pattern: {
                           value: /^[\w.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i,
                           message: 'Ingrese un correo electrónico válido'
                        },
                        maxLength: {
                           value: 80,
                           message: "Se ha superado el límite máximo de 80 caracteres"
                        }
                     })} type={'email'} required={true} label={"Correo Electrónico"} error={errors.acudiente?.correo} />

                  </div>

                  {tipo === 'odontologos' &&
                     <div className='container'>
                        <TextField type={'h6'} align={'center'}>Información del odontólogo</TextField>
                        <InputText {...register('odontologo.nombre', {
                           required: {
                              value: true,
                              message: message_required
                           },
                           maxLength: {
                              value: 45,
                              message: "Se ha superado el límite máximo de 45 caracteres"
                           }
                        })} label={"Nombres"} error={errors.odontologo?.nombre} />

                        <InputText {...register('odontologo.apellido', {
                           required: {
                              value: true,
                              message: message_required
                           },
                           maxLength: {
                              value: 45,
                              message: "Se ha superado el límite máximo de 45 caracteres"
                           }
                        })} label={"Apellidos"} error={errors.odontologo?.apellido} />

                        <InputText {...register('odontologo.celular', {
                           required: {
                              value: true,
                              message: message_required
                           },
                           maxLength: {
                              value: 10,
                              message: "Se ha superado el límite máximo de 10 caracteres"
                           }
                        })} type={'number'} label={"Teléfono celular"} error={errors.odontologo?.celular} />

                        {/* <InputSelect /> */}
                     </div>
                  }

                  <div className='container'>
                     <TextField type={'h6'} align={'center'}>Fotografía del dibujo del niño(a)</TextField>
                     <TextField type={'body2'}>Se debe subir una fotografía del dibujo realizado por su niño(a)</TextField>

                     <InputFile {...register('paciente.dibujo.archivo', {
                        required: {
                           value: true,
                           message: message_required
                        }
                     })} color={'secondary'} filename={watch('paciente.dibujo.archivo')} name={'paciente.dibujo.archivo'} label={"Subir fotografía del dibujo"} selectedFile={watch('paciente.dibujo.archivo')} error={errors.paciente?.dibujo?.archivo} />

                  </div>
                  <hr />

                  <div className="documentacion-legal">
                     <TextField type={'h6'} align={'center'}>Transferencia de derechos del dibujo</TextField>
                     <TextField type={'body2'} align={'justify'}>Cordial saludo, por medio de la presente yo <b><u>{`${watch('acudiente.nombre')} ${watch('acudiente.apellido')}`}</u></b> identificado con <b><u>{watch('acudiente.documento.tipo')}</u></b> No. <b><u>{watch('acudiente.documento.numero')}</u></b>, me permito TRANSFERIR los derechos patrimoniales del dibujo realizado por mi o por mi menor hijo días anteriores a <b><u>{new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</u></b> en el lugar <b><u>{`${watch('acudiente.vivienda.ciudad')} - ${watch('acudiente.vivienda.departamento')}`}</u></b>, para incluir éste en el calendario de relaciones profesionales de COLGATE PALMOLIVE – 2024 y/o en la PÁGINA WEB <a href="https://dibuja-y-colorea-sbfb.col1.co/page/odontologos" target="_blank" rel="noopener noreferrer">www.dibuja-y-colorea-sbfb.col1.co/page/odontologos</a>. Por lo tanto esta empresa podrá disponer de la reproducción, publicación, edición, y divulgación del dibujo a nivel mundial y sin limitación alguna en cuanto a tiempo, modo y lugar incluso pudiendo reproducirlo para cualquier medio de publicación, reproducción, multiplicación, o difusión, incluyendo físico y electrónico, páginas web y redes sociales. Esta cesión se realiza a título gratuito por lo tanto <b>COLGATE PALMOLIVE COMPAÑÍA</b> no estará obligada a realizar ningún pago por este concepto y autorizo a esta empresa a realizar la recolección, almacenamiento, uso, circulación de mis datos personales y los de mi menor hijo, según la política de datos disponible en la página <a href="http://colgate.com.co" target="_blank" rel="noopener noreferrer">www.colgate.com.co</a>. <br /> Atentamente,</TextField>

                        <TextField type={'body1'} align={'justify'}>
                           <b>{`${watch('acudiente.nombre')} ${watch('acudiente.apellido')}`}</b>
                        </TextField>
                        <TextField type={'caption'} align={'justify'}>
                           {watch('acudiente.documento.tipo').split(' ')[0]}. No. {watch('acudiente.documento.numero')} <br />
                           de {watch('acudiente.documento.lugar_expedicion')}
                        </TextField>
                        <br />

                        <TextField type={'caption'} align={'justify'}>Se debe subir una fotografía legible y lo más cercana posible de la firma del acudiente del niño(a), para certificar el <b>Acuerdo de propiedad intelectual</b></TextField>

                        <InputFile {...register('acudiente.firma', {
                           required: {
                              value: true,
                              message: message_required
                           }
                        })} color={'third'} filename={watch('acudiente.firma')} label={"Subir la fotografía de la firma"} name={'acudiente.firma'} selectedFile={watch('acudiente.firma')} error={errors.acudiente?.firma} />

                     </div>
                        <br />
                        <hr />

                        <div>
                           <TextField type={'h6'} align={'center'}><b>Políticas de recolección y uso de datos personales</b></TextField>
                           <TextField type={'body2'} align={'justify'}>Autorizo la recolección, almacenamiento, uso, tratamiento, y transmisión internacional o a terceros de mis datos personales por parte de <b>COLGATE PALMOLIVE COMPAÑÍA</b> con <b>NIT 890.300.546-6</b>, con el fin de recibir información sobre sus productos, campañas publicitarias y promociones , hacer parte de sus actividades para profesionales de la salud y recibir información comercial especializada de la misma. Esto de acuerdo a lo establecido en la Ley 1581 de 2012 y el decreto 377 de 2013, y conforme a la política de datos personales disponible en <a href="https://www.colgatepalmolive.com.co/legal-privacy-policy" target="_blank" rel="noopener noreferrer"><i><u>https://www.colgatepalmolive.com.co/legal-privacy-policy</u></i></a>. Entendiendo que puedo solicitar la modificación o supresión de mis datos personales en cualquier momento.</TextField>

                           <div className="form-check">
                              <FormControlLabel control={<Checkbox checked={watch('check')} {...register('check')} />} label={"Si autorizo la recolección y uso de mis datos personales"} />
                           </div>
                        </div>
                        <div className='container-btn-submit'>
                           <Button className='btn-submit' type='submit' variant="contained" disabled={!watch('check')}>
                              Inscribir
                           </Button>
                        </div>
                        {/* <input type='submit' /> */}
                     </form>
                  </Paper>
               </ThemeProvider>
               <Loading open={loading} />
               <Toaster />
            </div>
            );
};

            export default Formulario;