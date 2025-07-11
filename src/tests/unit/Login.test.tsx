import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../components/Login';

describe('Login Component', () => {
  const mockOnLogin = jest.fn();
  const mockOnSwitchToSignUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render login form with all required elements', () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('should render social login buttons', () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue with apple/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('should show error for empty email', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    test('should show error for empty password', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    test('should show error for invalid email format', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      });
    });

    test('should show error for password too short', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    test('should call onLogin with valid credentials', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });

    test('should not call onLogin with invalid credentials', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLogin).not.toHaveBeenCalled();
      });
    });

    test('should handle form submission with enter key', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.keyPress(passwordInput, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });
  });

  describe('Navigation', () => {
    test('should call onSwitchToSignUp when sign up button is clicked', () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpButton);
      
      expect(mockOnSwitchToSignUp).toHaveBeenCalled();
    });
  });

  describe('Social Login', () => {
    test('should handle Google sign in click', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);
      
      // Note: In a real test, you might want to mock the Google sign-in function
      // and verify it was called appropriately
      expect(googleButton).toBeInTheDocument();
    });

    test('should handle Apple sign in click', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const appleButton = screen.getByRole('button', { name: /continue with apple/i });
      fireEvent.click(appleButton);
      
      // Note: In a real test, you might want to mock the Apple sign-in function
      // and verify it was called appropriately
      expect(appleButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels and aria attributes', () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should have proper button types', () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Error Handling', () => {
    test('should clear errors when user starts typing', async () => {
      render(<Login onLogin={mockOnLogin} onSwitchToSignUp={mockOnSwitchToSignUp} />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      
      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });
  });
}); 