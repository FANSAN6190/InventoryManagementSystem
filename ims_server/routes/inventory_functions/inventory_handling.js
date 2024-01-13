import express from "express";
import { checkAuthenticated } from "../../server.js";

export default function inventoriesRouter(pool) {
  const router = express.Router();

  router.post("/add-update-inventory", checkAuthenticated, async (req, res) => {
    try {
      const client = await pool.connect();
      const {
        inventoryId,
        inventoryName,
        productCatalogue,
        isCreatingNewInventory,
      } = req.body;

      //console.log(JSON.stringify(productCatalogue,null,2));
      const userCode = req.user_code;
      const userName = (
        await client.query(
          `SELECT user_name FROM ims_schema.users WHERE user_code='${userCode}';`
        )
      ).rows[0].user_name;

      if (isCreatingNewInventory) {
        const insertNewInventoryQuery = `INSERT INTO ims_schema.inventory(inventory_code,inventory_id,inventory_name,user_name) 
        VALUES ($1,$2,$3,$4)`;
        await client.query(insertNewInventoryQuery, [
          inventoryId,
          inventoryId,
          inventoryName,
          userName,
        ]);
      }

      // Fetch the existing product catalogue
      const existingProductCatalogueQuery = `SELECT product_catalogue FROM ims_schema.inventory WHERE inventory_id=$1`;
      const existingProductCatalogueResult = await client.query(
        existingProductCatalogueQuery,
        [inventoryId]
      );
      let existingProductCatalogue =
        existingProductCatalogueResult.rows[0].product_catalogue;
      if (existingProductCatalogue == null) {
        existingProductCatalogue = [];
      }
      let totalVolume = 0;
      let inventoryWorth = 0;
      let mergedProductCatalogue = [];
      if (existingProductCatalogue.length + productCatalogue.length > 0) {
        // Merge the existing product catalogue with the new product catalogue
        mergedProductCatalogue = [
          ...existingProductCatalogue,
          ...productCatalogue,
        ];
        mergedProductCatalogue.forEach((product) => {
          totalVolume += parseInt(product.quantity);
          inventoryWorth +=
            parseInt(product.quantity) * parseInt(product.price);
        });
      }
      // Update the inventory with the total volume and inventory worth
      const updateInventoryQuery = `UPDATE ims_schema.inventory SET product_catalogue=$1, no_of_products=$2, total_volume=$3, inventory_worth=$4, last_update=CURRENT_TIMESTAMP  WHERE inventory_id=$5`;
      await client.query(updateInventoryQuery, [
        JSON.stringify(mergedProductCatalogue),
        mergedProductCatalogue.length,
        totalVolume,
        inventoryWorth,
        inventoryId,
      ]);

      // Insert new products into the products table
      const insertProductQuery = `INSERT INTO ims_schema.products(product_id, product_name, price, supplier_id, other_details) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (product_id) DO NOTHING`;

      productCatalogue.forEach(async (product) => {
        console.log(product);
        const product_id = product.productId;
        const product_name = product.productName;
        const price = product.price;
        const supplier_id = product.supplier.split("/")[1];
        const otherDetails = product.otherDetails;
        console.log(product_id, product_name, price, supplier_id, otherDetails);
        await client.query(insertProductQuery, [
          product_id,
          product_name,
          price,
          supplier_id,
          JSON.stringify(otherDetails),
        ]);
      });
    } catch (err) {
      console.error(err);
    }
  });
  return router;
}
