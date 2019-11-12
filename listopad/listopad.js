/*
 * 17. 11. 1989
 */

let sideOpen = false;
let beepOn = true;
const actionBeep = new Audio("snd/actionbeep.wav");
const screenBeep = new Audio("snd/screenbeep.wav");
const choiceBeep = new Audio("snd/choicebeep.wav");

const items = [{
    name: "klíč",
    keys: ["k"],
    desc: "Je to trochu větší kónický klíč. Má tři zuby a zdobenou rukojeť. Asi bude od nějakých vrat.",
    readInit: function(obj) {
        obj.onUse = function(game) {
            if (game.location.id === "m5") {
                const door = game.getLocationItem("vrata");
                if (!door.open) {
                    game.removeItem("klíč");
                    door.open = true;
                    game.print("O.K.");
                    game.print("Strčil jsi ho do klíčové dírky dveří, otočil jsi s ním a s velkou námahou jsi otevřel dveře do domu. S námahou proto, že na nich bylo instalováno BRANO.");
                    game.location.exits.push({
                        name: "Jih",
                        location: "m7"
                    });
                    return true;
                }
            }
        };
    }
}, {
    name: "vrata",
    keys: ["v"],
    open: false,
    takeable: false,
    nonTakeableMessage: "Myslím, že bych je nevzal, ani kdyby byly otevřená, natož když jsou zamčená.",
    readInit: function(obj) {
        obj.desc = function() {
            return obj.open ? "Jsou odemčená. V dírce je ještě klíč." : "Obrovská dřevěná zamčená vrata, která ti brání ve vstupu do domu. Asi ve výši tvých očí se na tebe směje prázdná klíčová dírka. Snad by se dala i odemknout.";
        };
    }
}, {
    name: "bednu",
    keys: ["b"],
    takeable: false,
    nonTakeableMessage: "Bohužel, ale bedna je řetězem přidělána k zábradlí. Jsi přece v Československu!",
    open: false,
    tapeTaken: false,
    readInit: function(obj) {
        obj.desc = function() {
            if (!obj.open) {
                return "Obrovská dřevěná bedna, zatlučená hřeby. Co je asi uvnitř?";
            }
            if (!obj.tapeTaken) {
                return "Je ze silných fošen. Vypadá to, že je čerstvě vypáčená! Uvnitř leží nějaká krabička!";
            }
            return "Je ze silných fošen. Vypadá to, že je čerstvě vypáčená! Je však prázdná.";
        };
    }
}, {
    name: "videokazetu",
    keys: ["i"],
    destroyed: false,
    skipOnUseMessage: true,
    readInit: function(obj) {
        obj.desc = function() {
            if (obj.destroyed) {
                return "Tato krabička, omotaná čímsi hnědým, byla kdysi kazeta SONY.";
            }
            return "Je to videokazeta firmy SONY. Ještě je v ochranném obalu.";
        };
        obj.onTake = function(game) {
            const box = game.getItem(game.getItems(), "bednu");
            if (box) {
                box.tapeTaken = true;
            }
        };
        obj.onUse = function(game) {
            if (obj.destroyed) {
                return false;
            }
            const cam = game.getItem(game.getItems(), "videokameru");
            game.print("O.K.");
            if (cam) {
                cam.tape = true;
                game.print("Zasunul jsi kazetu do videokamery.");
                game.removeItem(obj.name);
            } else {
                obj.destroyed = true;
                game.print("Vymotal jsi pásek z kazety ve snaze ho použít. Ale dopadlo to jinak. Z kazety se stala krabička omotaná čímsi hnědým.");
            }
            return true;
        }
    }
}, {
    name: "videokameru",
    keys: ["v"],
    battery: false,
    tape: false,
    skipOnUseMessage: true,
    readInit: function(obj) {
        obj.desc = function() {
            if (obj.battery && obj.tape) {
                return "Je to obyčejná videokamera. Na boku má nápis SONY a několik tlačítek. Když jsi stiskl tlačítko s nápisem EJECT, trochu to v ní zacvakalo a pak se otevřela dvířka s kazetou.";
            } else if (obj.battery && !obj.tape) {
                return "Je to obyčejná videokamera. Na boku je nápis SONY a několik tlačítek. Když jsi stiskl tlačítko s nápisem EJECT, trochu to v ní zacvakalo a pak se otevřela dvířka na kazetu.";
            }
            return "Je to obyčejná videokamera. Na boku je nápis SONY a několik tlačítek. Stiskl jsi jedno z nich, ale nic se nestalo.";
        };
        obj.onUse = function(game) {
            game.print("O.K.");
            if (!obj.battery) {
                game.print("Stiskl jsi červené tlačítko s nápisem RECORD, ale nic se nestalo.");
            } else if (obj.battery && !obj.tape) {
                game.print("Stiskl jsi červené tlačítko s nápisem RECORD, kamera začala bzučet, ale po chvíli přestala. Asi není vše v pořádku.");
            } else {
                if (game.location.id === "m20") {
                    game.print("Stiskl jsi červené tlačítko s nápisem RECORD. Kamera začala bzučet a nad tímto tlačítkem se rozsvítila červená dioda.", "end-win");
                    game.end("win");
                    return true;
                } else {
                    game.print("Po chvíli natáčení se objevila skupinka příslušníků Červených baretů. Vyrvali ti kameru z rukou a rozšlapali ji. Ty jsi na tom nebyl o moc lépe...", "end-lose");
                    game.end("kiled", false);
                }
            }
        }
    }
}, {
    name: "žebřík",
    keys: ["ž", "z"],
    desc: "Je to kovový třímetrový žebřík, má deset příček.",
    skipOnUseMessage: true,
    readInit: function(obj) {
        obj.onUse = function(game) {
            if (game.location.id === "m16") {
                if (!game.location.exits.find(e => e.name === "Nahoru")) {
                    game.print("O.K.");
                    game.print("Přistavil jsi žebřík ke zdi pod poklopem.");
                    if (game.getInventoryItem(obj.name)) {
                        game.dropItem(obj.name);
                    }
                    game.location.exits.push({
                        name: "Nahoru",
                        location: "m21",
                        skipPreposition: true
                    });
                }
                return true;
            } else if (game.location.id.substring(1, game.location.id.length) > 7) {
                game.print("Přistavil jsi žebřík k nejbližší zdi a zkušebně jsi na něj vylezl. Avšak žebřík nestál stabilně, proto jste se oba poroučeli k zemi. Vyvázl jsi pouze s otřesem mozku a zlomenou nohou.", "end-lose");
                game.end("killed", false);
                return true;
            }
        };
        obj.onTake = function(game) {
            if (game.location.id === "m16") {
                game.removeLocationExit("Nahoru");
            }
        }
    }
}, {
    name: "dveře",
    keys: ["d"],
    destroyed: false,
    takeable: false,
    nonTakeableMessage: "Bohužel, ale dveře jsou tak masivní, že bys je sotva otevřel.",
    readInit: function(obj) {
        obj.desc = function() {
            if (obj.destroyed) {
                return "Jsou to kovové dveře. V klíčové  dírce je zlomený klíček. To bude zas domovnice řádit...";
            }
            return "Je v nich malá klíčová dírka (asi pro malý klíček).";
        }
    }
}, {
    name: "rohožku",
    keys: ["r"],
    desc: "Je to zcela normální rohožka (rozměry 100 x 50 x 1,5 cm) na čištění bot.",
    skipGeneralMessage: true,
    readInit: function(obj) {
        obj.onTake = function(game) {
            game.print("O.K.");
            game.print("Pod rohožkou se skrýval klíček!");
            game.addLocationItem("klíček");
            return true;
        }
    }
}, {
    name: "klíček",
    keys: ["l"],
    destroyed: false,
    skipOnUseMessage: true,
    readInit: function(obj) {
        obj.desc = function() {
            if (obj.destroyed) {
                return "Je to jen rukojeť od bývalého klíčku.";
            }
            return "Je to malý klíček výrobního družstva INKLEMO Praha sloužící asi k odemykání čehosi.";
        };
        obj.onUse = function(game) {
            if (game.location.id === "m21") {
                const trapDoor = game.getLocationItem("poklop");
                if (!trapDoor.open) {
                    trapDoor.open = true;
                    game.print("O.K.");
                    game.print("Odemkl jsi zámek visící na poklopu.");
                    game.location.exits.push({
                        name: "Nahoru",
                        location: "m17",
                        skipPreposition: true
                    });
                    return true;
                }
            } else if (game.location.id === "m10") {
                const door = game.getLocationItem("dveře");
                if (door) {
                    door.destroyed = true;
                    game.removeItem("klíček");
                    game.print("O.K.");
                    game.print("Ztěžka jsi zasunul klíč do dírky ve dveřích, otočil jsi...  ...a došlo k nejhoršímu! KLÍČEK SE ZLOMIL!");
                    // Klicek se zlomil je v blikajícím stylu
                    // TODO fail state
                    return true;
                }
            }
        }
    }
}, {
    name: "poklop",
    keys: ["p"],
    open: false,
    takeable: false,
    readInit: function(obj) {
        obj.desc = function() {
            if (obj.open) {
                return "Je to masivní kovový poklop. Visí na něm odemčený zámek.";
            }
            return "Je to masivní kovový poklop; asi vede na střechu. Je zajištěn visacím zámkem.";
        };
        obj.nonTakeableMessage = function(game) {
            return game.location.id === "m21" ? "Je tak těžký, že kdybych ho vysadil z pantu, tak by mě srazil ze žebříku." : "Je moc vysoko!";
        };
    }
}, {
    name: "baterie",
    keys: ["b"],
    desc: "Jsou to baterie VARTA specielně určené pro elektronické přístroje.",
    skipOnUseMessage: true,
    readInit: function(obj) {
        obj.onUse = function(game) {
            const cam = game.getItem(game.getItems(), "videokameru");
            game.print("O.K.");
            if (cam) {
                cam.battery = true;
                game.print("Vložil jsi baterie do kamery.");
            } else {
                game.print("Odhodil jsi baterie do nejbližšího rohu.");
            }
            game.removeItem(obj.name);
            // failstate
            return true;
        };
    }
}, {
    name: "hák",
    keys: ["h"],
    desc: "Je to kovový \"s\"-hák sloužící k páčení.",
    readInit: function(obj) {
        obj.onUse = function(game) {
            const box = game.getItem(game.getItems(), "bednu");
            // Box is non-takeable - we can be sure we're in m8
            if (box) {
                if (!box.open) {
                    box.open = true;
                    game.print("O.K.");
                    game.print("Vypáčil jsi víko bedny. V bedně je videokazeta!");
                    game.addLocationItem("videokazetu");
                    return true;
                }
            } else {
                game.print("O.K.");
                game.print("Úderem o zem jsi \"s\"-hák přerazil.");
                game.removeItem(obj.name);
                return true;
            }
        };
    }
}];

const locations = [{
    id: "m1",
    desc: "Nacházíš se u Národního divadla. Dav tě strhává směrem k nakladatelství ALBATROS. Zůstat na místě je nemožné.",
    exits: [{
        name: "Východ",
        location: "m2"
    }],
    hint: "Neotálej a jdi vpřed!"
}, {
    id: "m2",
    desc: "Pokračuješ s davem směrem k jazykové škole. Na sever od tebe je pasáž Metro. Vpředu se průvod zastavil a lidé se začínají mačkat. Vrátit se nelze.",
    exits: [{
        name: "Sever",
        location: "m3"
    }, {
        name: "Východ",
        location: "m4"
    }],
    hint: "Pasáž nevypadá bezpečně.",
    items: ["klíč"]
}, {
    id: "m3",
    desc: "",
    skipLocationItems: true,
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Vlezl jsi do pasáže Metro. Vmžiku se na tebe vrhlo pět příslušníků \"Červených baretů\" a zmlátili tě do bezvědomí.", "end-lose");
            game.end("killed", false);
        }
    },
}, {
    id: "m4",
    desc: "Jsi namáčknut na zdi. Lidé skandují: \"Nechceme násilí\", \"Lidský práva\", \"Nechte nás projít\".",
    hint: "Neotálej a jdi vpřed!",
    exits: [{
        name: "Jih",
        location: "m5"
    }],
    noLocationItems: "Mimo kordon příslušníků VB nevidíš nic zvláštního."
}, {
    id: "m5",
    desc: "Jsi na chodníku na pravé straně Národní třídy.",
    hint: "Jak se dostat do domu?",
    items: ["vrata"],
    exits: [{
            name: "Sever",
            location: "m4"
        }, {
            name: "Západ",
            location: "m6"
        }
        // open the door -> exit "Jih" to m7
    ],
}, {
    id: "m6",
    desc: "",
    skipLocationItems: true,
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Vešel jsi do pasáže u Reduty. Jsou zde příslušníci \"Červených baretů\". Asi čtyři se na tebe ihned vrhli a se slovy \"Dělejte, ať se tu s váma nemusíme ... do půlnoci\" tě umlátili do bezvědomí.", "end-lose");
            game.end("killed", false);
        }
    },
}, {
    id: "m7",
    desc: "Jsi v přízemí domu.",
    hint: "Tady se nic zvláštního nestane.",
    exits: [{
        name: "Sever",
        location: "m5"
    }, {
        name: "Nahoru",
        location: "m11"
    }, {
        name: "Dolů",
        location: "m8",
        skipPreposition: true
    }],
}, {
    id: "m8",
    desc: "Jsi ve sklepení domu.",
    hint: "Bednu bude třeba vypáčit.",
    items: ["bednu"],
    exits: [{
        name: "Jih",
        location: "m10"
    }, {
        name: "Západ",
        location: "m9"
    }, {
        name: "Nahoru",
        location: "m7",
        skipPreposition: true
    }],
}, {
    id: "m9",
    hint: "K videokameře bude třeba i příslušenství.",
    desc: "Jsi na západním konci sklepní chodby.",
    items: ["videokameru"],
    exits: [{
        name: "Východ",
        location: "m8"
    }],
}, {
    id: "m10",
    hint: "Nezdá se, že by za těmi dveřmi bylo něco důležitého.",
    desc: "Jsi na jižním konci sklepní chodby.",
    items: ["žebřík", "dveře"],
    exits: [{
        name: "Sever",
        location: "m8"
    }],
}, {
    id: "m11",
    desc: "Stojíš na schodech v prvním patře.",
    hint: "Tady se nic zvláštního nestane.",
    exits: [{
        name: "Jih",
        location: "m12"
    }, {
        name: "Dolů",
        location: "m7",
        skipPreposition: true
    }],
}, {
    id: "m12",
    desc: "Jsi v rohu prvního patra. Zvenku slyšíš štěkat psy.",
    hint: "Tady se nic zvláštního nestane.",
    exits: [{
        name: "Sever",
        location: "m11"
    }, {
        name: "Východ",
        location: "m13"
    }],
}, {
    id: "m13",
    desc: "Stojíš pod schody, které zřejmě vedou do druhého patra.",
    hint: "Tady se nic zvláštního nestane.",
    exits: [{
        name: "Západ",
        location: "m12"
    }, {
        name: "Nahoru",
        location: "m14",
        skipPreposition: true
    }],
}, {
    id: "m14",
    hint: "Tady se nic zvláštního nestane.",
    desc: "Jsi na schodech ve druhém patře.",
    exits: [{
        name: "Západ",
        location: "m15"
    }, {
        name: "Dolů",
        location: "m13",
        skipPreposition: true
    }],
}, {
    id: "m15",
    desc: "Jsi v rohu druhého patra.",
    hint: "Copak je asi pod rohožkou?",
    // key is under the doormat 
    items: ["rohožku"],
    exits: [{
        name: "Jih",
        location: "m16"
    }, {
        name: "Východ",
        location: "m14"
    }],
}, {
    id: "m16",
    desc: "Jsi na konci chodby v druhém patře.",
    hint: "Odsud na poklop nedosáhneš.",
    // use the ladder -> exit "Nahoru" to m17
    items: ["poklop"],
    exits: [{
        name: "Sever",
        location: "m15"
    }],
}, {
    id: "m17",
    desc: "Jsi na střeše obytného domu.",
    hint: "Tady se nic zvláštního nestane.",
    exits: [{
        name: "Východ",
        location: "m18"
    }, {
        name: "Dolů",
        location: "m21",
        skipPreposition: true
    }],
}, {
    id: "m18",
    desc: "Jsi v rohu střechy.",
    hint: "Baterie přijdou vhod!",
    items: ["baterie"],
    exits: [{
        name: "Jih",
        location: "m19"
    }, {
        name: "Západ",
        location: "m17"
    }],
}, {
    id: "m19",
    hint: "Z Národní třídy můžou příslušníci vidět i tebe!",
    desc: "Popošel jsi po střeše. Dostal jsi se na místo, z kterého je dobře vidět na Národní třídu.",
    items: ["hák"],
    exits: [{
        name: "Sever",
        location: "m18"
    }, {
        name: "Východ",
        location: "m20"
    }],
}, {
    id: "m20",
    desc: "Dostal jsi se do rohu střechy. Je odtud nádherný výhled na osvětlené Hradčany.",
    hint: "Kromě výhledu na Hradčany odsud vidíš i zásah na Národní třídě. Snad to bude stačit.",
    exits: [{
        name: "Západ",
        location: "m19"
    }],
}, {
    id: "m21",
    desc: "Stojíš na žebříku.",
    hint: "Poklop bude třeba odemknout.",
    // open the trapdoor -> exit "Nahoru" to m21
    items: ["poklop"],
    exits: [{
        name: "Dolů",
        location: "m16",
        skipPreposition: true
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
            goToLocation(game, exits[0]);
        } else {
            game.print("Kam mám jít?");
            const exitActionList = [];
            for (const exit of exits) {
                exitActionList.push({
                    name: exit.name,
                    keys: [exit.name.charAt(0)],
                    perform: function(game) {
                        game.clearOutput();
                        goToLocation(game, exit);
                    }
                });
            }
            updateActionList(game, exitActionList);
            // Choice action
            return true;
        }
    },
}, {
    name: "Vzít",
    keys: ["v"],
    perform: function(game, params) {
        game.clearOutput();
        const takeableItems = game.location.items.map(i => game.mapItem(i)).filter(item => item.takeable === undefined || item.takeable ||
            item.name === "bednu" || item.name === "vrata" || item.name === "poklop" || item.name === "dveře");
        if (!takeableItems || takeableItems.length === 0) {
            game.print("Nic tu není!");
        } else {
            if (takeableItems.length === 1) {
                takeItem(game, takeableItems[0]);
                updateActionList(game);
            } else {
                game.print("Co mám vzít?");
                const itemsList = [];
                for (const item of takeableItems) {
                    itemsList.push({
                        name: item.name,
                        keys: item.keys,
                        perform: function(game) {
                            game.clearOutput();
                            takeItem(game, item);
                            updateActionList(game);
                        }
                    });
                }
                updateActionList(game, itemsList);
                // Choice action
                return true;
            }
        }
    },
}, {
    name: "Položit",
    keys: ["p"],
    perform: function(game, params) {
        game.clearOutput();
        if (!game.inventory || game.inventory.length === 0) {
            game.print("Nic neneseš.");
        } else {
            if (game.inventory.length === 1) {
                dropItem(game, game.mapItem(game.inventory[0]))
                updateActionList(game);
            } else {
                game.print("Co mám položit?");
                const itemsList = [];
                for (const itemName of game.inventory) {
                    const item = game.mapItem(itemName);
                    itemsList.push({
                        name: item.name,
                        keys: item.keys,
                        perform: function(game) {
                            game.clearOutput();
                            dropItem(game, item);
                            updateActionList(game);
                        }
                    });
                }
                updateActionList(game, itemsList);
                // Choice action
                return true;
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
                useItem(game, items[0]);
            } else {
                game.print("Co mám použít?");
                const itemsList = [];
                for (const item of items) {
                    itemsList.push({
                        name: item.name,
                        keys: item.keys,
                        perform: function(game) {
                            game.clearOutput();
                            useItem(game, item);
                            updateActionList(game);
                        }
                    });
                }
                updateActionList(game, itemsList);
                // Choice action
                return true;
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
            game.print("Dokud okolo tebe šel průvod, lidé se ti ohleduplně vyhýbali. Po chvíli však byl průvod přerušen kordonem \"pořádkových jednotek\", který přišel z mostu 1. Máje. Tito \"lidé\" se ti již nevyhli...", "end-lose");
            game.end("killed", false);
        } else if (game.location.id === "m4") {
            game.print("Chvíli jsi čekal,že bude průvod propuštěn směrem k Václavskému náměstí. Stalo se však něco uplně jiného. Příslušníci tvrdě zasáhli...", "end-lose");
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
                        keys: item.keys,
                        perform: function(game) {
                            game.clearOutput();
                            game.examineItem(item.name);
                            updateActionList(game);
                        }
                    });
                }
                updateActionList(game, itemsList);
                // Choice action
                return true;
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
            game.print("Nic neneseš!");
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
            locationExits: "Východy",
            wrongUsage: "Nevím k čemu!",
            gameSaved: "Hra uložena.",
            gameLoaded: "Uložená pozice nahrána.",
            gamePositions: "Uložené pozice: ",
            gamePositionsEmpty: "Nemáš žádnou uloženou pozici.",
            gamePositionDoesNotExist: "Nelze nahrát pozici: ",
            inventoryFull: "Máš plné ruce!",
        },
        intro: [function(gameContainer) {
            // Image
            const title = document.createElement("div");
            gameContainer.appendChild(title);
            title.className = "intro-title";

            const img = document.createElement("img");
            img.src = "img/title.png";
            img.className = "intro-img";
            title.appendChild(img);

            const textEnter = document.createElement("div");
            title.appendChild(textEnter);

            queueOutput(textEnter, "Stiskni klávesu ENTER", function() {
                textEnter.className = "intro-enter";
            });

        }, function(gameContainer) {
            // Title
            while (gameContainer.firstChild) {
                gameContainer.removeChild(gameContainer.firstChild);
            }
            const text1_a = document.createElement("div");
            text1_a.className = "intro-text1_a";
            gameContainer.appendChild(text1_a);
            const text1_b = document.createElement("div");
            text1_b.className = "intro-text1_b";
            gameContainer.appendChild(text1_b);
            const text1_c = document.createElement("div");
            text1_c.className = "intro-text1_c";
            gameContainer.appendChild(text1_c);
            const text1_d = document.createElement("div");
            text1_d.className = "intro-text1_d";
            gameContainer.appendChild(text1_d);


            const text2 = document.createElement("div");
            text2.className = "intro-text2";
            gameContainer.appendChild(text2);

            const textEnter = document.createElement("div");
            gameContainer.appendChild(textEnter);

            queueOutput(text1_a, "INFORMACE O HŘE");
            queueOutput(text1_b, "Tato hra vznikla podle skutečných událostí dne 17. 11. 1989. Hra vznikla na protest proti brutálnímu zásahu \"POŘÁDKOVÝCH JEDNOTEK\" Sboru národní bezpečnosti a tzv. ČERVENÝCH BARETŮ (Speciální jednotky ministerstva vnitra).");
            queueOutput(text1_c, "DOUBLES©FT");
            queueOutput(text1_d, "NAŠÍM CÍLEM NEBYLO ZNEVÁŽIT TO, CO SE STALO DNE 17. 11. 1989 NA NÁRODNÍ TŘÍDĚ, ALE ZOBRAZIT BRUTÁLNÍ ZÁSAH VB PROTI POKOJNÉ MANIFESTACI.");

            queueOutput(text2, "", undefined, undefined, true);

            queueOutput(textEnter, "Stiskni klávesu ENTER", function() {
                textEnter.className = "intro-enter";
            });

        }, function(gameContainer) {
            // Story
            while (gameContainer.firstChild) {
                gameContainer.removeChild(gameContainer.firstChild);
            }

            const text1 = document.createElement("div");
            text1.className = "intro-story1_a";
            gameContainer.appendChild(text1);
            const text2 = document.createElement("div");
            text2.className = "intro-story2";
            gameContainer.appendChild(text2);
            const text3 = document.createElement("div");
            text3.className = "intro-story3";
            gameContainer.appendChild(text3);

            const textAdd = document.createElement("div");
            textAdd.className = "intro-add";
            gameContainer.appendChild(textAdd);

            const textAdd1 = document.createElement("div");
            textAdd1.className = "intro-add-next";
            gameContainer.appendChild(textAdd1);

            const textEnter = document.createElement("div");
            gameContainer.appendChild(textEnter);

            queueOutput(text1, "CÍL HRY");
            queueOutput(text2, "Cílem hry je vyhnout se kordonu \"POŘÁDKOVÝCH SIL\", najít VIDEO KAMERU, KAZETU DO VIDEO KAMERY a celý \"masakr\" natočit na VIDEO z místa, z kterého vás nikdo z příslušníků \"POŘÁDKOVÝCH JEDNOTEK\" neuvidí.");
            queueOutput(text3, "Během hry nacházíte předměty, které vám usnadní řešení. Zaváhání může přinést jen nepříjemnosti.");

            queueOutput(textAdd, "PAMATUJTE:");
            queueOutput(textAdd1, "JEDNA RÁNA OBUŠKEM STAČÍ!");

            queueOutput(textEnter, "Stiskni klávesu ENTER", function() {
                textEnter.className = "intro-enter";
            });
        }],
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
                    processKey(game, event.key);
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
            };
            const sidebarOpen = document.querySelector("#game-sidebar-open");
            if (sidebarOpen) {
                sidebarOpen.style.display = "block";
            }
        },
        onEnd: function(endState) {
            if (endState === "killed") {
                this.print("Dlouho jsi nevydržel!");
                this.print("Stiskni klávesu R pro RESTART nebo L a nahraje se poslední uložená pozice.", "intro-enter");
            } else if (endState === "win") {
                this.print("!!! Natáčíš !!!", "end-win");
                this.print("Gratuluji!");
                this.print("Scénář: Miroslav Štěpán");
                this.print("Režie: Miloš Jakeš");
                this.print("Kostýmy: Matador Bratislava");
                this.print("VYROBILA");
                this.print("ÚV KSČ ve spolupráci s MV ČSSR © 1989");
                this.print("Těšte se na další hry od firmy DOUBLES©FT");
                this.print("DOUBLES©FT se s Vámi loučí");
                this.print("Informace o jiných textových hrách od firmy DOUBLES©FT na tel. 75-33-56 nebo 77-48-55");
                this.print("Stiskni klávesu R pro RESTART", "intro-enter");
            }
        },
        onEnterLocation: function(game, lastLocation) {
            updateActionList(game);
            // Play beep sound
            if (beepOn) {
                screenBeep.play();
            }
        },
        onLoad: function(game, positionName) {
            if (game.messages.gameLoaded) {
                game.print(game.messages.gameLoaded + " [" + positionName + "]", "hint");
            }
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
        actions: actions,
    }
    return game;
}

function processKey(game, key) {
    if (game.headless) {
        console.log(">> " + key);
    }
    key = key.toLowerCase();
    for (const action of game.actionList) {
        if (action.keys && action.keys.find(k => k.toLowerCase() === key)) {
            const isChoice = action.perform(game);
            // Play beep sound
            if (beepOn) {
                if (isChoice) {
                    choiceBeep.play();
                } else {
                    actionBeep.play();
                }
            }
            break;
        }
    }
}

function goToLocation(game, exit) {
    game.print("O.K.");
    game.print("Jdeš " + (exit.skipPreposition ? "" : "na ") + exit.name.toLowerCase());
    if (game.headless) {
        game.goToLocation(exit.name);
    } else {
        setTimeout(function() {
            game.goToLocation(exit.name);
        }, 1000);
    }
}

function dropItem(game, item) {
    const ret = game.dropItem(item.name);
    if (ret) {
        game.print("O.K.");
        game.print("Položil jsi " + item.name);
    }
}

function takeItem(game, item) {
    const ret = game.takeItem(item.name);
    if (ret.full) {
        return;
    }
    if (ret.item) {
        if (!ret.item.skipGeneralMessage) {
            game.print("O.K.");
            game.print("Vzal jsi " + ret.item.name);
        }
    } else {
        if (item.nonTakeableMessage) {
            const msg = item.nonTakeableMessage instanceof Function ? item.nonTakeableMessage(game) : item.nonTakeableMessage;
            game.print(msg);
        } else {
            game.print("Tohle nejde vzít.");
        }
    }
}

function useItem(game, item) {
    if (game.useItem(item.name)) {
        // if (!item.skipOnUseMessage) {
        //     game.print("Použil jsi " + item.name);
        // }
    } else {
        game.print(game.messages.wrongUsage);
    }
}

const builtinActions = [{
    name: "Restart",
    keys: ["r"],
    lineBreak: true,
    perform: function(game) {
        location.reload();
    }
}, {
    name: "Save",
    keys: ["s"],
    perform: function(game) {
        game.clearOutput();
        game.print("Uložit do jaké pozice?");
        const positionList = [];
        for (let index = 1; index < 10; index++) {
            positionList.push({
                name: "P" + index,
                keys: ["" + index],
                perform: function(game) {
                    game.clearOutput();
                    const positionName = game.save(["P" + index]);
                    if (game.messages.gameSaved) {
                        game.print(game.messages.gameSaved + " [" + positionName + "]", "hint");
                    }
                    updateActionList(game);
                }
            });
        }
        updateActionList(game, positionList);
    }
}, {
    name: "Load",
    keys: ["l"],
    perform: function(game) {
        game.clearOutput();
        const positions = game.getPositions();
        if (positions.length === 0) {
            game.print("Nemám co nahrát!");
            return;
        }
        game.print("Nahrát jakou pozici?");
        positions.sort();
        const positionList = [];
        for (const position of positions) {
            positionList.push({
                name: position[0],
                keys: [position[0].charAt(1)],
                perform: function(game) {
                    game.load([position[0]]);
                    // We cannot use the game param since a new game was already loaded => onLoad callback
                }
            });
        }
        updateActionList(game, positionList);
    }
}, {
    name: "Pomoc",
    keys: ["o"],
    perform: function(game) {
        game.clearOutput();
        if (game.location.hint) {
            game.print(game.location.hint, "hint");
        } else {
            game.print("Nevím, jak ti pomoci...");
        }
    }
}];

function updateActionList(game, actions) {
    if (game.endState) {
        return;
    }
    if (!actions) {
        actions = game.getActions();
        builtinActions.forEach(a => actions.push(a));
        game.print("Co mám dělat?");
    }
    game.actionList = actions;
    if (game.headless) {
        console.log("Actions: " + game.actionList.map(a => a.name).join(", "));
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
        let keyFound = false;
        for (let j = 0; j < action.name.length; j++) {
            if (j === 0 && action.lineBreak) {
                actionListDiv.appendChild(document.createElement("br"));
            }
            const letter = action.name[j];
            if (!keyFound && action.keys && action.keys.find(key => key.toLowerCase() === letter.toLowerCase())) {
                const keySpan = document.createElement("span");
                keySpan.className = "key";
                keySpan.textContent = letter;
                actionListDiv.appendChild(keySpan);
                keyFound = true;
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