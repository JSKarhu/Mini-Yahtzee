
import React, { useState, useEffect} from 'react';
import {  Text, View, Button, Pressable } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import {  NBR_OF_DICES, NBR_OF_THROWS, MAX_SPOT, SCOREBOARD_KEY } from '../constants/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../style/styles";



export default Scoreboard = ({ navigation }) => {

  const [scores, setScores] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus',() => {
      getScoreboardData();
    });
    return unsubscribe;
  }, [navigation]);

  const getScoreboardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
      if (jsonValue !== null) {
        let tmpScores = JSON.parse(jsonValue);
        tmpScores.sort((a, b) => b.points - a.points);
        setScores(tmpScores.slice(0, 7));
      }
    }
    catch (error) {
      console.log('Read error: ' + error.message);
    }
  }

  const clearScoreboard = async () => {
  try {
    await AsyncStorage.removeItem(SCOREBOARD_KEY);
    setScores([]);
  } catch (error) {
    console.log('Clear error: ' + error.message);
  }
}

  

  return (
    <View>
      {scores.map((player, i) => (
        <Text key={i}>{i + 1}. {player.name} {player.date} {player.time} {player.points}</Text>
      ))}
      <Button title='Clear scoreboard' onPress={clearScoreboard}></Button>
    </View>
  );
}