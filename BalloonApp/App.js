/**
 * Created by Leo on 25/04/2017.
 */

import React, {Component} from 'react'
import {Button, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native'
import {Constants} from 'expo'
import settings from "./settings"
import {Ionicons} from '@expo/vector-icons';

const mode = {
    "0": "Balloon OFF",
    "1": "Balloon ON",
    "2": "Balloon AUTO"
}

export default class App extends Component {
    state = {
        AppStatus: "",
        balloonStatus: false,
        balloonOrder: "",
        isRefreshing: "",
    };

    render() {
        this.refreshStatus();
        return (
            <View style={styles.container}>
                <View style={{flex: 2}}/>
                <Button
                    title="On en est ou ?"
                    onPress={this.refreshStatus}
                    style={{flex: 1}}
                />
                {this.renderToogle()}
                {this.renderBalloonStatus()}
            </View>
        );
    }

    renderToogle = () => {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TouchableOpacity onPress={this.toogleBalloon(0)}>
                    <Ionicons name="ios-snow" size={32} color={this.state.balloonOrder === 0 ? "blue" : ""} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.toogleBalloon(2)}>
                    <Ionicons name="cycle" size={32} color={this.state.balloonOrder === 2 ? "green" : ""} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.toogleBalloon(1)}>
                    <Ionicons name="ios-bonfire" size={32} color={this.state.balloonOrder === 1 ? "red" : ""} />
                </TouchableOpacity>
            </View>
        )
    }

    renderBalloonStatus = () => {
        return (
            <View>
                <View style={{flex: 3}}/>
                { this.state.isRefreshing ?
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                    /> :
                    <View>
                        <Text style={{flex: 1}}>{this.state.AppStatus}</Text>
                        <Ionicons name="thermometer" size={32} color={this.state.balloonStatus === 0 ? "blue" : this.state.balloonStatus === 1 ? "red" : "green"} />
                    </View>
                }
                <View style={{flex: 2}}/>
            </View>
        )
    }

    toogleBalloon = (order) => {
        this.setState({
            AppStatus: "Je donne tout pour envoyer l'ordre, chef !",
            balloonOrder: order
        })
        this.sendOrder();
    }

    refreshStatus = async() => {
        this.setState({isRefreshing: true})
        try {
            let response = await fetch(settings.RASBERRYPI_URL)
            if (response.status === 200) {
                response = await response.json();
                this.setState({
                    balloonStatus: response.balloonStatus,
                    balloonOrder: !response.balloonStatus,
                    AppStatus: "Le balloon dit : " + response.message
                })
            }
        } catch (error) {
            this.setState({AppStatus: "J'arrive pas à joindre la Pi chef !"})
        }
        this.setState({isRefreshing: false})
    }

    sendOrder = async () => {
        this.setState({isRefreshing: true})
        try {
            let response = await fetch(settings.RASBERRYPI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'balloonOrder': this.state.balloonOrder
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
    },
});