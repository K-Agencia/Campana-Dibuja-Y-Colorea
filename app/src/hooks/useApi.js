import axios from "axios";
import { useState } from "react";
import { urlApi } from "../constantes/RoutersLinks";

export const useApi = () => {

   const [loading, setLoading] = useState(false);

   const Conexion = axios.create({
      baseURL: urlApi
   })

   const api_handleSubmit = async (config, form) => {

      setLoading(true);

      return await new Promise((resolve, reject) => {
         Conexion({
            method: config.method,
            url: config.url,
            data: form,
            params: config.params,
            headers: {
               'Content-Type': config.formData ? 'multipart/form-data' : null
            }
         })
            .then((response) => {
               resolve(response);
            })
            .catch((error) => {
               reject(error.response)
            })
            .finally(() => {
               setLoading(false);
            })
      });
   };

   return {
      loading,
      api_handleSubmit
   }
}