import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from '../components/kanban/Board';

test('renders Board component', () => {
    render(<Board />);
});