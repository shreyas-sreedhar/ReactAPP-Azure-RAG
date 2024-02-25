import React from "react";
import './catalogcard.css';

function CatalogCard({ name, isConnected, onConnect }) {
  const buttonClass = isConnected ? "catalog-button connected" : "catalog-button";
  const buttonText = isConnected ? "Connected" : "Connect";

  return (
    <div className="div">
      <div className="div-2">
        <div className="div-3">{name}</div>
        {/* <div className="div-4">{description}</div> */}
        <button className={buttonClass} onClick={onConnect}>{buttonText}</button>
      </div>
    </div>
  );
}

export default CatalogCard;
