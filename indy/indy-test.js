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

const testInventoryLimit = function(engine) {
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

const testUniform = function(engine) {
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
        "POUZIJ TYC", "POLOZ TYC", "PROZKOUMEJ MRTVOLU CHLUPATYHO"
    ];

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

const testM15InstantDeath = function(engine) {
    info("---- M15 Instant Death Test ----");

    const commands = [ // m2
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
        "POUZIJ TYC", "POLOZ TYC", "PROZKOUMEJ MRTVOLU CHLUPATYHO", "SEBER UNIFORMU", "POUZIJ UNIFORMU", "P", "P", "D",
        // m15 -> death
    ]

    commands.forEach(command => {
        if (engine.game.endState) {
            return;
        }
        engine.processCommand(command);
    });

    if (assertTrue(engine.game.endState === 'killed', "Ocekavana smrt: " + engine.game.endState)) {
        return;
    }
    success("Test passed");
}

const testM14InstantDeath = function(engine) {
    info("---- M14 Instant Death Test ----");

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
        "SEBER DIAMANTY", "L",
        // m14 - instant deatch after one turn
        "VECI"
    ]

    commands.forEach(command => {
        if (engine.game.endState) {
            return;
        }
        engine.processCommand(command);
    });

    if (assertTrue(engine.game.endState === 'killed', "Ocekavana smrt: " + JSON.stringify(engine.game.location))) {
        return;
    }
    success("Test passed");
}

const testFullPath = function(engine) {
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

const testSuite = [
    testFullPath, testInventoryLimit, testUniform, testM15InstantDeath, testM14InstantDeath
]


function runTests(engine, initState) {

    for (let index = 0; index < testSuite.length; index++) {
        testSuite[index](engine);
        if (index < (testSuite.length - 1)) {
            restart(engine);
        }
    }
}