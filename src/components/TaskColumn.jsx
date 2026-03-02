import React from "react";
import TaskCard from "./TaskCard";

const TaskColumn = ({
  title,
  tasks,
  status,
  onDelete,
  onEdit,
  onStatusChange,
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.taskId}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskColumn;
