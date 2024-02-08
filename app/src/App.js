import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoutersLinks } from "./constantes/RoutersLinks";
import Formulario from "./paginas/Formulario";
import { ThemeProvider, createTheme } from "@mui/material";

import "./css/App.css";
import ViewDrawings from "./paginas/ViewDrawings";
import Insituciones from "./paginas/Insituciones";
import ViewDrawingsGeneral from "./paginas/ViewDrawingsGeneral";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#27d2f0",
      },
      secondary: {
        main: "#82bb00",
      },
      third: {
        main: "#d2010d",
      },
      fourth: {
        main: "#5F8700",
      },
    },
    overrides: {
      MuiInput: {
        underline: {
          "&:before": {
            borderBottom: "2px solid rgba(0, 0, 0, 0.42)",
          },
          "&:hover:not($disabled):before": {
            borderBottom: `2px solid #27d2f0`,
          },
          "&:after": {
            borderBottom: `2px solid #27d2f0`,
          },
        },
      },
    },
    typography: {
      fontFamily: ["Light", "Regular", "Bold"].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path={RoutersLinks.Form_Odontologos}
            element={<Formulario tipo={"odontologos"} />}
          />

          <Route
            exact
            path={RoutersLinks.Form_Colaboradores}
            element={<Formulario tipo={"empleados"} />}
          />

          <Route
            exact
            path={RoutersLinks.View_Odontologos}
            element={<ViewDrawingsGeneral />}
          />

          <Route
            exact
            path={RoutersLinks.View_Colaboradores}
            element={<Insituciones />}
          />

          <Route
            exact
            path={RoutersLinks.Seleccion_Odontologos}
            element={
              <ViewDrawings
                tipo={"odontologos"}
                titulo={"Odontólogos y Pacientes"}
              />
            }
          />
          <Route
            exact
            path={RoutersLinks.Seleccion_Colaboradores}
            element={
              <ViewDrawings
                tipo={"empleados"}
                titulo={"Colaboradores de Colgate"}
              />
            }
          />
          {/* <Route exact path={RoutersLinks.View_Odontologos} element={<Odontologo tipo={'odontologos'} />} /> */}
          {/* <Route exact path={RoutersLinks.View_Colaboradores} element={<Insituciones tipo={'empleados'} />} /> */}
          {/* <Route exact path={RoutersLinks.View_Colaboradores} element={<Odontologo tipo={'empleados'} />} /> */}
          {/* <Route exact path={RoutersLinks.Insituciones} element={<Insituciones />} /> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
