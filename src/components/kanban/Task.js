// Task.js
import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index, onEditTaskContent, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(task.content);
  const [newDueDate, setNewDueDate] = useState(task.dueDate);
  const [newPriority, setNewPriority] = useState(task.priority);

  useEffect(() => {
    setNewContent(task.content);
    setNewDueDate(task.dueDate);
    setNewPriority(task.priority);
  }, [task.content, task.dueDate, task.priority]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEditTaskContent(task.id, newContent, newDueDate, newPriority);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-md shadow-md mb-2 ${snapshot.isDragging && 'opacity-70'}`}
        >
          {isEditing ? (
            <>
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="mb-2 border p-1"
              />
              <label className="block mb-1">Due Date:</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="mb-2 border p-1"
              />
              <label className="block mb-1">Priority:</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="mb-2 border p-1"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button onClick={handleSaveClick} className="p-1 bg-green-500 text-white rounded">
                Save
              </button>
            </>
          ) : (
            <>
              <div>{task.content}</div>
              <div>{`Due Date: ${task.dueDate}`}</div>
              <div>{`Priority: ${task.priority}`}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={handleEditClick} className="p-1 bg-blue-500 text-white rounded">
                  Edit
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
