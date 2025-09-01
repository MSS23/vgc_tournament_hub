import { useState, useEffect, useCallback } from 'react';
import { Team, TeamSlot, TeamSlotManager, TournamentSubmission, TeamSlotAnalytics } from '../types';

const TEAM_SLOTS_STORAGE_KEY = 'vgc_hub_team_slots';
const DEFAULT_MAX_SLOTS = 8;

// Generate default empty team slot manager
const createDefaultTeamSlotManager = (): TeamSlotManager => ({
  slots: Array.from({ length: DEFAULT_MAX_SLOTS }, (_, index) => ({
    slotId: `slot-${index + 1}`,
    slotNumber: index + 1,
    team: null,
    isLocked: false,
    lastModified: new Date().toISOString(),
  })),
  maxSlots: DEFAULT_MAX_SLOTS,
  activeSlot: undefined,
  lastModified: new Date().toISOString(),
});

export const useTeamSlots = () => {
  const [teamSlotManager, setTeamSlotManager] = useState<TeamSlotManager>(createDefaultTeamSlotManager);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load team slots from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TEAM_SLOTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TeamSlotManager;
        // Ensure we have the correct number of slots
        while (parsed.slots.length < DEFAULT_MAX_SLOTS) {
          parsed.slots.push({
            slotId: `slot-${parsed.slots.length + 1}`,
            slotNumber: parsed.slots.length + 1,
            team: null,
            isLocked: false,
            lastModified: new Date().toISOString(),
          });
        }
        setTeamSlotManager(parsed);
      }
    } catch (err) {
      console.error('Failed to load team slots:', err);
      setError('Failed to load saved teams');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save team slots to localStorage
  const saveTeamSlots = useCallback((manager: TeamSlotManager) => {
    try {
      const updatedManager = {
        ...manager,
        lastModified: new Date().toISOString(),
      };
      localStorage.setItem(TEAM_SLOTS_STORAGE_KEY, JSON.stringify(updatedManager));
      setTeamSlotManager(updatedManager);
      setError(null);
    } catch (err) {
      console.error('Failed to save team slots:', err);
      setError('Failed to save team slots');
    }
  }, []);

  // Save team to specific slot
  const saveTeamToSlot = useCallback((slotNumber: number, team: Team) => {
    const updatedSlots = teamSlotManager.slots.map((slot) => {
      if (slot.slotNumber === slotNumber) {
        return {
          ...slot,
          team: {
            ...team,
            slotNumber,
            updatedAt: new Date().toISOString(),
          },
          lastModified: new Date().toISOString(),
        };
      }
      return slot;
    });

    const updatedManager = {
      ...teamSlotManager,
      slots: updatedSlots,
      activeSlot: slotNumber,
    };

    saveTeamSlots(updatedManager);
  }, [teamSlotManager, saveTeamSlots]);

  // Remove team from slot
  const removeTeamFromSlot = useCallback((slotNumber: number) => {
    const updatedSlots = teamSlotManager.slots.map((slot) => {
      if (slot.slotNumber === slotNumber) {
        return {
          ...slot,
          team: null,
          lastModified: new Date().toISOString(),
        };
      }
      return slot;
    });

    const updatedManager = {
      ...teamSlotManager,
      slots: updatedSlots,
      activeSlot: teamSlotManager.activeSlot === slotNumber ? undefined : teamSlotManager.activeSlot,
    };

    saveTeamSlots(updatedManager);
  }, [teamSlotManager, saveTeamSlots]);

  // Update team in slot
  const updateTeamInSlot = useCallback((teamId: string, updates: Partial<Team>) => {
    const updatedSlots = teamSlotManager.slots.map((slot) => {
      if (slot.team?.id === teamId) {
        return {
          ...slot,
          team: {
            ...slot.team,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
          lastModified: new Date().toISOString(),
        };
      }
      return slot;
    });

    const updatedManager = {
      ...teamSlotManager,
      slots: updatedSlots,
    };

    saveTeamSlots(updatedManager);
  }, [teamSlotManager, saveTeamSlots]);

  // Duplicate team to another slot
  const duplicateTeam = useCallback((sourceTeamId: string, targetSlotNumber: number) => {
    const sourceSlot = teamSlotManager.slots.find(slot => slot.team?.id === sourceTeamId);
    if (!sourceSlot?.team) return;

    const duplicatedTeam: Team = {
      ...sourceSlot.team,
      id: `team-${Date.now()}`,
      name: `${sourceSlot.team.name} (Copy)`,
      slotNumber: targetSlotNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveTeamToSlot(targetSlotNumber, duplicatedTeam);
  }, [teamSlotManager.slots, saveTeamToSlot]);

  // Toggle favorite status
  const toggleFavorite = useCallback((teamId: string) => {
    const slot = teamSlotManager.slots.find(slot => slot.team?.id === teamId);
    if (!slot?.team) return;

    updateTeamInSlot(teamId, {
      isFavorite: !slot.team.isFavorite,
    });
  }, [teamSlotManager.slots, updateTeamInSlot]);

  // Set active slot
  const setActiveSlot = useCallback((slotNumber?: number) => {
    const updatedManager = {
      ...teamSlotManager,
      activeSlot: slotNumber,
    };
    saveTeamSlots(updatedManager);
  }, [teamSlotManager, saveTeamSlots]);

  // Lock/unlock slot
  const toggleSlotLock = useCallback((slotNumber: number) => {
    const updatedSlots = teamSlotManager.slots.map((slot) => {
      if (slot.slotNumber === slotNumber) {
        return {
          ...slot,
          isLocked: !slot.isLocked,
          lastModified: new Date().toISOString(),
        };
      }
      return slot;
    });

    const updatedManager = {
      ...teamSlotManager,
      slots: updatedSlots,
    };

    saveTeamSlots(updatedManager);
  }, [teamSlotManager, saveTeamSlots]);

  // Update slot quick access name
  const updateSlotName = useCallback((slotNumber: number, quickAccessName: string) => {
    const updatedSlots = teamSlotManager.slots.map((slot) => {
      if (slot.slotNumber === slotNumber) {
        return {
          ...slot,
          quickAccessName,
          lastModified: new Date().toISOString(),
        };
      }
      return slot;
    });

    const updatedManager = {
      ...teamSlotManager,
      slots: updatedSlots,
    };

    saveTeamSlots(updatedManager);
  }, [teamSlotManager, saveTeamSlots]);

  // Add tournament submission to team
  const addTournamentSubmission = useCallback((teamId: string, submission: TournamentSubmission) => {
    const slot = teamSlotManager.slots.find(slot => slot.team?.id === teamId);
    if (!slot?.team) return;

    const updatedSubmissions = [...(slot.team.tournamentSubmissions || []), submission];
    
    updateTeamInSlot(teamId, {
      tournamentSubmissions: updatedSubmissions,
      lastUsedInTournament: submission.tournamentId,
      usageCount: (slot.team.usageCount || 0) + 1,
    });
  }, [teamSlotManager.slots, updateTeamInSlot]);

  // Get all teams (non-empty slots)
  const getAllTeams = useCallback((): Team[] => {
    return teamSlotManager.slots
      .filter(slot => slot.team !== null)
      .map(slot => slot.team!);
  }, [teamSlotManager.slots]);

  // Get teams by criteria
  const getTeamsByFilter = useCallback((filter: {
    isFavorite?: boolean;
    hasRentalCode?: boolean;
    recentlyUsed?: boolean;
  }) => {
    return getAllTeams().filter(team => {
      if (filter.isFavorite !== undefined && team.isFavorite !== filter.isFavorite) {
        return false;
      }
      if (filter.hasRentalCode !== undefined && Boolean(team.rentalTeamId) !== filter.hasRentalCode) {
        return false;
      }
      if (filter.recentlyUsed) {
        // Recently used in last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const lastUsed = team.tournamentSubmissions?.slice(-1)[0]?.submittedAt;
        if (!lastUsed || new Date(lastUsed) < thirtyDaysAgo) {
          return false;
        }
      }
      return true;
    });
  }, [getAllTeams]);

  // Get next available slot
  const getNextAvailableSlot = useCallback((): number | null => {
    const emptySlot = teamSlotManager.slots.find(slot => slot.team === null && !slot.isLocked);
    return emptySlot ? emptySlot.slotNumber : null;
  }, [teamSlotManager.slots]);

  // Export team data
  const exportTeamData = useCallback(() => {
    const teamsData = {
      slots: teamSlotManager.slots,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    
    const dataStr = JSON.stringify(teamsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vgc-hub-teams-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [teamSlotManager]);

  // Import team data
  const importTeamData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (importedData.slots && Array.isArray(importedData.slots)) {
          // Validate and merge imported data
          const updatedManager: TeamSlotManager = {
            ...teamSlotManager,
            slots: teamSlotManager.slots.map((currentSlot, index) => {
              const importedSlot = importedData.slots[index];
              if (importedSlot && importedSlot.team) {
                return {
                  ...currentSlot,
                  team: {
                    ...importedSlot.team,
                    id: `team-${Date.now()}-${index}`, // Generate new IDs to avoid conflicts
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                  lastModified: new Date().toISOString(),
                };
              }
              return currentSlot;
            }),
          };
          
          saveTeamSlots(updatedManager);
        }
      } catch (err) {
        console.error('Failed to import team data:', err);
        setError('Failed to import team data');
      }
    };
    reader.readAsText(file);
  }, [teamSlotManager, saveTeamSlots]);

  return {
    // State
    teamSlots: teamSlotManager.slots,
    activeSlot: teamSlotManager.activeSlot,
    maxSlots: teamSlotManager.maxSlots,
    loading,
    error,

    // Team operations
    saveTeamToSlot,
    removeTeamFromSlot,
    updateTeamInSlot,
    duplicateTeam,
    toggleFavorite,
    addTournamentSubmission,

    // Slot operations
    setActiveSlot,
    toggleSlotLock,
    updateSlotName,
    getNextAvailableSlot,

    // Data operations
    getAllTeams,
    getTeamsByFilter,
    exportTeamData,
    importTeamData,

    // Utility
    clearError: () => setError(null),
  };
};