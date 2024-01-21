import React from 'react';
import { render } from '@testing-library/react';
import ThemeController from '../components/ThemeController';

test('renders ThemeController component', () => {
  const { getByText } = render(<ThemeController expanded={true} />);

  const themeText = getByText('Theme');
  expect(themeText).toBeInTheDocument();
});
