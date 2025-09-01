import React, { useState, createContext, useContext } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import TournamentsScreen from './screens/TournamentsScreen';
import PairingsScreen from './screens/PairingsScreen';
import BlogScreen from './screens/BlogScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import SocialScreen from './screens/SocialScreen';
import SupportScreen from './screens/SupportScreen';
import QRScreen from './screens/QRScreen';
import TicketsScreen from './screens/TicketsScreen';
import CalendarScreen from './screens/CalendarScreen';
import MetagameScreen from './screens/MetagameScreen';

const Tab = createBottomTabNavigator();

const AuthContext = createContext();

const mockUser = {
  name: 'Manraj Sidhu',
  email: 'manraj@vgchub.com',
  division: 'Master',
  region: 'North America',
  achievements: [
    'Regional Champion 2023',
    'Top 8 Worlds 2023',
    'Meta Innovator',
  ],
};

export function useAuth() {
  return useContext(AuthContext);
}

export default function App() {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email === 'manraj@vgchub.com' && password === 'password123') {
      setUser(mockUser);
      return true;
    }
    return false;
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user ? (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                let iconName;
                switch (route.name) {
                  case 'Home': iconName = 'home-outline'; break;
                  case 'Tournaments': iconName = 'trophy-outline'; break;
                  case 'Pairings': iconName = 'people-outline'; break;
                  case 'Blog': iconName = 'book-outline'; break;
                  case 'Social': iconName = 'chatbubble-ellipses-outline'; break;
                  case 'Support': iconName = 'help-circle-outline'; break;
                  case 'QR': iconName = 'qr-code-outline'; break;
                  case 'Tickets': iconName = 'ticket-outline'; break;
                  case 'Calendar': iconName = 'calendar-outline'; break;
                  case 'Metagame': iconName = 'bar-chart-outline'; break;
                  case 'Profile': iconName = 'person-outline'; break;
                  case 'Settings': iconName = 'settings-outline'; break;
                  default: iconName = 'ellipse-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#3B82F6',
              tabBarInactiveTintColor: '#6B7280',
              tabBarStyle: { paddingBottom: 4, height: 60 },
              tabBarLabelStyle: { fontSize: 12 },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Tournaments" component={TournamentsScreen} />
            <Tab.Screen name="Pairings" component={PairingsScreen} />
            <Tab.Screen name="Blog" component={BlogScreen} />
            <Tab.Screen name="Social" component={SocialScreen} />
            <Tab.Screen name="Support" component={SupportScreen} />
            <Tab.Screen name="QR" component={QRScreen} />
            <Tab.Screen name="Tickets" component={TicketsScreen} />
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      ) : (
        <LoginScreen />
      )}
    </AuthContext.Provider>
  );
}
