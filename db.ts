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

export default client;