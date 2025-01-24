// routes/products.js
const express = require('express');
const path = require('path');
const router = express.Router();
const ExcelJS = require('exceljs');
const dbService = require('../services/dbService');

// Render product list at /index
router.get('/', (req, res) => {
  const products = dbService.loadProducts();
  res.render('products', { products, theme: 'dark' }); // Added theme data for dark mode
});

// Add new product
router.post('/add', (req, res) => {
  const { name, quantity } = req.body;
  const products = dbService.loadProducts();
  products.push({ name, quantity: parseInt(quantity, 10) });
  dbService.saveProducts(products);
  res.redirect('/'); // Updated route to /index
});

// Edit existing product
router.post('/edit', (req, res) => {
  const { index, quantity } = req.body;
  const products = dbService.loadProducts();
  if (products[index]) {
    products[index].quantity = parseInt(quantity, 10);
    dbService.saveProducts(products);
  }
  res.redirect('/'); // Updated route to /index
});

// Delete existing product
router.post('/delete', (req, res) => {
  const { index } = req.body;
  const products = dbService.loadProducts();
  if (products[index]) {
    products.splice(index, 1);  // Remove o produto pelo índice
    dbService.saveProducts(products);
  }
  res.redirect('/'); // Updated route to /index
});

// Export products to Excel
router.get('/export', async (req, res) => {
  const products = dbService.loadProducts();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inventory');

  // Add header row with styling
  worksheet.columns = [
    { header: 'Product Name', key: 'name', width: 30 },
    { header: 'Quantity', key: 'quantity', width: 15 }
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add product data rows
  products.forEach((product) => {
    worksheet.addRow(product);
  });

  // Format data rows
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
    });
  });

  // Set response headers and send file
  const exportFileName = `Inventory_${Date.now()}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${exportFileName}`);

  await workbook.xlsx.write(res);
  res.end();
});

module.exports = router;
