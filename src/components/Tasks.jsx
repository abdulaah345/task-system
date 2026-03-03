import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import TaskColumn from "./TaskColumn";
import Modal from "./Model";

const Tasks = () => {
  const { api, token } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ Name: "" });
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/Tasks/my-tasks");
      setTasks(res.data);
    } catch (err) {
      console.log("Fetch Error:", err.response?.data);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    if (!newTask.Name.trim()) return;

    try {
      await api.post("/Tasks/task", { Name: newTask.Name });
      setShowModal(false);
      setNewTask({ Name: "" });
      fetchTasks();
    } catch (err) {
      console.log("Add Error:", err.response?.data);
      alert("Add failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/Tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.taskId !== id));
    } catch (err) {
      console.log("Delete Error:", err.response?.data);
      alert("Delete failed");
    }
  };

  const handleEdit = async () => {
    const statusMap = { ToDo: 0, Doing: 1, Done: 2 };

    const statusNumber =
      typeof editingTask.status === "number"
        ? editingTask.status
        : statusMap[editingTask.status];

    try {
      const res = await api.put(`/Tasks/${editingTask.taskId}`, {
        Name: editingTask.name,
        Status: statusNumber,
      });

      setTasks((prev) =>
        prev.map((t) => (t.taskId === editingTask.taskId ? res.data : t)),
      );

      setEditingTask(null);
    } catch (err) {
      console.log("Edit Error:", err.response?.data);
    }
  };

  const updateStatus = async (task, newStatusString) => {
    const statusMap = { ToDo: 0, Doing: 1, Done: 2 };
    const statusNumber = statusMap[newStatusString];

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.taskId === task.taskId ? { ...t, status: newStatusString } : t,
      ),
    );

    try {
      await api.put(`/Tasks/${task.taskId}`, {
        Name: task.name,
        Status: statusNumber,
      });
    } catch (err) {
      alert("Status update failed");

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.taskId === task.taskId ? { ...t, status: task.status } : t,
        ),
      );
    }
  };

  const normalizeStatus = (status) => {
    if (status === 0 || status === "ToDo") return "ToDo";
    if (status === 1 || status === "Doing") return "Doing";
    if (status === 2 || status === "Done") return "Done";
    return status;
  };

  const todoTasks = tasks.filter((t) => normalizeStatus(t.status) === "ToDo");
  const doingTasks = tasks.filter((t) => normalizeStatus(t.status) === "Doing");
  const doneTasks = tasks.filter((t) => normalizeStatus(t.status) === "Done");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Tasks</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Task
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          onDelete={handleDelete}
          onEdit={(task) => setEditingTask(task)}
          onStatusChange={updateStatus}
        />
        <TaskColumn
          title="Doing"
          tasks={doingTasks}
          onDelete={handleDelete}
          onEdit={(task) => setEditingTask(task)}
          onStatusChange={updateStatus}
        />
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onDelete={handleDelete}
          onEdit={(task) => setEditingTask(task)}
          onStatusChange={updateStatus}
        />
      </div>

      {showModal && (
        <Modal
          title="Add Task"
          value={newTask.Name}
          onChange={(e) => setNewTask({ ...newTask, Name: e.target.value })}
          onClose={() => setShowModal(false)}
          onSave={handleAddTask}
        />
      )}

      {editingTask && (
        <Modal
          title="Edit Task"
          value={editingTask.name}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              name: e.target.value,
            })
          }
          onClose={() => setEditingTask(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
};

export default Tasks;
