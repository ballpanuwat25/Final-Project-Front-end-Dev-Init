import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import Calendar from '../Calendar';
import SelectOption from '../SelectOption';
import { formatDate } from '../../utils/dateUtils';

import { ChevronsDown, ChevronsRight, ChevronsUp } from 'lucide-react';

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

  const handleOptionChange = (value) => {
    setNewPriority(value);
  };

  const handleSelectedDayChange = (day) => {
    setNewDueDate(day);
  };

  const checkPriorityClass = (priority) => {
    if (priority === 'Low') {
      return 'badge badge-success';
    } else if (priority === 'Medium') {
      return 'badge badge-warning';
    } else if (priority === 'High') {
      return 'badge badge-error';
    }
  };

  const checkPriorityIcon = (priority) => {
    if (priority === 'Low') {
      return <ChevronsDown size={20} />;
    } else if (priority === 'Medium') {
      return <ChevronsRight size={20} />;
    } else if (priority === 'High') {
      return <ChevronsUp size={20} />;
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-base-100 p-4 rounded-md shadow-md mb-4 ${snapshot.isDragging && 'opacity-70'}`}
        >
          {isEditing ? (
            <div className='flex flex-col gap-2'>
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="input input-primary w-full"
              />

              <div className='flex w-full gap-2'>
                <Calendar onSelectedDayChange={handleSelectedDayChange} />
                <SelectOption onSelectOptionChange={handleOptionChange} />
              </div>

              <button onClick={handleSaveClick} className="btn w-full btn-neutral">
                Save
              </button>
            </div>
          ) : (
            <>
              <div className='inline-flex justify-between w-full mb-2'>
                <p className='font-bold'>{task.content}</p>
                <div className={`${checkPriorityClass(task.priority)}`}>{checkPriorityIcon(task.priority)}</div>
              </div>

              <p className='text-sm mb-2'>Deadline · {formatDate(task.dueDate)}</p>

              <div className="divider my-2" />

              <div className="flex gap-2 mt-2 w-full">
                <div className='w-full'>
                  <button onClick={handleEditClick} className="btn btn-sm w-full btn-outline btn-primary">
                    Edit
                  </button>
                </div>
                <div className='w-full'>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="btn btn-sm w-full btn-error btn-outline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
