import "@std/dotenv/load";
import { Client } from "postgres";

const postgres_url = new URL(Deno.env.get("DATABASE_URL") as string);

// PostgreSQL connection setup
const client = new Client({
  user: postgres_url.username,
  password: postgres_url.password,
  database: postgres_url.pathname.split("/")[1],
  hostname: postgres_url.hostname,
  port: parseInt(postgres_url.port) || 5432,
});

async function runSQLScript(filePath: string) {
  try {
    // Connect to the PostgreSQL database
    await client.connect();

    // Read SQL file contents
    const sql = await Deno.readTextFile(filePath);

    // Execute SQL script
    await client.queryArray(sql);
    console.log("SQL script executed successfully!");
  } catch (error) {
    console.error("Error executing SQL script:", error);
  } finally {
    // Ensure the client disconnects from the database
    await client.end();
  }
}

// Run the script (replace 'db.sql' with your actual SQL file path)
await runSQLScript("db.sql");
