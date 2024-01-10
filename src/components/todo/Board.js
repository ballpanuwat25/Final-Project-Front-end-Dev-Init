import React, { useState } from 'react';
import Columns from './Columns';

const Board = () => {
    const [columns, setColumns] = useState([
        { id: 1, title: 'To Do' },
        { id: 2, title: 'In Progress' },
        { id: 3, title: 'Done' },
    ]);

    const [tasks, setTasks] = useState([
        { id: 1, title: 'Task 1', columnId: 1 },
        { id: 2, title: 'Task 2', columnId: 1 },
        { id: 3, title: 'Task 3', columnId: 2 },
    ]);

    const addTask = (columnId) => {
        const newTask = { id: tasks.length + 1, title: `New Task`, columnId };
        setTasks([...tasks, newTask]);
    };

    const addColumn = () => {
        const newColumn = { id: columns.length + 1, title: `New Column` };
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

    const moveTask = (taskId, direction) => {
        const taskToMove = tasks.find((task) => task.id === taskId);
        const columnIndex = columns.findIndex((column) => column.id === taskToMove.columnId);
        const newColumnIndex =
            direction === 'left' ? columnIndex - 1 : direction === 'right' ? columnIndex + 1 : columnIndex;

        if (newColumnIndex >= 0 && newColumnIndex < columns.length) {
            setTasks(
                tasks.map((task) =>
                    task.id === taskId ? { ...task, columnId: columns[newColumnIndex].id } : task
                )
            );
        }
    };

    return (
        <div className="flex flex-col">
            <button onClick={addColumn} className="text-blue-500 text-left">Add Column</button>

            <div className='flex'>
                {columns.map((column) => (
                    <Columns
                        key={column.id}
                        column={column}
                        tasks={tasks}
                        onAddTask={addTask}
                        onDeleteColumn={deleteColumn}
                        onEditColumnName={editColumnName}
                        onMoveTask={moveTask}
                    />
                ))}
            </div>
        </div>
    );
};

export default Board;