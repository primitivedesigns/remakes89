const fullPathCommands = [
    // m2
    "PROZKOUMEJ OCAS", "SEBER SEKERU", "L",
    // m1
    "POUZIJ SEKERU", "PROZKOUMEJ MRTVOLU FIZLA", "SEBER STIT", "P", "D",
    // m5
    "POUZIJ STIT", "POLOZ STIT", "POUZIJ KAMEN", "P", "D",
    // m9
    "SEBER TYC", "N", "L", "D",
    // m8
    "POUZIJ TYC", "L", "D",
    // m10
    "POUZIJ TYC", "POLOZ TYC", "PROZKOUMEJ MRTVOLU CHLUPATYHO", "SEBER UNIFORMU", "POUZIJ UNIFORMU", "P", "P",
    // m12
    "POLOZ UNIFORMU", "D",
    // m15
    "POLOZ DIAMANTY", "N",
    // m12
    "SEBER UNIFORMU", "POUZIJ UNIFORMU", "L", "L",
    // m10
    "SEBER TYC", "P", "P",
    // m12
    "POLOZ UNIFORMU", "D",
    // m15
    "SEBER DIAMANTY", "L", "D", "P",
    // m18
    "POLOZ DIAMANTY", "SEBER SPENAT", "POUZIJ SPENAT", "POUZIJ TYC", "SEBER DIAMANTY", "L", "L",
    // m16
    "POLOZ DIAMANTY", "PROZKOUMEJ MRTVOLU CIVILA", "SEBER LEGITIMACI", "P", "N", "P", "N",
    // m12
    "SEBER UNIFORMU", "POUZIJ UNIFORMU", "L", "L", "N", "P", "N", "N", "P",
    // m3
    "DOVNITR"
];


function runTests(engine, initState) {
    testFullPath(engine);
    restart(engine);
    testInventoryLimit(engine);
    restart(engine);
    testUniform(engine);
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

function testUniform(engine) {
    info("---- Uniform Switch Test ----");

    const commands = [
        // m2
        "PROZKOUMEJ OCAS", "SEBER SEKERU", "L",
        // m1
        "POUZIJ SEKERU", "PROZKOUMEJ MRTVOLU FIZLA", "SEBER STIT", "P", "D",
        // m5
        "POUZIJ STIT", "POLOZ STIT", "POUZIJ KAMEN", "P", "D",
        // m9
        "SEBER TYC", "N", "L", "D",
        // m8
        "POUZIJ TYC", "L", "D",
        // m10
        "POUZIJ TYC", "POLOZ TYC", "PROZKOUMEJ MRTVOLU CHLUPATYHO"];

    commands.forEach(command => {
        if (engine.game.endState) {
            return;
        }
        engine.processCommand(command);
    });

    engine.processCommand("oblec uniformu");
    const uniform = engine.game.getInventoryItem("uniformu");
    if (assertTrue(uniform && uniform.dressed, "Ma mit oblecenou uniformu: " + JSON.stringify(uniform))) {
        return;
    }
    engine.processCommand("svlec uniformu");
    if (assertTrue(!uniform.dressed, "Uniforma nema byt oblecena: " + JSON.stringify(uniform))) {
        return;
    }
    engine.processCommand("pouzij uniformu");
    if (assertTrue(uniform.dressed, "Uniforma ma byt oblecena: " + JSON.stringify(uniform))) {
        return;
    }
    engine.processCommand("pouzij uniformu");
    if (assertTrue(!uniform.dressed, "Uniforma nema byt oblecena: " + JSON.stringify(uniform))) {
        return;
    }
    engine.processCommand("pouzij uniformu");
    engine.processCommand("poloz uniformu");
    if (assertTrue(!uniform.dressed && !engine.game.getInventoryItem("uniformu"), "Uniforma nema byt oblecena:" + JSON.stringify(uniform))) {
        return;
    }
    success("Test passed");
}

function testFullPath(engine) {
    info("---- Full Path Test ----");

    fullPathCommands.forEach(command => {
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