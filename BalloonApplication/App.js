import {Ionicons} from '@expo/vector-icons';
import {Constants} from 'expo';
import React from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import settings from './settings';

const BALLOON_STATUS = [
        INIT = {
            message: 'Salut toi !',
        },
        SENDING_ORDER = {
            message: 'Je donne tout pour envoyer l\'ordre, chef !',
        },
        ON = {
            message: 'Ca chauffe dans mon body !!!',
            orderCode: 'ON',
        },
        AUTO = {
            message: 'Je gère, l\'ami !',
            orderCode: 'AUTO',
        },
        ERR = {
            message: 'J\'arrive pas à joindre le balloon l\'ami !',
        },
    ]
;

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            balloonStatusCode: null,
            balloonStatus: '',
            sentOrder: '',
            isRefreshing: '',
        };
    }

    componentWillMount() {
        // this.refreshStatus();
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
                            style={{flex: 1}}>{
                            console.warn("state : " + this.state.balloonStatus)
                        }</Text>
                        <Ionicons
                            name="ios-thermometer"
                            size={32}
                            color={this.state.balloonStatus === BALLOON_STATUS.ON ? 'red' : 'green'}
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
            let response = await fetch(settings.RASBERRYPI_URL + '/ORDER=' + order.orderCode, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                response = await response.json();
                this.setState({
                    balloonStatusCode: this.getStatusFromCode(response.status),
                });
            }
        } catch (error) {
            this.setState({
                balloonStatus: BALLOON_STATUS.ERR,
            });
        }
        this.setState({isRefreshing: false});
    };

    refreshStatus = async () => {
        this.setState({isRefreshing: true});
        try {
            let response = await fetch(settings.RASBERRYPI_URL + '/STATUS');
            console.warn("response : ");

            if (response.status === 200) {
                response = await response.json();
                this.setState({
                    balloonStatusCode: this.getStatusFromCode(response.status),
                });
            }
        } catch (error) {
            this.setState({balloonStatus: BALLOON_STATUS.ERR});
        }
        this.setState({isRefreshing: false});
    };

    getStatusFromCode = (statusCode) => {
        console.warn("getStatus : " + statusCode);
        return BALLOON_STATUS
            .filter(status => status.orderCode === statusCode)[0];
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
