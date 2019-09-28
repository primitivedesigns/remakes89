function runGame(initState, headless) {
    const engine = createEngine(headless);
    engine.initState = initState;
    engine.run();
    return engine;
}

function createEngine(headless) {

    const engine = {};

    engine.run = function() {
        if (headless) {
            engine.initGame();
            engine.start();
        } else {
            // First reset UI controls
            const gameContainerDiv = document.querySelector("#game-container");
            while (gameContainerDiv.firstChild) {
                gameContainerDiv.removeChild(gameContainerDiv.firstChild);
            }
            if (engine.initState.intro) {
                intro(0, engine.initState.intro, function() {
                    engine.initGame();
                    engine.start();
                });
            } else {
                engine.initGame();
                engine.start();
            }
        }
    }

    engine.actions = [{
        name: "restart",
        builtin: true,
        perform: function() {
            location.reload();
        }
    }, {
        name: "save",
        aliases: ["uloz", "ulož"],
        builtin: true,
        perform: function(game, params) {
            const positionName = engine.save(params);
            game.clearOutput();
            if (game.messages.gameSaved) {
                game.print(game.messages.gameSaved + " [" + positionName + "]");
            }
        }
    }, {
        name: "load",
        aliases: ["nahrat", "nahraj"],
        builtin: true,
        perform: function(game, params) {
            const positionName = engine.load(params);
            game.clearOutput();
            // NOTE: we cannot use the "game" param because a new game was
            // loaded already
            if (engine.game.messages.gameLoaded) {
                engine.game.print(engine.game.messages.gameLoaded + " [" + positionName +
                    "]");
            }
        },
        autocomplete: function(game, str) {
            const positions = [];
            for (var i = 0; i < localStorage.length; i++) {
                positions.push(localStorage.key(i));
            }
            return (!str || str.length === 0) ? positions.map(function(p) {
                const ret = {};
                ret.name = p;
                return ret;
            }) : positions.filter(p => p.startsWith(str)).map(function(p) {
                const ret = {};
                ret.name = p;
                return ret;
            });
        }
    }];

    engine.initGame = function(position) {
        engine.game = createGame(this.initState, position, headless);
        engine.game.clearAll();
        console.log("Game initialized");
    }

    engine.processCommand = function(command) {
        if (headless) {
            console.log(">> " + command);
        }
        const game = engine.game;
        const parts = command.split(/\s+/);
        if (parts.length === 0) {
            return;
        }
        const params = [];
        if (parts.length > 1) {
            parts.slice(1).forEach(part => {
                if (part && part.trim().length > 0) {
                    params.push(part.trim());
                }
            });
        }

        let action = null;
        const actionName = parts[0];
        const actions = game.getActions().filter(action => game.aliasObjectMatchesName(action, actionName));
        // Add built-in actions
        engine.actions.filter(action => engine.game.aliasObjectMatchesName(action, actionName)).forEach(action => actions.push(action));

        if (actions.length === 0) {
            if (game.onMissingAction) {
                game.onMissingAction(game, parts[0]);
            } else if (game.messages && game.messages.unknownAction) {
                game.print(game.messages.unknownAction);
            }
        } else if (actions.length === 1) {
            if (game.printCommand) {
                game.print("$ " + inputValue, "command");
            }
            action = actions[0];
        } else {
            if (game.messages && game.messages.multipleActionsMatch) {
                game.print(game.messages.multipleActionsMatch + " " + actions.map(action => action.name).join(", "));
            }
        }

        game.clearInputHelp();
        if (game.messages && game.messages.inputHelpTip) {
            game.printInputHelp(game.messages.inputHelpTip);
        }

        if (action) {
            action.perform(game, params);
            if (game.onActionPerformed) {
                game.onActionPerformed(game, action, params);
            }
        }
    }

    engine.start = function() {

        let inputBox, historyLimit, lineLimit, inputs;

        if (!headless) {
            this.inputs = [];
            this.historyPos = 0;
            if (this.game.onStart) {
                this.game.onStart();
            }
            if (!this.game.time) {
                this.game.time = 0;
            }

            inputBox = document.querySelector("#game-input");
            inputBox.focus();
            historyLimit = 20;
            lineLimit = 20;
            inputs = this.inputs;

            inputBox.onkeydown = (e) => {
                if (e.key === "Enter") {
                    processInput();
                } else if (e.key === "ArrowUp") {
                    historyPrev();
                } else if (e.key === "ArrowDown") {
                    historyNext();
                } else if (e.key === "Tab") {
                    e.preventDefault();
                    autocomplete();
                }
            };
        }

        function processInput() {
            const game = engine.game;
            if (game.endState) {
                return;
            }
            const inputValue = inputBox.value;

            if (inputs.length > historyLimit) {
                inputs.shift();
            }
            if (inputs.length > 0) {
                if (inputs[inputs.length - 1] !== inputValue) {
                    inputs.push(inputValue);
                }
            } else {
                inputs.push(inputValue);
            }
            inputBox.value = "";
            this.historyPos = inputs.length;

            engine.processCommand(inputValue);
        }

        function historyPrev() {
            if (inputs.length > 0) {
                this.historyPos--;
                if (this.historyPos < 0) {
                    this.historyPos = 0;
                }
                inputBox.value = inputs[this.historyPos];
            }
        }

        function historyNext() {
            if (inputs.length > 0) {
                this.historyPos++;
                if (this.historyPos >= inputs.length) {
                    this.historyPos = inputs.length - 1;
                }
                inputBox.value = inputs[this.historyPos];
            }
        }

        function autocomplete() {
            const inputValue = inputBox.value;
            if (inputValue.trim().length === 0) {
                const actions = engine.game.getActions();
                engine.actions.forEach(action => actions.push(action));
                engine.game.clearInputHelp();
                const prefix = engine.game.messages.inputHelpPrefix ? engine.game.messages.inputHelpPrefix : "";
                engine.game.printInputHelp(prefix + actions.map(action => action.name).join(", "));
                return;
            }
            const parts = inputValue.split(/\s+/);
            if (parts.length == 1) {
                const actions = engine.game.getActions().filter(action => engine.game.aliasObjectNameStartsWith(action, inputValue));
                // Add built-in actions
                engine.actions.filter(action => engine.game.aliasObjectNameStartsWith(action, inputValue)).forEach(action => actions.push(action));

                if (actions.length === 0) {
                    engine.game.clearInputHelp();
                    engine.game.printInputHelp("\xa0");
                } else if (actions.length === 1) {
                    let val = actions[0].name;
                    if (!val.startsWith(inputValue)) {
                        val = actions[0].aliases.find(alias => alias.startsWith(inputValue));
                    }
                    inputBox.value = val + " ";
                } else {
                    engine.game.clearInputHelp();
                    const prefix = engine.game.messages.inputHelpPrefix ? engine.game.messages.inputHelpPrefix : "";
                    engine.game.printInputHelp(prefix + actions.map(action => {
                        let val = action.name;
                        if (!val.startsWith(inputValue)) {
                            val = action.aliases.find(alias => alias.startsWith(inputValue));
                        }
                        return val;
                    }).join(", "));
                }
            } else if (parts.length == 2) {
                let action = engine.actions.find(a => engine.game.aliasObjectMatchesName(a, parts[0]));
                if (!action) {
                    action = engine.game.getAction(parts[0]);
                }
                if (action && action.autocomplete) {
                    const results = action.autocomplete(engine.game, parts[1]);
                    if (results) {
                        if (results.length === 1) {
                            inputBox.value = parts[0] + " " + results[0].name + " ";
                        } else if (results.length > 1) {
                            engine.game.clearInputHelp();
                            const prefix = engine.game.messages.inputHelpPrefix ? engine.game.messages.inputHelpPrefix : "";
                            engine.game.printInputHelp(prefix + results.map(r => r.name).join(", "));
                        }
                    }
                }
            }
        }

        // Start the game
        this.game.enterLocation(this.game.getLocation(this.game.startLocation));
    }

    engine.save = function(params) {
        const position = {};
        const positionName = params.length === 0 ? "save" : params[0];
        position.locations = this.game.locations;
        position.items = this.game.items;
        position.time = this.game.time;
        position.location = this.game.location.id;
        position.inventory = this.game.inventory;
        localStorage.setItem(positionName, JSON.stringify(position));
        console.log("Game saved: " + positionName);
        return positionName;
    }

    engine.load = function(params) {
        const positionName = params.length === 0 ? "save" : params[0];
        this.initGame(JSON.parse(localStorage.getItem(positionName)));
        this.start();
        console.log("Game loaded: " + positionName);
        return positionName;
    }

    return engine;
}

function createGame(initialState, savedPosition, headless) {

    let gameContainerDiv; 
    if (!headless) {
        gameContainerDiv = document.querySelector("#game-container");
        while (gameContainerDiv.firstChild) {
            gameContainerDiv.removeChild(gameContainerDiv.firstChild);
        }
    }

    let inputBox, title, locationDiv, outputDiv, inputHelpDiv, inputContainerDiv, inputTip;

    const game = JSON.parse(JSON.stringify(initialState));
    game.actions = initialState.actions;
    game.onStart = initialState.onStart;
    game.onEnd = initialState.onEnd;
    game.onLocationInfo = initialState.onLocationInfo;
    game.onShiftTime = initialState.onShiftTime;
    game.onMissingAction = initialState.onMissingAction;
    game.onActionPerformed = initialState.onActionPerformed;
    game.buildLocationMessage = initialState.buildLocationMessage;

    if (savedPosition) {
        game.locations = savedPosition.locations;
        game.items = savedPosition.items;
        game.time = savedPosition.time;
        game.startLocation = savedPosition.location;
        game.inventory = savedPosition.inventory;
    } else {
        game.inventory = [];
        initialState.inventory.forEach(item => game.inventory.push(item));
    }

    if (headless) {
        console.log("Creating headless game...");
    } else {
        // Init UI controls
        // game-title
        title = document.createElement("h1");
        title.id = "game-title";
        if (initialState.title) {
            title.textContent = initialState.title;
        }
        gameContainerDiv.insertBefore(title, null);
        // game-location
        locationDiv = document.createElement("div");
        locationDiv.id = "game-location";
        gameContainerDiv.appendChild(locationDiv);
        // game-output
        outputDiv = document.createElement("div");
        outputDiv.id = "game-output";
        gameContainerDiv.appendChild(outputDiv);
        // game-input-container
        inputContainerDiv = document.createElement("div");
        inputContainerDiv.id = "game-input-container";
        gameContainerDiv.appendChild(inputContainerDiv);
        // game-input-help
        inputHelpDiv = document.createElement("div");
        inputHelpDiv.id = "game-input-help";
        inputContainerDiv.appendChild(inputHelpDiv);
        // game-input
        inputBox = document.createElement("input");
        inputBox.id = "game-input";
        inputContainerDiv.appendChild(inputBox);
        // game-input-tip
        inputTip = document.createElement("div");
        inputTip.id = "game-input-tip";
        inputContainerDiv.appendChild(inputTip);

        if (initialState.onInitControls) {
            initialState.onInitControls(gameContainerDiv);
        }
    }

    // Re-init locations and items
    game.locations.forEach(function(location) {
        const initialLoc = initialState.locations.find(loc => loc.id === location.id);
        if (initialLoc && initialLoc.readInit) {
            initialLoc.readInit(location);
        }
    });
    game.items.forEach(function(item) {
        const initialItem = initialState.items.find(it => it.name === item.name);
        if (initialItem && initialItem.readInit) {
            initialItem.readInit(item);
        }
    });

    game.removeInputContainer = function() {
        if (headless) {
            return;
        }
        gameContainerDiv.removeChild(inputContainerDiv);
    }

    // ==============
    // Game functions
    // ==============

    // Get the location with the specified id
    game.getLocation = (id) => game.locations.find(location => location.id === id);

    // Get all available actions: global + location + inventory and location
    // items actions
    game.getActions = function() {
        const actions = [];
        // First global actions
        game.actions.forEach(action => actions.push(action));
        // Location actions
        const location = game.location;
        if (location.actions) {
            location.actions.forEach(action => actions.push(action));
        }
        // Inventory + location items actions
        this.getItems().forEach(function(item) {
            if (item.actions) {
                item.actions.forEach(action => actions.push(action));
            }
        });
        return actions;
    };

    // Returns an action whose name or alias matches the specified name
    game.getAction = function(name) {
        let action = this.getActions().find(action => this.aliasObjectMatchesName(action, name));
        if (!action) {
            console.log("No action found for: " + name);
        }
        return action;
    }

    // Returns an item for the specified name or undefined
    game.mapItem = function(name) {
        return game.items.find(item => item.name === name);
    };

    // Returns an item whose name or alias matches the specified name, false
    // otherwise
    game.getItem = function(items, name) {
        if (items) {
            return items.find(item => this.aliasObjectMatchesName(item, name));
        }
        return null;
    };

    // Returns true if an object"s name or alias matches the specified name,
    // false otherwise
    game.aliasObjectMatchesName = function(obj, name) {
        if (!obj || !name) {
            return false;
        }
        if (this.matchName(name, obj.name)) {
            return true;
        }
        if (obj.aliases && obj.aliases.find(alias => this.matchName(name, alias))) {
            return true;
        }
        return false;
    };

    game.aliasObjectNameStartsWith = function(obj, str) {
        if (!obj || !str) {
            return false;
        }
        if (obj.name.startsWith(str)) {
            return true;
        }
        if (obj.aliases && obj.aliases.find(alias => alias.startsWith(str))) {
            return true;
        }
        return false;
    };

    // Returns an inventory item for the specified name or undefined
    game.getInventoryItem = function(name) {
        return game.inventory ? game.getItem(game.inventory.map(item => game.mapItem(item)), name) : undefined;
    };

    // Remove an inventory item of the specified name if present
    game.removeInventoryItem = function(name) {
        const idx = game.inventory.findIndex(item => item === name);
        if (idx != -1) {
            game.inventory.splice(idx, 1);
        }
    }

    // Returns a location item for the specified name or undefined
    game.getLocationItem = function(name) {
        if (game.location.items) {
            return game.getItem(game.location.items.map(item => game.mapItem(item)), name);
        }
        return undefined;
    };

    // Remove an item from the current location if present
    game.removeLocationItem = function(name, location) {
        const loc = location ? location : game.location;
        const idx = loc.items.findIndex(item => item === name);
        if (idx != -1) {
            loc.items.splice(idx, 1);
        }
    }

    game.addLocationItem = function(locationId, itemName) {
        const location = game.getLocation(locationId);
        if (location) {
            if (!location.items) {
                location.items = [];
            }
            location.items.push(itemName);
        } else {
            console.log("Location [" + locationId + "] not found");
        }
    }

    // Attempts to find an inventory/location item
    game.findItem = function(name) {
        let item = null;
        item = this.getInventoryItem(name);
        if (item) {
            return {
                "item": item,
                "location": null
            };
        }
        return this.findLocationItem(name);
    };

    game.findLocationItem = function(name) {
        for (index = 0; index < this.locations.length; index++) {
            const locItems = this.locations[index].items;
            const item = locItems ? this.getItem(locItems.map(item => game.mapItem(item)), name) : null;
            if (item) {
                return {
                    "item": item,
                    "location": this.locations[index]
                };
            }
        }
        return {};
    };

    // Return all available items (inventory + location)
    game.getItems = function() {
        const items = [];
        if (game.inventory) {
            game.inventory.forEach(i => items.push(i));
        }
        if (game.location.items) {
            game.location.items.forEach(i => items.push(i));
        }
        return items.map(item => game.mapItem(item));
    };

    game.getUsableItems = function() {
        return this.getItems().filter(item => !item.unusable);
    }

    // Return all takeable items in the current location
    game.getTakeableItems = function() {
        if (game.location.items) {
            return game.location.items.map(item => game.mapItem(item)).filter(item => item.takeable === undefined || item.takeable);
        }
    };

    game.enterLocation = function(location) {
        const lastLocation = game.location;
        if (lastLocation && lastLocation.onLeave) {
            lastLocation.onLeave(game);
        }
        game.location = location;
        if (location.onEnter) {
            location.onEnter(game);
        }
        if (!location.explored) {
            location.explored = true;
        }
        this.printLocationInfo(true);
    };

    game.printLocationInfo = function(runInQueue) {
        game.clearLocation();

        if (game.onLocationInfo && !game.onLocationInfo(game)) {
            // If onLocationInfo() returns false do not show the info
            return;
        }

        const location = game.location;
        const buildLocationMessage = game.buildLocationMessage;

        if (buildLocationMessage) {
            game.printLocation(buildLocationMessage(location, game), "custom")
        } else {
            // By default, each message is written on a separate line
            const funcs = [];
            if (location.name) {
                funcs.push(followup => game.printLocation(location.name, "name", 0, followup, !runInQueue));
            }
            if (location.desc) {
                const descStr = location.desc instanceof Function ? location.desc(game) : location.desc;
                funcs.push(followup => game.printLocation(descStr, "desc", 0, followup, !runInQueue));
            }
            if (location.exits && location.exits.length > 0) {
                funcs.push(followup => game.printLocation(game.messages.locationExits + ": " + location.exits.map(e => e.name).join(", "), "exits", 0, followup, !runInQueue));
            }
            let itemsStr = "";
            if (location.items && location.items.length > 0) {
                itemsStr = game.messages.locationItems + ": " + location.items.map(i => game.mapItem(i).name).join(", ");
            } else if (game.messages.noLocationItems) {
                itemsStr = game.messages.noLocationItems;
            }
            funcs.push(followup => game.printLocation(itemsStr, "items", 0, followup, !runInQueue));
            funcs.push(followup => game.printLocation("-".repeat(itemsStr.length), "dashes", 0, followup, !runInQueue));
            if (runInQueue) {
                queue(0, funcs);
            } else {
                funcs.forEach(func => func());
            }
        }
    };

    // Clear location info
    game.clearLocation = function() {
        if (headless) {
            return;
        }
        while (locationDiv.firstChild) {
            locationDiv.removeChild(locationDiv.firstChild);
        }
    };

    game.printLocation = function(text, cssClass, delay, followup, skipTypewriter) {
        if (headless) {
            console.log(text);
            return;
        }
        const line = document.createElement("div");
        if (cssClass) {
            line.className = cssClass;
        }
        if (delay) {
            setTimeout(function() {
                locationDiv.appendChild(line);
                if (skipTypewriter) {
                    line.textContent = text;
                } else {
                    typewriter(line, text, 0, followup);
                }
            }, delay);
        } else {
            locationDiv.appendChild(line);
            if (skipTypewriter) {
                line.textContent = text;
            } else {
                typewriter(line, text, 0, followup);
            }
        }
    };

    game.print = function(text, cssClass, delay) {
        if (headless) {
            console.log(text);
            return;
        }
        const line = document.createElement("div");
        if (cssClass) {
            line.className = cssClass;
        }
        if (delay) {
            setTimeout(function() {
                outputDiv.insertBefore(line, null);
                typewriter(line, text);
            }, delay);
        } else {
            outputDiv.insertBefore(line, null)
            typewriter(line, text);
        }
    };

    game.printInputHelp = function(str, cssClass) {
        if (headless) {
            return;
        }
        const line = document.createElement("div");
        if (cssClass) {
            line.className = cssClass;
        }
        inputHelpDiv.insertBefore(line, null).innerText = str;
    };

    // Clear input help div
    game.clearInputHelp = function() {
        if (headless) {
            return;
        }
        while (inputHelpDiv.firstChild) {
            inputHelpDiv.removeChild(inputHelpDiv.firstChild);
        }
    };

    // Clear output div
    game.clearOutput = function() {
        if (headless) {
            return;
        }
        while (outputDiv.firstChild) {
            outputDiv.removeChild(outputDiv.firstChild);
        }
    };

    game.goToLocation = function(exitName) {
        this.clearOutput();
        const location = game.location;
        const exit = location.exits.find(exit => exit.name === exitName);
        if (!exit) {
            console.log("No exit found: " + exitName);
        } else {
            this.enterLocation(this.getLocation(exit.location));
        }
    };

    // Prints all available actions
    game.printActions = function(prefix) {
        print(prefix + getActions().map(action => action.name).join(", "));
    };

    // Shift the time
    game.shiftTime = function(amount) {
        this.time = this.time + amount;
        if (this.onShiftTime) {
            this.onShiftTime(this);
        }
    };

    game.takeItem = function(name, updateLocationInfo = true) {
        if (game.inventoryLimit && game.inventory.length >= game.inventoryLimit) {
            if (game.messages.inventoryFull) {
                game.print(game.messages.inventoryFull);
            }
        } else {
            const item = this.getLocationItem(name);
            if (item && (item.takeable === undefined || item.takeable)) {
                const location = this.location;
                if (!this.inventory) {
                    this.inventory = [];
                }
                location.items.splice(location.items.findIndex(it => it === item.name), 1);
                this.inventory.push(item.name);
                if (updateLocationInfo) {
                    this.printLocationInfo(false);
                }
                if (item.onTake) {
                    item.onTake(this);
                }
                return item;
            }
        }
        return null;
    };

    game.dropItem = function(name, updateLocationInfo = true) {
        const item = this.getInventoryItem(name);
        if (item) {
            const location = this.location;
            if (!location.items) {
                location.items = [];
            }
            location.items.push(item.name);
            this.inventory.splice(this.inventory.findIndex(it => it === item.name), 1);
            if (updateLocationInfo) {
                this.printLocationInfo(false);
            }
            return item;
        }
        return null;
    };

    game.useItem = function(name) {
        const item = this.getItem(this.getItems(), name);
        if (item && !item.unusable && item.onUse) {
            item.onUse(game);
            item.used = true;
            return true;
        }
        return false;
    };

    game.examineItem = function(name) {
        const item = this.getItem(this.getItems(), name);
        if (item) {
            game.printItemInfo(item);
            if (item.onExamine) {
                item.onExamine(this);
            }
            item.examined = true;
            return true;
        }
        return false;
    };

    game.printItemInfo = function(item) {
        const foundItem = item instanceof Object ? item : this.getItem(this.getItems(), item);
        if (item) {
            this.print(item.desc instanceof Function ? item.desc(game) : item.desc);
        }
    };
    game.end = function(endState, clearAll = true) {
        if (clearAll) {
            this.clearOutput();
            this.clearLocation();
        }
        if (game.onEnd) {
            game.onEnd(endState);
        } else if (initialState.outro) {
            while (gameContainerDiv.firstChild) {
                gameContainerDiv.removeChild(gameContainerDiv.firstChild);
            }
            outro(0, initialState.outro);
        }
        this.endState = endState;
    };

    // Debug function - try to find a way from one location to the other
    // location
    game.findWay = function(from, to) {
        const fromLocation = this.locations.find(loc => loc.id === from);
        const toLocation = this.locations.find(loc => loc.id === to);
        if (fromLocation && toLocation) {
            let paths = [];
            let step = 0;
            paths.push([fromLocation]);

            let newPaths;
            do {
                newPaths = this.nextStep(++step, paths, fromLocation.id, toLocation.id);
                if (newPaths.length > 0) {
                    paths = paths.concat(newPaths);
                }
            } while (newPaths.length > 0);

            const ret = [];
            for (i = 0; i < paths.length; i++) {
                const path = paths[i];
                if (path[path.length - 1].id === to) {
                    ret.push(path);
                }
            }
            for (i = 0; i < ret.length; i++) {
                let path = ret[i];
                let steps = "";
                // 1: loc1 -> exit1 -> exit2 -> loc2
                for (j = 0; j < (path.length - 1); j++) {
                    const fromStep = path[j];
                    const toStep = path[j + 1];
                    steps += "-> " + fromStep.exits.find(exit => exit.location === toStep.id).name;
                }
                console.log((i + 1) + ": " + from + " " + steps + " -> " + to);
            }
            return ret;
        } else {
            console.log("Invalid locations!");
        }
    };

    game.nextStep = function(step, paths, startId, targetId) {
        const newPathsFound = [];
        for (i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (path.length === step) {
                const last = path[step - 1];
                if (path.filter(loc => loc.id === last.id).length > 1) {
                    // Cycle detected
                    continue;
                }
                if ((step === 1 || last.id != startId) && last.id != targetId && last.exits) {
                    for (j = 0; j < last.exits.length; j++) {
                        const newPath = path.slice(0);
                        newPath.push(this.locations.find(loc => loc.id === last.exits[j].location));
                        newPathsFound.push(newPath);
                    }
                }
            }
        }
        return newPathsFound;
    };

    // val - input
    // name - property to match
    game.matchName = function(val, name) {
        if (!val || !name) {
            return false;
        }
        if (this.isInputCaseSensitive) {
            if (val === name) {
                return true;
            }
            if (this.partialMatchLimit && val.length > this.partialMatchLimit) {
                return name.startsWith(val);
            }
            return false;
        } else {
            const nameUp = name.toUpperCase();
            const valUp = val.toUpperCase();
            if (valUp === nameUp) {
                return true;
            }
            if (this.partialMatchLimit && valUp.length > this.partialMatchLimit) {
                return nameUp.startsWith(valUp);
            }
            return false;
        }
    };

    game.clearAll = function() {
        this.clearLocation();
        this.clearOutput();
        this.clearInputHelp();
    }

    return game;
}

function intro(index, introFuns, startFun) {
    const gameContainerDiv = document.querySelector("#game-container");
    introFuns[index](gameContainerDiv);
    document.onkeydown = function(e) {
        if (e.key === "Enter") {
            document.onkeydown = null;
            if (introFuns.length > (index + 1)) {
                intro(index + 1, introFuns, startFun);
            } else {
                startFun();
            }
        }
    }
}

function outro(index, outroFuns) {
    const gameContainerDiv = document.querySelector("#game-container");
    outroFuns[index](gameContainerDiv);
    document.onkeydown = function(e) {
        if (e.key === "Enter") {
            document.onkeydown = null;
            if (outroFuns.length > (index + 1)) {
                intro(index + 1, outroFuns);
            }
        }
    }
}

function queue(index, funcs) {
    if (funcs.length > (index + 1)) {
        funcs[index](function() {
            queue(index + 1, funcs);
        });
    } else {
        funcs[index](null);
    }
}

function typewriter(element, text, idx, followup) {
    let indexVal = idx ? idx++ : 0;
    const textVal = text.slice(0, ++indexVal);
    element.textContent = textVal;
    if (text.length > indexVal) {
        const next = function() {
            typewriter(element, text, indexVal, followup);
        }
        setTimeout(next, 10);
    } else {
        if (followup) {
            followup();
        }
    }
}