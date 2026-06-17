import "./App.css";
import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task === "") return;

    setTasks([...tasks, task]);
    setTask("");
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

return (
  <div className="container">
    <h1>My To-Do List</h1>

    <input
      type="text"
      placeholder="Enter Task"
      value={task}
      onChange={(e) => setTask(e.target.value)}
    />

    <button onClick={addTask}>Add</button>

    <ul>
      {tasks.map((task, index) => (
        <li key={index}>
          {task}
          <button onClick={() => deleteTask(index)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  </div>
);
}

export default App;