import { SafeAreaView, Text, View } from 'react-native';
import React from 'react';
import Home from './components/Home';
import Footer from './components/Footer';
import Header from './components/Header';
import Gameboard from './components/Gameboard';
import styles from './style/styles';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Scoreboard from './components/Home';

const Tab = createBottomTabNavigator();

export default function App() {



  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='Home' component={Home} />
        <Tab.Screen name='Gameboard' component={Gameboard} />
        <Tab.Screen name='Scoreboard' component={Scoreboard} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


