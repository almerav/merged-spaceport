import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

import RootLayout from '../app/layout';

describe('RootLayout', () => {
  it('renders children', () => {
    render(
      <div>
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      </div> 
    );

    const content = screen.getByText('Test Content');
    expect(content).toBeInTheDocument();
  });
});
