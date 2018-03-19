import {Ionicons} from '@expo/vector-icons';
import {Constants} from 'expo';
import React from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import settings from './settings';

const BALLOON_ORDER = {
    ON: {
        code: 1,
    },
    AUTO: {
        code: 2,
    },
};

const BALLOON_STATUS = [
        SENDING_ORDER = {
            message: 'Je donne tout pour envoyer l\'ordre, chef !',
        },
        ON = {
            message: 'Ca chauffe dans mon body !!!',
            orderCode: 1,
        },
        AUTO = {
            message: 'Je gère, l\'ami !',
            orderCode: 2,
        },
        ERROR = {
            message: 'J\'arrive pas à joindre le balloon l\'ami !',
        },
    ]
;

export default class App extends React.Component {
    state = {
        balloonStatusCode: null,
        balloonStatusMessage: '',
        sentOrder: '',
        isRefreshing: '',
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
                <TouchableOpacity onPress={() => {
                    this.toogleBalloonStatus(BALLOON_STATUS.AUTO);
                }} style={{flex: 1, alignItems: 'center'}}>
                    <Ionicons name="md-infinite" size={55}
                              color={this.state.sentOrder === BALLOON_STATUS.AUTO ? 'green' : 'black'}/>
                    <Text>AUTO</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    this.toogleBalloonStatus(BALLOON_STATUS.ON);
                }} style={{flex: 1, alignItems: 'center'}}>
                    <Ionicons name="ios-bonfire" size={55}
                              color={this.state.sentOrder === BALLOON_STATUS.ON ? 'red' : 'black'}/>
                    <Text>ON</Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderBalloonStatus = () => {
        return (
            <View style={{flex: 1}}>
                { this.state.isRefreshing ?
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                    /> :
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Text
                            style={{flex: 1}}>{this.state.balloonStatusMessage}</Text>
                        <Ionicons
                            name="ios-thermometer"
                            size={32}
                            color={this.state.balloonStatusCode === 1 ? 'red' : 'green'}
                            style={{flex: 1}}
                        />
                    </View>
                }
            </View>
        );
    };

    toogleBalloonStatus = (status) => {
        this.setState({
            balloonStatusMessage: 'Je donne tout pour envoyer l\'ordre, chef !',
            sentOrder: status,
        });
        this.sendOrder(status);
    };

    sendOrder = async (order) => {
        this.setState({isRefreshing: true});
        try {
            let response = await fetch(settings.RASBERRYPI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'order': order.code,
                }),
            });
            if (response.status === 200) {
                response = await response.json();
                this.setState({
                    balloonStatusCode: response.balloonStatusCode,
                });
            }
        } catch (error) {
            this.setState({
                balloonStatusMessage: BALLOON_STATUS.ERROR,
            });
        }
        this.setState({isRefreshing: false});
    };

    refreshStatus = async () => {
        this.setState({isRefreshing: true});
        try {
            let response = await fetch(settings.RASBERRYPI_URL);
            if (response.status === 200) {
                response = await response.json();
                this.setState({
                    balloonStatusCode: response.balloonStatusCode,
                    balloonStatusMessage: 'Le balloon dit : ' + response.message,
                });
            }
        } catch (error) {
            this.setState({balloonStatusMessage: BALLOON_STATUS.ERROR});
        }
        this.setState({isRefreshing: false});
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
