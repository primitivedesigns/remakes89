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

const bookItemName = "knihu";
const dynamiteItemName = "dynamit";

const dynamiteExplosionTime = 2;
const bookBurningTime = 12;

const prestavba = {
    title: "P.R.E.S.T.A.V.B.A.",
    messages: {
        locationItems: "Vidíš",
        noLocationItems: "Nevidíš nic",
        locationExits: "Východy",
        unknownAction: "Bohužel... ale nezoufej, to je dialektika dějin!",
        inputHelpTip: '\xa0',
        inputHelpPrefix: "Možnosti: ",
    },
    onStart: function() {
        printRandomSlogan();
        this.printInputHelp(this.messages.inputHelpTip);
    },
    onLocationInfo: function(game) {
        if (darkLocations.find(id => id === game.location.id)) {
            const book = game.getInventoryItem(bookItemName);
            if (!book || !book.burning) {
                game.clearLocation();
                game.printLocation("Je tu tma.");
            }
        }
    },
    onShiftTime: function(game) {
        // The book should disappear after it's burning for 12 time units
        const bookRet = game.findItem(bookItemName);
        const book = bookRet.item;
        const bookLocation = bookRet.location;
        // TODO warning after 11 time units
        if (book && book.burning && (game.time - book.burning) > bookBurningTime) {
            if (bookLocation) {
                bookLocation.items.splice(bookLocation.items.findIndex(item => item.name === bookItemName), 1);
            } else {
                game.inventory.splice(game.inventory.findIndex(item => item.name === bookItemName), 1);
            }
        }

        // Dynamite should explode after 2 time units
        const dynamiteRet = game.findItem(dynamiteItemName);
        const dynamite = dynamiteRet.item;
        const dynamiteLocation = dynamiteRet.location;
        if (dynamite && dynamite.ignited) {
            if ((dynamiteLocation && dynamiteLocation.id === game.location.id) || dynamiteLocation == null) {
                // GAME OVER
                game.end("Obrovská exploze otřásla městem, což jsi včak jako její přímý účastník neslyšel.");
                return;
            }
            if ((game.time - dynamite.ignited) > dynamiteExplosionTime) {
                // Exploded!
                game.print("Země se otřásla výbuchem.");
                if (dynamiteLocation) {
                    if (dynamiteLocation.id === "m18") {
                        dynamiteLocation.items.splice(dynamiteLocation.items.findIndex(item => item.name === "sochu"), 1);
                        dynamiteLocation.items.push({
                            name: "trosky jakési sochy",
                            desc: "Vidím kus lebky, ucho a ruku ukazující cestu do šťastné komunistické budoucnosti.",
                            takeable: false
                        });
                        dynamiteLocation.items.push({
                            name: "cihlu",
                            desc: "Je celá ze zlata.",
                            onTake: function(game) {
                                game.end("Gratuluji vítězi! Je vidět, že socialistický člověk si poradí v každé situaci...");
                            }
                        });
                    }
                    dynamiteLocation.items.splice(dynamiteLocation.items.findIndex(item => item.name === dynamiteItemName), 1);
                }
            }
        }
    },
    onMissingAction: function(game, name) {
        game.clearOutput();
        if (!game.examineItem(name)) {
            // No action found and no item matches the name
            game.print(game.messages.unknownAction);
        }
        game.shiftTime(1);
    },
    onActionPerformed: function(game, action) {
        game.shiftTime(1);
    },
    isInputCaseSensitive: false,
    partialMatchLimit: 2,
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
            aliases: ["uvodnik", "noviny"],
            desc: "Je to úvodník Rudého práva.",
            read: false,
            actions: [{
                name: "přečti",
                aliases: ["čti", "cti", "precti"],
                perform: function(game) {
                    const newspaper = game.findItem("úvodník").item;
                    if (newspaper) {
                        newspaper.read = true;
                        game.clearOutput();
                        game.print("Přečetl jsi si úvodník Rudého práva. Okamžitě jsi dostal chuť k práci, která je základní ctí socialistického občana.");
                    } else {
                        // This should never happen
                        console.log("Newspaper not found");
                    }
                }
            }]
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
                const newspaper = game.findItem("úvodník").item;
                if (pickaxe) {
                    if (newspaper.read) {
                        game.clearOutput();
                        game.print("Podařilo se ti prokopat se do nižšího podlaží!");
                        game.location.exits.push({
                            name: "D",
                            location: "m2"
                        });
                        game.printLocationInfo();
                    } else {
                        game.clearOutput();

                        game.print("Nechce se ti makat.");
                    }
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
            aliases: ["krumpac"],
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
            aliases: ["bedna"],
            desc: "Je ze dřeva.",
            onExamine: function(game) {
                game.print("Něco jsi našel!");
                game.location.items.push({
                    name: "košík",
                    aliases: ["kosik"],
                    desc: "Je to hezký proutěný košík, i když poněkud špinavý.",
                    onExamine: function(game) {
                        game.print("Něco jsi našel!");
                        game.location.items.push({
                            name: "krabici",
                            aliases: ["krabice"],
                            desc: "Je z papíru.",
                            onExamine: function(game) {
                                game.print("Něco jsi našel!");
                                game.location.items.push({
                                    name: "klíč",
                                    aliases: ["klic"],
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
            aliases: ["zapalovac"],
            desc: "Jistě by s ním šlo leccos zapálit. Je to totiž kvalitní zapalovač \"Made in USSR\".",
            actions: [{
                name: "zapal",
                perform: function(game, params) {
                    game.clearOutput();
                    if (getRandomInt(3) === 0) {
                        if (game.matchName(params[0], bookItemName)) {
                            const book = game.getInventoryItem(bookItemName);
                            if (book) {
                                game.print("Zapálil jsi Kapitál. Kéž osvítí tvoji cestu!");
                                book.burning = game.time;
                                // Show info in a dark location
                                game.printLocationInfo();
                                return;
                            }
                        } else if (game.matchName(params[0], dynamiteItemName)) {
                            const dynamite = game.getItem(game.getItems(), dynamiteItemName);
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
                    game.print(game.messages.unknownAction);
                },
                autocomplete: function(game, str) {
                    return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => item.name.startsWith(str));
                }
            }]
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
            aliases: ["dvere"],
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
            aliases: ["kod", "kód"],
            perform: function(game, params) {
                const door = game.getLocationItem("dveře");
                game.clearOutput();

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

                if (game.matchName(params[0], "dveře")) {
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
            aliases: ["otevri"],
            perform: function(game, params) {
                game.clearOutput();

                if (game.matchName(params[0], "poklop")) {
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
            aliases: ["misu"],
            desc: "Je úplně zaschlá.",
            takeable: false,
            onExamine: function(game) {
                game.print("Něco jsi našel!");
                game.location.items.push({
                    name: bookItemName,
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
            aliases: ["oltar"],
            desc: "Jsou na něm obrazy Svaté trojice - Marxe, Engelse a Lenina...",
            onExamine: function(game) {
                game.print("Něco jsi našel!");
                game.location.items.push({
                    name: dynamiteItemName,
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
            if (!game.examineItem(params.join(" "))) {
                game.print(game.messages.unknownAction);
            }
        },
        autocomplete: function(game, str) {
            return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => item.name.startsWith(str));
        }
    }, {
        name: "S",
        aliases: ["sever"],
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("S");
        }
    }, {
        name: "V",
        aliases: ["vychod", "východ"],
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("V");
        }
    }, {
        name: "J",
        aliases: ["jih"],
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("J");
        }
    }, {
        name: "Z",
        aliases: ["zapad", "západ"],
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("Z");
        }
    }, {
        name: "N",
        aliases: ["nahoru"],
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("N");
        }
    }, {
        name: "D",
        aliases: ["dolu"],
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
                game.print("Položil jsi " + params[0]);
            }
        },
        autocomplete: function(game, str) {
            return (!str || str.length === 0) ? game.inventory : game.inventory.filter(item => item.name.startsWith(str));
        }
    }, {
        name: "vezmi",
        aliases: ["seber"],
        perform: function(game, params) {
            printRandomSlogan();
            game.clearOutput();
            const item = game.takeItem(params[0]);
            if (item) {
                game.print("Vzal jsi " + item.name + ".");
            } else {
                game.print("Tohle nelze vzít.");
            }
        },
        autocomplete: function(game, str) {
            return (!str || str.length === 0) ? game.getTakeableItems() : game.getTakeableItems().filter(item => item.name.startsWith(str));
        }
    }, {
        name: "inventář",
        aliases: ["věci", "veci", "i"],
        perform: function(game) {
            game.clearOutput();
            if (game.inventory && game.inventory.length > 0) {
                game.print("Máš u sebe: " + game.inventory.map(item => item.name).join(", "));
            } else {
                game.print("Nemáš u sebe nic.");
            }
        }
    }]
}

function printRandomSlogan() {
    document.querySelector('#slogan').innerText = slogans[getRandomInt(slogans.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}