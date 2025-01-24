// services/dbService.js
const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../data/db.json');

// Load products from JSON file
const loadProducts = () => {
  if (!fs.existsSync(dbFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(data);
};

// Save products to JSON file
const saveProducts = (products) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(products, null, 2));
};

module.exports = {
  loadProducts,
  saveProducts,
};
