function startGame(state) {
    // Constants
    const inputBox = document.querySelector('#input');
    const locationDiv = document.querySelector('#location');
    const outputDiv = document.querySelector('#output');
    const inputs = [];
    const historyLimit = 20;
    const lineLimit = 20;
    const game = Object.assign({}, state);

    let historyPos = 0;
    
    // Initialize input/output elements
    document.querySelector('#title').innerText = game.title;
    inputBox.onkeydown = (e) => {
      if (e.key === 'Enter') {
          processInput();
      } else if(e.key === 'ArrowUp') {
          historyPrev();
      } else if(e.key === 'ArrowDown') {
          historyNext();
      } else if(e.key === 'Tab') {
          e.preventDefault();
          autocomplete();
      }
    };
    if (!game.time) {
        game.time = 0;
    }
    
    // Game functions
    game.getLocation = (id) => game.locations.find(location => location.id === id);
    game.getActions = function(){
        const actions = [];
        // First global actions
        game.actions.forEach(action => actions.push(action));
        // Location actions
        const location = game.location;
        if (location.actions) {
            location.actions.forEach(action => actions.push(action));    
        }
        return actions;
    }
    game.getAction = function(name) {
        let action = this.getActions().find(action => action.name === name);
        if(action === undefined) {
            console.log("No action found for: " + name);
        }
        return action;
    }
    game.getItem = function(items, name) {
        if (items) {
            return items.find(item => item.name === name);
        }
        return null;
    }
    game.getInventoryItem = function(name) {
        return this.getItem(game.inventory, name);
    }
    game.getLocationItem = function(name) {
        return this.getItem(game.location.items, name);
    }
    // Get all available items (inventory + location)
    game.getItems = function(){
        const items = [];
        if(game.inventory) {
            game.inventory.forEach(i => items.push(i));
        }        
        if(game.location.items) {
            game.location.items.forEach(i => items.push(i));
        }
        return items;
    }
    game.getTakeableItems = function() {
        if(game.location.items) {
           return game.location.items.filter(item => item.takeable === undefined || item.takeable);
        }
    }
    game.enterLocation = function(location) {
        this.location = location;
        this.printLocationInfo();
        this.shiftTime(1);
    }
    game.printLocationInfo = function() {
        while (locationDiv.firstChild) {
            locationDiv.removeChild(locationDiv.firstChild);
        }
        const location =  game.location;
        this.printLocation('*** ' + location.name + " ***");
        if (location.desc) {
            this.printLocation(location.desc);
        }
        if (location.exits && location.exits.length > 0) {
            this.printLocation(this.messages.locationExits + ": " + location.exits.map(e => e.name).join(", "));
        }
        if (location.items && location.items.length > 0) {
            this.printLocation(this.messages.locationItems + ": " + location.items.map(i => i.name).join(", "));
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
        const first = outputDiv.firstChild;
        outputDiv.insertBefore(line,first).innerText = str;
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
    game.printActions = function (prefix) {
        print(prefix + getActions().map(action => action.name).join(", "));
    }
    game.shiftTime = function(amount) {
        this.time = this.time + amount;
    }
    game.takeItem = function(name) {
        const item = this.getLocationItem(name);
        if (item && (item.takeable === undefined || item.takeable)) {
            const location = this.location;
            if (!this.inventory) {
                this.inventory = [];
            }
            location.items.splice(location.items.findIndex(item => item.name === name), 1);
            this.inventory.push(item);
            this.printLocationInfo();
            return true;
        }
        return false;
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
        const item = this.getItem(this.getItems(),name);
        if(item) {
            item.onUse(this);
            return true;
        }
        return false;
    }
    game.printItemInfo = function(name) {
        const item = this.getItem(this.getItems(),name);
        if(item) {
           this.print(item.desc instanceof Function ? item.desc() : item.desc);
        }
    }
    game.end = function(text) {
        this.clearOutput();
        this.ended = true;
        this.print(text,'end');
    }
    
    // Start the game
    game.enterLocation(game.getLocation(game.startLocation));
    
    function processInput() {
        if (game.ended) {
            return;
        }
        const intputValue = inputBox.value;
        game.print('$ ' + intputValue, "command");
        if (inputs.length > historyLimit) {
            inputs.shift();
        }
        if (inputs.length > 0) {
           if(inputs[inputs.length - 1] !== intputValue) {
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
        const params = parts.slice(1);
        if (action) {
            action.perform(game,params);
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
            const actions = game.getActions().filter(action => action.name.startsWith(intputValue));
            if (actions.length === 1) {
                inputBox.value = actions[0].name + ' ';
            } else {
                game.print(actions.map(action => action.name).join(', '));
            }    
        } else if (parts.length == 2) {
            const action = game.getAction(parts[0]);
            if (action && action.autocomplete) {
                const results = action.autocomplete(game,parts[1]);
                if (results) {
                    if (results.length === 1) {
                        inputBox.value = parts[0] + ' ' + results[0].name + ' ';
                    } else if(results.length > 1) {
                        game.print(results.map(r => r.name).join(', '));
                    }    
                }
            }
        }
    }
    
}

