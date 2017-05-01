/**
 * Created by Leo on 25/04/2017.
 */

const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// var rpio = require('rpio');

var SerialPort = require("serialport")
var serialPort = new SerialPort("/dev/cu.usbmodem1411", { baudrate: 115200 });

app.post('/', (request, response) => {
    var balloonOrder = request.body.balloonOrder
    var message = balloonOrder ? "Je donne tout !!!" : "You are saving the earth, bro"

    console.log(message);
    resolveOrder(balloonOrder);

    response.send(JSON.stringify(
        {
            message: message,
            balloonStatus: balloonOrder
        }
    ))
})

resolveOrder = (balloonOrder) => {
    sendToArduino(balloonOrder ? 1 : 0)
}

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})

sendToArduino = (data) => {
    var buf = new Buffer(1);
    buf.writeUInt8(data, 0);
    serialPort.write(buf);
}

// senToGPIO = (data) => {
//     // It's the GPIO 18 actually
//     var GPIOpin = 11;
//
//     rpio.open(GPIOpin, rpio.OUTPUT, rpio.LOW);
//
//     rpio.write(GPIOpin, data ? rpio.HIGH : rpio.LOW);
//
// }