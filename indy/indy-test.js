function runTests(engine, initState) {
    runSmokeTest(engine);

    // engine.initGame(initState);
    //engine.start();
}

function testInventoryLimit(engine) {

    engine.processCommand("pro ocas");
    engine.processCommand("seber sekeru");
    assertHasItem(engine, "sekeru");
    assertHasItem(engine, "ocas");

}

function runSmokeTest(engine) {
    const commands = ["PROZKOUMEJ OCAS", "SEBER SEKERU", "L", "POUZIJ SEKERU", "PROZKOUMEJ MRTVOLU FIZLA", "POLOZ SEKERU", "SEBER STIT", "P", "D",
        "POUZIJ STIT", "POLOZ STIT", "POUZIJ KAMEN", "P", "D", "SEBER TYC", "N", "L", "D", "POUZIJ TYC", "L", "D", "POUZIJ TYC",
        "POLOZ TYC", "PROZKOUMEJ MRTVOLU CHLUPATYHO", "SEBER UNIFORMU", "POUZIJ UNIFORMU", "P", "P", "POLOZ UNIFORMU", "D", "POLOZ DIAMANTY", "N",
        "SEBER UNIFORMU", "POUZIJ UNIFORMU", "L", "L", "SEBER TYC", "P", "P", "POLOZ UNIFORMU", "D", "SEBER DIAMANTY", "L", "P", "L", "D", "P", "POLOZ DIAMANTY",
        "SEBER SPENAT", "POUZIJ SPENAT", "POUZIJ TYC", "SEBER DIAMANTY", "L", "L", "POLOZ DIAMANTY", "PROZKOUMEJ MRTVOLU CIVILA",
        "SEBER LEGITIMACI", "P", "N", "P", "N", "SEBER UNIFORMU", "POUZIJ UNIFORMU", "L", "L", "N", "P", "N", "N", "P", "DOVNITR"
    ];

    commands.forEach(command => {
        if (engine.game.endState) {
            return;
        }
        engine.processCommand(command);
    });
    
    if (engine.game.endState != "win") {
        error("Smoke test failed with end state [" + engine.game.endState + "]");
    } else {
        success("Smoke test passed with end state [" + engine.game.endState + "]");
    }
}


function assertHasItem(engine, itemName) {
    if (!engine.game.getInventoryItem(itemName)) {
        error("Item " + itemName + " not in inventory");
    }
}

function error(message) {
    const messages = document.querySelector("#game-tests");
    const error = document.createElement("div");
    error.className = "error";
    error.textContent = message;
    messages.appendChild(error);
}

function success(message) {
    const messages = document.querySelector("#game-tests");
    const success = document.createElement("div");
    success.className = "success";
    success.textContent = message;
    messages.appendChild(success);
}