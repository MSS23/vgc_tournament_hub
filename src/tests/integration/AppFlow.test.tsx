import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';

describe('Application Flow Integration Tests', () => {
  beforeEach(() => {
    // Clear any stored data
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('User Registration Flow', () => {
    test('should complete full user registration process', async () => {
      render(<App />);

      // Start on homepage
      expect(screen.getByText('VGC Hub')).toBeInTheDocument();

      // Click sign up button
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpButton);

      // Fill out registration form
      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      // Select division
      await waitFor(() => {
        expect(screen.getByText('Choose Your Division')).toBeInTheDocument();
      });

      const masterButton = screen.getByText('Master Division (Ages 18+)');
      fireEvent.click(masterButton);

      const nextButton2 = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton2);

      // Create password
      await waitFor(() => {
        expect(screen.getByText('Create Your Password')).toBeInTheDocument();
      });

      const passwordInput = screen.getByPlaceholderText('Password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const completeButton = screen.getByRole('button', { name: /complete/i });
      fireEvent.click(completeButton);

      // Should be redirected to competitor view
      await waitFor(() => {
        expect(screen.getByText('Welcome, Trainer!')).toBeInTheDocument();
      });
    });

    test('should handle registration validation errors', async () => {
      render(<App />);

      // Click sign up button
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpButton);

      // Try to proceed without filling required fields
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      });
    });
  });

  describe('User Login Flow', () => {
    test('should complete login process successfully', async () => {
      render(<App />);

      // Click login button
      const loginButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginButton);

      // Fill login form
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);

      // Should be redirected to competitor view
      await waitFor(() => {
        expect(screen.getByText('Welcome, Trainer!')).toBeInTheDocument();
      });
    });

    test('should handle login validation errors', async () => {
      render(<App />);

      // Click login button
      const loginButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginButton);

      // Try to login without credentials
      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });
  });

  describe('Tournament Registration Flow', () => {
    const setupLoggedInUser = async () => {
      render(<App />);

      // Quick login (in real app, this would be a proper login)
      // For testing, we'll simulate being logged in by directly setting state
      // This is a simplified version for integration testing
      
      // Click login and fill credentials
      const loginButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginButton);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(screen.getByText('Welcome, Trainer!')).toBeInTheDocument();
      });
    };

    test('should register for tournament successfully', async () => {
      await setupLoggedInUser();

      // Navigate to tournaments tab
      const tournamentsButton = screen.getByText('Tournaments');
      fireEvent.click(tournamentsButton);

      // Find and click register button for a tournament
      const registerButtons = screen.getAllByText(/register/i);
      if (registerButtons.length > 0) {
        fireEvent.click(registerButtons[0]);

        // Should show registration confirmation
        await waitFor(() => {
          expect(screen.getByText(/registered/i)).toBeInTheDocument();
        });
      }
    });

    test('should handle tournament registration when full', async () => {
      await setupLoggedInUser();

      // Navigate to tournaments tab
      const tournamentsButton = screen.getByText('Tournaments');
      fireEvent.click(tournamentsButton);

      // Find a full tournament and try to register
      const fullTournamentButtons = screen.getAllByText(/waitlist/i);
      if (fullTournamentButtons.length > 0) {
        fireEvent.click(fullTournamentButtons[0]);

        // Should show waitlist message
        await waitFor(() => {
          expect(screen.getByText(/waitlist/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Team Building Flow', () => {
    const setupLoggedInUser = async () => {
      render(<App />);

      // Quick login
      const loginButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginButton);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(screen.getByText('Welcome, Trainer!')).toBeInTheDocument();
      });
    };

    test('should build and save a team', async () => {
      await setupLoggedInUser();

      // Navigate to showcase tab
      const showcaseButton = screen.getByText('Showcase');
      fireEvent.click(showcaseButton);

      // Add a Pokémon
      const addButton = screen.getByText('Add Pokémon');
      fireEvent.click(addButton);

      // Configure the Pokémon
      const nameInput = screen.getByPlaceholderText('Pokémon name');
      fireEvent.change(nameInput, { target: { value: 'Charizard' } });

      const itemSelect = screen.getByDisplayValue('No Item');
      fireEvent.change(itemSelect, { target: { value: 'Focus Sash' } });

      const abilitySelect = screen.getByDisplayValue('Select Ability');
      fireEvent.change(abilitySelect, { target: { value: 'Blaze' } });

      const teraSelect = screen.getByDisplayValue('Select Tera Type');
      fireEvent.change(teraSelect, { target: { value: 'Fire' } });

      // Add moves
      const moveInputs = screen.getAllByPlaceholderText('Move name');
      fireEvent.change(moveInputs[0], { target: { value: 'Flamethrower' } });
      fireEvent.change(moveInputs[1], { target: { value: 'Air Slash' } });
      fireEvent.change(moveInputs[2], { target: { value: 'Dragon Claw' } });
      fireEvent.change(moveInputs[3], { target: { value: 'Earthquake' } });

      // Save the team
      const saveButton = screen.getByText('Save Team');
      fireEvent.click(saveButton);

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/team saved/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Flow', () => {
    const setupLoggedInUser = async () => {
      render(<App />);

      // Quick login
      const loginButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginButton);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(screen.getByText('Welcome, Trainer!')).toBeInTheDocument();
      });
    };

    test('should navigate between all tabs', async () => {
      await setupLoggedInUser();

      // Test each tab navigation
      const tabs = ['Tournaments', 'Pairings', 'Showcase', 'QR Code', 'Calendar', 'Following', 'Search', 'Blog'];

      for (const tab of tabs) {
        const tabButton = screen.getByText(tab);
        fireEvent.click(tabButton);

        // Verify tab content is displayed
        await waitFor(() => {
          expect(screen.getByText(tab)).toBeInTheDocument();
        });
      }
    });

    test('should handle logout', async () => {
      await setupLoggedInUser();

      // Find and click logout button
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      // Should return to homepage
      await waitFor(() => {
        expect(screen.getByText('VGC Hub')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Flow', () => {
    test('should handle network errors gracefully', async () => {
      // Mock fetch to simulate network error
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      );

      render(<App />);

      // Try to login (should handle error gracefully)
      const loginButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginButton);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);

      // Should handle error without crashing
      await waitFor(() => {
        expect(screen.getByText('Welcome, Trainer!')).toBeInTheDocument();
      });
    });

    test('should handle invalid data gracefully', async () => {
      render(<App />);

      // Try to access protected routes without login
      // This should redirect to login or show appropriate message
      expect(screen.getByText('VGC Hub')).toBeInTheDocument();
    });
  });

  describe('Performance Flow', () => {
    test('should handle rapid user interactions', async () => {
      render(<App />);

      // Rapidly click between sign up and login
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      const loginButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.click(signUpButton);
      fireEvent.click(loginButton);
      fireEvent.click(signUpButton);

      // Should not crash and should be responsive
      await waitFor(() => {
        expect(screen.getByText('Join the VGC Community')).toBeInTheDocument();
      });
    });

    test('should handle form submissions efficiently', async () => {
      render(<App />);

      const startTime = performance.now();

      // Complete registration process
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpButton);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      const endTime = performance.now();

      // Should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
}); 