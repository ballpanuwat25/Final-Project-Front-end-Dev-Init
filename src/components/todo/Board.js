// Board.js
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import Columns from './Columns';

const Board = () => {
    const initialData = {
        tasks: {
            task1: { id: 'task1', content: 'Task 1' },
            task2: { id: 'task2', content: 'Task 2' },
            // Add more tasks as needed
        },
        columns: {
            column1: {
                id: 'column1',
                title: 'To Do',
                taskIds: ['task1', 'task2'],
            },
            column2: {
                id: 'column2',
                title: 'In Progress',
                taskIds: [],
            },
            // Add more columns as needed
        },
        columnOrder: ['column1', 'column2'],
    };

    const [data, setData] = useState(initialData);

    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return; // Dropped outside of the list

        if (type === 'column') {
            const newColumnOrder = Array.from(data.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            const newData = {
                ...data,
                columnOrder: newColumnOrder,
            };

            setData(newData);
            return;
        }

        const startColumn = data.columns[source.droppableId];
        const endColumn = data.columns[destination.droppableId];

        if (startColumn === endColumn) {
            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...startColumn,
                taskIds: newTaskIds,
            };

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn,
                },
            };

            setData(newData);
        } else {
            const startTaskIds = Array.from(startColumn.taskIds);
            startTaskIds.splice(source.index, 1);
            const newStartColumn = {
                ...startColumn,
                taskIds: startTaskIds,
            };

            const endTaskIds = Array.from(endColumn.taskIds);
            endTaskIds.splice(destination.index, 0, draggableId);
            const newEndColumn = {
                ...endColumn,
                taskIds: endTaskIds,
            };

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newStartColumn.id]: newStartColumn,
                    [newEndColumn.id]: newEndColumn,
                },
            };

            setData(newData);
        }
    };

    const addNewColumn = () => {
        const newColumnId = `column${Object.keys(data.columns).length + 1}`;

        const newColumn = {
            id: newColumnId,
            title: `New Column ${Object.keys(data.columns).length + 1}`,
            taskIds: [],
        };

        const newData = {
            ...data,
            columns: {
                ...data.columns,
                [newColumn.id]: newColumn,
            },
            columnOrder: [...data.columnOrder, newColumn.id],
        };

        setData(newData);
    };

    const deleteColumn = (columnId) => {
        const newColumns = { ...data.columns };
        delete newColumns[columnId];

        const newColumnOrder = data.columnOrder.filter((id) => id !== columnId);

        const newData = {
            ...data,
            columns: newColumns,
            columnOrder: newColumnOrder,
        };

        setData(newData);
    };

    const editColumnName = (columnId, newName) => {
        const newColumns = {
            ...data.columns,
            [columnId]: {
                ...data.columns[columnId],
                title: newName,
            },
        };

        const newData = {
            ...data,
            columns: newColumns,
        };

        setData(newData);
    };

    const addNewTask = (columnId, content) => {
        const newTaskId = `task${Object.keys(data.tasks).length + 1}`;

        const newTask = {
            id: newTaskId,
            content: content || `New Task ${Object.keys(data.tasks).length + 1}`,
        };

        const newColumns = {
            ...data.columns,
            [columnId]: {
                ...data.columns[columnId],
                taskIds: [...data.columns[columnId].taskIds, newTaskId],
            },
        };

        const newTasks = {
            ...data.tasks,
            [newTaskId]: newTask,
        };

        const newData = {
            ...data,
            columns: newColumns,
            tasks: newTasks,
        };

        setData(newData);
    };

    const editTaskContent = (taskId, newContent) => {
        const newTasks = {
            ...data.tasks,
            [taskId]: {
                ...data.tasks[taskId],
                content: newContent,
            },
        };

        const newData = {
            ...data,
            tasks: newTasks,
        };

        setData(newData);
    };

    const deleteTask = (taskId, columnId) => {
        const newColumns = {
            ...data.columns,
            [columnId]: {
                ...data.columns[columnId],
                taskIds: data.columns[columnId].taskIds.filter((id) => id !== taskId),
            },
        };

        const newTasks = { ...data.tasks };
        delete newTasks[taskId];

        const newData = {
            ...data,
            columns: newColumns,
            tasks: newTasks,
        };

        setData(newData);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col gap-4">
                <button onClick={addNewColumn} className="p-2 bg-blue-500 text-white rounded-md">
                    Add New Column
                </button>
                <>
                    <Columns
                        columns={data.columns}
                        tasks={data.tasks}
                        columnOrder={data.columnOrder}
                        onDeleteColumn={deleteColumn}
                        onEditColumnName={editColumnName}
                        onAddNewTask={addNewTask}
                        onEditTaskContent={editTaskContent}
                        onDeleteTask={deleteTask}
                    />
                </>
            </div>
        </DragDropContext>
    );
};

export default Board;
