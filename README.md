# WebPocket

## Goal

WebPocket is a package that helps Backend Developers to easily test their WebSocket Servers. Normally when we make a Server that uses WebSockets instead of HTTPS, we have to use the browser console to emit messages to the server and test whether the server is working as required or not. But this is a very tiring task to type below commands

```
socket.emit("message", "Hello World");

ws.send("Hello World");

OR

socket.on("message", (msg) => {
    // Do stuff
}) 

ws.onmessage((type, msg) => {
    //Do stuff
})
```

every time we need to emit a message to the backend or listen for messages from the backend.

So, this package solves this problem by providing you a command line tool, with which you don't have to write those commands, instead you just have to run this tool once and then you can type in your message to be emitted to the server and hit enter and that's it, it's done.

## Documentation

### Installation


You can install it globally

```
npm install -g webpocket

OR

npm i -g webpocket
```

### Commands

```
wp --version
```

To show the installed version of the package

```
wp --help
```

To display all the commands for this package

```
wp socket --url="http://localhost:3000"
```

To connect to a Socket.io Server running on localhost:3000

```
wp ws --url="http://localhost:3000"
```

To connect to a WebSocket Server running on localhost:3000


After you are connected to a server, you will get option to either send a message to server or quit in case of WebSocket Server or emit an event or quit in the case of a Socket.io Server.

You don't have to listen to events, the tool will listen to events and messages that are emitted by the server and display them on the command line.

In case any error occurs or the server get's disconnected, then appropriate error messages will be displayed.


## Built With

* <a href="https://www.npmjs.com/package/yargs">yargs</a>
* <a href="https://www.npmjs.com/package/inquirer">inquirer</a>
* <a href="https://www.npmjs.com/package/chalk">chalk</a>
* <a href="https://www.npmjs.com/package/socket.io-client">socket.io-client</a>
* <a href="https://www.npmjs.com/package/websocket">websocket</a>

## Author

Prashant Pandey - Initial work - <a href="https://github.com/b2pacific">b2pacific</a>

## License

This project is licensed under the MIT License - see the LICENSE file for details.
