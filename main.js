#! /usr/bin/env node

const { EOL } = require("os");

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.error('uncaughtExceptionMonitor', err, origin);
});

let myArgs = process.argv;
let stdinFound = process.stdin.isTTY !== true; // https://stackoverflow.com/a/39801858/1997873

let help_flag = myArgs.indexOf('-h') > -1 ||
    myArgs.indexOf('--help') > -1;
let quiet_flag = myArgs.indexOf('-q') > -1;
let ascii_flag = myArgs.indexOf('--ascii') > -1;
let keep_empty_flag = myArgs.indexOf('-k') > -1 ||
    myArgs.indexOf('--keep-empty') > -1;
let verbose_flag = myArgs.indexOf('--verbose') > -1;

if (help_flag) {
    console.log([
        "Process stdin with node power",
        "npx pipestr [..flags] \"(d, l[]) => {code to run}\" ",
        "d is the entire data, and l is lines",
        "",
        "Flags:",
        "Help\t-h/--help",
        "No extra logs\t-q",
        "Ascii encoding (not utf)\t--ascii",
        "Keep empty lines\t--keep-empty",
        "Print args and more info\t--verbose",
    ].join('\n'))
    process.exit(quiet_flag ? 0 : 1);
}

if (!stdinFound) {
    if (!quiet_flag) {
        console.log("No stdin! exiting... (-q to hide this message)")
    }
    process.exit(quiet_flag ? 0 : 1);
}

if (verbose_flag) {
    console.log(myArgs)
}

let result = "";

process.stdin.on('data', (d) => result += d.toString(ascii_flag ? "ascii" : "utf-8"))

process.stdin.once('end', () => {
    let func = new Function("d", "l", "return " + myArgs[myArgs.length - 1]);
    let lines = result.split(EOL);
    if (!keep_empty_flag) {
        lines = lines.filter(e => !!e && e.length > 0)
    }
    process.stdout.write(
        func.call({},
            lines.join(EOL), lines
        )
        || ""
    );
})