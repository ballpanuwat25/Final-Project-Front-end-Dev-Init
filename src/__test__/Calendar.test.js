import React from 'react';
import { render, screen } from '@testing-library/react';
import Calendar from '../components/Calendar';

describe('Calendar Component', () => {
  it('renders without errors', () => {
    render(<Calendar />);
    expect(screen.getByText(/Due to/)).toBeInTheDocument();
  });
});
