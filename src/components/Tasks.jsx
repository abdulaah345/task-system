import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContextProvider";
import TaskColumn from "./TaskColumn";
import Modal from "./Model";

const API = "http://tasksystems.runasp.net/api/Tasks";

const Tasks = () => {
  const { token } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ Name: "" });
  const [editingTask, setEditingTask] = useState(null);

  // ================= FETCH =================
  const fetchTasks = async () => {
    console.log("🚀 Fetching Tasks...");
    try {
      const res = await axios.get(`${API}/my-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Fetched Data:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.log("❌ Fetch Error:", err.response?.data);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  // ================= ADD =================
  const handleAddTask = async () => {
    console.log("➕ Adding Task:", newTask);
    if (!newTask.Name.trim()) return;

    try {
      const res = await axios.post(
        `${API}/task`,
        { Name: newTask.Name },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("✅ Added:", res.data);

      setShowModal(false);
      setNewTask({ Name: "" });
      fetchTasks();
    } catch (err) {
      console.log("❌ Add Error:", err.response?.data);
      alert("Add failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    console.log("🗑 Deleting:", id);

    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Deleted:", id);
      setTasks((prev) => prev.filter((t) => t.taskId !== id));
    } catch (err) {
      console.log("❌ Delete Error:", err.response?.data);
      alert("Delete failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = async () => {
    const statusMap = {
      ToDo: 0,
      Doing: 1,
      Done: 2,
    };

    const statusNumber =
      typeof editingTask.status === "number"
        ? editingTask.status
        : statusMap[editingTask.status];

    try {
      const res = await axios.put(
        `${API}/${editingTask.taskId}`,
        {
          Name: editingTask.name,
          Status: statusNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("✅ Edited:", res.data);

      // 👇 هنا السحر
      setTasks((prev) =>
        prev.map((t) => (t.taskId === editingTask.taskId ? res.data : t)),
      );

      setEditingTask(null);
    } catch (err) {
      console.log("❌ Edit Error:", err.response?.data);
    }
  };

  // ================= CHANGE STATUS =================
  const updateStatus = async (task, newStatusString) => {
    console.log("🔄 Updating Status");
    console.log("Task:", task);
    console.log("New Status String:", newStatusString);

    const statusMap = {
      ToDo: 0,
      Doing: 1,
      Done: 2,
    };

    const statusNumber = statusMap[newStatusString];
    console.log("Mapped Status Number:", statusNumber);

    // ✅ Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.taskId === task.taskId ? { ...t, status: newStatusString } : t,
      ),
    );

    try {
      const res = await axios.put(
        `${API}/${task.taskId}`,
        {
          Name: task.name,
          Status: statusNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("✅ Status Updated:", res.data);
    } catch (err) {
      console.log("❌ Status Error:", err.response?.data);
      alert("Status update failed");

      // Rollback لو حصل خطأ
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.taskId === task.taskId ? { ...t, status: task.status } : t,
        ),
      );
    }
  };

  // ================= NORMALIZE =================
  const normalizeStatus = (status) => {
    console.log("🔎 Normalizing:", status);
    if (status === 0 || status === "ToDo") return "ToDo";
    if (status === 1 || status === "Doing") return "Doing";
    if (status === 2 || status === "Done") return "Done";
    if (["ToDo", "Doing", "Done"].includes(status)) return status;
    return status;
  };

  // ================= FILTER =================
  const todoTasks = tasks.filter((t) => normalizeStatus(t.status) === "ToDo");
  const doingTasks = tasks.filter((t) => normalizeStatus(t.status) === "Doing");
  const doneTasks = tasks.filter((t) => normalizeStatus(t.status) === "Done");

  console.log("📌 ToDo:", todoTasks);
  console.log("📌 Doing:", doingTasks);
  console.log("📌 Done:", doneTasks);

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
