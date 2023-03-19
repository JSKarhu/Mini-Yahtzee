import React from "react";
import { Text, View } from "react-native";
//import { Header } from "react-native/Libraries/NewAppScreen";
import styles from '../style/styles';

export default Footer = () => {

    return (
        <View style={styles.footer}> 
            <Text style={styles.author}>
                Author: Joona Karhu
            </Text>
        </View>
    )
} 