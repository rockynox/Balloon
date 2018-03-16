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

var balloonOrder = ""

// var rpio = require('rpio');

var SerialPort = require("serialport")
var serialPort = new SerialPort("/dev/ttyACM0", {baudrate: 115200});

app.post('/', (request, response) => {

    balloonOrder = request.body

    console.log(request.body.message);
    resolveOrder(request.body.code);

    response.send(JSON.stringify(
        {
            message: request.body.message,
            balloonStatusCode: balloonOrder.code
        }
    ))
})

app.get('/', (request, response) => {

    console.log(balloonOrder.message);
    resolveOrder(balloonOrder.code);

    response.send(JSON.stringify(
        {
            message: balloonOrder.message,
            balloonStatusCode: balloonOrder.code
        }
    ))
})

resolveOrder = (balloonOrder) => {
    sendToArduino(balloonOrder)
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