// Column.js
import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import Task from './Task';

const Column = ({
    column,
    tasks,
    onDeleteColumn,
    onEditColumnName,
    onAddNewTask,
    onEditTaskContent,
    onDeleteTask,
}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [newColumnName, setNewColumnName] = useState(column.title);
    const [newTaskContent, setNewTaskContent] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        onEditColumnName(column.id, newColumnName);
        setIsEditing(false);
    };

    const handleAddTaskClick = () => {
        if (newTaskContent.trim() !== '') {
            onAddNewTask(column.id, newTaskContent);
            setNewTaskContent('');
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex justify-between items-center mb-2">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            className="mr-2 border p-1"
                        />
                        <button onClick={handleSaveClick} className="p-1 bg-green-500 text-white rounded">
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
                        <div className="flex gap-2">
                            <button onClick={handleEditClick} className="p-1 bg-blue-500 text-white rounded">
                                Edit
                            </button>
                            <button
                                onClick={() => onDeleteColumn(column.id)}
                                className="p-1 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-w-72 bg-white rounded p-4`}
                    >
                        {tasks.map((task, index) => (
                            <Task
                                key={task.id}
                                task={task}
                                index={index}
                                onEditTaskContent={onEditTaskContent}
                                onDeleteTask={() => onDeleteTask(task.id, column.id)}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <div className="mt-2">
                <input
                    type="text"
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    placeholder="New Task"
                    className="border p-1"
                />
                <button onClick={handleAddTaskClick} className="p-1 bg-blue-500 text-white rounded">
                    Add Task
                </button>
            </div>
        </div>
    );
};

export default Column;