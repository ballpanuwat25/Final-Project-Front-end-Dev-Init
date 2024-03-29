import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
} from 'date-fns'

import Notification from '../components/Notification';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarCheck, NotebookPen, Clock4, Pencil, Trash, Check, Plus, Presentation } from 'lucide-react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Schedule() {
    const [meetings, setMeetings] = useState([])

    const [notificationStatus, setNotificationStatus] = useState(null);

    useEffect(() => {
        const savedNotification = JSON.parse(localStorage.getItem('notificationStatus'));
        setNotificationStatus(savedNotification);
    }, []);

    useEffect(() => {
        const savedMeetings = JSON.parse(localStorage.getItem('meetings')) || [];
        setMeetings(savedMeetings)
    }, [])

    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

    const days = eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
    })

    const previousMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    const selectedDayMeetings = meetings.filter((meeting) =>
        isSameDay(parseISO(meeting.meet_startDate), selectedDay)
    )

    const [newMeetingInput, setNewMeetingInput] = useState('');
    const [newMeetingStart, setNewMeetingStart] = useState('');
    const [newMeetingEnd, setNewMeetingEnd] = useState('');

    const addMeeting = () => {
        if (newMeetingInput.trim() !== '') {
            const newMeeting = {
                meet_id: meetings.length + 1,
                meet_name: newMeetingInput,
                meet_startDate: selectedDay.toISOString(),
                meet_startTime: newMeetingStart,
                meet_endTime: newMeetingEnd,
                meet_readStatus: 'Unread',
            };

            setMeetings([...meetings, newMeeting]);

            setNewMeetingInput('');
            setNewMeetingStart('');
            setNewMeetingEnd('');

            localStorage.setItem('meetings', JSON.stringify([...meetings, newMeeting]));
            window.location.reload();
        }
    }

    const deleteMeeting = (meetingId) => {
        const updatedMeetings = meetings.filter((meeting) => meeting.meet_id !== meetingId);
        setMeetings(updatedMeetings);

        localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
        window.location.reload();
    }

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingMeetingId, setEditingMeetingId] = useState(null);

    const editMeeting = (meetingId) => {
        const meetingToEdit = meetings.find((meeting) => meeting.meet_id === meetingId);

        setNewMeetingInput(meetingToEdit.meet_name);
        setNewMeetingStart(meetingToEdit.meet_startTime);
        setNewMeetingEnd(meetingToEdit.meet_endTime);

        setIsEditMode(true);
        setEditingMeetingId(meetingId);
    }

    const updateMeeting = () => {
        if (newMeetingInput.trim() !== '') {
            const updatedMeetings = meetings.map((meeting) =>
                meeting.meet_id === editingMeetingId
                    ? {
                        ...meeting,
                        meet_name: newMeetingInput,
                        meet_startTime: newMeetingStart,
                        meet_endTime: newMeetingEnd,
                    }
                    : meeting
            );

            setMeetings(updatedMeetings);

            setNewMeetingInput('');
            setNewMeetingStart('');
            setNewMeetingEnd('');
            setIsEditMode(false);
            setEditingMeetingId(null);

            localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
            window.location.reload();
        }
    }

    return (
        <div className="flex h-screen">
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={notificationStatus} path={"/"} />
                <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={false} alert={false} path={"/todo"} />
                <SidebarItem icon={<CalendarCheck size={20} />} text="Schedule" active={true} alert={false} path={"/schedule"} />
                <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={false} alert={false} path={"/journal"} />
                <SidebarItem icon={<Presentation size={20} />} text="Kanban" active={false} alert={false} path={"/kanban"} />
            </Sidebar>

            <div className="flex-1 p-4 overflow-scroll">
                <div className="w-full">
                    <div className='w-full flex justify-between items-center'>
                        <h1 className='text-lg md:text-3xl font-bold'>Schedule 📅</h1>

                        <div className='hidden'>
                            <Notification />
                        </div>

                        <div className="flex items-center">
                            <h2 className="flex-auto font-semibold text-primary text-sm">
                                {format(firstDayCurrentMonth, 'MMMM yyyy')}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-primary"
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-primary"
                            >
                                <span className="sr-only">Next month</span>
                                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="divider my-2" />

                    <>
                        <div className="grid grid-cols-7 py-4 mb-3 text-base text-center text-neutral-content bg-neutral rounded-xl font-bold">
                            <div>S</div>
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                        </div>

                        <div className="grid grid-cols-7 mt-2 text-sm border rounded-xl overflow-hidden">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    className={classNames(
                                        dayIdx === 0 && colStartClasses[getDay(day)],
                                        'py-2 md:py-7 lg:py-11 border'
                                    )}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedDay(day);
                                            document.getElementById('schedule_modal').showModal()
                                        }}
                                        className={classNames(
                                            isEqual(day, selectedDay) && 'text-white',

                                            !isEqual(day, selectedDay) &&
                                            isToday(day) &&
                                            'text-primary',

                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-base-content',

                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            !isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-400',

                                            isEqual(day, selectedDay) && isToday(day) && 'bg-primary',

                                            isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            'bg-neutral text-neutral-content',

                                            !isEqual(day, selectedDay) && 'hover:bg-base-300',

                                            (isEqual(day, selectedDay) || isToday(day)) &&
                                            'font-bold',

                                            'mx-auto flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full md:text-base'
                                        )}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                                            {format(day, 'd')}
                                        </time>
                                    </button>

                                    <dialog id="schedule_modal" className="modal">
                                        <div className="modal-box">
                                            <div className="text-sm">
                                                <div className="flex flex-col mb-2 gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder='Add a meeting'
                                                        className="input input-bordered input-primary w-full"
                                                        value={newMeetingInput}
                                                        onChange={(e) => setNewMeetingInput(e.target.value)}
                                                    />

                                                    <div className="flex flex-row gap-2">
                                                        <input
                                                            type="time"
                                                            value={newMeetingStart}
                                                            onChange={(e) => setNewMeetingStart(e.target.value)}
                                                            className="input input-bordered input-primary w-full"
                                                        />

                                                        <input
                                                            type="time"
                                                            value={newMeetingEnd}
                                                            onChange={(e) => setNewMeetingEnd(e.target.value)}
                                                            className="input input-bordered input-primary w-full"
                                                        />
                                                    </div>

                                                    {isEditMode ? (
                                                        <button
                                                            type="button"
                                                            onClick={updateMeeting}
                                                            className="btn btn-primary"
                                                        >
                                                            <Check size={18} /> Update meeting
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={addMeeting}
                                                            className="btn btn-primary"
                                                        >
                                                            <Plus size={18} /> Add meeting
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="divider" />

                                                <div className='flex flex-col gap-4'>
                                                    {selectedDayMeetings.length > 0 ? (
                                                        selectedDayMeetings.map((meeting) => (
                                                            <Meeting
                                                                meeting={meeting}
                                                                key={meeting.meet_id}
                                                                onDelete={deleteMeeting}
                                                                onEdit={editMeeting}
                                                            />
                                                        ))
                                                    ) : (
                                                        <p>No meetings for today.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <form method="dialog" className="modal-backdrop">
                                            <button>close</button>
                                        </form>
                                    </dialog>

                                    <div className="w-1 h-1 mx-auto mt-1">
                                        {meetings.some((meeting) =>
                                            isSameDay(parseISO(meeting.meet_startDate), day)
                                        ) && (
                                                <div className="w-1 h-1 rounded-full bg-accent"></div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>

                </div>
            </div>
        </div >
    )
}

const Meeting = ({ meeting, onDelete, onEdit }) => {
    return (
        <div className="flex items-center px-4 py-2 gap-2 rounded-xl bg-neutral text-neutral-content">
            <div className="flex-auto">
                <p className="font-bold">{meeting.meet_name}</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs">
                    <Clock4 size={14} /> {meeting.meet_startTime} - {meeting.meet_endTime}
                </p>
            </div>

            <div className='inline-flex gap-2'>
                <button
                    className="btn btn-sm btn-circle"
                    onClick={() => onEdit(meeting.meet_id)}
                >
                    <Pencil size={16} />
                </button>

                <button
                    className="btn btn-sm btn-circle"
                    onClick={() => onDelete(meeting.meet_id)}
                >
                    <Trash size={16} />
                </button>
            </div>
        </div>
    )
}

// Array mapping days to their corresponding column start classes
const colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]