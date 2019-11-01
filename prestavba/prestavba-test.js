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

    const book = engine.game.getInventoryItem("knihu");
    if (assertTrue(book, "Kniha neni v inventari")) {
        return;
    }
    if (assertFalse(book.burning, "Kniha jiz hori!")) {
        return;
    }

    // zapal knihu
    let limit = 20, attempt = 1;
    while(!book.burning) {
        console.log("Kniha - pokus " + attempt + ": ");
        engine.processCommand("zapal knihu");
        if (book.burning || attempt > limit) {
            break;
        }
        attempt++;
    }

    executeCommands(coms2, engine);
    
    // zapal dynamit
    const dynamite = engine.game.findItem("dynamit").item;

    if (assertTrue(dynamite, "Dynamit nelze najit")) {
        return;
    }
    if (assertFalse(dynamite.ignited, "Dynamit nema byt zapaleny")) {
        return;
    }

    limit = 20; 
    attempt = 1;
    while(!dynamite.ignited) {
        console.log("Dynamic - pokus " + attempt + ": ");
        engine.processCommand("zapal dynamit");
        if (dynamite.ignited || attempt > limit) {
            break;
        }
        attempt++;
    }

    if (assertTrue(dynamite.ignited, "Dynamit musi byt zapaleny")) {
        return;
    }

    engine.processCommand("poloz dynamit");
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