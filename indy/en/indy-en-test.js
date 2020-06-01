beepOn = false;

const fullPathCommands = [
    // m2
    "EXAMINE TAIL", "TAKE AXE", "L",
    // m1
    "USE AXE", "EXAMINE DEAD COP", "TAKE SHIELD", "R", "D",
    // m5
    "USE SHIELD", "DROP SHIELD", "USE STONE", "R", "D",
    // m9
    "TAKE ROD", "U", "L", "D",
    // m8
    "USE ROD", "L", "D",
    // m10
    "USE ROD", "DROP ROD", "EXAMINE DEAD COPPER", "TAKE UNIFORM", "USE UNIFORM", "R", "R",
    // m12
    "DROP UNIFORM", "D",
    // m15
    "DROP DIAMONDS", "U",
    // m12
    "TAKE UNIFORM", "USE UNIFORM", "L", "L",
    // m10
    "TAKE ROD", "R", "R",
    // m12
    "DROP UNIFORM", "D",
    // m15
    "TAKE DIAMONDS", "L", "D", "R",
    // m18
    "DROP DIAMONDS", "TAKE SPINACH", "USE SPINACH", "DROP CAN", "USE ROD", "TAKE DIAMONDS", "L", "L",
    // m16
    "DROP DIAMONDS", "EXAMINE DEAD CIVILIAN", "TAKE ID CARD", "R", "U", "R", "U",
    // m12
    "TAKE UNIFORM", "USE UNIFORM", "L", "L", "U", "R", "U", "U", "R",
    // m3
    "INSIDE"
];


const testFullPath = function (engine) {
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
    testFullPath
]

function runTests(engine, initState) {

    for (let index = 0; index < testSuite.length; index++) {
        testSuite[index](engine);
        if (index < (testSuite.length - 1)) {
            restart(engine);
        }
    }
}