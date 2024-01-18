import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ScheduleComponent() {
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    const savedMeetings = JSON.parse(localStorage.getItem('meetings')) || [];
    setMeetings(savedMeetings)
  }, [])

  const today = startOfToday()
  const [selectedDay, setSelectedDay] = useState(today)
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
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

  const openModal = () => {
    if (window.screen.width < 1127) {
      document.getElementById('my_modal_2').showModal()
    }
  }

  return (
    <div className='w-full border shadow rounded-lg h-72 md:h-96 overflow-y-scroll'>
      <div className="flex p-2 gap-2 lg:p-4 lg:gap-4">
        <div className='w-full'>
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

          <div className="grid grid-cols-7 mt-4 lg:mt-8 text-xs leading-6 text-center text-base-content">
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
                  onClick={() => {
                    setSelectedDay(day);
                    openModal();
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

                <dialog id="my_modal_2" className="modal">
                  <div className="modal-box">
                    <ol className="space-y-1 text-sm leading-6 text-gray-500">
                      {selectedDayMeetings.length > 0 ? (
                        selectedDayMeetings.map((meeting) => (
                          <Meeting
                            meeting={meeting}
                            key={meeting.meet_id}
                          />
                        ))
                      ) : (
                        <p>No meetings.</p>
                      )}
                    </ol>
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
        </div>

        <div className='lg:flex m-0 divider divider-horizontal hidden' />

        <div className='lg:block w-full hidden'>
          <ol className="space-y-1 text-sm leading-6 text-gray-500">
            {selectedDayMeetings.length > 0 ? (
              selectedDayMeetings.map((meeting) => (
                <Meeting
                  meeting={meeting}
                  key={meeting.meet_id}
                />
              ))
            ) : (
              <p>No meetings.</p>
            )}
          </ol>
        </div>
      </div>
    </div>
  )
}

const Meeting = ({ meeting }) => {
  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl bg-base-300 text-base-content">
      <div className="flex-auto">
        <p className="font-bold">{meeting.meet_name}</p>
        <p className="mt-0.5">
          {meeting.meet_startTime} - {meeting.meet_endTime}
        </p>
      </div>
    </li>
  )
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]