import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SelectOption from '../components/SelectOption';

test('renders SelectOption component and handles option change', () => {
  const mockOnSelectOptionChange = jest.fn();

  const { getAllByText, getByRole } = render(
    <SelectOption onSelectOptionChange={mockOnSelectOptionChange} />
  );

  const defaultOption = getAllByText(/Priority/i);
  expect(defaultOption.length).toBeGreaterThan(0);

  const button = getByRole('button');
  fireEvent.click(button);

  const lowOption = getByRole('radio', { name: /Low/i });
  const mediumOption = getByRole('radio', { name: /Medium/i });
  const highOption = getByRole('radio', { name: /High/i });

  expect(lowOption).toBeInTheDocument();
  expect(mediumOption).toBeInTheDocument();
  expect(highOption).toBeInTheDocument();

  fireEvent.click(lowOption);

  expect(getAllByText(/Low/i).length).toBeGreaterThan(0);
  expect(mockOnSelectOptionChange).toHaveBeenCalledWith('Low');
});
