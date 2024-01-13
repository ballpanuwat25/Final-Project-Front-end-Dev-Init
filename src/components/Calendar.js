import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
    add, //Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
    eachDayOfInterval, //Return the array of dates within the specified time interval.
    endOfMonth, //Return the end of a month for the given date. The result will be in the local timezone.
    format, //Return the formatted date string in the given format. The result may vary by locale.
    getDay, //Get the day of the week of the given date.
    isEqual, //Are the given dates equal?
    isSameMonth, //Are the given dates in the same month (and year)?
    isToday, //Is the given date today?
    parse, //Return the date parsed from string using the given format string.
    startOfToday, //Return the start of today.
} from 'date-fns'

import { CalendarDays } from 'lucide-react';

// Utility function to concatenate CSS class names conditionally
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

// Calendar component
export default function Calendar({ onSelectedDayChange }) {
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

    // JSX structure for the calendar
    return (
        <div className="w-full">
            <button className="btn btn-outline btn-primary w-full" onClick={() => document.getElementById('calendar').showModal()}>
                <CalendarDays size={20} />
                Due to
            </button>

            <dialog id="calendar" className="modal">
                <div className="modal-box">
                    <div className="max-w-md px-4 mx-auto">
                        <>
                            <div className="flex items-center">
                                <h2 className="flex-auto font-semibold text-primary">
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
                                            'py-1.5 flex flex-col items-center'
                                        )}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedDay(day);
                                                onSelectedDayChange(day);
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
                                                'font-semibold',

                                                'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                                            )}
                                        >
                                            <time dateTime={format(day, 'yyyy-MM-dd')}>
                                                {format(day, 'd')}
                                            </time>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    </div>

                    <div className="divider" />

                    <div className="modal-action">
                        <form method="dialog" className='flex w-full justify-between items-center'>
                            <h2 className="font-semibold text-gray-900">
                                Selected Day: {' '}
                                <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                    {format(selectedDay, 'MMM dd, yyy')}
                                </time>
                            </h2>
                            <button className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </dialog>
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