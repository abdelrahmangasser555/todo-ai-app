import React from "react";
import { useEffect, useState } from "react";
import "./styling.css";
export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const todo = { title: newTodo, completed: false };
    fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ id }) => {
        setTodos([...todos, { ...todo, id }]);
        setNewTodo("");
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleComplete = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: !todo.completed }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setTodos(
          todos.map((todo) => {
            if (todo.id === id) {
              return { ...todo, completed: !todo.completed };
            }
            return todo;
          })
        );
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleComplete(todo.id)}
            />
            <span
              style={{ textDecoration: todo.completed ? "line-through" : "" }}
            >
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
