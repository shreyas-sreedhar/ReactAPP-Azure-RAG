import React from "react";
import { Link } from "react-router-dom";
import "./cataloglayout.css"; // Make sure this points to your CSS file
import CatalogCard from "../Catalog-card/CatalogCard"; // Ensure this path is correct

const CatalogLayout = () => {
  const catalogNames = [
    { name: 'Sales', description: 'Add Sales data to your catalog', isConnected: false },
    { name: 'Business', description: 'Add Business data to your catalog', isConnected: false },
    { name: 'Product', description: 'Add Product data to your catalog', isConnected: false },
    { name: 'Marketing', description: 'Add Marketing data to your catalog', isConnected: false },
    // ... other items
  ];

  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1 className='pagetitle'>Choose Your Catalog</h1>
        <p>Begin by selecting the units of business you'd like to configure for the user. This will help us tailor the data options to your specific user.</p>
      </header>

      <div className="catalog-grid">
        <div className="catalog-card">
          <h3 className="card-title">Sales</h3>
          <p className="card-description">Add Sales to the catalog to discover data related to Sales</p>
          <button className="catalog-button connected">Connected</button>
        </div>
        <div className="catalog-card">
          <h3 className="card-title">Business</h3>
          <p className="card-description">Add Business to the catalog to discover data related to Business</p>
          <button className="catalog-button">Connect</button>
        </div>
        <div className="catalog-card">
          <h3 className="card-title">Product</h3>
          <p className="card-description">Add Product to the catalog to discover data related to Product</p>
          <button className="catalog-button">Connect</button>
        </div>
        <div className="catalog-card">
          <h3 className="card-title">Marketing</h3>
          <p className="card-description">Add Marketing to the catalog to discover data related to Marketing</p>
          <button className="catalog-button">Connect</button>
        </div>
        
      </div>
      <div className="catalog-card">
          <h3 className="card-title">Create new Catalog</h3>
          <p className="card-description">Add Marketing to the catalog to discover data related to Marketing</p>
          <button className="catalog-button">Create</button>
        </div>

      <footer className="layout-footer">
        <div> 
        <Link to="/chatbot/step-two"><button className="footer-button primary">next</button></Link> 
       </div>
      </footer>
    </div>
  );
};

export default CatalogLayout;
