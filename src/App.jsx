import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showFinished, setShowFinished] = useState(true);
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

  const handleCheckbox = async (e) => {
    let id = e.target.name;
    let index = todos.findIndex((i) => {
      return i.id === id;
    });
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    try {
      const response = await fetch(`http://localhost:3000/updateCheck/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      const result = await response.json();
      console.log("Yes", result.message);
    } catch (err) {
      console.log("Error updating Todo ", err);
    }
  };

  const handleUpdate = async (id, newDes) => {
    let newTodo = newDes;
    try {
      const response = await fetch(`http://localhost:3000/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ des: newDes })
      });
      const result = await response.json();
      console.log("Yes, ", result.message);
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, des: newDes } : todo))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      let newTodos = todos.filter((i) => {
        return i.id !== id;
      });
      setTodos(newTodos);
      const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const result = await response.json();
      console.log("Yes, ", result.message);
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="mx-3 container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2">
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
              className="bg-violet-900 text-white px-4 py-1 rounded cursor-pointer"
            >
              Save
            </button>
          </form>
        </div>
        <div className="todos">
          <input
            type="checkbox"
            name=""
            checked={showFinished}
            onChange={() => setShowFinished(!showFinished)}
          />
          Show Finished
          {todos.length == 0 && (
            <div className="font-xl italic m-5">No Todos to show </div>
          )}
          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div key={item.id} className="flex justify-between mx-1 my-2">
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      onChange={handleCheckbox}
                      name={item.id}
                      checked={item.isCompleted}
                    />
                    <div className={item.isCompleted ? "line-through" : ""}>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          defaultValue={item.des}
                          onBlur={(e) => handleUpdate(item.id, e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span>{item.des}</span>
                      )}
                    </div>
                  </div>
                  <div className="buttons flex h-full ">
                    <button
                      className="bg-violet-900 cursor-pointer px-3 py-1 mx-2 text-sm font-bold rounded-md hover:bg-violet-950 text-white"
                      onClick={() => {
                        setEditingId(item.id);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-violet-900 cursor-pointer px-3 py-1 mx-2 text-sm font-bold rounded-md hover:bg-violet-950 text-white"
                      onClick={(e) => {
                        handleDelete(item.id);
                      }}
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}
