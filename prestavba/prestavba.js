const gameTitle = "P.R.E.S.T.A.V.B.A.";
const slogans = ["Sláva K.S.Č.!",
    "Se SSSR na věčné časy!",
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

let sideOpen = false;
let beepOn = true;
const beep = new Audio("snd/beep.wav");

const items = [{
    name: "bednu",
    aliases: ["bedna"],
    desc: "Je ze dřeva.",
    readInit: function(obj) {
        obj.onExamine = function(game) {
            if (!obj.examined) {
                game.print("Něco jsi našel!");
                game.location.items.push("košík");
                game.printLocationInfo();
            }

        }
    }
}, {
    name: "košík",
    aliases: ["kosik"],
    desc: "Je to hezký proutěný košík, i když poněkud špinavý.",
    readInit: function(obj) {
        obj.onExamine = function(game) {
            if (!this.examined) {
                this.examined = true;
                game.print("Něco jsi našel!");
                game.location.items.push("krabici");
                game.printLocationInfo();
            }

        }
    }
}, {
    name: "krabici",
    aliases: ["krabice"],
    desc: "Je z papíru.",
    readInit: function(obj) {
        obj.onExamine = function(game) {
            if (!this.examined) {
                this.examined = true;
                game.print("Něco jsi našel!");
                game.location.items.push("klíč");
                game.printLocationInfo();
            }
        }
    }
}, {
    name: "klíč",
    aliases: ["klic"],
    desc: "Je to čtverhranný klíč k poklopu."
}, {
    name: "úvodník",
    aliases: ["uvodnik", "noviny"],
    desc: "Je to úvodník Rudého práva.",
    read: false,
    readInit: function(obj) {
        obj.actions = [{
            name: "přečti",
            aliases: ["čti", "cti", "precti", "cist", "číst"],
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
        }];
    }
}, {
    name: "zapalovač",
    aliases: ["zapalovac"],
    desc: "Jistě by s ním šlo leccos zapálit. Je to totiž kvalitní zapalovač \"Made in USSR\".",
    readInit: function(obj) {
        obj.actions = [{
            name: "zapal",
            aliases: ["zapalit", "zapálit"],
            perform: function(game, params) {
                game.clearOutput();
                if (getRandomInt(3) === 0) {
                    const book = game.getInventoryItem(bookItemName);
                    const dynamite = game.getItem(game.getItems(), dynamiteItemName);
                    if (book && game.aliasObjectMatchesName(book, params[0])) {
                        game.print("Zapálil jsi Kapitál. Kéž osvítí tvoji cestu!");
                        book.burning = game.time;
                        // Show info in a dark location
                        game.printLocationInfo();
                    } else if (dynamite && game.aliasObjectMatchesName(dynamite, params[0])) {
                        game.print("Zapálil jsi doutnák...");
                        dynamite.ignited = game.time;
                    } else {
                        game.print(game.messages.unknownCommand);
                    }
                } else {
                    game.print("Zapalovač vynechal...");
                }
            },
            autocomplete: function(game, str) {
                return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => item.name.startsWith(str));
            }
        }]
    }
}, {
    name: "dveře",
    aliases: ["dvere"],
    takeable: false,
    open: false,
    locked: true,
    readInit: function(obj) {
        obj.desc = function() {
            return "Jsou " + (this.open ? "otevřené" : "zavřené") + " a " + (this.locked ? "zamčené" : "odemčené") + ". Je na nich zámek na číselný čtyřmístný kód.";
        }
    }
}, {
    name: "poklop",
    desc: "Je to těžký ocelový poklop se zámkem na čtverhranný klíč.",
    takeable: false,
    closed: true
}, {
    name: "mísu",
    aliases: ["misu"],
    desc: "Je úplně zaschlá.",
    takeable: false,
    readInit: function(obj) {
        obj.onExamine = function(game) {
            if (!this.examined) {
                this.examined = true;
                game.print("Něco jsi našel!");
                game.location.items.push("knihu");
                game.printLocationInfo();
            }
        }
    }
}, {
    name: bookItemName,
    aliases: ["kapital", "kapitál"],
    burning: null,
    readInit: function(obj) {
        obj.desc = function() {
            if (this.burning == null) {
                return "Je to Marxův Kapitál.";
            } else {
                return "Vydává jasné světlo pokroku!!!";
            }
        }
    }
}, {
    name: "oltář",
    aliases: ["oltar"],
    desc: "Jsou na něm obrazy Svaté trojice - Marxe, Engelse a Lenina...",
    readInit: function(obj) {
        obj.onExamine = function(game) {
            if (!this.examined) {
                this.examined = true;
                game.print("Něco jsi našel!");
                game.location.items.push(dynamiteItemName);
                game.printLocationInfo();
            }
        }
    }
}, {
    name: dynamiteItemName,
    desc: "Je to klasická koule s doutnákem."
}, {
    name: "sochu",
    desc: "Lenin...",
}, {
    name: "trosky jakési sochy",
    aliases: ["trosky jakesi sochy"],
    desc: "Vidím kus lebky, ucho a ruku ukazující cestu do šťastné komunistické budoucnosti.",
    takeable: false
}, {
    name: "cihlu",
    desc: "Je celá ze zlata.",
    readInit: function(obj) {
        obj.onTake = function(game) {
            game.end(true);
        }
    }
}, {
    name: "krumpáč",
    aliases: ["krumpac"],
    desc: "Je velice zrezivělý, ale jinak použitelný."
}]

const locations = [{
    id: "m1",
    desc: "Jsi na konci dlouhé podzemní chodby. Je tu žebřík vedoucí kamsi nahoru.",
    exits: [{
        name: "Z",
        location: "m2"
    }, {
        name: "N",
        location: "m20"
    }],
    hint: "Bude třeba něco zapálit něco, co bude dlouho hořet. Pokud se to nepovede napoprvé, tak to nevzdávej!"
}, {
    id: "m2",
    desc: "Jsi v dlouhé podzemní chodbě vedoucí na východ.",
    exits: [{
        name: "V",
        location: "m1"
    }, {
        name: "N",
        location: "m4"
    }],
    hint: "Bude třeba něco zapálit něco, co bude dlouho hořet. Pokud se to nepovede napoprvé, tak to nevzdávej!"
}, {
    id: "m3",
    desc: "Jsi v malém jižním výklenku jeskyňky. Je tu spousta papíru.",
    items: ["úvodník"],
    exits: [{
        name: "S",
        location: "m4"
    }],
    hint: "Najdeš tu něco, co ti dodá sílu."
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
    hint: "Zamysli se, proč tvé kroky duní.",
    readInit: function(obj) {
        obj.actions = [{
            name: "kopej",
            aliases: ["kopat"],
            perform: function(game, params) {
                const pickaxe = game.getInventoryItem("krumpáč");
                const newspaper = game.findItem("úvodník").item;
                if (pickaxe) {
                    if (newspaper && newspaper.read) {
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
                    game.print(game.messages.unknownCommand);
                }
            }
        }]
    }
}, {
    id: "m5",
    desc: "Jsi v úzké podzemní chodbě vedoucí na východ. Je tu vlhko.",
    items: ["krumpáč"],
    exits: [{
        name: "V",
        location: "m4"
    }, {
        name: "N",
        location: "m9"
    }],
    hint: "Seber, co vidíš, a neotálej!"
}, {
    id: "m6",
    desc: "Jsi v bývalém skladišti. Je tu neskutečný nepořádek.",
    items: ["bednu"],
    exits: [{
        name: "J",
        location: "m9"
    }],
    hint: "Zkus to tu pořádně prozkoumat."
}, {
    id: "m7",
    desc: "Stojíš ve tmavém výklenku.",
    items: ["zapalovač"],
    exits: [{
        name: "V",
        location: "m9"
    }],
    hint: "Seber, co tu vidíš!"
}, {
    id: "m8",
    desc: "Stojíš před ošklivým smrdutým záchodem. Táhne od něj nepříjemný zápach.",
    items: ["dveře"],
    exits: [{
        name: "S",
        location: "m9"
    }],
    hint: "Do dveří bude třeba zadat čtyřmístný kód. Zkus si vzpomenout na důležité roky v dějinách Československa.",
    readInit: function(obj) {
        obj.actions = [{
            name: "zadej",
            aliases: ["kod", "kód", "zadat"],
            perform: function(game, params) {
                const door = game.getLocationItem("dveře");
                game.clearOutput();

                if (params[0] === "1948" && door.locked) {
                    door.locked = false;
                    game.print("Zámek klapnul!");
                } else {
                    game.print(game.messages.unknownCommand);
                }
            }
        }, {
            name: "otevři",
            aliases: ["otevri", "otevrit", "otevřít"],
            perform: function(game, params) {
                const door = game.getLocationItem("dveře");
                game.clearOutput();
                if (game.aliasObjectMatchesName(door, params.join(" "))) {
                    if (door.locked) {
                        game.print("Dveře jsou zamčené.");
                    } else {
                        door.open = true;
                        game.print("Cesta na záchod je volná!");
                        game.location.exits.push({
                            name: "V",
                            location: "m10"
                        });
                        game.printLocationInfo();
                    }
                } else {
                    game.print(game.messages.unknownCommand);
                }
            },
            autocomplete: function(game, str) {
                return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => game.aliasObjectNameStartsWith(item, str));
            }
        }]
    }
}, {
    id: "m9",
    desc: "Stojíš v malé zaprášené místnosti.",
    items: ["poklop"],
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
    hint: "Poklop bude třeba odemknout klíčem, který někdo někde pohodil.",
    readInit: function(obj) {
        obj.actions = [{
            name: "použij",
            aliases: ["pouzij"],
            perform: function(game, params) {
                const openAction = obj.actions.find(action => action.name === "otevři");
                if (openAction) {
                    openAction.perform(game, ["poklop"]);
                }
            },
            autocomplete: function(game, str) {
                return (!str || str.length === 0) ? game.getUsableItems() : game.getUsableItems().filter(item => game.aliasObjectNameStartsWith(item, str));
            }
        }, {
            name: "otevři",
            aliases: ["otevri", "otevrit", "otevřít", "odemkni", "odemknout"],
            perform: function(game, params) {
                game.clearOutput();
                const trapdoor = game.getLocationItem("poklop");
                if (trapdoor && trapdoor.closed && game.matchName(params[0], "poklop")) {
                    if (game.getInventoryItem("klíč")) {
                        trapdoor.closed = false;
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
                    game.print(game.messages.unknownCommand);
                }
            },
            autocomplete: function(game, str) {
                return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => game.aliasObjectNameStartsWith(item, str));
            }
        }]
    }
}, {
    id: "m10",
    desc: "Jsi na špinavém záchodě. Radši to nebudu příliš popisovat, mohlo by se ti udělat nevolno.",
    items: ["mísu"],
    exits: [{
        name: "Z",
        location: "m8"
    }],
    hint: "V míse není voda, takže to, co v ní najdeš, bude suché."
}, {
    id: "m11",
    desc: "Stojíš před krásně vyzdobeným oltářem.",
    items: ["oltář"],
    exits: [{
        name: "Z",
        location: "m20"
    }],
    hint: "Prohledej to tu."
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
    }],
    hint: "V tomhle městě ti mapa nepomůže. Zkus postupovat až tam, odkud už cesta nevede."
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
    }],
    hint: "V tomhle městě ti mapa nepomůže. Zkus postupovat až tam, odkud už cesta nevede."
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
    }],
    hint: "V tomhle městě ti mapa nepomůže. Zkus postupovat až tam, odkud už cesta nevede."
}, {
    id: "m15",
    desc: "Jsi ve městě. Asi jsi zabloudil...",
    exits: [{
        name: "V",
        location: "m12"
    }, {
        name: "Z",
        location: "m13"
    }],
    hint: "V tomhle městě ti mapa nepomůže. Zkus postupovat až tam, odkud už cesta nevede."
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
    }],
    hint: "V tomhle městě ti mapa nepomůže. Zkus postupovat až tam, odkud už cesta nevede."
}, {
    id: "m17",
    desc: "Bloudíš městem. Tudy cesta nevede...",
    exits: [{
        name: "V",
        location: "m18"
    }, {
        name: "Z",
        location: "m16"
    }],
    hint: "Přihořívá!"
}, {
    id: "m18",
    desc: "Jsi v malém parčíku. Je tu plno zeleně.",
    items: ["sochu"],
    exits: [{
        name: "Z",
        location: "m17"
    }],
    hint: "Nedoporučuje se být přímým účastníkem výbuchu!"
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
    }],
    hint: "Tady nic zajímavého nenajdeš."
}];

function initState() {

    function titleToHtml(title, container) {
        for (let value of title) {
            if (value === ".") {
                container.appendChild(document.createTextNode("."));
            } else {
                const letter = document.createElement("span");
                letter.textContent = value;
                container.appendChild(letter);
            }
        }
    }

    const game = {
        title: gameTitle,
        savedPositionPrefix: "prestavba",
        messages: {
            locationItems: "Vidíš",
            noLocationItems: "Nevidíš nic",
            locationExits: "Východy",
            unknownCommand: "Bohužel... ale nezoufej, to je dialektika dějin!",
            multipleActionsMatch: "Vstupu odpovídá více příkazů: ",
            inputHelpTip: "\xa0",
            inputHelpPrefix: "Pokračuj: ",
            gameSaved: "Hra uložena.",
            gameLoaded: "Uložená pozice nahrána.",
        },
        intro: [function(gameContainer) {
                const title = document.createElement("div");
                gameContainer.appendChild(title);
                title.className = "intro-title";

                const img = document.createElement("img");
                img.src = "img/title.png";
                img.className = "intro-img";
                title.appendChild(img);

                const text5 = document.createElement("div");
                title.appendChild(text5);
                text5.className = "intro-text4";
                typewriter(text5, "Stiskni klávesu ENTER...");
            },
            function(gameContainer) {

                while (gameContainer.firstChild) {
                    gameContainer.removeChild(gameContainer.firstChild);
                }
                const funcs = [];
                const text1 = document.createElement("div");
                text1.className = "intro-text1";
                gameContainer.appendChild(text1);

                const text2 = document.createElement("div");
                text2.className = "intro-text2";
                gameContainer.appendChild(text2);

                const text3 = document.createElement("div");
                text3.className = "intro-text3";
                gameContainer.appendChild(text3);

                const text5 = document.createElement("div");
                gameContainer.appendChild(text5);

                const text4 = document.createElement("div");
                text4.className = "intro-text4";
                gameContainer.appendChild(text4);

                queueOutput(text1, "ÚV Software si u příležitosti 20. výročí osvobození Československa spojeneckými armádami dovoluje nabídnout vám logickou konverzační hru:");
                titleToHtml(gameTitle, text2);
                queueOutput(text3, "Program Revoluční Experimentální Socialisticky Tvořivé Avantgardní Voloviny Básníků a Analfabetů");
                queueOutput(text5, '<span class="enter-cmd">&#9166;</span> Stiskni klávesu ENTER...', undefined, function() {
                    text5.className = "intro-text5";
                }, true);
                queueOutput(text4, "&copy; 1988 ÚV Software<br>Námět &copy; 1968 Život", undefined, undefined, true);
            }
        ],
        outro: [function(gameContainer) {
            const text1 = document.createElement("div");
            text1.className = "outro-text1";
            text1.textContent = "Gratuluji vítězi!";
            gameContainer.appendChild(text1);

            const text2 = document.createElement("div");
            text2.className = "outro-text2";
            text1.textContent = "Je vidět, že socialistický člověk si poradí v každé situaci...";
            gameContainer.appendChild(text2);

            const text3 = document.createElement("div");
            text3.className = "outro-text3";
            text3.textContent = "Ještě jednou gratuluji. Sejdeme se všichni 21. srpna na Staroměstkém náměstí... (nebo jinde)";
            gameContainer.appendChild(text3);
        }],
        onInitControls: function(gameContainer) {
            // Custom title
            const titleH1 = document.querySelector("#game-title");
            while (titleH1.firstChild) {
                titleH1.removeChild(titleH1.firstChild);
            }
            titleToHtml(gameTitle, titleH1);

            // Input tips
            const inputTips = document.querySelector("#game-input-tip");
            const tip1 = document.createElement("span");
            tip1.title = "Speciální klávesa - doplň příkaz";
            tip1.innerHTML = "&nbsp;&#8633; TAB&nbsp;";
            inputTips.appendChild(tip1);
            const tip2 = document.createElement("span");
            tip2.title = "Speciální klávesa - starší příkazy z historie";
            tip2.innerHTML = "&nbsp;&uparrow;&nbsp;";
            inputTips.appendChild(tip2);
            const tip3 = document.createElement("span");
            tip3.title = "Speciální klávesa - novější příkazy z historie";
            tip3.innerHTML = "&nbsp;&downarrow;&nbsp;";
            inputTips.appendChild(tip3);
            const tip4 = document.createElement("span");
            tip4.title = "Příkaz - ulož hru";
            tip4.innerHTML = "&nbsp;SAVE&nbsp;";
            inputTips.appendChild(tip4);
            const tip5 = document.createElement("span");
            tip5.title = "Příkaz - nahraj hru";
            tip5.innerHTML = "&nbsp;LOAD&nbsp;";
            inputTips.appendChild(tip5);

            // Slogan
            const slogan = document.createElement("div");
            slogan.id = "slogan";
            gameContainer.appendChild(slogan);

            document.addEventListener("keydown", function(event) {
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
                }
                // Play beep sound
                if (beepOn) {
                    beep.play();
                }
            });
        },
        onStart: function() {
            printRandomSlogan();
            const sidebarOpen = document.querySelector("#game-sidebar-open");
            if (sidebarOpen) {
                sidebarOpen.style.display = "block";
            }
            this.printInputHelp('Zadej příkaz. Například "prozkoumej poklop". Pro automatické doplnění příkazu zkus klávesu TAB.');
        },
        onEnd: function(endState) {
            if (endState) {
                this.runOutro();
            } else {
                this.removeInputContainer();
            }
        },
        onLocationInfo: function(game) {
            if (darkLocations.find(id => id === game.location.id)) {
                const book = game.getInventoryItem(bookItemName);
                if (!book || !book.burning) {
                    game.clearLocation();
                    game.printLocation("Je tu tma.");
                    return false;
                }
            }
            return true;
        },
        onShiftTime: function(game) {
            // The book should disappear after 12 time units
            const bookRet = game.findItem(bookItemName);
            const book = bookRet.item;
            if (book && book.burning) {
                const burningTime = game.time - book.burning;
                if (burningTime === (bookBurningTime - 1)) {
                    game.print("Marxova kniha dohořívá!!!");
                } else if (burningTime >= bookBurningTime) {
                    // TODO hint: "Bohužel už ti shořela kniha, a proto budeš muset začít znovu od začátku pomocí hesla RESTART."
                    game.removeItem(book.name);
                }
            }

            // Dynamite should explode after 2 time units
            const dynamiteRet = game.findItem(dynamiteItemName);
            const dynamite = dynamiteRet.item;
            const dynamiteLocation = dynamiteRet.location;
            if (dynamite && dynamite.ignited) {
                if ((game.time - dynamite.ignited) > dynamiteExplosionTime) {
                    // Exploded!
                    if ((dynamiteLocation && dynamiteLocation.id === game.location.id) || dynamiteLocation == null) {
                        // GAME OVER
                        game.print("Obrovská exploze otřásla městem, což jsi však jako její přímý účastník neslyšel.", "end");
                        game.end(false);
                        return;
                    }
                    game.print("Země se otřásla výbuchem.");
                    if (dynamiteLocation) {
                        if (dynamiteLocation.id === "m18") {
                            game.removeLocationItem("sochu", dynamiteLocation);
                            dynamiteLocation.items.push("trosky jakési sochy");
                            dynamiteLocation.items.push("cihlu");
                        }
                    }
                    game.removeItem(dynamiteItemName);
                }
            }
        },
        onUknownCommand: function(game, name) {
            game.clearOutput();
            if (!game.examineItem(name)) {
                // No action found and no item matches the name
                game.print(game.messages.unknownCommand);
            }
            game.shiftTime(1);
            printRandomSlogan();
        },
        onActionPerformed: function(game, action) {
            if (!action.builtin) {
                game.shiftTime(1);
                printRandomSlogan();
            }
        },
        isInputCaseSensitive: false,
        partialMatchLimit: 2,
        startLocation: "m9",
        // ITEMS
        items: items,
        // GAME LOCATIONS
        locations: locations,
        // GLOBAL ACTIONS
        actions: [{
            name: "prozkoumej",
            aliases: ["prozkoumat"],
            perform: function(game, params) {
                game.clearOutput();
                if (!game.examineItem(params.join(" "))) {
                    game.print(game.messages.unknownCommand);
                }
            },
            autocomplete: function(game, str) {
                return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => game.aliasObjectNameStartsWith(item, str));
            }
        }, {
            name: "S",
            aliases: ["sever"],
            perform: function(game, params) {
                game.goToLocation("S");
            }
        }, {
            name: "V",
            aliases: ["vychod", "východ"],
            perform: function(game, params) {
                game.goToLocation("V");
            }
        }, {
            name: "J",
            aliases: ["jih"],
            perform: function(game, params) {
                game.goToLocation("J");
            }
        }, {
            name: "Z",
            aliases: ["zapad", "západ"],
            perform: function(game, params) {
                game.goToLocation("Z");
            }
        }, {
            name: "N",
            aliases: ["nahoru"],
            perform: function(game, params) {
                game.goToLocation("N");
            }
        }, {
            name: "D",
            aliases: ["dolu"],
            perform: function(game, params) {
                game.goToLocation("D");
            }
        }, {
            name: "polož",
            aliases: ["poloz", "polozit", "položit"],
            perform: function(game, params) {
                const item = game.dropItem(params[0]);
                game.clearOutput();
                if (item) {
                    game.print("Položil jsi " + item.name + ".");
                } else {
                    game.print("Tohle nejde položit.");
                }
            },
            autocomplete: function(game, str) {
                const items = game.inventory.map(item => game.mapItem(item));
                return (!str || str.length === 0) ? items : items.filter(item => game.aliasObjectNameStartsWith(item, str));
            }
        }, {
            name: "vezmi",
            aliases: ["seber", "vzít", "vzit"],
            perform: function(game, params) {
                game.clearOutput();
                const ret = game.takeItem(params.join(" "), false);
                if (ret.item) {
                    game.print("Vzal jsi " + ret.item.name + ".");
                } else if (!ret.full) {
                    game.print("Tohle nejde vzít.");
                }
            },
            autocomplete: function(game, str) {
                return (!str || str.length === 0) ? game.getTakeableItems() : game.getTakeableItems().filter(item => game.aliasObjectNameStartsWith(item, str));
            }
        }, {
            name: "inventář",
            aliases: ["věci", "veci", "i"],
            perform: function(game) {
                game.clearOutput();
                if (game.inventory && game.inventory.length > 0) {
                    game.print("Máš u sebe: " + game.inventory.join(", "));
                } else {
                    game.print("Nemáš u sebe nic.");
                }
            }
        }, {
            name: "slovník",
            aliases: ["slovnik", "akce"],
            perform: function(game) {
                game.clearOutput();
                game.print("Můžeš zadat příkazy: " + game.getActions().map(action => action.name).join(", "));
            }
        }, {
            name: "pomoc",
            aliases: ["help"],
            perform: function(game) {
                game.clearOutput();
                if (game.location && game.location.hint) {
                    game.print(game.location.hint);
                }
            }
        }]
    }

    return game;
}

function printRandomSlogan() {
    const sloganNode = document.querySelector("#slogan");
    if (sloganNode) {
        sloganNode.textContent = slogans[getRandomInt(slogans.length)];
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function openSide() {
    sideOpen = true;
    const sidebar = document.querySelector("#game-sidebar");
    const sidebarClose = document.querySelector("#game-sidebar-close");
    const container = document.querySelector("#game-container");
    sidebar.style.width = "50%";
    container.style.marginRight = "50%";
    sidebarClose.style.display = "block";
}

function closeSide() {
    sideOpen = false;
    const sidebar = document.querySelector("#game-sidebar");
    const sidebarClose = document.querySelector("#game-sidebar-close");
    const container = document.querySelector("#game-container");
    const inputBox = document.querySelector("#game-input");
    sidebar.style.width = "0";
    container.style.marginRight = "0";
    inputBox.focus();
    sidebarClose.style.display = "none";
}