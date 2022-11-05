#!/usr/bin/node
const { showfileTreeFn, organiseFn, helpFn } = require("./organizerFunction");

//Get CLI Inputs
let cliInputParams = process.argv.slice(2);
let cliCommand = cliInputParams[0];

// Check the cli i/p
// console.log(cliInputParams);

//Check for the CLI command

switch (cliCommand) {
  case "show_file_tree":
    showfileTreeFn(cliInputParams[1]);
    break;
  case "organize_files":
    organiseFn(cliInputParams[1], cliInputParams[2] === "cut" ? true : false);
    break;
  case "help":
    helpFn();
    break;
  default:
    console.log("Please enter the write command or try help");
    break;
}
