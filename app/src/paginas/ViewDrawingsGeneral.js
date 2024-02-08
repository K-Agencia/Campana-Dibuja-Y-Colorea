import { Container, ImageList, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import Toast from "../componentes/Toast";
import Loading from "../componentes/Loading";
import ImageItem from "../componentes/ImageItem";
import WindowModal from "../componentes/WindowModal";
import { urlApi } from "../constantes/RoutersLinks";
import TextField from "../componentes/TextField";
import textos from "../css/img/logo_pinta.png";
import fondo_final from "../css/img/fondo_final.jpg";

import "../css/ViewDrawings.css";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

const ViewDrawingsGeneral = ({ tipo, url_data }) => {
  window.document.title = "Incripciones - Dibuja y Colorea";

  const [show, setShow] = useState(false);
  const [imageModal, setImageModal] = useState("");

  const [data, setData] = useState([]);
  const [ganadores, setGanadores] = useState([]);
  const [page, setPage] = useState(0);

  const { loading } = useApi();

  const handleShow = (data) => {
    setImageModal(data);
    setShow(true);
  };

  const handleClose = () => {
    setImageModal("");
    setShow(false);
  };

  const get_data = (page) => {
    let newPage = page + 1;
    axios({
      baseURL: urlApi,
      method: "get",
      url: `/dibujos/odontologos/${newPage}`,
    })
      .then((res) => {
        setPage(newPage);
        setData(data.concat(res.data));
      })
      .catch((err) => {
        <Toast title="¡Error!" message={err.data} />;
      });
  };

  useEffect(() => {
    get_data(page);
  }, []);

  useEffect(() => {
    axios({
      baseURL: urlApi,
      method: "get",
      url: `/ganadores/dib`,
    })
      .then((res) => {
        setGanadores(res.data);
      })
      .catch((err) => {
        <Toast title="¡Error!" message={err.data} />;
      });
  }, []);

  return (
    <div className="ViewDrawingsGeneral">
      <div className="logo">
        <div>
          <h3>Conoce los 4 Dibujos</h3>
          <h4>seleccionados de la actividad</h4>
        </div>
        <img src={textos} className="textos" alt="" />
      </div>
      <Container fixed className="ViewDrawings">
        <Paper className="paper-ViewDrawings" elevation={2}>
          <TextField type={"h4"} align={"center"}>
            ¡Felicidades!
          </TextField>
          <ImageList className="ImageList-dibujos">
            {ganadores.map((item, index) => (
              <div className="content_ImageList" key={index}>
                <ImageItem
                  number={index + 1}
                  item={item}
                  handleShow={handleShow}
                />
              </div>
            ))}
          </ImageList>
        </Paper>

        <Paper className="paper-ViewDrawings" elevation={2}>
          <TextField type={"h4"} align={"center"}>
            Todos nuestros participantes
          </TextField>
          <InfiniteScroll
            dataLength={data.length} //This is important field to render the next data
            next={() => get_data(page)}
            hasMore={true}
            loader={<Loading open={loading} />}
            scrollableTarget="InfiniteScroll"
          >
            <ImageList className="ImageList-dibujos">
              {data.map((item, index) => (
                <div key={index}>
                  <ImageItem item={item} handleShow={handleShow} />
                </div>
              ))}
            </ImageList>
          </InfiniteScroll>

          <Loading open={loading} />

          {show && (
            <WindowModal show={show} handleClose={handleClose}>
              <div className="content-img-modal">
                <img
                  className="img-modal"
                  src={`${urlApi}/images?key=${imageModal.url}`}
                  alt=""
                />
              </div>
              <div className="content-information">
                <TextField type={"subtitle1"}>
                  <b>Artista:</b> {imageModal.infantes}
                </TextField>
                <TextField type={"caption"}>
                  <b>Acudiente:</b> {imageModal.padres}
                </TextField>
                <TextField type={"caption"}>
                  <b>url:</b> {imageModal.url}
                </TextField>
                {imageModal.odontologo !== "- -" && (
                  <TextField type={"caption"}>
                    <b>Odontólogo:</b> {imageModal.odontologo}
                  </TextField>
                )}
              </div>
            </WindowModal>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ViewDrawingsGeneral;
