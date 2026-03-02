const TaskCard = ({ task, onDelete, onEdit, onStatusChange }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4 hover:shadow-xl transition">
      <h3 className="font-medium text-white">{task.name}</h3>

      <div className="flex gap-2 mt-3 text-xs">
        {task.status !== "ToDo" && (
          <button
            onClick={() => onStatusChange(task, "ToDo")}
            className="bg-gray-600 px-2 py-1 rounded"
          >
            ToDo
          </button>
        )}

        {task.status !== "Doing" && (
          <button
            onClick={() => onStatusChange(task, "Doing")}
            className="bg-yellow-600 px-2 py-1 rounded"
          >
            Doing
          </button>
        )}

        {task.status !== "Done" && (
          <button
            onClick={() => onStatusChange(task, "Done")}
            className="bg-green-600 px-2 py-1 rounded"
          >
            Done
          </button>
        )}
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <button onClick={() => onEdit(task)} className="text-blue-400">
          Edit
        </button>

        <button onClick={() => onDelete(task.taskId)} className="text-red-400">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
