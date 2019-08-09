function runGame(initState) {
    const engine = createEngine(initState);
    engine.initState = initState;
    engine.run();
    return engine;
}

function createEngine() {

    const engine = {};

    engine.run = function() {
        // First reset UI controls
        const gameContainerDiv = document.querySelector('#game-container');
        while (gameContainerDiv.firstChild) {
            gameContainerDiv.removeChild(gameContainerDiv.firstChild);
        }
        if (engine.initState.intro) {
            showIntro(0, engine.initState.intro, function() {
                engine.initGame();
                engine.start();
            });
        } else {
            engine.initGame();
            engine.start();
        }
    }

    engine.initGame = function(position) {
        engine.game = createGame(this.initState, position);
        engine.game.clearAll();
        console.log('Game initialized');
    }

    engine.start = function() {
        this.inputs = [];
        this.historyPos = 0;
        if (this.game.onStart) {
            this.game.onStart();
        }
        if (!this.game.time) {
            this.game.time = 0;
        }

        const inputBox = document.querySelector('#game-input');
        inputBox.focus();
        const historyLimit = 20;
        const lineLimit = 20;
        const inputs = this.inputs;

        inputBox.onkeydown = (e) => {
            if (e.key === 'Enter') {
                processInput();
            } else if (e.key === 'ArrowUp') {
                historyPrev();
            } else if (e.key === 'ArrowDown') {
                historyNext();
            } else if (e.key === 'Tab') {
                e.preventDefault();
                autocomplete();
            }
        };

        function processInput() {
            if (engine.game.endState) {
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
            inputBox.value = '';
            this.historyPos = inputs.length;

            // Parse the command
            const parts = inputValue.split(/\s+/);
            if (parts.length === 0) {
                return;
            }
            const params = [];
            parts.slice(1).forEach(part => {
                if (part && part.trim().length > 0) {
                    params.push(part.trim());
                }
            });

            // Built-in actions
            if (parts[0].toLowerCase() === 'restart') {
                engine.run();
                return;
            } else if (parts[0].toLowerCase() === 'save') {
                inputBox.value = '';
                engine.save(params);
                return;
            } else if (parts[0].toLowerCase() === 'load') {
                inputBox.value = '';
                engine.load(params);
                return;
            }

            const action = engine.game.getAction(parts[0]);

            if (action) {
                if (engine.game.printCommand) {
                    engine.game.print('$ ' + inputValue, "command");
                }
            } else {
                if (engine.game.onMissingAction) {
                    engine.game.onMissingAction(engine.game, parts[0]);
                } else if (engine.game.messages && engine.game.messages.unknownAction) {
                    engine.game.print(engine.game.messages.unknownAction);
                }
            }
            engine.game.clearInputHelp();
            if (engine.game.messages && engine.game.messages.inputHelpTip) {
                engine.game.printInputHelp(engine.game.messages.inputHelpTip);
            }

            if (action) {
                action.perform(engine.game, params);
                if (engine.game.onActionPerformed) {
                    engine.game.onActionPerformed(engine.game, action);
                }
            }
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
            const intputValue = inputBox.value;
            const parts = intputValue.split(/\s+/);
            if (parts.length == 1) {
                const actions = engine.game.getActions().filter(action => engine.game.isInputCaseSensitive ? action.name.startsWith(intputValue) : action.name.toUpperCase().startsWith(intputValue.toUpperCase()));
                if (actions.length === 1) {
                    inputBox.value = actions[0].name + ' ';
                } else {
                    engine.game.clearInputHelp();
                    const prefix = engine.game.messages.inputHelpPrefix ? engine.game.messages.inputHelpPrefix : "";
                    engine.game.printInputHelp(prefix + actions.map(action => action.name).join(', '));
                }
            } else if (parts.length == 2) {
                const action = engine.game.getAction(parts[0]);
                if (action && action.autocomplete) {
                    const results = action.autocomplete(engine.game, parts[1]);
                    if (results) {
                        if (results.length === 1) {
                            inputBox.value = parts[0] + ' ' + results[0].name + ' ';
                        } else if (results.length > 1) {
                            engine.game.clearInputHelp();
                            const prefix = engine.game.messages.inputHelpPrefix ? engine.game.messages.inputHelpPrefix : "";
                            engine.game.printInputHelp(prefix + results.map(r => r.name).join(', '));
                        }
                    }
                }
            }
        }

        // Start the game
        this.game.enterLocation(this.game.getLocation(this.game.startLocation));
    }

    engine.save = function() {
        const position = {};
        position.locations = this.game.locations;
        position.items = this.game.items;
        position.time = this.game.time;
        position.location = this.game.location.id;
        position.inventory = this.game.inventory;
        localStorage.setItem("save", JSON.stringify(position));
        console.log('Game saved');
    }

    engine.load = function() {
        this.initGame(JSON.parse(localStorage.getItem("save")));
        this.start();
        console.log('Game loaded');
    }

    return engine;
}

function createGame(initialState, savedPosition) {

    const gameContainerDiv = document.querySelector('#game-container');
    while (gameContainerDiv.firstChild) {
        gameContainerDiv.removeChild(gameContainerDiv.firstChild);
    }

    let locationDiv, outputDiv, inputHelpDiv;

    const game = JSON.parse(JSON.stringify(initialState));
    game.actions = initialState.actions;
    game.onStart = initialState.onStart;
    game.onEnd = initialState.onEnd;
    game.onLocationInfo = initialState.onLocationInfo;
    game.onShiftTime = initialState.onShiftTime;
    game.onMissingAction = initialState.onMissingAction;
    game.onActionPerformed = initialState.onActionPerformed;

    if (savedPosition) {
        game.locations = savedPosition.locations;
        game.items = savedPosition.items;
        game.time = savedPosition.time;
        game.startLocation = savedPosition.location;
        game.inventory = savedPosition.inventory;
    }

    // Init UI controls
    // game-title
    const title = document.createElement('h1');
    title.id = 'game-title';
    if (initialState.title) {
        title.innerText = initialState.title;
    }
    gameContainerDiv.insertBefore(title, null);
    // game-location
    locationDiv = document.createElement('div');
    locationDiv.id = 'game-location';
    gameContainerDiv.appendChild(locationDiv);
    // game-output
    outputDiv = document.createElement('div');
    outputDiv.id = 'game-output';
    gameContainerDiv.appendChild(outputDiv);
    // game-input-container
    const inputContainerDiv = document.createElement('div');
    inputContainerDiv.id = 'game-input-container';
    gameContainerDiv.appendChild(inputContainerDiv);
    // game-input-help
    inputHelpDiv = document.createElement('div');
    inputHelpDiv.id = 'game-input-help';
    inputContainerDiv.appendChild(inputHelpDiv);
    // game-input
    const inputBox = document.createElement('input');
    inputBox.id = 'game-input';
    inputContainerDiv.appendChild(inputBox);
    // game-input-tip
    const inputTip = document.createElement('div');
    inputTip.id = 'game-input-tip';
    inputContainerDiv.appendChild(inputTip);

    if (initialState.onInitControls) {
        initialState.onInitControls(gameContainerDiv);
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

    // Game functions
    game.getLocation = (id) => game.locations.find(location => location.id === id);
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
    }
    game.getAction = function(name) {
        let action = this.getActions().find(action => this.aliasObjectMatchesName(action, name));
        if (!action) {
            console.log("No action found for: " + name);
        }
        return action;
    }
    game.mapItem = function(name) {
            return game.items.find(item => item.name === name);
        }
        // Returns an item whose name or alias matches the specified name
    game.getItem = function(items, name) {
        if (items) {
            return items.find(item => this.aliasObjectMatchesName(item, name));
        }
        return null;
    }
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
    }
    game.getInventoryItem = function(name) {
        return game.inventory ? this.getItem(game.inventory.map(item => game.mapItem(item)), name) : null;
    }
    game.getLocationItem = function(name) {
        return this.getItem(game.location.items.map(item => game.mapItem(item)), name);
    }
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
    }
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
        }
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
        }
        // Return all takeable items in the current location
    game.getTakeableItems = function() {
        if (game.location.items) {
            return game.location.items.map(item => game.mapItem(item)).filter(item => item.takeable === undefined || item.takeable);
        }
    }
    game.enterLocation = function(location) {
        this.location = location;
        this.printLocationInfo();
    }
    game.printLocationInfo = function() {
        this.clearLocation();
        const location = game.location;
        if (location.name) {
            this.printLocation('*** ' + location.name + " ***", "name");
        }
        if (location.desc) {
            const descStr = location.desc instanceof Function ? location.desc() : location.desc;
            this.printLocation(descStr, "desc");
        }
        if (location.exits && location.exits.length > 0) {
            this.printLocation(this.messages.locationExits + ": " + location.exits.map(e => e.name).join(", "), "exits");
        }
        let itemsStr = "";
        if (location.items && location.items.length > 0) {
            itemsStr = this.messages.locationItems + ": " + location.items.map(i => game.mapItem(i).name).join(", ");
        } else if (this.messages.noLocationItems) {
            itemsStr = this.messages.noLocationItems;
        }
        this.printLocation(itemsStr, "items");
        this.printLocation("-".repeat(itemsStr.length));
        if (this.onLocationInfo) {
            this.onLocationInfo(this);
        }
    }
    game.clearLocation = function() {
        while (locationDiv.firstChild) {
            locationDiv.removeChild(locationDiv.firstChild);
        }
    }
    game.printLocation = function(str, cssClass) {
        const line = document.createElement('div');
        if (cssClass) {
            line.className = cssClass;
        }
        locationDiv.appendChild(line).innerText = str;
    }
    game.print = function(str, cssClass) {
        const line = document.createElement('div');
        if (cssClass) {
            line.className = cssClass;
        }
        outputDiv.insertBefore(line, null).innerText = str;
    }
    game.printInputHelp = function(str, cssClass) {
        const line = document.createElement('div');
        if (cssClass) {
            line.className = cssClass;
        }
        inputHelpDiv.insertBefore(line, null).innerText = str;
    }
    game.clearInputHelp = function() {
        while (inputHelpDiv.firstChild) {
            inputHelpDiv.removeChild(inputHelpDiv.firstChild);
        }
    }
    game.clearOutput = function() {
        while (outputDiv.firstChild) {
            outputDiv.removeChild(outputDiv.firstChild);
        }
    }
    game.goToLocation = function(exitName) {
        this.clearOutput();
        const location = game.location;
        const exit = location.exits.find(exit => exit.name === exitName);
        if (!exit) {
            console.log("No exit found: " + exitName);
        } else {
            this.enterLocation(this.getLocation(exit.location));
        }
    }
    game.printActions = function(prefix) {
        print(prefix + getActions().map(action => action.name).join(", "));
    }
    game.shiftTime = function(amount) {
        this.time = this.time + amount;
        if (this.onShiftTime) {
            this.onShiftTime(this);
        }
    }
    game.takeItem = function(name) {
        const item = this.getLocationItem(name);
        if (item && (item.takeable === undefined || item.takeable)) {
            const location = this.location;
            if (!this.inventory) {
                this.inventory = [];
            }
            location.items.splice(location.items.map(it => game.mapItem(it)).findIndex(it => this.aliasObjectMatchesName(it, name)), 1);
            this.inventory.push(item.name);
            this.printLocationInfo();
            if (item.onTake) {
                item.onTake(this);
            }
            return item;
        }
        return null;
    }
    game.dropItem = function(name) {
        const item = this.getInventoryItem(name);
        if (item) {
            const location = this.location;
            if (!location.items) {
                location.items = [];
            }
            location.items.push(item.name);
            this.inventory.splice(this.inventory.findIndex(item => item === name), 1);
            this.printLocationInfo();
            return item;
        }
        return null;
    }
    game.useItem = function(name) {
        const item = this.getItem(this.getItems(), name);
        if (item && item.onUse) {
            item.onUse(this);
            return true;
        }
        return false;
    }
    game.examineItem = function(name) {
        const item = this.getItem(this.getItems(), name);
        if (item) {
            this.printItemInfo(item);
            if (item.onExamine) {
                item.onExamine(this);
            }
            return true;
        }
        return false;
    }
    game.printItemInfo = function(item) {
        const foundItem = item instanceof Object ? item : this.getItem(this.getItems(), item);
        if (item) {
            this.print(item.desc instanceof Function ? item.desc() : item.desc);
        }
    }
    game.end = function(endState) {
        this.clearOutput();
        this.clearLocation();
        if (game.onEnd) {
            game.onEnd(endState);
        }
        this.endState = endState;
    }
    game.findWay = function(from, to) {
        const fromLocation = this.locations.find(loc => loc.id === from);
        const toLocation = this.locations.find(loc => loc.id === to);
        if (fromLocation && toLocation) {
            let paths = [];
            let step = 0;
            paths.push([fromLocation]);

            let newPaths;
            do {
                newPaths = nextStep(++step, paths, fromLocation.id, toLocation.id);
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
    }
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
        },
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
        }

    game.clearAll = function() {
        this.clearLocation();
        this.clearOutput();
        this.clearInputHelp();
    }

    return game;
}

function showIntro(index, introFuns, startFun) {
    const gameContainerDiv = document.querySelector('#game-container');
    introFuns[index](gameContainerDiv);
    document.onkeydown = function(e) {
        if (e.key === 'Enter') {
            document.onkeydown = null;
            if (introFuns.length > (index + 1)) {
                showIntro(index + 1, introFuns, startFun);
            } else {
                startFun();
            }
        }
    }
}