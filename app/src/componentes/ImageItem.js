import React from "react";
import { ImageListItem } from "@mui/material";
// import ItemNameBar from './ItemNameBar';
import { urlApi } from "../constantes/RoutersLinks";

import "../css/ImageItem.css";

const ImageItem = ({ key, item, handleShow, number }) => {
  return (
    <ImageListItem
      key={key}
      className="ImageListItem"
      onClick={() => handleShow(item)}
    >
      {number && (
        <div className="number">
          <h4>{number}</h4>
        </div>
      )}
      <img src={`${urlApi}/images?key=${item.url}`} alt={""} loading="lazy" />
      {/* <ItemNameBar item={item} /> */}
    </ImageListItem>
  );
};

export default ImageItem;
