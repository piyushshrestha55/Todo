import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [todos, setTodos] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await fetch("http://localhost:3000/sendData", {
          method: "GET"
        });
        let result = await res.json();
        setTodos(result); // assuming result is already an array
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const saveToDB = async (newTodo) => {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo)
      });

      const result = await response.json();
      console.log("Saved to backend:", result.message);

      setTodos([...todos, result.todo]);
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const onSubmit = async (data) => {
    const newTodo = {
      id: uuidv4(),
      des: data.Todo,
      isCompleted: false
    };

    await saveToDB(newTodo);
  };

  return (
    <>
      <NavBar />
      <div className="container w-[50%] mx-auto h-[90vh] bg-violet-200 my-3 p-5 rounded-2xl">
        <div className="inputs">
          <h1 className="font-bold text-2xl mx-[45%] my-3">iTasks</h1>
          <form className="flex gap-2" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              className="bg-white px-1 w-1/2"
              {...register("Todo", {
                required: { value: true, message: "Please enter your Todos" }
              })}
            />
            {errors.Todo && (
              <span className="text-red-600">{errors.Todo.message}</span>
            )}
            <button
              type="submit"
              className="bg-violet-500 text-white px-4 py-1 rounded cursor-pointer"
            >
              Save
            </button>
          </form>
        </div>
        <div className="todos">
          {todos.map((item) => {
            return (
              <>
                <div key={item._id}>
                  {" "}
                  <span>{item.des}</span>
                  <span>{item.isCompleted ? "✅" : "❌"}</span>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
