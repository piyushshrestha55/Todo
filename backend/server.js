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
  console.log(req.body);
  try {
    let todo = new Todo(req.body); //req.body === to new document todo passed from frontend as newTodo
    await todo.save(); //the todo is saved as document in todoDB
    res.json({ message: "Todo saved!", todo }); // the res is passed or fetched to the frontend as a json
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(port, () => {
  console.log(`The app is listening at the port ${port}`);
});
