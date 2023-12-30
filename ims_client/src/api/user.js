import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    try {
        const users = await sql`SELECT * FROM Users;`;
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}