/**
 * Created by Leo on 25/04/2017.
 */

import React, { Component } from 'react'
import { Button, Text, View, StyleSheet } from 'react-native'
import { Constants } from 'expo'
import settings from "./settings"
import { Ionicons } from '@expo/vector-icons';

const mode = {
    "0": "Balloon OFF",
    "1": "Balloon ON",
    "2": "Balloon AUTO"
}

export default class App extends Component {
    state = {
        AppStatus: null,
        balloonStatus: false,
        balloonOrder: ""
    };

    render() {
        let icon = this.state.balloonStatus ?
            <Ionicons name="ios-bonfire" size={32} color="red" style={{flex:1}}/> :
            <Ionicons name="ios-snow" size={32} color="blue" style={{flex:1}}/>

        let textIcon = this.state.balloonStatus ?
            <Text style={{flex:1}}>Ca chauffe....</Text> :
            <Text style={{flex:1}}>Douche froide bro</Text>
        return (
            <View style={styles.container}>
                <View style={{flex:2}}/>
                <Button
                  title="Azy clique moi un peu pour voir !"
                  onPress={this.toogleBalloonPower}
                  style={{flex:1}}
              />
              <Text style={{flex:1}}>{this.state.AppStatus}</Text>
                <View style={{flex:3}}/>
                {icon}
                {textIcon}
                <View style={{flex:2}}/>
            </View>
        );
    }

    toogleBalloonPower = () => {
        this.sendOrder();
        this.setState({AppStatus: "Je donne tout pour envoyer l'ordre, chef !"})
    }

    sendOrder = async () => {
        try {
            let response = await fetch(settings.RASBERRYPI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'balloonOrder' : this.state.balloonOrder
                })
            })
            if(response.AppStatus === 200) {
                response = await response.json()
                this.setState({balloonStatus:response.balloonStatus})
                this.setState({balloonOrder:!this.state.balloonOrder})
                this.setState({AppStatus: "Le balloon dit : " + response.message})
            }
        } catch (error) {
            this.setState({AppStatus: "J'arrive pas à joindre la Pi chef !"})
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
    },
});