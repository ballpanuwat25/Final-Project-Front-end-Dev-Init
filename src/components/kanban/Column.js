import React, { useState, useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { Pencil, Trash, Check, Plus, X } from 'lucide-react';

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
    const [isAdding, setIsAdding] = useState(false);
    const [newColumnName, setNewColumnName] = useState(column.title);
    const [newTaskContent, setNewTaskContent] = useState('');

    useEffect(() => {
        setNewColumnName(column.title);
    }, [column.title]);

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
            setIsAdding(false);
        }
    };

    const handleAddClick = () => {
        if (!isAdding) {
            setIsAdding(true);
        } else {
            setIsAdding(false);
        }
    };

    const handleCancelClick = () => {
        setIsAdding(false);
        setNewTaskContent('');
    };

    return (
        <div className="flex flex-col items-center p-4 bg-base-200 rounded">
            <div className="flex justify-between items-center mb-4 w-full">
                {isEditing ? (
                    <div className='flex items-center gap-2 justify-between w-full'>
                        <input
                            type="text"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            className="input input-bordered w-full input-sm input-primary"
                        />
                        <button onClick={handleSaveClick} className="btn btn-sm btn-circle btn-success btn-outline">
                            <Check size={16} />
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center gap-2 justify-between w-full'>
                        <h2 className="text-xl font-semibold">{column.title}</h2>
                        <div className="flex gap-2">
                            <button onClick={handleEditClick} className="btn btn-sm btn-circle btn-primary btn-outline">
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => onDeleteColumn(column.id)}
                                className="btn btn-sm btn-circle btn-secondary btn-outline"
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex flex-col flex-1 min-w-72`}
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

            <div className="mt-4 flex flex-col items-center gap-2 w-full">
                {isAdding ? (
                    <div className='flex flex-col gap-2 w-full'>
                        <input
                            type="text"
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
                            placeholder="New Task"
                            className="input input-bordered w-full input-primary"
                        />
                        <div className='flex flex-row gap-2 w-full'>
                            <div className='w-full'>
                                <button onClick={handleAddTaskClick} className="btn w-full">
                                    <Check size={16} />
                                </button>
                            </div>
                            <div className='w-full'>
                                <button onClick={handleCancelClick} className="btn w-full">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={handleAddClick} className="btn w-full">
                        <Plus size={16} /> Add Task
                    </button>
                )}
            </div>
        </div>
    );
};

export default Column;