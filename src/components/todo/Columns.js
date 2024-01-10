import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Tasks from './Tasks';

const Columns = ({
    column,
    tasks,
    onAddTask,
    onDeleteColumn,
    onEditColumnName,
    onEditTask,
    onDeleteTask,
    index,
}) => {

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
        <Draggable draggableId={column.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="bg-gray-200 p-4 rounded-md shadow-md m-2"
                >
                    <div className="flex justify-between items-center mb-2">

                        <div className='flex flex-col'>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    className="text-lg font-semibold p-1 border border-gray-400 rounded"
                                />
                            ) : (
                                <h2 className="text-lg font-semibold" {...provided.dragHandleProps}>
                                    {column.title}
                                </h2>
                            )}

                            <div className="flex space-x-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleEditSave} className="text-green-500">
                                            Save
                                        </button>
                                        <button onClick={handleEditCancel} className="text-red-500">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={handleEditStart} className="text-blue-500">
                                        Edit Column Name
                                    </button>
                                )}
                                <button onClick={() => onAddTask(column.id)} className="text-blue-500">
                                    Add Task
                                </button>
                                <button onClick={() => onDeleteColumn(column.id)} className="text-red-500">
                                    Delete Column
                                </button>
                            </div>
                        </div>
                    </div>
                    <Droppable droppableId={column.id} type="TASK">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {tasks
                                    .filter((task) => task.columnId === column.id)
                                    .map((task, index) => (
                                        <Tasks
                                            key={task.id}
                                            task={task}
                                            index={index}
                                            onEditTask={onEditTask}
                                            onDeleteTask={onDeleteTask}
                                        />
                                    ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
};

export default Columns;
