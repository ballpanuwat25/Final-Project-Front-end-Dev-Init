import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Pause, Play } from 'lucide-react';

const Countdown = () => {
  const initialTime = 30 * 60;
  const [time, setTime] = useState(() => {
    const storedTime = localStorage.getItem('countdownTime');
    return storedTime ? parseInt(storedTime, 10) : initialTime;
  });
  const [isCounting, setIsCounting] = useState(false);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleAddTime = () => {
    setTime((prevTime) => prevTime + 5 * 60);
  };

  const handleSubtractTime = () => {
    setTime((prevTime) => Math.max(prevTime - 5 * 60, 0));
  };

  const handleToggleCountdown = () => {
    setIsCounting((prevIsCounting) => !prevIsCounting);
  };

  const handleResetCountdown = () => {
    setIsCounting(false);
    setTime(initialTime);

    localStorage.removeItem('countdownTime');
  };

  useEffect(() => {
    let countdownInterval;

    if (isCounting && time > 0) {
      countdownInterval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem('countdownTime', newTime.toString());
          return newTime;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [isCounting, time]);

  return (
    <div className="flex flex-col rounded-lg shadow border justify-center px-4 py-2">
      <div className='inline-flex gap-4 items-center justify-between mb-2 md:mb-0'>
        <h1 className="md:text-2xl font-bold mb-1">Focus Timer</h1>
        <button
          onClick={handleResetCountdown}
          className="btn btn-sm btn-circle bg-base-300"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className='inline-flex gap-4 items-center justify-center'>
        <button
          onClick={handleAddTime}
          className="btn btn-circle btn-sm btn-outline btn-primary"
        >
          <Plus size={16} />
        </button>
        <h1 className="text-lg md:text-3xl font-bold">{formatTime(time)}</h1>
        <button
          onClick={handleSubtractTime}
          className="btn btn-circle btn-sm btn-outline btn-secondary"
        >
          <Minus size={16} />
        </button>
      </div>

      <button
        onClick={handleToggleCountdown}
        className={`${isCounting ? 'btn-secondary' : 'btn-primary'
          } btn mt-4 mb-2 md:mb-0 md:mt-2`}
      >
        {isCounting ? <Pause /> : <Play />}
      </button>
    </div>
  );
};

export default Countdown;
