import { SafeAreaView, Text, View } from 'react-native';
import React from 'react';
import Home from './components/Home';
import Footer from './components/Footer';
import Header from './components/Header';
import Gameboard from './components/Gameboard';
import styles from './style/styles';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Scoreboard from './components/Scoreboard';

const Tab = createBottomTabNavigator();

export default function App() {



  return (
    <NavigationContainer>
      <Header />
      
      <Tab.Navigator>
      <Tab.Screen name='Home'
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='ios-home' size={size} color={color} />
        )}}
      />
      <Tab.Screen
        name='Gameboard'
        component={Gameboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='ios-game-controller' size={size} color={color} />
          )}}
      />
      <Tab.Screen
        name='Scoreboard'
        component={Scoreboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='ios-trophy' size={size} color={color} />
          )}}
      />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}


