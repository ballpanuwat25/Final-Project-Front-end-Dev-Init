// Columns.js
import React from 'react';
import Column from './Column';

const Columns = ({
  columns,
  tasks,
  columnOrder,
  onDeleteColumn,
  onEditColumnName,
  onAddNewTask,
  onEditTaskContent,
  onDeleteTask,
}) => {

  return (
    <div className='flex flex-row'>
      {columnOrder.map((columnId, index) => {
        const column = columns[columnId];
        const columnTasks = column.taskIds.map((taskId) => tasks[taskId]);

        return (
          <Column
            key={column.id}
            column={column}
            tasks={columnTasks}
            onDeleteColumn={onDeleteColumn}
            onEditColumnName={onEditColumnName}
            onAddNewTask={onAddNewTask}
            onEditTaskContent={onEditTaskContent}
            onDeleteTask={onDeleteTask}
          />
        );
      })}
    </div>
  );
};

export default Columns;
