import React from 'react';
import { render } from '@testing-library/react';
import Notification from '../components/Notification';

test('renders Notification component', () => {
  const { getByText } = render(<Notification />);

  expect(getByText('Notifications 🔔')).toBeInTheDocument();
});
