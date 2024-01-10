import React, { useState } from 'react';
import Tasks from './Tasks';

const Columns = ({ column, tasks, onAddTask, onDeleteColumn, onEditColumnName, onMoveTask, onEditTask, onDeleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newColumnName, setNewColumnName] = useState(column.title);

    const handleEditStart = () => {
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setNewColumnName(column.title);
    };

    const handleEditSave = () => {
        onEditColumnName(column.id, newColumnName);
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-200 p-4 rounded-md shadow-md m-2">
            <div className="flex justify-between items-center mb-2">
                {isEditing ? (
                    <input
                        type="text"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        className="text-lg font-semibold p-1 border border-gray-400 rounded"
                    />
                ) : (
                    <h2 className="text-lg font-semibold">{column.title}</h2>
                )}
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleEditSave} className="text-green-500">Save</button>
                            <button onClick={handleEditCancel} className="text-red-500">Cancel</button>
                        </>
                    ) : (
                        <button onClick={handleEditStart} className="text-blue-500">Edit Column Name</button>
                    )}
                    <button onClick={() => onAddTask(column.id)} className="text-blue-500">Add Task</button>
                    <button onClick={() => onDeleteColumn(column.id)} className="text-red-500">Delete Column</button>
                </div>
            </div>
            <div>
                {tasks
                    .filter((task) => task.columnId === column.id)
                    .map((task) => (
                        <Tasks
                            key={task.id}
                            task={task}
                            onMoveTask={onMoveTask}
                            onEditTask={onEditTask}
                            onDeleteTask={onDeleteTask}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Columns;