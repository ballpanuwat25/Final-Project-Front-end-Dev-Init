import React from 'react'

function TodoComponent() {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 justify-between items-center'>
            <div className='border shadow w-full h-52 rounded p-2'>task Today</div>
            <div className='border shadow w-full h-52 rounded p-2'>task Monthly</div>
            <div className='border shadow w-full h-52 rounded p-2'>Over Due task</div>
        </div>
    )
}

export default TodoComponent
