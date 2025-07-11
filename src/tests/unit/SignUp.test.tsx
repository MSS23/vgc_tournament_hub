import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '../../components/SignUp';

describe('SignUp Component', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Information', () => {
    test('should render first step with all required fields', () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      expect(screen.getByText('Join the VGC Community')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Date of Birth')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    test('should show error for empty name', async () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    test('should show error for empty email', async () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      const nameInput = screen.getByPlaceholderText('Full Name');
      const dobInput = screen.getByPlaceholderText('Date of Birth');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    test('should show error for invalid email format', async () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      });
    });

    test('should show error for empty date of birth', async () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      });
    });

    test('should show error for future date of birth', async () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(dobInput, { target: { value: futureDateString } });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Date of birth cannot be in the future')).toBeInTheDocument();
      });
    });

    test('should proceed to next step with valid information', async () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Choose Your Division')).toBeInTheDocument();
      });
    });
  });

  describe('Step 2: Division Selection', () => {
    const setupDivisionStep = () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.click(nextButton);
    };

    test('should render division selection step', async () => {
      setupDivisionStep();
      
      await waitFor(() => {
        expect(screen.getByText('Choose Your Division')).toBeInTheDocument();
        expect(screen.getByText('Junior Division (Ages 11-15)')).toBeInTheDocument();
        expect(screen.getByText('Senior Division (Ages 16-17)')).toBeInTheDocument();
        expect(screen.getByText('Master Division (Ages 18+)')).toBeInTheDocument();
      });
    });

    test('should select junior division and proceed', async () => {
      setupDivisionStep();
      
      await waitFor(() => {
        const juniorButton = screen.getByText('Junior Division (Ages 11-15)');
        fireEvent.click(juniorButton);
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Create Your Password')).toBeInTheDocument();
      });
    });

    test('should select senior division and proceed', async () => {
      setupDivisionStep();
      
      await waitFor(() => {
        const seniorButton = screen.getByText('Senior Division (Ages 16-17)');
        fireEvent.click(seniorButton);
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Create Your Password')).toBeInTheDocument();
      });
    });

    test('should select master division and proceed', async () => {
      setupDivisionStep();
      
      await waitFor(() => {
        const masterButton = screen.getByText('Master Division (Ages 18+)');
        fireEvent.click(masterButton);
        
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Create Your Password')).toBeInTheDocument();
      });
    });

    test('should show error if no division is selected', async () => {
      setupDivisionStep();
      
      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
        
        expect(screen.getByText('Please select a division')).toBeInTheDocument();
      });
    });
  });

  describe('Step 3: Password Creation', () => {
    const setupPasswordStep = async (division: string) => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      // Step 1: Information
      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.click(nextButton);
      
      // Step 2: Division
      await waitFor(() => {
        const divisionButton = screen.getByText(new RegExp(division));
        fireEvent.click(divisionButton);
        
        const nextButton2 = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton2);
      });
    };

    test('should render password creation step', async () => {
      await setupPasswordStep('Master Division');
      
      await waitFor(() => {
        expect(screen.getByText('Create Your Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
      });
    });

    test('should show error for password too short', async () => {
      await setupPasswordStep('Master Division');
      
      await waitFor(() => {
        const passwordInput = screen.getByPlaceholderText('Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
        const completeButton = screen.getByRole('button', { name: /complete/i });
        
        fireEvent.change(passwordInput, { target: { value: '123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
        fireEvent.click(completeButton);
        
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });

    test('should show error for password mismatch', async () => {
      await setupPasswordStep('Master Division');
      
      await waitFor(() => {
        const passwordInput = screen.getByPlaceholderText('Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
        const completeButton = screen.getByRole('button', { name: /complete/i });
        
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
        fireEvent.click(completeButton);
        
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    test('should complete signup with valid password', async () => {
      await setupPasswordStep('Master Division');
      
      await waitFor(() => {
        const passwordInput = screen.getByPlaceholderText('Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
        const completeButton = screen.getByRole('button', { name: /complete/i });
        
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.click(completeButton);
      });
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'test@example.com',
          dateOfBirth: '1990-01-01',
          division: 'master',
          password: 'password123',
          requiresGuardian: false
        });
      });
    });
  });

  describe('Guardian Requirements', () => {
    test('should require guardian for junior division', async () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      // Step 1: Information
      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(dobInput, { target: { value: '2010-01-01' } }); // 14 years old
      fireEvent.click(nextButton);
      
      // Step 2: Division
      await waitFor(() => {
        const juniorButton = screen.getByText('Junior Division (Ages 11-15)');
        fireEvent.click(juniorButton);
        
        const nextButton2 = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton2);
      });
      
      // Step 3: Password
      await waitFor(() => {
        const passwordInput = screen.getByPlaceholderText('Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
        const completeButton = screen.getByRole('button', { name: /complete/i });
        
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.click(completeButton);
      });
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'test@example.com',
          dateOfBirth: '2010-01-01',
          division: 'junior',
          password: 'password123',
          requiresGuardian: true
        });
      });
    });
  });

  describe('Navigation', () => {
    test('should go back to previous step', async () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      // Go to step 2
      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const dobInput = screen.getByPlaceholderText('Date of Birth');
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Choose Your Division')).toBeInTheDocument();
        
        const backButton = screen.getByRole('button', { name: /back/i });
        fireEvent.click(backButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Join the VGC Community')).toBeInTheDocument();
      });
    });
  });

  describe('Social Sign Up', () => {
    test('should handle Google sign up click', () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);
      
      expect(googleButton).toBeInTheDocument();
    });

    test('should handle Apple sign up click', () => {
      render(<SignUp onComplete={mockOnComplete} />);
      
      const appleButton = screen.getByRole('button', { name: /continue with apple/i });
      fireEvent.click(appleButton);
      
      expect(appleButton).toBeInTheDocument();
    });
  });
}); 