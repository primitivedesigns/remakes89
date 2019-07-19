function startGame(state) {
    // Constants
    const inputBox = document.querySelector('#input');
    const locationDiv = document.querySelector('#location');
    const outputDiv = document.querySelector('#output');
    const inputHelpDiv = document.querySelector('#inputHelp');
    const inputs = [];
    const historyLimit = 20;
    const lineLimit = 20;
    const game = Object.assign({}, state);

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
        return this.getItem(game.inventory, name);
    }
    game.getLocationItem = function(name) {
        return this.getItem(game.location.items, name);
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
            item = this.getItem(this.locations[index].items, name);
            if (item != null) {
                return {
                    "item": item,
                    "location": this.locations[index]
                };
            }
        }
        return {};
    }
    game.getItems = function() {
        const items = [];
        if (game.inventory) {
            game.inventory.forEach(i => items.push(i));
        }
        if (game.location.items) {
            game.location.items.forEach(i => items.push(i));
        }
        // return all available items (inventory + location)
        return items;
    }
    game.getTakeableItems = function() {
        if (game.location.items) {
            return game.location.items.filter(item => item.takeable === undefined || item.takeable);
        }
    }
    game.enterLocation = function(location) {
        this.location = location;
        this.printLocationInfo();
        this.shiftTime(1);
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
            // this.printLocation("-".repeat(descStr.length));
        }
        if (location.exits && location.exits.length > 0) {
            this.printLocation(this.messages.locationExits + ": " + location.exits.map(e => e.name).join(", "), "exits");
        }
        let itemsStr = "";
        if (location.items && location.items.length > 0) {
            itemsStr = this.messages.locationItems + ": " + location.items.map(i => i.name).join(", ");
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
            location.items.splice(location.items.findIndex(item => this.aliasObjectMatchesName(item, name)), 1);
            this.inventory.push(item);
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
            location.items.push(item);
            this.inventory.splice(this.inventory.findIndex(item => item.name === name), 1);
            this.printLocationInfo();
            return true;
        }
        return false;
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
    game.end = function(text) {
        this.clearOutput();
        this.ended = true;
        this.print(text, 'end');
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

    if (game.onStart) {
        game.onStart();
    }

    let historyPos = 0;

    // Initialize input/output elements
    const title = document.querySelector('#title');
    if (title) {
        title.innerText = game.title;
    }
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
    if (!game.time) {
        game.time = 0;
    }

    function nextStep(step, paths, startId, targetId) {
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
                        newPath.push(game.locations.find(loc => loc.id === last.exits[j].location));
                        newPathsFound.push(newPath);
                    }
                }
            }
        }
        // console.log("Step " + step + " found " + newPathsFound.length + "
        // paths");
        return newPathsFound;
    }


    // Start the game
    game.enterLocation(game.getLocation(game.startLocation));

    function processInput() {
        if (game.ended) {
            return;
        }
        const intputValue = this.isInputCaseSensitive ? inputBox.value : inputBox.value.toUpperCase();

        if (inputs.length > historyLimit) {
            inputs.shift();
        }
        if (inputs.length > 0) {
            if (inputs[inputs.length - 1] !== intputValue) {
                inputs.push(intputValue);
            }
        } else {
            inputs.push(intputValue);
        }
        inputBox.value = '';
        historyPos = inputs.length;

        // Parse the command
        const parts = intputValue.split(/\s+/);
        if (parts.length === 0) {
            return;
        }
        const action = game.getAction(parts[0]);

        if (action) {
            if (game.printCommand) {
                game.print('$ ' + intputValue, "command");
            }
        } else {
            if (game.onMissingAction) {
                game.onMissingAction(game, parts[0]);
            } else if (game.messages && game.messages.unknownAction) {
                game.print(game.messages.unknownAction);
            }
        }
        game.clearInputHelp();
        if (game.messages && game.messages.inputHelpTip) {
            game.printInputHelp(game.messages.inputHelpTip);
        }

        const params = [];
        parts.slice(1).forEach(part => {
            if (part && part.trim().length > 0) {
                params.push(part.trim());
            }
        });
        if (action) {
            action.perform(game, params);
        }
    }

    function historyPrev() {
        if (inputs.length > 0) {
            historyPos--;
            if (historyPos < 0) {
                historyPos = 0;
            }
            inputBox.value = inputs[historyPos];
        }
    }

    function historyNext() {
        if (inputs.length > 0) {
            historyPos++;
            if (historyPos >= inputs.length) {
                historyPos = inputs.length - 1;
            }
            inputBox.value = inputs[historyPos];
        }
    }

    function autocomplete() {
        const intputValue = inputBox.value;
        const parts = intputValue.split(/\s+/);
        if (parts.length == 1) {
            const actions = game.getActions().filter(action => this.isInputCaseSensitive ? action.name.startsWith(intputValue) : action.name.toUpperCase().startsWith(intputValue.toUpperCase()));
            if (actions.length === 1) {
                inputBox.value = actions[0].name + ' ';
            } else {
                game.clearInputHelp();
                const prefix = game.messages.inputHelpPrefix ? game.messages.inputHelpPrefix : "";
                game.printInputHelp(prefix + actions.map(action => action.name).join(', '));
            }
        } else if (parts.length == 2) {
            const action = game.getAction(parts[0]);
            if (action && action.autocomplete) {
                const results = action.autocomplete(game, parts[1]);
                if (results) {
                    if (results.length === 1) {
                        inputBox.value = parts[0] + ' ' + results[0].name + ' ';
                    } else if (results.length > 1) {
                        game.clearInputHelp();
                        const prefix = game.messages.inputHelpPrefix ? game.messages.inputHelpPrefix : "";
                        game.printInputHelp(prefix + results.map(r => r.name).join(', '));
                    }
                }
            }
        }
    }

    return game;
}