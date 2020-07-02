beepOn = false;

const fullPathCommands = [
    // m1
    "j",
    // m2
    "v", "j", "v",
    // m4
    "j",
    // m5
    "u", "k", "j", "j",
    // m7
    "j", "d",
    // m8
    "j", "j",
    // m10
    "v", "ž", "j", "j", "n",
    // m7
    "j", "n",
    // m11
    "j", "j",
    // m12
    "j", "v",
    // m13
    "j", "n",
    // m14
    "j", "z",
    // m15
    "v", "v", "j", "j",
    // m16
    "u", "ž", "j", "n",
    // m21
    "u", "l", "j", "n",
    // m17
    "j", "v",
    // m18
    "j", "j",
    // m19
    "v", "j", "s", "j", "z", "j", "d", "j", "d", "j", "s", "j", "v", "j", "d", "j", "z", "j", "s", "j", "d", "j", "d",
    // m8
    "u", "h",
    // drop items
    "p", "h", "p", //"r", "p", "l",
    // take tape
    "v", "i", "j", "z",
    // m9
    "v", "j",
    // back go to the roof
    "j", "n", "j", "n", "j", "j", "j", "v", "j", "n", "j", "z", "j", "j", "j", "n", "j", "n", "j", "v",
    // m18
    "v", "i",
    // prepare cam
    "u", "b", "u", "i", "j", "j", "j", "v",
    // m20
    "u"
];

const testFullPath = function(engine) {
    info("---- Full Path Test ----");

    executeCommands(fullPathCommands, engine, function(command) {
        console.log("Inventář: " + engine.game.inventory);
        processKey(engine.game, command);
    });

    if (engine.game.endState != "win") {
        error("Test failed with end state [" + engine.game.endState + "]");
    } else {
        success("Test passed with end state [" + engine.game.endState + "]");
    }
}

const testBreakHook = function(engine) {
    info("---- Break Hook Test ----");
    engine.game.inventory.push("hák");
    engine.game.getLocation("m19").items =[];
    updateActionList(engine.game);
    processKey(engine.game, "u");
    if (assertFalse(engine.game.findItem("hák").item, "Hak ma zmizet")) {
        return;
    }
    success("Test passed");
}

const testSuite = [
    testFullPath, testBreakHook
]


function runTests(engine, initState) {

    for (let index = 0; index < testSuite.length; index++) {
        testSuite[index](engine);
        if (index < (testSuite.length - 1)) {
            restart(engine);
        }
    }
}