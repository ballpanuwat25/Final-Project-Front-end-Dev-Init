// Task.js
import React, { useState } from 'react';

const Task = ({ task, onMoveTask, onEditTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState(task.title);

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setNewTaskTitle(task.title);
  };

  const handleEditSave = () => {
    onEditTask(task.id, newTaskTitle);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-2 rounded-md shadow-md mb-2">
      {isEditing ? (
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="mb-2 p-1 border border-gray-400 rounded"
        />
      ) : (
        <p>{task.title}</p>
      )}
      <div className="flex justify-between mt-2">
        {isEditing ? (
          <>
            <button onClick={handleEditSave} className="text-green-500">Save</button>
            <button onClick={handleEditCancel} className="text-red-500">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => onMoveTask(task.id, 'left')} className="text-blue-500">Move Left</button>
            <button onClick={() => onMoveTask(task.id, 'right')} className="text-blue-500">Move Right</button>
            <button onClick={handleEditStart} className="text-blue-500">Edit Task</button>
            <button onClick={() => onDeleteTask(task.id)} className="text-red-500">Delete Task</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Task;
