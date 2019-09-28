function runTests(engine, initState) {
    testFullPath(engine);
}


function testFullPath(engine) {
    info("---- Full Path Test ----");

    const coms1 = ["zapad", "vezmi zapalovac", "vychod", "sever", "pro bed", "pro kos", "pro kra", "vezmi klic", "jih", "otevri poklop", "jih", 
    "kod 1948", "otevri dvere", "vychod", "pro misu", "vezmi knihu", "zapad", "sever"];

    const coms2 = ["dolu", "vezmi krum", "vychod", "jih", "vez uvo", "sever", "cti uvo", "kopej", "dolu", "vychod", "nahoru", "vychod", "pro olt", "vez dyn",
    "z", "j", "j", "j", "v", "v"];

    executeCommands(coms1, engine);

    // zapal knihu
    let burning = false, limit = 20, attempt = 0;
    while(!burning) {
        engine.processCommand("zapal knihu");
        if (engine.game.getInventoryItem("knihu").burning || attempt > limit) {
            burning = true;
        }
        attempt++;
    }

    executeCommands(coms2, engine);
    
    // zapal dynamit
    burning = false;
    limit = 20; 
    attempt = 0;
    while(!burning) {
        engine.processCommand("zapal dynamit");
        if (engine.game.getInventoryItem("dynamit").ignited || attempt > limit) {
            burning = true;
        }
        attempt++;
    }

    engine.processCommand("poloz dynamit");
    engine.processCommand("zapal dynamit");
    engine.processCommand("zapad");
    engine.processCommand("veci");
    engine.processCommand("vychod");
    engine.processCommand("vezmi cihlu");

    if (!engine.game.endState) {
        error("Test failed with end state [" + engine.game.endState + "]");
    } else {
        success("Test passed with end state [" + engine.game.endState + "]");
    }
}