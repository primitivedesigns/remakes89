const darkLocations = ["m1", "m2", "m3", "m4", "m5"];

const bookItemName = "knihu";
const dynamiteItemName = "dynamit";

const dynamiteExplosionTime = 2;
const bookBurningTime = 12;

const prestavba = {
    title: "P.R.E.S.T.A.V.B.A.",
    messages: {
        // Na začátku všech popisů místností je "O.K." Také to je před hláškami o úspěšném použití předmětů. Asi by se to mohlo dát rovnou do enginu.
        locationItems: "Vidíš",
        // pokud nejsou predmety, nic se nepise
        noLocationItems: "",
        locationExits: "Můžeš jít",
        unknownAction: "To bohužel nejde!!!"
    },
    onStart: function() {
        printRandomSlogan();
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
        // GAME OVER
        if (dynamite && dynamite.ignited) {
            if ((dynamiteLocation && dynamiteLocation.id === game.location.id) || dynamiteLocation == null) {
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
    isInputCaseSensitive: false,
    startLocation: "m2",
    inventory: [],
    // na začátku máš diamanty, popis: "Jsou to čtyři nádherné drahokamy."
    locations: [{
        id: "m1",
        desc: "O.K. Stojíš před domem potravin. Vchod do metra je naštěstí volný. Z balkónu v domě se pobaveně dívá nepříjemný člověk (zřejmě komunista) na poctivě odváděnou práci členů VB. Můžeš jít dolů, doprava a dovnitř.",
        items: [{
            name: "fízla",
            desc: "Chystá se zmlátit tě.",
            //fízla lze zabít použitím sekery. Pokud okamžitě nepoužiješ sekeru, pak message: "Fizl se na tebe krvežíznivě vrhnul a začal tě mlátit. A mlátil a mlátil..." a GAMEOVER / použití sekery vytvoří item mrtvolu fízla
            takeable: false
        },{
            name: "mrtvolu_fízla",
            // víceslovné předměty dávám s podtržítkem
            desc: "Má hluboko v hlavě zaseklou sekeru (dobrá práce)! Našels' u něj štít.",
            onExamine: function(game) {
                game.print("");
                game.location.items.push({
                    name: "štít",
                    desc: "Je vhodně upraven proti padajícímu kamení."
                })
             },
            
            takeable: false
        }],
        exits: [{
            name: "dolů",
            location: "m4"
        }, {
            name: "doprava",
            location: "m2"
        }, {
            name: "dovnitř",
            location: "m19"
        }]
    }, {
        id: "m2",
        desc: "O.K. Jsi pod sochou svatého Václava. Vidíš zatarasený vchod do metra. Nahoře je muzeum, ale přístup k němu je zatarasený. Můžeš jít doleva,doprava a dolů. Vidíš ocas.",
        items: [{
            name: "ocas",
            desc: "Je to ocas koně,na kterém sedí svatý Václav. Ve skulince pod ocasem jsi našel sekeru.",
                onExamine: function(game) {
                game.print("");
                game.location.items.push({
                    name: "sekeru",
                    desc: "Do tupé policajtské hlavy by zajela jako po másle."
                })
            },
            takeable: false
        }],
        exits: [{
            name: "doleva",
            location: "m1"
        }, {
            name: "doprava",
            location: "m3"
        }, {
            name: "dolů",
            location: "m5"
        }]
    }, {
        id: "m3",
        desc: "O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe našel legitimaci člena tajné policie, popřál mnoho štěstí v další práci, lehce se uklonil a odešel (hlupák). Můžeš jít doleva, dovnitř a dolů.",
        //verze, pokud nemáš legitimaci: O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe nic nenašel, zavolal si na pomoc 'kamarády' a zmlátili tě do němoty. Když od tebe odbíhali na nějakou ženu s kočárkem, jednomu z nich vypadla z pouzdra mačeta. Doplazil ses pro ni a spáchals' HARAKIRI.
        exits: [{
            name: "doleva",
            location: "m2"
        }, {
            name: "dovnitř",
            location: "m20"
        }, {
            name: "dolů",
            location: "m6"
        }]
    }, {
        id: "m4",
        desc: "O.K. Stojíš u prodejny Supraphon. Než ses však stačil rozhlédnout, pokropila tě sprška vodního děla. Spadl jsi na zem a rozbil sis hlavu."
        // automatický GAME OVER
    }, {
        id: "m5",
        desc: "O.K. Ulevuješ si mezi kytičky ve velkém květináči.",
        // Když poprvé přijdeš, kámen se jmenuje "kámen, který padá na tebe" a pokud okamžitě nepoužiješ štít, tak je GAME OVER s hláškou: "Kámen se přibližuje víc a víc. Pořád se zvětšuje a zvětšuje a zvětšuje a zvětšu-"
        items: [{
            name: "kámen",
            desc: "Není to obyčejný kámen, je to dlažební kostka."
            // pokud v této místnosti použiješ kámen, tak "O.K. Vrhnul jsi kámen napravo. Zprava (a to je pozoruhodné) jsi zaslechl výkřik." Tím se zpřístupní M6
        },{
            name: "slovník",
            desc: "Podrobný česko-anglicky slovník."
        }
    ],
        exits: [{
            name: "doleva",
            location: "m4"
        }, {
            name: "doprava",
            location: "m6"
        }, {
            name: "nahoru",
            location: "m2"
        }, {
            name: "dolů",
            location: "m8"
            // pokud jsou možné 4 směry z 5, hra vypíše: "Můžeš kamkoli kromě Y." Nevím, jestli je nutné to dodržovat
        }]
    }, {
        id: "m6",
        desc: "O.K. Nacházíš se u domu módy v ústí do zatarasené Krakovské ulice.",
        // Pokud jsi v M5 nepoužil kámen, tak text pokračuje: "Vidíš policajta. Na tváři, která se k tobě víc a více přibližuje, je vidět, že je to maniak. Už mu neunikneš." GAMEOVER

        items: [{
            name: "mrtvolu_policajta",
            desc: "Byl nepochybně zasažen dlažební kostkou.",
            takeable: false
        }],
        exits: [{
            name: "nahoru",
            location: "m3"
        }, {
            name: "dolů",
            location: "m9"
        }, {
            name: "doleva",
            location: "m5"
        }]
    }, {
        id: "m7",
        // chybí
        desc: "Stojíš v tmavém výklenku.",
        items: [{
            name: "zapalovač",
            desc: "Jistě by s ním šlo leccos zapálit. Je to totiž kvalitní zapalovač \"Made in USSR\".",
            actions: [{
                name: "zapal",
                perform: function(game, params) {
                    game.clearOutput();
                    game.print("-----------------");
                    if (getRandomInt(3) === 0) {
                        if (params[0] === bookItemName.toUpperCase()) {
                            const book = game.getInventoryItem(bookItemName);
                            if (book) {
                                game.print("Zapálil jsi Kapitál. Kéž osvítí tvoji cestu!");
                                book.burning = game.time;
                                // Show info in a dark location
                                game.printLocationInfo();
                                return;
                            }
                        } else if (params[0] === dynamiteItemName.toUpperCase()) {
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
        //chybí
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
        desc: "O.K. Stojíš pod lešením. Dole jsou zátarasy. Slyšíš tichý, leč podezřelý tikot. Vidíš do ústí zatarasené ulice Ve Smečkách.",
        // pokud došlo k výbuchu: "O.K. Balancuješ na kraji obrovského kráteru. Na dně vidíš ceduli 'Dům módy'. Neudržels' však rovnováhu a padáš dolů." a GAME OVER
        items: [{
            name: "tyč",
            desc: "Na ledacos by se hodila.",
        }],
        exits: [{
            name: "doleva",
            location: "m8"
        }, {
            name: "nahoru",
            location: "m6"
        }],
        // Pokud uděláš víc než 1 akci: "Zahlédl jsi záblesk, po kterém následuje ohromný výbuch. Než tě zasáhla střepina, došlo ti,co znamenal ten tikot." GAMEOVER
        // Pokud odejdeš po 1 akci (seber tyč): "Místo, ze kterého jsi právě vyšel, vyletělo do povětří. Tys měl ale štěstí."
    }, {
        id: "m10",
        desc: "Jsi na špinavém záchodě. Radši to nebudu příliš popisovat, mohlo by se ti udělat nevolno.",
        items: [{
            name: "mísu",
            desc: "Je úplně zaschlá.",
            takeable: false,
            onExamine: function(game) {
                game.print("Něco jsi našel.");
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
            desc: "Jsou na něm obrazy Svaté trojice - Marxe, Engelse a Lenina...",
            onExamine: function(game) {
                game.print("Něco jsi našel.");
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
    }]
}

function printRandomSlogan() {
    document.querySelector('#slogan').innerText = slogans[getRandomInt(slogans.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}