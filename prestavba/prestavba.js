const prestavba = {
    title: "P.R.E.S.T.A.V.B.A.",
    messages: {
        locationItems: "Vidíš",
        noLocationItems: "Nevidíš nic",
        locationExits: "Východy",
        unknownAction: "Bohužel... ale nezoufej, to je dialektika dějin!"
    },
    onStart: function() {
        printRandomSlogan();
    },
    onLocationInfo: function(game) {
        if (darkLocations.find(id => id === game.location.id)) {
            const book = game.getInventoryItem("knihu");
            if (!book || !book.burning) {
                game.clearLocation();
                game.printLocation("Je tu tma.");
            }
        }
    },
    onShiftTime: function(game) {
        let book = game.getInventoryItem("knihu");
        let bookLocation = null;
        if (!book) {
            for (var location in game.locations) {
                book = game.getItem(location.items, "knihu");
                bookLocation = location;
                break;
            }
        }
        if (book && book.burning && (book.burning - game.time) > 12) {
            // The book should disappear after it's burning for 12 time
            // units
            if (bookLocation) {
                bookLocation.items.splice(bookLocation.items.findIndex(item => item.name === "knihu"), 1);
            } else {
                game.inventory.splice(game.inventory.findIndex(item => item.name === "knihu"), 1);
            }
        }
        // Dynamite
        let dynamite = game.getInventoryItem("dynamit");
        let dynamiteLocation = null;
        if (!dynamite) {
            for (var location in game.locations) {
                dynamite = game.getItem(location.items, "dynamit");
                dynamiteLocation = location;
                break;
            }
        }
        if (dynamite && dynamite.ignited && (dynamite.ignited - game.time) > 2) {
            // Explosion
            if (dynamiteLocation) {
                // TODO ruins of the statue
                dynamiteLocation.items.splice(dynamiteLocation.items.findIndex(item => item.name === "dynamit"), 1);
            } else {
                game.inventory.splice(game.inventory.findIndex(item => item.name === "dynamit"), 1);
            }
        }
    },
    isInputCaseSensitive: false,
    startLocation: "m9",
    inventory: [],
    locations: [{
        id: "m1",
        desc: "Jsi na konci dlouhé podzemní chodby. Je tu žebřík vedoucí kamsi nahoru.",
        exits: [{
            name: "Z",
            location: "m2"
        }, {
            name: "N",
            location: "m20"
        }]
    }, {
        id: "m2",
        desc: "Jsi v dlouhé podzemní chodbě vedoucí na východ.",
        exits: [{
            name: "V",
            location: "m1"
        }, {
            name: "N",
            location: "m4"
        }]
    }, {
        id: "m3",
        desc: "Jsi v malém jižním výklenku jeskyňky. Je tu spousta papíru.",
        items: [{
            name: "úvodník",
            desc: "Je to úvodník Rudého práva."
        }],
        exits: [{
            name: "S",
            location: "m4"
        }]
    }, {
        id: "m4",
        desc: "Jsi v malé podzemní jeskyňce. Při chůzi tvé kroky podivně duní.",
        exits: [{
            name: "J",
            location: "m3"
        }, {
            name: "Z",
            location: "m5"
        }],
        actions: [{
            name: "kopej",
            perform: function(game, params) {
                const pickaxe = game.getInventoryItem("krumpáč");
                if (pickaxe) {
                    game.clearOutput();
                    game.print("-----------------");
                    game.print("Podařilo se ti prokopat se do nižšího podlaží!");
                    game.location.exits.push({
                        name: "D",
                        location: "m2"
                    });
                    game.printLocationInfo();
                } else {
                    game.print(game.messages.unknownAction);
                }
            }
        }]
    }, {
        id: "m5",
        desc: "Jsi v úzké podzemní chodbě vedoucí na východ. Je tu vlhko.",
        items: [{
            name: "krumpáč",
            desc: "Je velice zrezivělý, ale jinak použitelný."
        }],
        exits: [{
            name: "V",
            location: "m4"
        }, {
            name: "N",
            location: "m9"
        }]
    }, {
        id: "m6",
        desc: "Jsi v bývalém skladišti. Je tu neskutečný nepořádek.",
        items: [{
            name: "bednu",
            desc: "Je ze dřeva.",
            onExamine: function(game) {
                game.print("Něco jsi našel.");
                game.location.items.push({
                    name: "košík",
                    desc: "Je to hezký proutěný košík, i když poněkud špinavý.",
                    onExamine: function(game) {
                        game.print("Něco jsi našel.");
                        game.location.items.push({
                            name: "krabici",
                            desc: "Je z papíru.",
                            onExamine: function(game) {
                                game.print("Něco jsi našel.");
                                game.location.items.push({
                                    name: "klíč",
                                    desc: "Je to čtverhranný klíč k poklopu."
                                });
                                game.printLocationInfo();
                            }
                        });
                        game.printLocationInfo();
                    }
                });
                game.printLocationInfo();
            }
        }],
        exits: [{
            name: "J",
            location: "m9"
        }]
    }, {
        id: "m7",
        desc: "Stojíš v tmavém výklenku.",
        items: [{
            name: "zapalovač",
            desc: "Jistě by s ním šlo leccos zapálit. Je to totiž kvalitní zapalovač \"Made in USSR\".",
        }],
        exits: [{
            name: "V",
            location: "m9"
        }]
    }, {
        id: "m8",
        desc: "Stojíš před ošklivým smrdutým záchodem. Táhne od něj nepříjemný zápach.",
        items: [{
            name: "dveře",
            desc: function() {
                return "Jsou " + (this.open ? "otevřené" : "zavřené") + " a " + (this.locked ? "zamčené" : "odemčené") + ". Je na nich zámek na číselný čtyřmístný kód.";
            },
            takeable: false,
            open: false,
            locked: true,
        }],
        exits: [{
            name: "S",
            location: "m9"
        }],
        actions: [{
            name: "zadej",
            perform: function(game, params) {
                const door = game.getLocationItem("dveře");
                game.clearOutput();
                game.print("-----------------");
                if (params[0] === "1948" && door.locked) {
                    door.locked = false;
                    game.print("Zámek klapnul!");
                } else {
                    game.print(game.messages.unknownAction);
                }
            }
        }, {
            name: "otevři",
            perform: function(game, params) {
                const door = game.getLocationItem("dveře");
                game.clearOutput();
                game.print("-----------------");
                if (params[0] === "DVEŘE") {
                    door.open = true;
                    game.print("Cesta na záchod je volná!");
                    game.location.exits.push({
                        name: "V",
                        location: "m10"
                    });
                    game.printLocationInfo();
                } else {
                    game.print(game.messages.unknownAction);
                }
            },
            autocomplete: function(game, str) {
                return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => item.name.startsWith(str));
            }
        }]
    }, {
        id: "m9",
        desc: "Stojíš v malé zaprášené místnosti.",
        items: [{
            name: "poklop",
            desc: "Je to těžký ocelový poklop se zámkem na čtverhranný klíč.",
            takeable: false,
        }],
        exits: [{
            name: "S",
            location: "m6"
        }, {
            name: "J",
            location: "m8"
        }, {
            name: "Z",
            location: "m7"
        }],
        actions: [{
            name: "otevři",
            perform: function(game, params) {
                game.clearOutput();
                game.print("-----------------");
                if (params[0] === "POKLOP") {
                    if (game.getInventoryItem("klíč")) {
                        game.print("S pomocí klíče se ti podařilo otevřít poklop.");
                        game.location.exits.push({
                            name: "D",
                            location: "m5"
                        });
                        game.printLocationInfo();
                    } else {
                        game.print("Nemáš klíč!");
                    }
                } else {
                    game.print(game.messages.unknownAction);
                }
            },
            autocomplete: function(game, str) {
                return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => item.name.startsWith(str));
            }
        }]
    }, {
        id: "m10",
        desc: "Jsi na špinavém záchodě. Radši to nebudu příliš popisovat, mohlo by se ti udělat nevolno.",
        items: [{
            name: "mísu",
            desc: "Je úplně zaschlá.",
            onExamine: function(game) {
                game.print("Něco jsi našel.");
                game.location.items.push({
                    name: "knihu",
                    desc: function() {
                        if (this.burning == null) {
                            return "Je to Marxův Kapitál.";
                        } else {
                            return "Vydává jasné světlo pokroku!!!";
                        }
                    },
                    burning: null
                });
                game.printLocationInfo();
            }
        }],
        exits: [{
            name: "Z",
            location: "m8"
        }]
    }, {
        id: "m11",
        desc: "Stojíš před krásně vyzdobeným oltářem.",
        items: [{
            name: "oltář",
            desc: "Jsou na něm obrazy Svaté trojice - Marxe, Engelse a Lenina...",
            onExamine: function(game) {
                game.print("Něco jsi našel.");
                game.location.items.push({
                    name: "dynamit",
                    desc: "Je to klasická koule s doutnákem."
                });
                game.printLocationInfo();
            }
        }],
        exits: [{
            name: "Z",
            location: "m20"
        }]
    }, {
        id: "m12",
        desc: "Jsi ve městě. Je tu velký zmatek.",
        exits: [{
            name: "S",
            location: "m20"
        }, {
            name: "V",
            location: "m13"
        }, {
            name: "J",
            location: "m14"
        }, {
            name: "Z",
            location: "m13"
        }]
    }, {
        id: "m13",
        desc: "Bloudíš městem.",
        exits: [{
            name: "S",
            location: "m9"
        }, {
            name: "V",
            location: "m14"
        }, {
            name: "Z",
            location: "m12"
        }]
    }, {
        id: "m14",
        desc: "Jsi ve městě. Ulice jsou nepředstavitelně špinavé...",
        exits: [{
            name: "S",
            location: "m12"
        }, {
            name: "V",
            location: "m15"
        }, {
            name: "J",
            location: "m16"
        }, {
            name: "Z",
            location: "m17"
        }]
    }, {
        id: "m15",
        desc: "Jsi ve městě. Asi jsi zabloudil...",
        exits: [{
            name: "V",
            location: "m12"
        }, {
            name: "Z",
            location: "m13"
        }]
    }, {
        id: "m16",
        desc: "Procházíš městem.",
        exits: [{
            name: "S",
            location: "m14"
        }, {
            name: "V",
            location: "m17"
        }, {
            name: "J",
            location: "m12"
        }, {
            name: "Z",
            location: "m12"
        }]
    }, {
        id: "m17",
        desc: "Bloudíš městem. Tudy cesta nevede...",
        exits: [{
            name: "V",
            location: "m18"
        }, {
            name: "Z",
            location: "m16"
        }]
    }, {
        id: "m18",
        desc: "Jsi v malém parčíku. Je tu plno zeleně.",
        items: [{
            name: "sochu",
            desc: "Lenin...",
        }],
        exits: [{
            name: "Z",
            location: "m17"
        }]
    }, {
        id: "m20",
        desc: "Jsi v malém kostelíku. Je docela hezky vyzdoben.",
        exits: [{
            name: "V",
            location: "m11"
        }, {
            name: "J",
            location: "m12"
        }, {
            name: "D",
            location: "m1"
        }]
    }],
    actions: [{
        name: "prozkoumej",
        perform: function(game, params) {
            printRandomSlogan();
            game.clearOutput();
            game.print("-----------------");
            game.examineItem(params[0]);
        },
        autocomplete: function(game, str) {
            return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => item.name.startsWith(str));
        }
    }, {
        name: "S",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("S");
        }
    }, {
        name: "V",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("V");
        }
    }, {
        name: "J",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("J");
        }
    }, {
        name: "Z",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("Z");
        }
    }, {
        name: "N",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("N");
        }
    }, {
        name: "D",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("D");
        }
    }, {
        name: "polož",
        perform: function(game, params) {
            if (game.dropItem(params[0])) {
                printRandomSlogan();
                game.clearOutput();
                game.print("-----------------");
                game.print("Položil jsi " + params[0]);
            }
        },
        autocomplete: function(game, str) {
            return (!str || str.length === 0) ? game.inventory : game.inventory.filter(item => item.name.startsWith(str));
        }
    }, {
        name: "vezmi",
        perform: function(game, params) {
            printRandomSlogan();
            game.clearOutput();
            game.print("-----------------");
            if (game.takeItem(params[0])) {
                game.print("Vzal jsi " + params[0]);
            } else {
                game.print("Tohle nelze vzít.");
            }
        },
        autocomplete: function(game, str) {
            return (!str || str.length === 0) ? game.getTakeableItems() : game.getTakeableItems().filter(item => item.name.startsWith(str));
        }
    }, {
        name: "inventář",
        perform: function(game) {
            game.clearOutput();
            game.print("-----------------");
            if (game.inventory && game.inventory.length > 0) {
                game.print("Máš u sebe: " + game.inventory.map(item => item.name).join(", "));
            } else {
                game.print("Nemáš u sebe nic.");
            }
        }
    }, {
        name: "zapal",
        perform: function(game, params) {
            game.clearOutput();
            game.print("-----------------");
            if (game.getInventoryItem("zapalovač")) {
                if (getRandomInt(3) === 0) {
                    if (params[0] === "KNIHU") {
                        const book = game.getInventoryItem("knihu");
                        if (book) {
                            game.print("Zapálil jsi Kapitál. Kéž osvítí tvoji cestu!");
                            book.burning = game.time;
                            return;
                        }
                    } else if (params[0] === "DYNAMIT") {
                        const dynamite = game.getItem(game.getItems(), "knihu");
                        if (dynamite) {
                            game.print("Zapálil jsi doutnák...");
                            dynamite.ignited = game.time;
                            return;
                        }
                    }
                } else {
                    game.print("Zapalovač vynechal...");
                    return;
                }
            }
            game.print(game.messages.unknownAction);
        },
        autocomplete: function(game, str) {
            return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => item.name.startsWith(str));
        }
    }]
}

const slogans = ["Sláva K.S.Č.!",
    "Se SSSR na věčné časy",
    "Ať žije socialismus!",
    "Proletáři všech zemí, spojte se!",
    "Sláva leninské politice strany!",
    "Smrt imperialistickým štváčům!",
    "Vzhůru do nové pětiletky!",
    "Ať žije Vítězný únor!",
    "Socialismus - cesta zítřka!!!",
    "Kupředu levá, zpátky ni krok!",
    "Za osvobození vykořisťovaných!",
    "Za nejdemokratičtější zřízení!",
    "Dnes pětiletka - zítra komunismus!"
];

const darkLocations = ["m1", "m2", "m3", "m4", "m5"];

function printRandomSlogan() {
    document.querySelector('#slogan').innerText = slogans[getRandomInt(slogans.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}