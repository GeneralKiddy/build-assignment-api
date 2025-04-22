import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/assignments", async (req, res) => {
  try {
    const newAssignment = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
      published_at: new Date(),
    };
    await connectionPool.query(
      `insert into assignments (user_id, title, content, category, created_at, updated_at, published_at, status)
      values ($1, $2, $3, $4, $5, $6, $7, $8)`, 
      [
        1,
        newAssignment.title,
        newAssignment.content,
        newAssignment.category,
        newAssignment.created_at,
        newAssignment.updated_at,
        newAssignment.published_at,
        newAssignment.status,
      ]
    );
    return res.status(201).json({ "message": "Created assignment sucessfully" });
  }
  catch { res.status(500).json({ "message": "Server could not create assignment because database connection" }) }
});

app.get("/assignments", async (req, res) => {
  try {
    const results = await connectionPool.query(`select * from assignments`);
    return res.status(200).json({ "data": results.rows });
  }
  catch { res.status(500).json({ "message": "Server could not read assignment because database connection" }) }
});

app.get("/assignments/:assignmentId", async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const results = await connectionPool.query(`select * from assignments where assignment_id = $1`, [assignmentId]);
    return res.status(200).json({ "data": results.rows[0] });
  }
  catch { res.status(500).json({ "message": "Server could not read assignment because database connection" }) }
});

app.put("/assignments/:assignmentId", async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const updatedAssignment = { ...req.body, updated_at: new Date() };
    await connectionPool.query(
      `update assignments set
        title = $2,
        content = $3,
        category = $4,
        length = $5,
        status = $6, 
        updated_at = $7
      where assignment_id = $1
      `,
      [
        assignmentId,
        updatedAssignment.title,
        updatedAssignment.content,
        updatedAssignment.category,
        updatedAssignment.length, 
        updatedAssignment.status,
        updatedAssignment.updated_at,
      ]
    );
    return res.status(200).json({ "message": "Updated assignment sucessfully" })
  }
  catch { res.status(500).json({ "message": "Server could not update assignment because database connection" }) }
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    await connectionPool.query(
      `delete from assignments where assignment_id = $1`, [assignmentId]
    );
    return res.status(200).json({ "message": "Deleted assignment sucessfully" })
  }
  catch { res.status(500).json({ "message": "Server could not delete assignment because database connection" }) }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
