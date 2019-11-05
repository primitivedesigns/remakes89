/*
 * 17. 11. 1989
 */

let sideOpen = false;

const items = [{
    name: "klíč",
    desc: "Je to trochu větší kónický klíč. Má tři zuby a zdobenou rukojeť. Asi bude od nějakých vrat."
}];

const locations = [{
    id: "m1",
    desc: "Nacházíš se u Národního divadla. Dav tě strhává směrem k nakladatelství ALBATROS. Zůstat na místě je nemožné.",
    exits: [{
        name: "Východ",
        location: "m2"
    }],
}, {
    id: "m2",
    desc: "Pokračuješ s davem směrem k jazykové škole. Na jih od tebe je pasáž Metro. Vpředu se průvod zastavil a lidé se začínají mačkat. Vrátit se nelze.",
    exits: [{
        name: "Sever",
        location: "m3"
    }, {
        name: "Východ",
        location: "m4"
    }],
    items: ["klíč"]
}, {
    id: "m3",
    desc: "",
    skipLocationItems: true,
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Vlezl jsi do pasáže Metro. Vmžiku se na tebe vrhlo pět příslušníků \"Červených baretů\" a zmlátili tě do bezvědomí.", "end-lose");
            game.end("killed", false);
        }
    },
}, {
    id: "m4",
    desc: "Jsi namáčknut na zdi. Lidé skandují: \"Nechceme násilí\", \"Lidský práva\", \"Nechte nás projít\".",
    exits: [{
        name: "Jih",
        location: "m5"
    }],
    noLocationItems: "Mimo kordon příslušníků VB nevidíš nic zvláštního."
}, {
    id: "m5",
    desc: "Jsi na chodníku na pravé straně Národní třídy.",
    exits: [{
        name: "Sever",
        location: "m4"
    }, {
        name: "Západ",
        location: "m6"
    }],
}, {
    id: "m6",
    desc: "",
    skipLocationItems: true,
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Vešel jsi do pasáže u Reduty. Jsou zde příslušníci \"Červených baretů\". Asi čtyři se na tebe ihned vrhli a se slovy \"Dělejte, ať se tu s váma nemusíme ... do půlnoci\" tě umlátili do bezvědomí.", "end-lose");
            game.end("killed", false);
        }
    },
}, {
    id: "m7",
    desc: "Jsi v přízemí domu.",
    exits: [{
        name: "Sever",
        location: "m5"
    }, {
        name: "Nahoru",
        location: "m11"
    }, {
        name: "Dolů",
        location: "m8"
    }],
}, {
    id: "m8",
    desc: "Jsi ve sklepení domu.",
    exits: [{
        name: "Jih",
        location: "m10"
    }, {
        name: "Západ",
        location: "m9"
    }, {
        name: "Nahoru",
        location: "m7"
    }],
}, {
    id: "m9",
    desc: "Jsi na konci sklepní chodby.",
    exits: [{
        name: "Východ",
        location: "m8"
    }],
}, {
    id: "m10",
    desc: "Jsi na konci sklepní chodby.",
    exits: [{
        name: "Sever",
        location: "m8"
    }],
}, {
    id: "m11",
    desc: "Stojíš na schodech v prvním patře.",
    exits: [{
        name: "Jih",
        location: "m12"
    }, {
        name: "Dolů",
        location: "m7"
    }],
}, {
    id: "m12",
    desc: "Jsi v rohu prvního patra. Zvenku slyšíš štěkat psy.",
    exits: [{
        name: "Sever",
        location: "m11"
    }, {
        name: "Východ",
        location: "m13"
    }],
}, {
    id: "m13",
    desc: "Stojíš pod schody, které zřejmě vedou do druhého patra.",
    exits: [{
        name: "Západ",
        location: "m12"
    }, {
        name: "Nahoru",
        location: "m14"
    }],
}, {
    id: "m14",
    desc: "Jsi na schodech ve druhém patře.",
    exits: [{
        name: "Západ",
        location: "m15"
    }, {
        name: "Dolů",
        location: "m13"
    }],
}, {
    id: "m15",
    desc: "Jsi v rohu druhého patra.",
    exits: [{
        name: "Jih",
        location: "m16"
    }, {
        name: "Východ",
        location: "m14"
    }],
}, {
    id: "m16",
    desc: "Jsi na konci chodby v druhém patře.",
    exits: [{
        name: "Sever",
        location: "m15"
    }],
}, {
    id: "m17",
    desc: "Jsi na střeše obytného domu.",
    exits: [{
        name: "Východ",
        location: "m18"
    }, {
        name: "Dolů",
        location: "m21"
    }],
}, {
    id: "m18",
    desc: "Jsi v rohu střechy.",
    exits: [{
        name: "Jih",
        location: "m19"
    }, {
        name: "Západ",
        location: "m17"
    }],
}, {
    id: "m19",
    desc: "Popošel jsi po střeše. Dostal jsi se na místo, z kterého je dobře vidět na Národní třídu.",
    exits: [{
        name: "Sever",
        location: "m18"
    }, {
        name: "Východ",
        location: "m20"
    }],
}, {
    id: "m20",
    desc: "Dostal jsi se do rohu střechy. Je odtud nádherný výhled na osvětlené Hradčany.",
    exits: [{
        name: "Západ",
        location: "m19"
    }],
}];

// Global actions
const actions = [{
    name: "Jít",
    keys: ["j"],
    perform: function(game, params) {
        game.clearOutput();
        const exits = game.location.exits;
        if (exits.length === 1) {
            game.print("O.K.");
            game.print("Jdeš na " + exits[0].name.toLowerCase());
            setTimeout(function() {
                game.goToLocation(exits[0].name);
            }, 1000);
        } else {
            game.print("Kam mám jít?");
            const exitActionList = [];
            for (const exit of exits) {
                exitActionList.push({
                    name: exit.name,
                    keys: [exit.name.charAt(0)],
                    perform: function(game) {
                        game.clearOutput();
                        game.print("O.K.");
                        game.print("Jdeš na " + exit.name.toLowerCase());
                        setTimeout(function() {
                            game.goToLocation(exit.name);
                        }, 1000);
                    }
                });
            }
            updateActionList(game, exitActionList);
        }
    },
}, {
    name: "Vzít",
    keys: ["v"],
    perform: function(game, params) {
        game.clearOutput();
        const takeableItems = game.getTakeableItems();
        if (!takeableItems || takeableItems.length === 0) {
            game.print("Nic tu není!");
        } else {
            if (takeableItems.length === 1) {
                const ret = game.takeItem(takeableItems[0].name);
                if (ret.full) {
                    if (game.messages.inventoryFull) {
                        game.print(game.messages.inventoryFull);
                    }
                } else if (ret.item) {
                    game.print("O.K.");
                    game.print("Vzal jsi " + ret.item.name);
                }
            } else {
                game.print("Co mám vzít?");
                const itemsList = [];
                for (const item of takeableItems) {
                    itemsList.push({
                        name: item.name,
                        keys: [item.name.charAt(0)],
                        perform: function(game) {
                            game.clearOutput();
                            const ret = game.takeItem(takeableItems[0].name);
                            if (ret.full) {
                                if (game.messages.inventoryFull) {
                                    game.print(game.messages.inventoryFull);
                                }
                            } else if (ret.item) {
                                game.print("O.K.");
                                game.print("Vzal jsi " + ret.item.name);
                            }
                        }
                    });
                }
                updateActionList(game, itemsList);
            }
        }
    },
}, {
    name: "Položit",
    keys: ["p"],
    perform: function(game, params) {
        game.clearOutput();
        if (!game.inventory || game.inventory.length === 0) {
            game.print("Nic neneseš!");
        } else {
            if (game.inventory.length === 1) {
                const item = game.dropItem(game.inventory[0]);
                if (item) {
                    game.print("O.K.");
                    game.print("Položil jsi " + item.name);
                }
            } else {
                game.print("Co mám položit?");
                const itemsList = [];
                for (const itemName of game.inventory) {
                    itemsList.push({
                        name: itemName,
                        keys: [itemName.charAt(0)],
                        perform: function(game) {
                            game.clearOutput();
                            const item = game.dropItem(game.inventory[0]);
                            if (item) {
                                game.print("O.K.");
                                game.print("Položil jsi " + item.name);
                            }
                        }
                    });
                }
                updateActionList(game, itemsList);
            }
        }
    },
}, {
    name: "Použít",
    keys: ["u"],
    perform: function(game, params) {
        game.clearOutput();
        const items = game.getItems();
        if (!items || items.length === 0) {
            game.print("Nemám co použít!");
        } else {
            if (items.length === 1) {
                game.useItem(items[0].name);
            } else {
                game.print("Co mám použít?");
                const itemsList = [];
                for (const item of items) {
                    itemsList.push({
                        name: item.name,
                        keys: [item.name.charAt(0)],
                        perform: function(game) {
                            game.clearOutput();
                            game.useItem(item.name);
                        }
                    });
                }
                updateActionList(game, itemsList);
            }
        }
    },
}, {
    name: "Čekat",
    keys: ["c", "č"],
    perform: function(game, params) {
        game.clearOutput();
        game.print("Zůstal jsi stát na místě...");
        if (game.location.id === "m1") {
            game.print("Dokud okolo tebe šel průvod, lidé se ti ohleduplně vyhýbali. Po chvíli však byl průvod přerušen kordonem \"pořádkových jednotek\", který přišel z mostu 1. Máje. Tito \"lidé\" se ti již nevyhli...", "end-lose");
            game.end("killed", false);
        } else if (game.location.id === "m4") {
            game.print("Chvíli jsi čekal,že bude průvod propuštěn směrem k Václavskému náměstí. Stalo se však něco uplně jiného. Příslušníci tvrdě zasáhli...", "end-lose");
            game.end("killed", false);
        } else {
            game.print("Nic se nestalo.");
        }
    },
}, {
    name: "Prozkoumat",
    keys: ["z"],
    perform: function(game, params) {
        game.clearOutput();
        const items = game.getItems();
        if (!items || items.length === 0) {
            game.print("Nemám co zkoumat!");
        } else {
            if (items.length === 1) {
                game.examineItem(items[0].name);
            } else {
                const itemsList = [];
                for (const item of items) {
                    itemsList.push({
                        name: item.name,
                        keys: [item.name[0]],
                        perform: function(game) {
                            game.clearOutput();
                            game.examineItem(items[0].name);
                        }
                    });
                }
                updateActionList(game, itemsList);
            }
        }
    },
}, {
    name: "Inventura",
    keys: ["i"],
    perform: function(game, params) {
        game.clearOutput();
        if (game.inventory && game.inventory.length > 0) {
            game.print("Neseš " + game.inventory.join(", "));
        } else {
            game.print("Nic neneseš!");
        }
    },
}];

const initControls = function(gameContainer, game) {
    const actionListDiv = document.createElement("div");
    actionListDiv.id = "game-action-list";
    gameContainer.appendChild(actionListDiv);
}

function initState() {

    const game = {
        savedPositionPrefix: "listopad",
        messages: {
            locationItems: "Vidíš",
            noLocationItems: "Nevidíš nic zvláštního.",
            locationExits: "Můžeš jít",
            unknownCommand: "To bohužel nejde!!!",
            gameSaved: "Hra uložena.",
            gameLoaded: "Uložená pozice nahrána.",
            gamePositions: "Uložené pozice: ",
            gamePositionsEmpty: "Nemáš žádnou uloženou pozici.",
            gamePositionDoesNotExist: "Nelze nahrát pozici: ",
            inventoryFull: "Máš plné ruce!",
        },
        onInitControls: initControls,
        onStart: function(game) {
            document.onkeydown = function(event) {
                if (event.key === "F1") {
                    event.preventDefault();
                    if (sideOpen) {
                        closeSide();
                    } else {
                        openSide();
                    }
                } else if (event.key === "Enter" && isOutputQueueProcessed()) {
                    skipOutputEffects();
                    return;
                } else if (!game.endState) {
                    // Match action
                    for (const action of game.actionList) {
                        if (action.keys && action.keys.find(key => key.toLowerCase() === event.key)) {
                            action.perform(game);
                            break;
                        }
                    }
                } else {
                    if (event.key === "r") {
                        // Restart game
                        location.reload();
                    } else if (event.key === "l") {
                        event.preventDefault();
                        if (!game.loadLastPosition()) {
                            // No position to load...
                            location.reload();
                        }
                    }
                }
                // Play beep sound
                // if (beepOn) {
                //     beep.play();
                // }
            };
            const sidebarOpen = document.querySelector("#game-sidebar-open");
            if (sidebarOpen) {
                sidebarOpen.style.display = "block";
            }
        },
        onEnd: function(endState) {
            clearActionList();
            if (endState === "killed") {
                this.print("Dlouho jsi nevydržel!");
            } else if (endState === "win") {
                this.print("TODO", "end-win");
                this.print("Stiskni klávesu R pro RESTART", "intro-enter");
            }
        },
        onEnterLocation: function(game, lastLocation) {
            updateActionList(game);
        },
        actionList: [],
        isInputCaseSensitive: false,
        startLocation: "m1",
        partialMatchLimit: 2,
        inventoryLimit: 4,
        skipLocationExits: true,
        skipInputBox: true,
        skipLocationSeparator: true,
        items: items,
        inventory: [],
        locations: locations,
        actions: actions
    }
    return game;
}

function updateActionList(game, actions) {
    if (game.endState) {
        return;
    }
    if (!actions) {
        actions = game.getActions();
        game.print("Co mám dělat?");
    }
    game.actionList = actions;
    if (game.headless) {
        console.log("Actions: " + game.actionList.join(", "));
    } else {
        fillActionList(game)
    }
}

function fillActionList(game) {
    if (game.endState) {
        return;
    }
    const actionListDiv = document.querySelector("#game-action-list");
    while (actionListDiv.firstChild) {
        actionListDiv.removeChild(actionListDiv.firstChild);
    }
    for (let i = 0; i < game.actionList.length; i++) {
        const action = game.actionList[i];
        for (let j = 0; j < action.name.length; j++) {
            const letter = action.name[j];
            if (action.keys && action.keys.find(key => key.toLowerCase() === letter.toLowerCase())) {
                const keySpan = document.createElement("span");
                keySpan.className = "key";
                keySpan.textContent = letter;
                actionListDiv.appendChild(keySpan);
            } else {
                const letterSpan = document.createElement("span");
                letterSpan.textContent = letter;
                actionListDiv.appendChild(letterSpan);
            }
            if (j === (action.name.length - 1) && (i != game.actionList.length - 1)) {
                const separatorSpan = document.createElement("span");
                separatorSpan.textContent = ", ";
                separatorSpan.className = "action-separator";
                actionListDiv.appendChild(separatorSpan);
            }
        }
    }
}

function clearActionList() {
    const actionListDiv = document.querySelector("#game-action-list");
    while (actionListDiv.firstChild) {
        actionListDiv.removeChild(actionListDiv.firstChild);
    }
}

function openSide() {
    sideOpen = true;
    const sidebar = document.querySelector("#game-sidebar");
    const sidebarClose = document.querySelector("#game-sidebar-close");
    const all = document.querySelector("#game-all");
    sidebar.style.width = "40%";
    all.style.marginRight = "40%";
    sidebarClose.style.display = "block";
}

function closeSide() {
    sideOpen = false;
    const sidebar = document.querySelector("#game-sidebar");
    const sidebarClose = document.querySelector("#game-sidebar-close");
    const all = document.querySelector("#game-all");
    sidebar.style.width = "0";
    all.style.marginRight = "0";
    sidebarClose.style.display = "none";
}