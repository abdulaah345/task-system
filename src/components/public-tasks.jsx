import { useEffect, useState } from "react";
import axios from "axios";

export default function PublicTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("https://systemtodo.runasp.net/api/Auth/public-tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Public Tasks</h1>
      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
}
