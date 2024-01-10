// Task.js
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index, onEditTaskContent, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(task.content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEditTaskContent(task.id, newContent);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-md shadow-md mb-2 ${snapshot.isDragging && 'bg-red-200'}`}
        >
          {isEditing ? (
            <>
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="mb-2 border p-1"
              />
              <button onClick={handleSaveClick} className="p-1 bg-green-500 text-white rounded">
                Save
              </button>
            </>
          ) : (
            <>
              {task.content}
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
