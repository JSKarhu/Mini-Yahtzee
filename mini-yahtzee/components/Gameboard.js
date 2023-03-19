import React, { useState, useEffect} from "react";
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from "../style/styles";
import { TabRouter } from "@react-navigation/native";
import Footer from "./Footer";
import {  NBR_OF_DICES, NBR_OF_THROWS, MAX_SPOT, SCOREBOARD_KEY } from '../constants/Game';
import { Col, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';

let board = [];


export default Gameboard = ({route}) => {

    const [playerName, setplayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');
    //This array has the info whether dices is selected or not
    const [selectedDices, setSelectedDices] = 
      useState(new Array(NBR_OF_DICES).fill(false));
    //this array has the info whether the spot counts has been selected or not
    const [selectedDicePoints, setSelectedDicePoints] = 
      useState(new Array(MAX_SPOT).fill(false));
    //this array has dice spots for a throw
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
    //this array has total points of different spot counts
    const [dicePointsTotal, setDiceSpotsTotal] = useState(new Array(MAX_SPOT).fill(0));
    const [scores, setScores] = useState([]);

    const [totalScore, setTotalScoreValue] = useState(0);

    function setTotalScore(newTotalScore) {
      let bonus = newTotalScore >= 63 ? 35 : 0;
      let totalScore = newTotalScore + bonus;
      setTotalScoreValue(totalScore);
    }
  

    const row = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
      row.push(
        <Pressable 
            key={"row" + i}
            onPress={() => selectDice(i)}>
          <MaterialCommunityIcons
            name={board[i]}
            key={"row" + i}
            size={50} 
            color={getDiceColor(i)}>
          </MaterialCommunityIcons>
        </Pressable>
      );
    }

    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={'points' + spot}>
                <Text key={'points' + spot} style={styles.points}>{getSpotTotal(spot)}</Text>
            </Col>
        )
    }
    

    const buttonsRow = [];
    for ( let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        buttonsRow.push(
        <Col key={'buttonsRow' + diceButton}>
            <Pressable
                key={'buttonsRow' + diceButton} 
                onPress={() => selectDicePoints(diceButton)}
                >
                <MaterialCommunityIcons name={'numeric-' + (diceButton + 1) + '-circle'}
                key={'buttonRow' + diceButton}
                size={40}
                color={getDicePointsColor(diceButton)}>
                </MaterialCommunityIcons>
            </Pressable>
        </Col>
        )
    }
      //This will be done once when entering to gameboard first time
    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setplayerName(route.params.player);
            getScoreboardData();
        }
    }, []);

    //This will be done when number of throws changes
    useEffect(() => {
      if (nbrOfThrowsLeft === 0) {
        setStatus('Select your points');
      }
      else if (nbrOfThrowsLeft < 0) {
        setNbrOfThrowsLeft(NBR_OF_THROWS-1);
      }
      else if (selectedDicePoints.every(x => x)) {
        savePlayerPoints();
      }
    }, [nbrOfThrowsLeft]);

    function getDiceColor(i) {
        if (board.every((val, i, arr) => val === arr[0])) {
          return "orange";
        }
        else {
          return selectedDices[i] ? "black" : "steelblue";
        }
      }

    function getDicePointsColor(i) {
      if (selectedDicePoints[i]) {
        return 'black';
      }
      else {
        return 'steelblue';
      }
    }

    function selectDice(i) {
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
      }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
      }

    function selectDicePoints(i) {
        let selected = [...selectedDices];
        let selectedPoints = [...selectedDicePoints];
        let points = [...dicePointsTotal];
        if (!selectedPoints[i]) {
          selectedPoints[i] = true;
          let nbrOfDices = diceSpots.reduce((total, x) => (x === (i +1) ? total +1: total), 0);
          points[i] = nbrOfDices * (i + 1);
          setDiceSpotsTotal(points);
        }
        const newTotalScore = points.reduce((sum, value) => sum + value, 0);
        setTotalScore(newTotalScore);
        selected.fill(false);
        setSelectedDices(selected);
        setSelectedDicePoints(selectedPoints);
        setNbrOfThrowsLeft(NBR_OF_THROWS)
        return points[i];
      }

    function throwDices() {
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
          if (!selectedDices[i]) {
            let randomNumber = Math.floor(Math.random() * 6 + 1);
            board[i] = 'dice-' + randomNumber;
            spots[i] = randomNumber;
          }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
        setDiceSpots(spots);
        setStatus('Select and throw dices again');
      }

    function checkWinner() {
        if (board.every((val, i, arr) => val === arr[0]) && nbrOfThrowsLeft > 0) {
          setStatus('You won');
        }
        else if (board.every((val, i, arr) => val === arr[0]) && nbrOfThrowsLeft === 0) {
          setStatus('You won, game over');
          setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
        else if (nbrOfThrowsLeft === 0) {
          setStatus('Game over');
          setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
        else {
          setStatus('Keep on throwing');
        }
      }

      useEffect(() => {
        checkWinner();
        if (nbrOfThrowsLeft === NBR_OF_THROWS) {
          setStatus('Game has not started');
        }
        if (nbrOfThrowsLeft < 0) {
          setNbrOfThrowsLeft(NBR_OF_THROWS-1);
        }
      }, [nbrOfThrowsLeft]);


      const getScoreboardData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
          if (jsonValue !== null) {
            let tmpScores = JSON.parse(jsonValue);
            setScores(tmpScores);
          }
        }
        catch (error) {
          console.log('Read error: ' + error.message);
        }
      }

      const getCurrentDate=()=>{
 
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
   
        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        return date + '.' + month + '.' + year;//format: d-m-y;
      }

      const getCurrentTime=()=>{
 
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
   
        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        return hours + ':' + minutes;//format: d-m-y;
      }      

      const savePlayerPoints = async () => {
        const playerPoints = {
          name: playerName,
          date: getCurrentDate(), // replace this
          time: getCurrentTime(),  // replace this
          points: totalScore  // replace this
        }
        try {
          const newScore = [...scores, playerPoints];
          const jsonValue = JSON.stringify(newScore);
          await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
        }
          catch (error) {
            console.log('Save error: ' + error.message);
          }
      }

      
      
    
    return(
        <View style={styles.gameboard}>
             <View style={styles.flex}>{row}</View>
        <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
        <Text style={styles.gameinfo}>{status}</Text>
        <Pressable style={styles.button}
            onPress={() => throwDices()}>
          <Text style={styles.buttonText}>
            Throw dices
          </Text>
        </Pressable>
            <View style={styles.dicePoints}><Grid>{pointsRow}</Grid></View>
            <View style={styles.dicePoints}><Grid>{buttonsRow}</Grid></View>
            {totalScore < 63 ?
            <>
            <Text style={styles.header}>Total: {totalScore}  </Text>
            <Text>You are {(63 - totalScore)} away from bonus!</Text>
            </>
            :
            <>
            <Text style={styles.header}>Total: {totalScore}  </Text>
            <Text>You got the bonus! {totalScore} </Text>
            </>
            }
            <Text>Player: {playerName}</Text>
            <Footer />
        </View>
    )
}