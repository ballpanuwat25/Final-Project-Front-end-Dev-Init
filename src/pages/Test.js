import React from 'react';
import Board from '../components/kanban/Board';

function Test() {
  return (
    <div className="App p-4">
      <h1 className="text-3xl font-semibold mb-4">Kanban Board</h1>
      <Board />
    </div>
  );
}

export default Test;