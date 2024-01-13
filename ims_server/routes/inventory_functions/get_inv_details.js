import express from "express";
import { checkAuthenticated } from "../../server.js";

export default function getInvDetailsRouter( pool){
    const router = express.Router();
    router.get("/get-inventories", checkAuthenticated, async (req, res) => {
        try {
        const client = await pool.connect();
        const inventoryResult = await client.query(
            `SELECT inventory_name,inventory_id FROM ims_schema.inventory,ims_schema.users WHERE ims_schema.users.user_code='${req.user_code}' and ims_schema.users.user_name=ims_schema.inventory.user_name;`
        );
        const results = {
            results: inventoryResult ? inventoryResult.rows : null,
        };
        client.release();
        console.log(results);
        return res.json(results);
        } catch (err) {
        console.error(err);
        }
    });

    router.get("/get-suppliers", checkAuthenticated, async (req, res) => {
        try {
        const client = await pool.connect();
        const supplierResult = await client.query(
            `SELECT supplier_id, supplier_name FROM ims_schema.suppliers;`
        );
        const results = { results: supplierResult ? supplierResult.rows : null };
        client.release();
        console.log(results);
        return res.json(results);
        } catch (err) {
        console.error(err);
        }
    });
    return router;
}