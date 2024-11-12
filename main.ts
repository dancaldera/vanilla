import "@std/dotenv/load";
import express, { Request, Response } from "express";
import client from "./db.ts";

const app = express();
app.use(express.json());

// Connect to the database
await client.connect();

// Endpoint to check if API is running
app.get("/", (_: Request, res: Response) => {
  res.send("API is running");
});

// Create a new Todo
app.post("/todos", async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    const result = await client.queryArray`
      INSERT INTO todos (title, completed) VALUES (${title}, false) RETURNING *`;
    res.status(201).json(result.rows[0]);
  } catch (_error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Get all Todos
app.get("/todos", async (_: Request, res: Response) => {
  try {
    const result = await client.queryArray`SELECT * FROM todos ORDER BY id`;
    res.json(result.rows);
  } catch (_error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Update a Todo
app.put("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const result = await client.queryArray`
      UPDATE todos SET title = ${title}, completed = ${completed} WHERE id = ${id} RETURNING *`;
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (_error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete a Todo
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await client.queryArray`
      DELETE FROM todos WHERE id = ${id} RETURNING *`;
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json({ message: "Todo deleted" });
  } catch (_error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
