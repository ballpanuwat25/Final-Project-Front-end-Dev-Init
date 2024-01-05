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
import { Fragment, useState } from 'react'

// Utility function to concatenate CSS class names conditionally
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

// Calendar component
export default function Calendar2() {
    const [meetings, setMeetings] = useState([
        {
            id: 1,
            name: 'Leslie Alexander',
            startDatetime: '2024-01-11T13:00',
            endDatetime: '2024-01-12T14:30',
        },
        {
            id: 2,
            name: 'Michael Foster',
            startDatetime: '2024-01-11T13:00',
            endDatetime: '2024-01-15T14:30',
        },
    ])

    // Initial setup using React state
    let today = startOfToday()
    let [selectedDay, setSelectedDay] = useState(today)
    let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

    // Generate an array of days for the current month
    let days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    })

    // Function to navigate to the previous month
    function previousMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    // Function to navigate to the next month
    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    // Filter meetings for the selected day
    let selectedDayMeetings = meetings.filter((meeting) =>
        isSameDay(parseISO(meeting.startDatetime), selectedDay)
    )

    // State to manage the input for a new meeting
    const [newMeetingInput, setNewMeetingInput] = useState('');

    // Function to add a new meeting
    function addMeeting() {
        if (newMeetingInput.trim() !== '') {
            const newMeeting = {
                id: meetings.length + 1, // Generate a unique ID (you may need a more robust solution in a real app)
                name: newMeetingInput,
                startDatetime: selectedDay.toISOString(), // Use the selected day
                endDatetime: selectedDay.toISOString(), // Use the selected day for simplicity, adjust as needed
            };

            // Update the meetings array with the new meeting
            setMeetings([...meetings, newMeeting]);

            // Clear the input field
            setNewMeetingInput('');
        }
    }

    // JSX structure for the calendar
    return (
        <div className="pt-16">
            <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                    <div className="md:pr-14">
                        <div className="flex items-center">
                            <h2 className="flex-auto font-semibold text-gray-900">
                                {format(firstDayCurrentMonth, 'MMMM yyyy')}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Next month</span>
                                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
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
                                            'text-red-500',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-900',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            !isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-400',
                                            isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                                            isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            'bg-gray-900',
                                            !isEqual(day, selectedDay) && 'hover:bg-gray-200',
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
                                        {meetings.some((meeting) =>
                                            isSameDay(parseISO(meeting.startDatetime), day)
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
                            Schedule for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyy')}
                            </time>
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                            <div className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    placeholder='Add a meeting'
                                    className='w-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
                                    value={newMeetingInput}
                                    onChange={(e) => setNewMeetingInput(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={addMeeting}
                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-sky-500 border border-transparent rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    Add
                                </button>
                            </div>

                            {selectedDayMeetings.length > 0 ? (
                                selectedDayMeetings.map((meeting) => (
                                    <Meeting meeting={meeting} key={meeting.id} />
                                ))
                            ) : (
                                <p>No meetings for today.</p>
                            )}
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    )
}

// Meeting component
function Meeting({ meeting }) {
    // Parse start and end times of the meeting
    let startDateTime = parseISO(meeting.startDatetime)
    let endDateTime = parseISO(meeting.endDatetime)

    // JSX structure for a meeting item
    return (
        <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
            <div className="flex-auto">
                <p className="text-gray-900">{meeting.name}</p>
                <p className="mt-0.5">
                    <time dateTime={meeting.startDatetime}>
                        {format(startDateTime, 'dd/MM/yyyy, h:mm a')}
                    </time>{' '}
                    -{' '}
                    <time dateTime={meeting.endDatetime}>
                        {format(endDateTime, 'dd/MM/yyyy, h:mm a')}
                    </time>
                </p>
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
                                    <a
                                        href="/"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Edit
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="/"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Cancel
                                    </a>
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
let colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]
