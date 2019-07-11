const demo = {
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
        }]
    }, {
        id: "m5",
        desc: "Jsi v úzké podzemní chodbě vedoucí na východ. Je tu vlhko.",
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
        exits: [{
            name: "J",
            location: "m9"
        }]
    }, {
        id: "m7",
        desc: "Stojíš v tmavém výklenku.",
        items: [{
            name: "zapalovač",
            desc: "Jistě by s ním šlo leccos zapálit. Je to totiž kvlaitní zapalovač \"Made in USSR\".",
        }],
        exits: [{
            name: "V",
            location: "m9"
        }]
    }, {
        id: "m8",
        desc: "Stojíš před ošklivým smrdutým záchodem. Táhne od něj nepříjemný zápach.",
        exits: [{
            name: "S",
            location: "m9"
        }]
    }, {
        id: "m9",
        desc: "Stojíš v malé zaprášené místnosti.",
        items: [{
            name: "poklop",
            desc: "Je to těžký ocelový poklop se zámkem na čtverhranný klíč.",
            takeable: false
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
            }
            // TODO
        ]
    }, {
        id: "m10",
        desc: "Jsi na špinavém záchodě. Radši to nebudu příliš popisovat, mohlo by se ti udělat nevolno.",
        exits: [{
            name: "Z",
            location: "m8"
        }]
    }, {
        id: "m11",
        desc: "Stojíš před krásně vyzdobeným oltářem.",
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
            game.printItemInfo(params[0]);
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
        name: "poloz",
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
]

function printRandomSlogan() {
    document.querySelector('#slogan').innerText = slogans[getRandomInt(slogans.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}