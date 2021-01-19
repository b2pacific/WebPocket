#!/usr/bin/env node

const yargs = require("yargs");
const io = require("socket.io-client");
const WebSocketClient = require("websocket").client;
const inquirere = require("inquirer");
const chalk = require("chalk");

const socketInputs = async (socket) => {
  const prompts = [
    {
      type: "list",
      name: "selection",
      message: "Choose your option",
      choices: ["emit", "exit"],
    },
    {
      type: "input",
      name: "event",
      message: "Enter event name: ",
      when: (answers) => answers.selection === "emit",
    },
    {
      type: "input",
      name: "msg",
      message: "Enter message: ",
      when: (answers) => answers.selection === "emit",
    }
  ];

  const answers = await inquirere.prompt(prompts);
  if (answers.selection === "emit") {
    socket.emit(answers.event, answers.msg);
  } else {
    process.exit(0);
  }
  console.log();
  return socketInputs(socket);
};

const sio = async (socket) => {
  const inputs = await socketInputs(socket);
  process.exit(0);
};

const wsInputs = async (socket) => {
  const prompts = [
    {
      type: "list",
      name: "selection",
      message: "Choose your option",
      choices: ["send", "exit"],
    },
    {
      type: "input",
      name: "msg",
      message: "Enter message: ",
      when: (answers) => answers.selection === "send",
    },
  ];

  const answers = await inquirere.prompt(prompts);
  if (answers.selection === "send") {
    socket.send(answers.msg);
  } else {
    process.exit(0);
  }
  console.log();
  return wsInputs(socket);
};

const ws = async (socket) => {
  const inputs = await wsInputs(socket);
  process.exit(0);
};

yargs
  .command({
    command: "socket",
    describe: "Connect to Socket.io Server",
    builder: {
      url: {
        describe: "URL of the Server",
        demandOption: true,
        type: "string",
      },
    },
    async handler(argv) {
      const socket = io(argv.url);

      await socket.on("connect", () => {
        console.log(
          chalk.blue(`\nConnected to ${argv.url} with Socket ID ${socket.id}\n`)
        );
        sio(socket);
      });

      await socket.on("disconnect", () => {
        console.log(chalk.green(`Disconnected from ${argv.url}`));
        process.exit(1);
      });

      await socket.on("connect_error", (err) => {
        console.log(chalk.red(`Trouble connecting to ${argv.url} \n ${err}`));
      });

      await socket.onAny((event, msg) => {
        console.log(chalk.green(
          `\nReceived data from server, Event: ${event}, Message: ${msg}\n\n\n`
        ));
      });
    },
  })
  .command({
    command: "ws",
    describe: "Connect to ws Server",
    builder: {
      url: {
        describe: "URL of the Server",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      const socket = new WebSocketClient();

      socket.on("connectFailed", (err) => {
        console.log(chalk.red(`Trouble connecting to ${argv.url} \n ${err}`));
      })

      socket.on("connect", (connection) => {
        console.log(chalk.blue(`\nConnected to ${argv.url}\n`));
        ws(connection);

        connection.on("error", (err) => {
          console.log(chalk.red(`Trouble connecting to ${argv.url} \n ${err}`));
        });

        connection.on("close", () => {
          console.log(chalk.green(`Disconnected from ${argv.url}`));
          process.exit(1);
        });

        connection.on("message", (msg) => {
          console.log(chalk.green(`\nReceived data from server, Type: ${msg.type}, Message: ${msg.utf8Data}\n\n\n`));
        });
      });
      socket.connect(argv.url, "echo-protocol");
    },
  })
  .demandCommand()
  .help()
  .wrap(72).argv;
