import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
    add, //Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
    eachDayOfInterval, //Return the array of dates within the specified time interval.
    endOfMonth, //Return the end of a month for the given date. The result will be in the local timezone.
    format, //Return the formatted date string in the given format. The result may vary by locale.
    getDay, //Get the day of the week of the given date.
    isEqual, //Are the given dates equal?
    isSameDay, //Are the given dates in the same day (and year and month)?
    isSameMonth, //Are the given dates in the same month (and year)?
    isToday, //Is the given date today?
    parse, //Return the date parsed from string using the given format string.
    parseISO, //Parse the given string in ISO 8601 format and return an instance of Date.
    startOfToday, //Return the start of today.
} from 'date-fns'

import Sidebar, { SidebarItem } from '../components/Sidebar';
import { LayoutDashboard, ListTodo, CalendarDays, NotebookPen } from 'lucide-react';

// Utility function to concatenate CSS class details conditionally
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

// Calendar component
export default function Journals() {
    const [journals, setJournals] = useState([])

    useEffect(() => {
        const savedJournals = JSON.parse(localStorage.getItem('journals')) || [];
        setJournals(savedJournals)
    }, [])

    // Initial setup using React state
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

    // Generate an array of days for the current month
    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    })

    // Function to navigate to the previous month
    const previousMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    // Function to navigate to the next month
    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    // Filter journals for the selected day
    const selectedDayJournals = journals.filter((journal) =>
        isSameDay(parseISO(journal.startDate), selectedDay)
    )

    // State to manage the input for a new journal
    const [newJournalInput, setNewJournalInput] = useState('');
    const [dailyMood, setDailyMood] = useState('');

    // Function to add a new journal
    const addJournal = () => {
        if (newJournalInput.trim() !== '') {
            const newJournal = {
                id: journals.length + 1, // Generate a unique ID (you may need a more robust solution in a real app)
                detail: newJournalInput,
                mood: dailyMood,
                startDate: selectedDay.toISOString(), // Use the selected day
            };

            // Update the journals array with the new journal
            setJournals([...journals, newJournal]);

            // Clear the input field
            setNewJournalInput('');
            setDailyMood('');

            // Save the journals array to local storage
            localStorage.setItem('journals', JSON.stringify([...journals, newJournal]));
        }
    }

    // Function to delete a journal
    const deleteJournal = (journalId) => {
        const updatedJournals = journals.filter((journal) => journal.id !== journalId);
        setJournals(updatedJournals);

        // Save the journals array to local storage
        localStorage.setItem('journals', JSON.stringify(updatedJournals));
    }

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingJournalId, setEditingJournalId] = useState(null);

    // Function to handle the "Edit" button click
    const editJournal = (journalId) => {
        const journalToEdit = journals.find((journal) => journal.id === journalId);

        // Populate the form fields with the data of the selected journal
        setNewJournalInput(journalToEdit.detail);
        setDailyMood(journalToEdit.mood);

        // Set edit mode and the journal being edited
        setIsEditMode(true);
        setEditingJournalId(journalId);
    }

    // Function to handle the "Update" button click
    const updateJournal = () => {
        if (newJournalInput.trim() !== '') {
            const updatedJournals = journals.map((journal) =>
                journal.id === editingJournalId
                    ? {
                        ...journal,
                        detail: newJournalInput,
                        mood: dailyMood,
                    }
                    : journal
            );

            // Update the journals array with the updated journal
            setJournals(updatedJournals);

            // Clear the input fields and exit edit mode
            setNewJournalInput('');
            setDailyMood('');
            setIsEditMode(false);
            setEditingJournalId(null);

            // Save the journals array to local storage
            localStorage.setItem('journals', JSON.stringify(updatedJournals));
        }
    }

    // JSX structure for the calendar
    return (
        <div className="flex">
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={false} alert={false} path={"/"} />
                <SidebarItem icon={<ListTodo size={20} />} text="TodoList" active={false} alert={true} path={"/todo"} />
                <SidebarItem icon={<CalendarDays size={20} />} text="Schedule" active={false} alert={false} path={"/calendar"} />
                <SidebarItem icon={<NotebookPen size={20} />} text="DailyJournal" active={true} alert={false} path={"/journal"} />
            </Sidebar>

            <div className="flex-1 p-4">
                <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                    <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                        <div className="md:pr-14">
                            <div className="flex items-center">
                                <h2 className="flex-auto font-semibold text-primary">
                                    {format(firstDayCurrentMonth, 'MMMM yyyy')}
                                </h2>
                                <button
                                    type="button"
                                    onClick={previousMonth}
                                    className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 text-primary"
                                >
                                    <span className="sr-only">Previous month</span>
                                    <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={nextMonth}
                                    type="button"
                                    className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-primary"
                                >
                                    <span className="sr-only">Next month</span>
                                    <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-base-content">
                                <div>S</div>
                                <div>M</div>
                                <div>T</div>
                                <div>W</div>
                                <div>T</div>
                                <div>F</div>
                                <div>S</div>
                            </div>
                            <div className="grid grid-cols-7 mt-2 text-sm">
                                {days.map((day, dayIdx) => (
                                    <div
                                        key={day.toString()}
                                        className={classNames(
                                            dayIdx === 0 && colStartClasses[getDay(day)],
                                            'py-1.5'
                                        )}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDay(day)}
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
                                                'font-semibold',
                                                
                                                'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                                            )}
                                        >
                                            <time dateTime={format(day, 'yyyy-MM-dd')}>
                                                {format(day, 'd')}
                                            </time>
                                        </button>

                                        <div className="w-1 h-1 mx-auto mt-1">
                                            {journals.some((journal) =>
                                                isSameDay(parseISO(journal.startDate), day)
                                            ) && (
                                                    <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <section className="mt-12 md:mt-0 md:pl-14">
                            <h2 className="font-semibold text-gray-900">
                                Daily Journal for{' '}
                                <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                    {format(selectedDay, 'MMM dd, yyy')}
                                </time>
                            </h2>
                            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                                <div className="flex flex-col mb-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder='Today I feel...'
                                        className='w-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
                                        value={dailyMood}
                                        onChange={(e) => setDailyMood(e.target.value)}
                                    />

                                    <textarea
                                        type="text"
                                        placeholder='Describe a journal'
                                        className='w-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
                                        value={newJournalInput}
                                        onChange={(e) => setNewJournalInput(e.target.value)}
                                    />

                                    {isEditMode ? (
                                        <button
                                            type="button"
                                            onClick={updateJournal}
                                            className="px-4 py-2 text-sm font-medium text-white bg-sky-500 border border-transparent rounded-md hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
                                        >
                                            Update
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={addJournal}
                                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-sky-500 border border-transparent rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>


                                {selectedDayJournals.length > 0 ? (
                                    selectedDayJournals.map((journal) => (
                                        <Journal
                                            journal={journal}
                                            key={journal.id}
                                            onDelete={deleteJournal}
                                            onEdit={editJournal}
                                        />
                                    ))
                                ) : (
                                    <p>No journals for today.</p>
                                )}
                            </ol>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Journal component
const Journal = ({ journal, onDelete, onEdit }) => {
    // JSX structure for a journal item
    return (
        <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
            <div className="flex-auto">
                <p className="text-gray-900">Today's Mood: {journal.mood}</p>
                <p className="text-gray-900">Thought: {journal.detail}</p>
            </div>

            <Menu
                as="div"
                className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
            >
                <div>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                        <span className="sr-only">Open options</span>
                        <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900 w-full text-left' : 'text-gray-700',
                                            'block px-4 py-2 text-sm w-full text-left'
                                        )}
                                        onClick={() => onEdit(journal.id)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900 w-full text-left' : 'text-gray-700',
                                            'block px-4 py-2 text-sm w-full text-left'
                                        )}
                                        onClick={() => onDelete(journal.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </li>
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