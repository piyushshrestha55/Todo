import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  des: String,
  isCompleted: Boolean
});

const Todo = mongoose.model("Todo", TodoSchema);
export default Todo;
