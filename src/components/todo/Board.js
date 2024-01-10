import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Columns from './Columns';

const Board = () => {
    const [columns, setColumns] = useState([
        { id: '1', title: 'To Do' },
        { id: '2', title: 'In Progress' },
        { id: '3', title: 'Done' },
    ]);

    const [tasks, setTasks] = useState([
        { id: 'task-1', title: 'Task 1', columnId: '1' },
        { id: 'task-2', title: 'Task 2', columnId: '1' },
        { id: 'task-3', title: 'Task 3', columnId: '2' },
    ]);

    const addTask = (columnId) => {
        const newTask = { id: `task-${tasks.length + 1}`, title: 'New Task', columnId };
        setTasks([...tasks, newTask]);
    };

    const addColumn = () => {
        const newColumn = { id: `${columns.length + 1}`, title: 'New Column' };
        setColumns([...columns, newColumn]);
    };

    const deleteColumn = (columnId) => {
        setColumns(columns.filter((column) => column.id !== columnId));
    };

    const editColumnName = (columnId, newName) => {
        setColumns(
            columns.map((column) => (column.id === columnId ? { ...column, title: newName } : column))
        );
    };

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            return; // Dropped outside of a valid droppable area
        }

        const movedTask = tasks.find((task) => task.id === draggableId);

        // Move within the same column
        if (source.droppableId === destination.droppableId) {
            const movedTaskIndex = tasks.findIndex((task) => task.id === draggableId);
            const updatedTasks = [...tasks];
            updatedTasks.splice(movedTaskIndex, 1);
            updatedTasks.splice(destination.index, 0, movedTask);
            setTasks(updatedTasks);
        } else {
            // Move to a different column
            movedTask.columnId = destination.droppableId;
            setTasks([...tasks.filter((task) => task.id !== draggableId), movedTask]);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="COLUMN">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col">
                        <button onClick={addColumn} className="text-blue-500 text-left">
                            Add Column
                        </button>
                        <div className="flex">
                            {columns.map((column, index) => (
                                <Columns
                                    key={column.id}
                                    column={column}
                                    tasks={tasks.filter((task) => task.columnId === column.id)}
                                    onAddTask={() => addTask(column.id)}
                                    onDeleteColumn={() => deleteColumn(column.id)}
                                    onEditColumnName={(newName) => editColumnName(column.id, newName)}
                                    index={index}
                                />
                            ))}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Board;
