/**
 * Created by Leo on 25/04/2017.
 */

import React, {Component} from 'react'
import {Button, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native'
import {Constants} from 'expo'
import settings from "./settings"
import {Ionicons} from '@expo/vector-icons';

const modes = {
    OFF : {
        id : 0,
        name : "Balloon OFF",
        message : "You are saving the earth, bro",
        arduinoCode: 0
    },
    ON : {
        id : 1,
        name : "Balloon ON",
        message : "Ca chauffe dans mon body !!!",
        arduinoCode: 1
    },
    AUTO : {
        id : 2,
        name : "Balloon AUTO",
        message : "Je gère, l'ami !",
        arduinoCode: 2
    }
}

export default class App extends Component {
    state = {
        AppStatus: "",
        balloonStatus: false,
        balloonOrder: "",
        isRefreshing: "",
    };

    componentWillMount() {
        this.refreshStatus();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}/>
                <Button
                    title="On en est ou ?"
                    onPress={this.refreshStatus}
                    style={{flex: 1}}
                />
                <View style={{flex: 1}}/>
                {this.renderToogle()}
                <View style={{flex: 1}}/>
                {this.renderBalloonStatus()}
                <View style={{flex: 1}}/>
            </View>
        );
    }

    renderToogle = () => {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
            }}>
                <TouchableOpacity onPress={() => {this.toogleBalloon(modes.OFF)}} style={{flex:1, alignItems:'center'}}>
                    <Ionicons name="ios-snow" size={55} color={this.state.balloonOrder.id === 0 ? "blue" : "black"} />
                    <Text>OFF</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.toogleBalloon(modes.AUTO)}} style={{flex:1, alignItems:'center'}}>
                    <Ionicons name="md-infinite" size={55} color={this.state.balloonOrder.id === 2 ? "green" : "black"} />
                    <Text>AUTO</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.toogleBalloon(modes.ON)}} style={{flex:1, alignItems:'center'}}>
                    <Ionicons name="ios-bonfire" size={55} color={this.state.balloonOrder.id === 1 ? "red" : "black"} />
                    <Text>ON</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderBalloonStatus = () => {
        return (
            <View style={{flex:1}}>
                { this.state.isRefreshing ?
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                    /> :
                    <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{flex: 1}}>{this.state.AppStatus}</Text>
                        <Ionicons
                            name="ios-thermometer"
                            size={32}
                            color={this.state.balloonStatus === 0 ? "blue" : this.state.balloonStatus === 1 ? "red" : "green"}
                            style={{flex:1}}
                        />
                    </View>
                }
            </View>
        )
    }

    toogleBalloon = (mode) => {
        this.setState({
            AppStatus: "Je donne tout pour envoyer l'ordre, chef !",
            balloonOrder: mode
        })
        this.sendOrder(mode);
    }

    refreshStatus = async() => {
        this.setState({isRefreshing: true})
        try {
            let response = await fetch(settings.RASBERRYPI_URL)
            if (response.status === 200) {
                response = await response.json();
                this.setState({
                    balloonStatus: response.balloonStatus,
                    AppStatus: "Le balloon dit : " + response.message
                })
            }
        } catch (error) {
            this.setState({AppStatus: "J'arrive pas à joindre la Pi chef !"})
        }
        this.setState({isRefreshing: false})
    }

    sendOrder = async (mode) => {
        this.setState({isRefreshing: true})
        try {
            let response = await fetch(settings.RASBERRYPI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'arduinoCode': mode.arduinoCode,
                    'message' : mode.message
                })
            })
            if (response.status === 200) {
                response = await response.json()
                this.setState({
                    balloonStatus: response.balloonStatus,
                    AppStatus: "Le balloon dit : " + response.message
                })
            }
        } catch (error) {
            this.setState({AppStatus: "J'arrive pas à joindre la Pi chef !"})
        }
        this.setState({isRefreshing: false})
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        flexDirection: 'column',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
    },
});