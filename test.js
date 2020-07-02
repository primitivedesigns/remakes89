function restart(engine) {
    console.log("===========================");
    console.log("==== Restarting engine ====");
    console.log("===========================");
    engine.initGame();
    engine.start();
}

function executeCommands(commands, engine, processCommand) {
    for (let index = 0; index < commands.length; index++) {
        console.log("==== Step " + (index + 1) + "/" + commands.length + " ====");
        const command = commands[index];
        if (engine.game.endState) {
            return;
        }
        if (processCommand) {
            processCommand(command);
        } else {
            engine.processCommand(command);
        }
    }
}

function assertTrue(condition, message) {
    if (!condition) {
        error("ERROR: " + message);
        return true;
    }
    return false;
}

function assertFalse(condition, message) {
    if (condition) {
        error(message);
        return true;
    }
    return false;
}

function info(text) {
    message(text, "info");
}

function error(text) {
    message(text, "error");
}

function success(text) {
    message(text, "success");
}

function message(text, cssClass) {
    const messages = document.querySelector("#game-tests");
    const message = document.createElement("div");
    message.className = cssClass;
    message.textContent = text;
    messages.appendChild(message);
}