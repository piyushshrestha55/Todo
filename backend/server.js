import Express from "express";
import mongoose from "mongoose";
import Todo from "./model/todo.js";
import cors from "cors";
import bodyParser from "body-parser";

await mongoose
  .connect("mongodb://localhost:27017/todo")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const app = Express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
// app.use(Express.json());

app.get("/sendData", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/todos", async (req, res) => {
  try {
    let todo = new Todo(req.body); //req.body === to new document todo passed from frontend as newTodo
    await todo.save(); //the todo is saved as document in todoDB
    res.json({ message: "Todo saved!", todo }); // the res is passed or fetched to the frontend as a json
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/update/:id", async (req, res) => {
  console.log(req.body);
  let todo = req.body;
  try {
    const result = await Todo.updateOne(
      { id: req.params.id },
      { $set: { des: todo.des } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Todo not found or unchanged" });
    }
    res.json({ message: "Todo updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    const result = await Todo.deleteOne({ id: req.params.id });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Todo not found or unchanged" });
    }
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/updateCheck/:id", async (req, res) => {
  try {
    const todo = await Todo.findOne({ id: req.params.id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.isCompleted = !todo.isCompleted;
    await todo.save();

    res.json({ message: "Todo updated", todo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`The app is listening at the port ${port}`);
});
