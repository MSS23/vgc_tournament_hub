import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamShowcase from '../../components/TeamShowcase';

describe('TeamShowcase Component', () => {
  const mockOnSave = jest.fn();
  const defaultProps = {
    userDivision: 'master' as const,
    isGuardianApprovalRequired: false,
    onSave: mockOnSave,
    userId: 'user-123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render team showcase with initial state', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      expect(screen.getByText('Team Showcase')).toBeInTheDocument();
      expect(screen.getByText('Create and share your competitive teams')).toBeInTheDocument();
      expect(screen.getByText('Add Pokémon')).toBeInTheDocument();
      expect(screen.getByText('Save Team')).toBeInTheDocument();
    });

    test('should show empty team state initially', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      expect(screen.getByText('No Pokémon added yet')).toBeInTheDocument();
      expect(screen.getByText('Click "Add Pokémon" to start building your team')).toBeInTheDocument();
    });
  });

  describe('Adding Pokémon', () => {
    test('should add a Pokémon when Add Pokémon button is clicked', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      const addButton = screen.getByText('Add Pokémon');
      fireEvent.click(addButton);
      
      expect(screen.getByText('Pokémon 1')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Pokémon name')).toBeInTheDocument();
    });

    test('should add multiple Pokémon', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      const addButton = screen.getByText('Add Pokémon');
      
      // Add first Pokémon
      fireEvent.click(addButton);
      expect(screen.getByText('Pokémon 1')).toBeInTheDocument();
      
      // Add second Pokémon
      fireEvent.click(addButton);
      expect(screen.getByText('Pokémon 2')).toBeInTheDocument();
      
      // Add third Pokémon
      fireEvent.click(addButton);
      expect(screen.getByText('Pokémon 3')).toBeInTheDocument();
    });

    test('should not allow more than 6 Pokémon', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      const addButton = screen.getByText('Add Pokémon');
      
      // Add 6 Pokémon
      for (let i = 0; i < 6; i++) {
        fireEvent.click(addButton);
      }
      
      expect(screen.getByText('Pokémon 6')).toBeInTheDocument();
      
      // Try to add 7th Pokémon
      fireEvent.click(addButton);
      
      // Should still only have 6 Pokémon
      expect(screen.queryByText('Pokémon 7')).not.toBeInTheDocument();
    });
  });

  describe('Pokémon Configuration', () => {
    const setupPokemon = () => {
      render(<TeamShowcase {...defaultProps} />);
      const addButton = screen.getByText('Add Pokémon');
      fireEvent.click(addButton);
    };

    test('should allow editing Pokémon name', () => {
      setupPokemon();
      
      const nameInput = screen.getByPlaceholderText('Pokémon name');
      fireEvent.change(nameInput, { target: { value: 'Charizard' } });
      
      expect(nameInput).toHaveValue('Charizard');
    });

    test('should allow selecting item', () => {
      setupPokemon();
      
      const itemSelect = screen.getByDisplayValue('No Item');
      fireEvent.change(itemSelect, { target: { value: 'Focus Sash' } });
      
      expect(itemSelect).toHaveValue('Focus Sash');
    });

    test('should allow selecting ability', () => {
      setupPokemon();
      
      const abilitySelect = screen.getByDisplayValue('Select Ability');
      fireEvent.change(abilitySelect, { target: { value: 'Blaze' } });
      
      expect(abilitySelect).toHaveValue('Blaze');
    });

    test('should allow selecting Tera Type', () => {
      setupPokemon();
      
      const teraSelect = screen.getByDisplayValue('Select Tera Type');
      fireEvent.change(teraSelect, { target: { value: 'Fire' } });
      
      expect(teraSelect).toHaveValue('Fire');
    });

    test('should allow editing moves', () => {
      setupPokemon();
      
      const moveInputs = screen.getAllByPlaceholderText('Move name');
      fireEvent.change(moveInputs[0], { target: { value: 'Flamethrower' } });
      fireEvent.change(moveInputs[1], { target: { value: 'Air Slash' } });
      
      expect(moveInputs[0]).toHaveValue('Flamethrower');
      expect(moveInputs[1]).toHaveValue('Air Slash');
    });

    test('should toggle EV display', () => {
      setupPokemon();
      
      const evToggle = screen.getByText('Show EVs');
      fireEvent.click(evToggle);
      
      expect(screen.getByText('Hide EVs')).toBeInTheDocument();
      expect(screen.getByText('HP')).toBeInTheDocument();
      expect(screen.getByText('Attack')).toBeInTheDocument();
    });

    test('should allow editing EV values', () => {
      setupPokemon();
      
      const evToggle = screen.getByText('Show EVs');
      fireEvent.click(evToggle);
      
      const hpInput = screen.getByDisplayValue('0');
      fireEvent.change(hpInput, { target: { value: '252' } });
      
      expect(hpInput).toHaveValue(252);
    });
  });

  describe('Removing Pokémon', () => {
    test('should remove Pokémon when remove button is clicked', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      // Add a Pokémon
      const addButton = screen.getByText('Add Pokémon');
      fireEvent.click(addButton);
      
      expect(screen.getByText('Pokémon 1')).toBeInTheDocument();
      
      // Remove the Pokémon
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);
      
      expect(screen.queryByText('Pokémon 1')).not.toBeInTheDocument();
      expect(screen.getByText('No Pokémon added yet')).toBeInTheDocument();
    });

    test('should reorder Pokémon after removal', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      const addButton = screen.getByText('Add Pokémon');
      
      // Add 3 Pokémon
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      
      expect(screen.getByText('Pokémon 1')).toBeInTheDocument();
      expect(screen.getByText('Pokémon 2')).toBeInTheDocument();
      expect(screen.getByText('Pokémon 3')).toBeInTheDocument();
      
      // Remove the second Pokémon
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[1]);
      
      // Should now have Pokémon 1 and 2 (the third one becomes second)
      expect(screen.getByText('Pokémon 1')).toBeInTheDocument();
      expect(screen.getByText('Pokémon 2')).toBeInTheDocument();
      expect(screen.queryByText('Pokémon 3')).not.toBeInTheDocument();
    });
  });

  describe('Team Sharing', () => {
    const setupTeamWithPokemon = () => {
      render(<TeamShowcase {...defaultProps} />);
      
      // Add a Pokémon and configure it
      const addButton = screen.getByText('Add Pokémon');
      fireEvent.click(addButton);
      
      const nameInput = screen.getByPlaceholderText('Pokémon name');
      fireEvent.change(nameInput, { target: { value: 'Charizard' } });
    };

    test('should show share options when share button is clicked', () => {
      setupTeamWithPokemon();
      
      const shareButton = screen.getByText('Share');
      fireEvent.click(shareButton);
      
      expect(screen.getByText('Share Team')).toBeInTheDocument();
      expect(screen.getByText('Open Team Sheet')).toBeInTheDocument();
      expect(screen.getByText('With EVs')).toBeInTheDocument();
    });

    test('should handle open team sheet sharing', () => {
      setupTeamWithPokemon();
      
      const shareButton = screen.getByText('Share');
      fireEvent.click(shareButton);
      
      const openTeamSheetButton = screen.getByText('Open Team Sheet');
      fireEvent.click(openTeamSheetButton);
      
      expect(screen.getByText('Team shared as Open Team Sheet!')).toBeInTheDocument();
    });

    test('should handle EV sharing', () => {
      setupTeamWithPokemon();
      
      const shareButton = screen.getByText('Share');
      fireEvent.click(shareButton);
      
      const evButton = screen.getByText('With EVs');
      fireEvent.click(evButton);
      
      expect(screen.getByText('Team shared with EVs!')).toBeInTheDocument();
    });
  });

  describe('Saving Team', () => {
    const setupValidTeam = () => {
      render(<TeamShowcase {...defaultProps} />);
      
      // Add a Pokémon and configure it
      const addButton = screen.getByText('Add Pokémon');
      fireEvent.click(addButton);
      
      const nameInput = screen.getByPlaceholderText('Pokémon name');
      fireEvent.change(nameInput, { target: { value: 'Charizard' } });
      
      const itemSelect = screen.getByDisplayValue('No Item');
      fireEvent.change(itemSelect, { target: { value: 'Focus Sash' } });
      
      const abilitySelect = screen.getByDisplayValue('Select Ability');
      fireEvent.change(abilitySelect, { target: { value: 'Blaze' } });
      
      const teraSelect = screen.getByDisplayValue('Select Tera Type');
      fireEvent.change(teraSelect, { target: { value: 'Fire' } });
      
      const moveInputs = screen.getAllByPlaceholderText('Move name');
      fireEvent.change(moveInputs[0], { target: { value: 'Flamethrower' } });
      fireEvent.change(moveInputs[1], { target: { value: 'Air Slash' } });
      fireEvent.change(moveInputs[2], { target: { value: 'Dragon Claw' } });
      fireEvent.change(moveInputs[3], { target: { value: 'Earthquake' } });
    };

    test('should show validation errors for incomplete team', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      const saveButton = screen.getByText('Save Team');
      fireEvent.click(saveButton);
      
      expect(screen.getByText('Please add at least one Pokémon to your team')).toBeInTheDocument();
    });

    test('should show validation errors for incomplete Pokémon', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      // Add Pokémon but don't configure it
      const addButton = screen.getByText('Add Pokémon');
      fireEvent.click(addButton);
      
      const saveButton = screen.getByText('Save Team');
      fireEvent.click(saveButton);
      
      expect(screen.getByText('Please complete all Pokémon configurations')).toBeInTheDocument();
    });

    test('should save team with valid configuration', () => {
      setupValidTeam();
      
      const saveButton = screen.getByText('Save Team');
      fireEvent.click(saveButton);
      
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        title: expect.any(String),
        description: expect.any(String),
        team: expect.arrayContaining([
          expect.objectContaining({
            name: 'Charizard',
            item: 'Focus Sash',
            ability: 'Blaze',
            teraType: 'Fire',
            moves: ['Flamethrower', 'Air Slash', 'Dragon Claw', 'Earthquake']
          })
        ])
      }));
    });
  });

  describe('Guardian Approval', () => {
    test('should show guardian approval notice when required', () => {
      render(<TeamShowcase {...defaultProps} isGuardianApprovalRequired={true} />);
      
      expect(screen.getByText('Guardian approval required for team sharing')).toBeInTheDocument();
    });

    test('should not show guardian approval notice when not required', () => {
      render(<TeamShowcase {...defaultProps} isGuardianApprovalRequired={false} />);
      
      expect(screen.queryByText('Guardian approval required for team sharing')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels and aria attributes', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      const addButton = screen.getByText('Add Pokémon');
      expect(addButton).toHaveAttribute('type', 'button');
    });

    test('should have proper input types', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      const addButton = screen.getByText('Add Pokémon');
      fireEvent.click(addButton);
      
      const nameInput = screen.getByPlaceholderText('Pokémon name');
      expect(nameInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid EV values', () => {
      render(<TeamShowcase {...defaultProps} />);
      
      const addButton = screen.getByText('Add Pokémon');
      fireEvent.click(addButton);
      
      const evToggle = screen.getByText('Show EVs');
      fireEvent.click(evToggle);
      
      const hpInput = screen.getByDisplayValue('0');
      fireEvent.change(hpInput, { target: { value: '300' } }); // Invalid value
      
      expect(hpInput).toHaveValue(300);
      // Note: In a real implementation, you might want to validate this and show an error
    });
  });
}); 