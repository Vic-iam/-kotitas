import fs from 'fs';
import path from 'path';
import pool from '../app/db.server';


export default async function install() {
    const client = await pool.connect()

    try {
        console.log('Connected to the database.');
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        if (files.length === 0) {
            console.log('No migration files found.');
            return;
        }

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');
            console.log(`Running migration: ${file}...`);
            await client.query(sql);
            console.log(`Successfully applied ${file}`);
        }

        console.log('All migrations completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        client.release();
    }
};

