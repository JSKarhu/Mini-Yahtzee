import React, { useState } from 'react';
import {  Text, View, TextInput, Pressable, Keyboard } from 'react-native';
import {  NBR_OF_DICES, NBR_OF_THROWS, MAX_SPOT, SCOREBOARD_KEY } from '../constants/Game';
import styles from '../style/styles';

export default function Home({navigation}) {

    const [playerName, setplayerName] = useState('');
    const [hasPlayerName, sethasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            sethasPlayerName(true);
            Keyboard.dismiss();
        }
    }

  return (
    <View style={styles.container}>
        { !hasPlayerName
        ?
        <>
        <Text style={styles.gameinfo}>For scoreboard enter your name</Text>
        <TextInput style={styles.gameinfo} onChangeText={setplayerName} autoFocus={true}></TextInput>
        <Pressable onPress={() => handlePlayerName(playerName)}>
            <Text style={styles.buttonText}>OK</Text>
        </Pressable>
        </>
        :
        <>
        <Text style={styles.gameinfo}>Rules of the game:</Text>
        <Text style={styles.gameinfo}>THE GAME: Upper section of the classic Yahtzee dice game. You have 5 dices and for the every dice you have 3 throws. After each throw you can keep dices in
        order to get same dice spot counts as many as
        possible. In the end of the turn you must select
        your points from 1 to 6.
        Game ends when all points have been selected.
        The order for selecting those is free.
        POINTS: After each turn game calculates the sum
        for the dices you selected. Only the dices having
        the same spot count are calculated. Inside the
        game you can not select same points from
        1 to 6 again.
        GOAL: To get points as much as possible.
        63 points is the limit of
        getting bonus which gives you 50
        points more.</Text>
        <Text style={styles.gameinfo}>Good luck, {playerName}</Text>
        <Pressable onPress={() => navigation.navigate('Gameboard', {player: playerName})}>
            <Text style={styles.buttonText}>PLAY</Text>
        </Pressable>
        </>
        }
        <Footer />
    </View>
  )
}