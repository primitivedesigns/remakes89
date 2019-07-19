const darkLocations = ["m20"];

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

const bookItemName = "knihu";
const dynamiteItemName = "dynamit";

const dynamiteExplosionTime = 2;
const bookBurningTime = 12;

const prestavba = {
    title: "P.R.E.S.T.A.V.B.A.",
    messages: {
        // Na začátku všech popisů místností je "O.K." Také to je před hláškami o úspěšném použití předmětů. Asi by se to mohlo dát rovnou do enginu.
        // Výpis místnosti je v původní hře v dost náhodném pořadí.Někdy se píšou věci před východy, jindy jinak, protože to je natvrdo. Navrhuju udělat výpis v pořadí: DESC + VÝCHODY + Věci. Ale na rozdíl od Prestavby to je v souvislém textu.
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
        desc: "O.K. Jsi pod sochou svatého Václava. Vidíš zatarasený vchod do metra. Nahoře je muzeum, ale přístup k němu je zatarasený. Můžeš jít doleva,doprava a dolů.",
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
        desc: "O.K. Stojíš před prodejnou knihy. Není nic slyšet, protože veliký dav tu skanduje heslo 'AŤ ŽIJE KAREL!' Vidíš nápis na zdi. Vlevo je zatarasený vchod do Opletalky.",
        items: [{
            name: "nápis_na_zdi",
            desc: "Bez slovníku jej nerozluštíš.",
            takeable: false
            // POUŽIJ SLOVNÍK: "O.K. Přeložil sis nápis na zdi. Cituji: Jakeš je vůl, KAREL."
            }, {
            name: "pistoli",
            desc: "Bohužel v ní nejsou náboje.",
            }
            ],
        exits: [{
            name: "V",
            location: "m9"
        }]
    }, {
        id: "m8",
        //chybí
        desc: "O.K. Stojíš mezi patníky u kanálu. Není tu nic zvláštního. Dole jsou zátarasy.",
        items: [{
            name: "poldu",
            desc: "Chystá se zmlátit tě.",
            //fízla lze zabít použitím tyče. Pokud okamžitě nepoužiješ sekeru, pak message: "Jakmile tě polda zmerčil, vrhnul se na tebe. Nevzmohl jsi se ani na obranu. Chudáku." a GAMEOVER
            // použít tyč - hláška "O.K. Vypáčil jsi poklop kanálu. Poklop spadnul do šachty. Polda se na tebe z řevem vrhnul,ale v okamžiku, kdy tě chtěl udeřit, zahučel přímo před tebou do kanálu."
            takeable: false
        },
            ],
        exits: [{
            name: "doleva",
            location: "m7"
        }, {
            name: "doprava",
            location: "m9"
        }, {
            name: "nahoru",
            location: "m5"
        }],
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
        desc: "O.K. Nacházíš se před LUXOL CLUBEM. Vedle je kino Jalta. Najednou se na tebe vrhnul chlupatej,a když u tebe nic nenašel, zklamaně odešel. Dole vidíš zátarasy.",
        // Pokud máš pistoli, tak: "O.K. Nacházíš se před LUXOL CLUBEM. Vedle je kino Jalta. Dole vidíš zátarasy. Najednou se na tebe vrhnul chlupatej. Prošacoval tě, a když u tebe našel pistolí,odprásknul tě." GAME OVER
        // První akce musí být použít tyč, pak: "O.K. Praštil jsi chlupatýho tyčí přes hlavu." objeví se item mrtvola chlupatýho, zmizí item chlupatýho
        // Pokud uděláš cokoli jiného, pak: "Policajta naštvalo, že u tebe nenašel co hledal a vrhnul se na tebe." GAME OVER
        items: [{
            name: "chlupatýho",
            desc: "Chystá se zmlátit tě.",
            takeable: false,
        }, {
            name: "mrtvolu_chlupatýho",
            desc: "Někdo mu rozrazil tyči lebku (kdo asi?). Má na sobě uniformu.",
            onExamine: function(game) {
                game.location.items.push({
                    name: "uniformu",
                    desc: "Je to uniforma člena Veřejné bezpečnosti."
                    // V původní hře nejde uniformu prozkoumat, což podle mě zjevně chyba, tak jsem text dofabuloval
                    // Pokud použiješ uniformu, tak si ji oblékneš: "O.K. Oblékl sis uniformu člena Veřejné bezpečnosti." Mohl by být i synonymum Obleč uniformu
                    // V původní hře ji svlékneš tím, že ji položíš. "Svlékl sis uniformu." To je podle mě matoucí a můžeme to udělat jinak.
                    // Pokud máš uniformu, mění se události v některých místnostech

                });
                game.printLocationInfo();
            }
            takeable: false,
        }],
        exits: [{
            name: "nahoru",
            location: "m7"
        }, {
            name: "doprava",
            location: "m11"
        }]
    }, {
        id: "m11",
        desc: "O.K. Jsi v křoví.",
        // Pokud na sobě nemáš uniformu: "O.K. Jsi v křoví. Vrhnul se na tebe člen VB a odtáhnul tě do antona. Sedí tu pár milých tváří s železnými tyčemi v rukách. Začali sis tebou hrát." GAMEOVER
        items: [{
            name: "člena_VB",
            desc: "Kontroluje kolemjdoucí.",
            // opět to nebylo v původní hře, deskripci jsem dopsal
            takeable: false
        }],
        exits: [{
            name: "doleva",
            location: "m10"
        }, {
            name: "doprava",
            location: "m12"
        }]
    }, {
        id: "m12",
        desc: "O.K. Stojíš před bankou. Nahoře jsou zátarasy.",
        items: [{
            name: "oltář",
            desc: "Jako by ti něco říkalo: Polož sem diamanty.",
            // pokud položíš diamanty: "Jakmile jsi je položil, někdo je z oltáře ukradl." - item zmizí. Neděje se to jinde, pouze v této místnosti. 
            takeable: false
        }, {
            name: "cedulku",
            desc: "Je na ní napsáno: 'A ven se dostane jen ten, kdo má čtyři magické diamanty.'",
            takeable: false
        }],
        exits: [{
            name: "doleva",
            location: "m11"
        }, {
            name: "dolů",
            location: "m15"
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
        name: "dolů",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("dolů");
        }
    }, {
        name: "nahoru",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("nahoru");
        }
    }, {
        name: "doleva",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("doleva");
        }
    }, {
        name: "doprava",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("doprava");
        }
    }, {
        name: "dovnitř",
        perform: function(game, params) {
            printRandomSlogan();
            game.goToLocation("dovnitř");
        }
    },  {
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