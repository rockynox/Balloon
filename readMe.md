#Balloon Project
*Build a smart Home with a RasberryPi, Arduino and React-native*


## A. Architecture

The communication between :
- The App and the server is made by a REST service.
- The Arduino and the RasberryPi is made by the serial port.


### 1. RasberryPi (server)

To launch the server :
```
node index.js
```

- Node server
- REST service

### 2. App (React-Native)

```
npm start
```

### 3. Arduino

With **servo.h** library.

## B. REST formalisation

- POST on '/'
With JSON body : 
```
    {
        'balloonOrder' : balloonOrder
    }
```

-- Response -- 
200
With JSON body :
``` 
    {
        message: message,
        balloonStatus: balloonOrder
    }
```

## C. Serial formalisation

On serial port :  
 - 0 : Balloon OFF
 - 1 : Balloon ON
 - 2 : Baloon AUTO
 

#TODO

- Implement the Refresh status and the Auto mode (TODO : test)
- Make this app a standalone app (complete the app.json)
- LCD Screen with status prompt
- Implement the router/navigation
- Put some push notification 
- Put some reminder based on your habits "do you want some hot water for your shower"
- With relay + arduino AdafruitWifi, auto control of the music (wake up music...)
- Play music based on the humor (image recognition -> miscrosoft API)
- Voice control ? 
