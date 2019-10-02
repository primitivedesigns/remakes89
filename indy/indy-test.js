function runTests(engine, initState) {
    testFullPath(engine);
    restart(engine);
    testInventoryLimit(engine);
}

function testInventoryLimit(engine) {
    info("---- Inventory Limit Test ----");
    let failed = false;
    engine.processCommand("prozkoumej ocas");
    engine.processCommand("seber sekeru");
    if (assertTrue(engine.game.getInventoryItem("sekeru"), "Ma mit sekeru, inventar: " + JSON.stringify(engine.game.inventory))) {
        return;
    }
    engine.processCommand("doleva");
    engine.processCommand("pouzij sekeru");
    engine.processCommand("prozkoumej mrtvolu fizla");
    engine.processCommand("seber stit");
    engine.processCommand("doprava");
    engine.processCommand("dolu");
    engine.processCommand("pouzij stit");
    engine.processCommand("seber kamen");
    if (assertFalse(engine.game.getInventoryItem("kamen"), "Nema mit kamen")) {
        return;
    }
    success("Test passed");
}

function testFullPath(engine) {
    info("---- Full Path Test ----");
    const commands = ["PROZKOUMEJ OCAS", "SEBER SEKERU", "L", "POUZIJ SEKERU", "PROZKOUMEJ MRTVOLU FIZLA", "SEBER STIT", "P", "D",
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
        error("Test failed with end state [" + engine.game.endState + "]");
    } else {
        success("Test passed with end state [" + engine.game.endState + "]");
    }
}