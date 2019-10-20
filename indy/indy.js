// const gameTitle = "DOBRODRUŽSTVÍ INDIANA JONESE NA VÁCLAVSKÉM NÁMĚSTÍ V PRAZE DNE 16.1.1989";

let sideOpen = false;
let beepOn = true;
const beep = new Audio("snd/beep.wav");

const items = [{
    name: "diamanty",
    desc: "Jsou to čtyři nádherné drahokamy.",
    readInit: function(obj) {
        obj.onDrop = function(game) {
            if (game.location.id === "m12") {
                game.print("Jakmile jsi je položil, někdo je z oltáře ukradl.");
                game.removeItem("diamanty");
            }
        }
    }
}, {
    name: "fízla",
    aliases: ["fizla"],
    desc: "Chystá se zmlátit tě.",
    takeable: false
}, {
    name: "mrtvolu fízla",
    aliases: ["mrtvolu fizla"],
    desc: "Má hluboko v hlavě zaseklou sekeru (dobrá práce)! Našels' u něj štít.",
    readInit: function(obj) {
        obj.onExamine = function(game) {
            game.addLocationItem("štít");
        }
    },
    takeable: false
}, {
    name: "štít",
    aliases: ["stit"],
    desc: "Je vhodně upraven proti padajícímu kamení.",
    readInit: function(obj) {
        obj.onUse = function(game) {
            if (game.location.id === "m5" && !game.location.shieldUsed) {
                game.location.shieldUsed = true;
                const boulder = game.getLocationItem("kámen");
                if (boulder) {
                    boulder.takeable = true;
                    boulder.unusable = false;
                }
                game.print("O.K. Odrazil jsi kámen štítem.");
                game.onLocationItemAdded(game, boulder.name);
            }
        }
    }
}, {
    name: "ocas",
    readInit: function(obj) {
        obj.onExamine = function(game) {
            if (!this.examined) {
                game.addLocationItem("sekeru")
            }
        };
        obj.desc = function() {
            let ret = "Je to ocas koně, na kterém sedí svatý Václav.";
            if (!this.examined) {
                ret += " Ve skulince pod ocasem jsi našel sekeru.";
            }
            return ret;
        };
    },
    takeable: false
}, {
    name: "sekeru",
    desc: "Do tupé policajtské hlavy by zajela jako po másle.",
    readInit: function(obj) {
        obj.onUse = function(game) {
            const cop = game.getLocationItem("fízla");
            if (cop) {
                game.print("O.K. Zasekl jsi mu sekeru do hlavy tak hluboko, že nejde vytáhnout.");
                game.removeItem("sekeru");
                game.removeLocationItem(cop.name);
                game.addLocationItem("mrtvolu fízla");
            } else {
                game.print(game.messages.unknownCommand);
            }
        }
    }
}, {
    name: "kámen",
    aliases: ["kamen"],
    desc: "Není to obyčejný kámen, je to dlažební kostka.",
    takeable: false,
    unusable: true,
    readInit: function(obj) {
        obj.onUse = function(game) {
            if (!this.used && game.location.id === "m5") {
                game.print("O.K. Vrhnul jsi kámen napravo. Zprava (a to je pozoruhodné) jsi zaslechl výkřik.");
                // Set m6 property
                game.getLocation("m6").shouldFail = false;
                game.removeItem(obj.name);
                game.addLocationItem("mrtvolu policajta", "m6", true);
            }
        }
    }
}, {
    name: "slovník",
    aliases: ["slovnik"],
    desc: "Podrobný česko-anglicky slovník.",
    readInit: function(obj) {
        obj.onUse = function(game) {
            if (game.location.id === "m7") {
                game.print("O.K. Přeložil sis nápis na zdi. Cituji: Jakeš je vůl, KAREL.");
            }
        }
    }
}, {
    name: "mrtvolu policajta",
    desc: "Byl nepochybně zasažen dlažební kostkou.",
    takeable: false
}, {
    name: "nápis na zdi",
    aliases: ["napis na zdi"],
    desc: "Bez slovníku jej nerozluštíš.",
    takeable: false
}, {
    name: "pistoli",
    desc: "Bohužel v ní nejsou náboje.",
}, {
    name: "poldu",
    desc: "Chystá se zmlátit tě.",
    takeable: false
}, {
    name: "tyč",
    aliases: ["tyc"],
    desc: "Na ledacos by se hodila.",
    readInit: function(obj) {
        obj.onUse = function(game) {
            if (game.location.id === "m8" && game.getLocationItem("poldu")) {
                game.print("O.K. Vypáčil jsi poklop kanálu. Poklop spadnul do šachty. Polda se na tebe s řevem vrhnul, ale v okamžiku, kdy tě chtěl udeřit, zahučel přímo před tebou do kanálu.");
                game.removeLocationItem("poldu");
            } else if (game.location.id === "m10" && game.getLocationItem("chlupatýho")) {
                game.print("O.K. Praštil jsi chlupatýho tyčí přes hlavu.");
                game.removeLocationItem("chlupatýho");
                game.addLocationItem("mrtvolu chlupatýho");
            } else if (game.location.id === "m18" && obj.throwable) {
                game.print("O.K. Mrštil jsi tyčí nalevo a uslyšel jsi zasténání. Cha, cha, cha, cha.");
                game.removeItem(obj.name);
                game.addLocationItem("mrtvolu milicionáře", "m17");
            }
        }
    }
}, {
    name: "chlupatýho",
    aliases: ["chlupatyho"],
    desc: "Chystá se zmlátit tě.",
    takeable: false,
}, {
    name: "mrtvolu chlupatýho",
    aliases: ["mrtvolu chlupatyho"],
    desc: "Někdo mu rozrazil tyči lebku (kdo asi?). Má na sobě uniformu.",
    readInit: function(obj) {
        obj.onExamine = function(game) {
            game.addLocationItem("uniformu");
        };
    },
    takeable: false,
}, {
    name: "uniformu",
    desc: "Je to uniforma člena Veřejné bezpečnosti.",
    readInit: function(obj) {
        const dressAction = {
            name: "obleč",
            aliases: ["oblec", "oblekni", "oblékni", "obleknout", "obléknout"],
            perform: function(game, params) {
                const uniform = game.findItem("uniformu").item;
                if (uniform && game.aliasObjectNameStartsWith(uniform, params.join(" "))) {
                    let uniform = game.getInventoryItem("uniformu");
                    if (!uniform) {
                        uniform = game.takeItem("uniformu", false);
                    }
                    if (uniform && !uniform.dressed) {
                        obj.dressed = true;
                        game.print("O.K. Oblékl sis uniformu člena Veřejné bezpečnosti.");
                    }
                }
            }
        };
        const undressAction = {
            name: "svleč",
            aliases: ["svlec", "svlekni", "svlékni"],
            perform: function(game, params) {
                const uniform = game.findItem("uniformu").item;
                if (obj.dressed && uniform && game.aliasObjectNameStartsWith(uniform, params.join(" "))) {
                    obj.dressed = false;
                    game.print("O.K. Svlékl sis uniformu.");
                }
            }
        };
        obj.onUse = function(game) {
            if (obj.dressed) {
                undressAction.perform(game, ["uniformu"]);
            } else {
                dressAction.perform(game, ["uniformu"]);
            }
        };
        obj.actions = [undressAction, dressAction];
        obj.onDrop = function(game) {
            obj.dressed = false;
        };
    }
}, {
    name: "člena VB",
    aliases: ["clena VB"],
    desc: "Kontroluje kolemjdoucí.",
    takeable: false
}, {
    name: "oltář",
    aliases: ["oltar"],
    desc: "Jako by ti něco říkalo: Polož sem diamanty.",
    takeable: false
}, {
    name: "cedulku",
    desc: "Je na ní napsáno: 'A ven se dostane jen ten, kdo má čtyři magické diamanty.'",
    takeable: false
}, {
    name: "civila",
    desc: "Je na něm vidět, že nemá v lásce komunisty.",
    takeable: false
}, {
    name: "příslušníka",
    aliases: ["prislusnika"],
    desc: "Chystá se zmlátit tě.",
    takeable: false
}, {
    name: "mrtvolu civila",
    desc: "Je ti velice podobný. Má u sebe legitimaci.",
    takeable: false,
    readInit: function(obj) {
        obj.onExamine = function(game) {
            game.addLocationItem("legitimaci");
        };
    }
}, {
    name: "legitimaci",
    desc: "Patří členu tajné policie, který je ti velice podobný.",
}, {
    name: "mrtvolu milicionáře",
    aliases: ["mrtvolu milicionare"],
    desc: "Někdo po něm mrštil tyči. Hádám tak dle toho, že ji má zaraženou v hlavě.",
    takeable: false,
}, {
    name: "špenát",
    aliases: ["spenat"],
    desc: "Ještě je v záruční lhůtě.",
    readInit: function(obj) {
        obj.onUse = function(game) {
            game.print("O.K. Snědl jsi špenát a hned se cítíš silnější, že bys mohl tyčí házet.");
            const rodRet = game.findItem("tyč");
            if (rodRet.item) {
                rodRet.item.throwable = true;
            }
            const location = game.removeItem(obj.name);
            if (location) {
                location.items.push("plechovku");
            } else {
                game.inventory.push("plechovku");
            }
        }
    }
}, {
    name: "plechovku",
    desc: "Je to dočista vylízaná plechovka od špenátu."
}];

const locations = [{
    id: "m1",
    desc: "O.K. Stojíš před domem potravin. Vchod do metra je naštěstí volný. Z balkónu v domě se pobaveně dívá nepříjemný člověk (zřejmě komunista) na poctivě odváděnou práci členů VB.",
    items: ["fízla"],
    readInit: function(obj) {
        obj.onAction = function(game, action, params) {
            if (!game.getLocationItem("fízla")) {
                return false;
            }
            if (action.name === "použij" && params && params.length > 0) {
                const item = game.getItem(game.getUsableItems(), params[0]);
                if (item && game.matchName(item.name, "sekeru")) {
                    return false;
                }
            }
            game.print("Fízl se na tebe krvežíznivě vrhnul a začal tě mlátit. A mlátil a mlátil...", "end");
            game.end("killed", false);
            return true;
        }
    },
    exits: [{
        name: "dolů",
        location: "m4"
    }, {
        name: "doprava",
        location: "m2"
    }, {
        name: "dovnitř",
        location: "m19"
    }],
}, {
    id: "m2",
    desc: "O.K. Jsi pod sochou svatého Václava. Vidíš zatarasený vchod do metra. Nahoře je muzeum, ale přístup k němu je zatarasený.",
    items: ["ocas"],
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
    readInit: function(obj) {
        obj.onEnter = function(game) {
            if (!game.getInventoryItem("legitimaci")) {
                game.print("Když od tebe odbíhali na nějakou ženu s kočárkem, jednomu z nich vypadla z pouzdra mačeta. Doplazil ses pro ni a spáchals' HARAKIRI.", "end");
                game.end("killed", false);
            }
        };
        obj.desc = function(game) {
            if (game.getInventoryItem("legitimaci")) {
                return "O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe našel legitimaci člena tajné policie, popřál mnoho štěstí v další práci, lehce se uklonil a odešel (hlupák).";
            } else {
                this.exits = [];
                this.items = [];
                return "O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe nic nenašel, zavolal si na pomoc 'kamarády' a zmlátili tě do němoty."
            }
        }
    },
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
    desc: "O.K. Stojíš u prodejny Supraphon. Než ses však stačil rozhlédnout, pokropila tě sprška vodního děla.",
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Spadl jsi na zem a rozbil sis hlavu.", "end");
            game.end("killed");
        }
    }
}, {
    id: "m5",
    desc: "O.K. Ulevuješ si mezi kytičky ve velkém květináči.",
    items: ["kámen", "slovník"],
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
    }],
    readInit: function(obj) {
        obj.decorateItemName = function(itemName, game) {
            if (itemName === "kámen") {
                const boulder = game.getLocationItem("kámen");
                if (boulder && boulder.unusable) {
                    return "kámen, který padá na tebe,";
                }
            }
            return itemName;
        };
        obj.onAction = function(game, action, params) {
            if (obj.shieldUsed) {
                return false;
            }
            if (action.name === "použij" && params && params.length > 0) {
                const item = game.getItem(game.getUsableItems(), params[0]);
                if (item && game.matchName(item.name, "štít")) {
                    return false;
                }
            }
            game.print("Kámen se přibližuje víc a víc. Pořád se zvětšuje a zvětšuje a zvětšuje a zvětšu-", "end");
            game.end("killed", false);
            return true;
        };
    }
}, {
    id: "m6",
    desc: "O.K. Nacházíš se u domu módy v ústí do zatarasené Krakovské ulice.",
    // see item "kámen"
    shouldFail: true,
    readInit: function(obj) {
        obj.onEnter = function(game) {
            if (this.shouldFail) {
                game.print("Vidíš policajta. Na tváři, která se k tobě víc a více přibližuje, je vidět, že je to maniak. Už mu neunikneš.", "end");
                game.end("killed", false);
            }
        }
    },
    items: [],
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
    desc: "O.K. Stojíš před prodejnou knihy. Není nic slyšet, protože veliký dav tu skanduje heslo 'AŤ ŽIJE KAREL!' Vlevo je zatarasený vchod do Opletalky.",
    items: ["nápis na zdi", "pistoli"],
    exits: [{
        name: "nahoru",
        location: "m4"
    }, {
        name: "doprava",
        location: "m8"
    }, {
        name: "dolů",
        location: "m10"
    }]
}, {
    id: "m8",
    desc: "O.K. Stojíš mezi patníky u kanálu. Není tu nic zvláštního. Dole jsou zátarasy.",
    items: ["poldu"],
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
    readInit: function(obj) {
        obj.onAction = function(game, action, params) {
            if (!game.getLocationItem("poldu")) {
                // Cop is dead...
                return false;
            }
            if (action.name === "použij" && params && params.length > 0) {
                const item = game.getItem(game.getUsableItems(), params[0]);
                if (item && game.matchName(item.name, "tyč")) {
                    return false;
                }
            }
            game.print("Jakmile tě polda zmerčil, vrhnul se na tebe. Nevzmohl jsi se ani na obranu. Chudáku.", "end");
            game.end("killed", false);
            return true;
        };
    }
}, {
    id: "m9",
    exploded: false,
    readInit: function(obj) {
        obj.desc = function() {
            if (this.exploded) {
                return "O.K. Balancuješ na kraji obrovského kráteru. Na dně vidíš ceduli 'Dům módy'.";
            } else {
                return "O.K. Stojíš pod lešením. Dole jsou zátarasy. Slyšíš tichý, leč podezřelý tikot. Vidíš do ústí zatarasené ulice Ve Smečkách.";
            }
        };
        obj.onEnter = function(game) {
            if (this.exploded) {
                game.print("Neudržels' však rovnováhu a padáš dolů.", "end");
                game.end("killed", false);
            } else {
                this.countDownTime = game.time;
            }
        }
    },
    items: ["tyč"],
    exits: [{
        name: "doleva",
        location: "m8"
    }, {
        name: "nahoru",
        location: "m6"
    }],
}, {
    id: "m10",
    desc: "O.K. Nacházíš se před LUXOL CLUBEM. Vedle je kino Jalta. Dole vidíš zátarasy.",
    items: ["chlupatýho"],
    readInit: function(obj) {
        obj.onEnter = function(game) {
            obj.actionTaken = false;
            if (!game.location.explored) {
                if (game.getInventoryItem("pistoli")) {
                    game.print("Najednou se na tebe vrhnul chlupatej. Prošacoval tě, a když u tebe našel pistoli, odprásknul tě.", "end");
                    game.end("kill", false);
                } else {
                    game.print("Najednou se na tebe vrhnul chlupatej, a když u tebe nic nenašel, zklamaně odešel.");
                }
            }
        };
        obj.onAction = function(game, action, params) {
            if (obj.actionTaken && game.getLocationItem("chlupatýho")) {
                game.print("Policajta naštvalo, že u tebe nenašel, co hledal, a vrhnul se na tebe.", "end");
                game.end("killed", false);
                return true;
            } else {
                obj.actionTaken = true;
            }
        };
    },
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
    items: ["člena VB"],
    readInit: function(obj) {
        obj.onEnter = function(game) {
            const uniform = game.getInventoryItem("uniformu");
            if (!uniform || !uniform.dressed) {
                game.print("Vrhnul se na tebe člen VB a odtáhnul tě do antona. Sedí tu pár milých tváří s železnými tyčemi v rukách. Začali si s tebou hrát.", "end");
                game.end("killed", false);
            }
        }
    },
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
    items: ["oltář", "cedulku"],
    exits: [{
        name: "doleva",
        location: "m11"
    }, {
        name: "dolů",
        location: "m15"
    }]
}, {
    id: "m13",
    desc: "O.K. Jsi před grandhotelem EVROPA. Zahlédl jsi však videokameru zamířenou přímo na tebe.",
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Uznal jsi, že veškerý odpor je marný a spáchal jsi sebevraždu.", "end");
            game.end("killed", false);
        }
    }
}, {
    id: "m14",
    cops: true,
    readInit: function(obj) {
        obj.desc = function(game) {
            let ret = "O.K. Sedíš na lavičce. (Už nemůžeš, co?) Kolem ucha ti hvízdla kulka. Nahoře jsou zátarasy.";
            if (obj.cops) {
                ret += " Blíží se k tobě řada policajtů.";
            }
            return ret;
        };
        obj.onLeave = function() {
            obj.cops = false;
        };
        obj.onAction = function(game, action, params) {
            if (action.name != "doleva" && action.name != "doprava" && action.name != "dolů") {
                game.print("Řada policajtů se přiblížila až k tobě. Než jsi stačil vstát, pustili se do tebe obušky.", "end");
                game.end("killed", false);
                return true;
            }
        };
    },
    exits: [{
        name: "doleva",
        location: "m13"
    }, {
        name: "doprava",
        location: "m15"
    }, {
        name: "dolů",
        location: "m17"
    }],
}, {
    id: "m15",
    desc: "O.K. Stojíš pod lešením. Napravo je ústí do zatarasené Štěpánské ulice. Dole jsou také zátarasy.",
    items: ["civila"],
    readInit: function(obj) {
        obj.onEnter = function(game) {
            const uniform = game.getInventoryItem("uniformu");
            if (uniform && uniform.dressed) {
                game.print("Vrhnul se na tebe civilní občan pod dojmem, že jsi člen VB. Máš totiž ještě oblečenou uniformu.", "end");
                game.end("killed", false);
            }
        };
    },
    exits: [{
        name: "doleva",
        location: "m14"
    }, {
        name: "nahoru",
        location: "m12"
    }],
}, {
    id: "m16",
    desc: "O.K. Ležíš před obchodním domem DRUŽBA. Praštil tě totiž příslušník. Vchod do metra je zatarasen. Dole za zátarasy je tramvajové koleje.",
    items: ["příslušníka", "mrtvolu civila"],
    exits: [{
        name: "doprava",
        location: "m17"
    }, {
        name: "nahoru",
        location: "m13"
    }],
    readInit: function(obj) {
        obj.onAction = function(game, action, params) {
            if (!game.getLocationItem("příslušníka")) {
                return false;
            }
            if (action.name === "polož" && params && params.length > 0) {
                const item = game.getItem(game.getInventoryItems(), params.join(" "));
                if (item && game.matchName(item.name, "diamanty")) {
                    game.print("Příslušník správně pochopil a diskrétně odešel.");
                    game.removeLocationItem("příslušníka");
                    game.removeItem("diamanty");
                    return true;
                }
            }
            game.print("Příslušník se na tebe vrhnul a zmlátil tě.", "end");
            game.end("killed", false);
            return true;
        };
    }
}, {
    id: "m17",
    readInit: function(obj) {
        obj.desc = function(game) {
            if (!obj.explored) {
                return "O.K. Sedíš v květináči mezi kytičkami a nadává ti milicionář. Cituji: 'Jestli tě tu uvidím ještě jednou, tak uvidíš.'";
            } else {
                if (game.getLocationItem("mrtvolu milicionáře")) {
                    return "O.K. Sedíš v květináči mezi kytičkami.";
                } else {
                    return "O.K. Sedíš v květináči mezi kytičkami a nadává ti milicionář. Cituji: 'Já tě upozorňoval, ty hajzle.'";
                }
            }
        };
        obj.onEnter = function(game) {
            if (obj.explored && !game.getLocationItem("mrtvolu milicionáře")) {
                game.print("Když se vypovídal, vrhnul se na tebe.", "end");
                game.end("killed", false);
            }
        }
    },
    exits: [{
        name: "doleva",
        location: "m16"
    }, {
        name: "doprava",
        location: "m18"
    }, {
        name: "nahoru",
        location: "m14"
    }],
}, {
    id: "m18",
    desc: "O.K. Stojíš u zataraseného vchodu do metra. Dole a nahoře jsou zátarasy.",
    items: ["špenát"],
    exits: [{
        name: "doleva",
        location: "m17"
    }],
}, {
    id: "m19",
    desc: "O.K. Dostal ses do metra. Všude je tu rozšířen slzný plyn.",
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Je ho tu tolik, že ses udusil.", "end");
            game.end("killed", false);
        }
    }
}, {
    id: "m20",
    desc: "O.K. OBELSTIL JSI I TU NEJVĚTŠÍ FÍZLOVSKOU SVINI. ŠTASTNĚ JSI SE DOSTAL NA LETIŠTĚ A ODLETĚL DOMŮ. GRATULUJI K VÍTĚZSTVÍ!!!!!!!!!!",
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.end("win");
        }
    }
}];

const actions = [{
    name: "prozkoumej",
    aliases: ["prozkoumat"],
    perform: function(game, params) {
        if (!game.examineItem(params.join(" "))) {
            game.print(game.messages.unknownCommand);
        }
    },
    autocomplete: function(game, str) {
        return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => game.aliasObjectNameStartsWith(item, str));
    }
}, {
    name: "použij",
    aliases: ["pouzij"],
    perform: function(game, params) {
        if (!game.useItem(params.join(" "))) {
            game.print(game.messages.unknownCommand);
        }
    },
    autocomplete: function(game, str) {
        return (!str || str.length === 0) ? game.getUsableItems() : game.getUsableItems().filter(item => game.aliasObjectNameStartsWith(item, str));
    }
}, {
    name: "dolů",
    aliases: ["dolu", "d"],
    perform: function(game, params) {
        game.goToLocation("dolů");
    }
}, {
    name: "nahoru",
    aliases: ["n"],
    perform: function(game, params) {
        game.goToLocation("nahoru");
    }
}, {
    name: "doleva",
    aliases: ["vlevo", "l"],
    perform: function(game, params) {
        game.goToLocation("doleva");
    }
}, {
    name: "doprava",
    aliases: ["vpravo", "p"],
    perform: function(game, params) {
        game.goToLocation("doprava");
    }
}, {
    name: "dovnitř",
    aliases: ["dovnitr"],
    perform: function(game, params) {
        game.goToLocation("dovnitř");
    }
}, {
    name: "polož",
    aliases: ["poloz", "polozit", "položit"],
    perform: function(game, params) {
        const item = game.dropItem(params.join(" "), false);
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
        if (game.inventory && game.inventory.length > 0) {
            game.print("Máš u sebe " + game.inventory.join(", ") + " a víc už ani >p<.");
        } else {
            game.print("Máš u sebe hovno.");
        }
    }
}, {
    name: "slovník",
    aliases: ["slovnik", "akce"],
    perform: function(game) {
        game.print("Můžeš zadat příkazy: " + game.getActions().map(action => action.name).join(", "));
    }
}, {
    name: "pomoc",
    aliases: ["help"],
    perform: function(game) {
        if (game.location && game.location.hint) {
            game.print(game.location.hint);
        }
    }
}, {
    name: "unknownCommand",
    perform: function(game) {
        game.print(game.messages.unknownCommand);
    }
}];

const initControls = function(gameContainer, game) {
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
}

function initState() {

    const game = {
        savedPositionPrefix: "indy",
        messages: {
            locationItems: "Vidíš",
            noLocationItems: "",
            locationExits: "Můžeš jít",
            unknownCommand: "To bohužel nejde!!!",
            multipleActionsMatch: "Vstupu odpovídá více příkazů: ",
            inputHelpTip: "\xa0",
            inputHelpPrefix: "Pokračuj: ",
            gameSaved: "Hra uložena.",
            gameLoaded: "Uložená pozice nahrána.",
            inventoryFull: "Víc už toho neuneseš!",
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
        }],
        onInitControls: initControls,
        onShiftTime: function(game) {
            const m9 = game.getLocation("m9");
            if (m9.countDownTime && !m9.exploded) {
                const bombTime = game.time - m9.countDownTime;
                if (bombTime > 2) {
                    if (game.location.id === "m9") {
                        game.print("Zahlédl jsi záblesk, po kterém následuje ohromný výbuch. Než tě zasáhla střepina, došlo ti,co znamenal ten tikot.", "end");
                        game.end("killed", false);
                    } else {
                        m9.exploded = true;
                        game.print("Místo, ze kterého jsi právě vyšel, vyletělo do povětří. Tys měl ale štěstí.");
                    }
                }
            }
        },
        onStart: function() {
            const gameThis = this;
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
                } else if (event.key === "r" && gameThis.endState) {
                    // Restart game
                    location.reload();
                }
                // Play beep sound
                if (beepOn) {
                    beep.play();
                }
            });
            const sidebarOpen = document.querySelector("#game-sidebar-open");
            if (sidebarOpen) {
                sidebarOpen.style.display = "block";
            }
            this.printInputHelp('Zadej příkaz. Například "prozkoumej ocas". Pro automatické doplnění příkazu zkus klávesu TAB.');
        },
        onEnd: function(endState) {
            if (endState === "killed") {
                this.print("INDIANA JONES JE MRTEV!");
                this.print("ZPRÁVA Z AMERICKÉHO TISKU: Československá vláda oznámila, že náš drahý hrdina - INDIANA JONES - zemřel nešťastnou náhodou při autonehodě. Pokrač. na str. 54.");
                this.print("Stiskni R pro RESTART", "intro-text5");
                this.removeInputContainer();
            }
        },
        buildLocationMessage: function(location, game) {
            let message = "";
            if (location.desc) {
                message += location.desc instanceof Function ? location.desc(game) : location.desc;
                message += " ";
            }
            if (location.exits && location.exits.length > 0) {
                message += buildExitsMessage(game, location);
                message += " ";
            }
            if (location.items && location.items.length > 0) {
                message += buildItemsMessage(game, location);
            } else if (game.messages.noLocationItems) {
                message += game.messages.noLocationItems;
            }
            return message;
        },
        onActionPerformed: function(game, action, params) {
            if (!action.builtin) {
                game.shiftTime(1);
            }
        },
        onLocationItemAdded: function(game) {
            const location = game.location;
            if (location.items && location.items.length > 0) {
                game.print(buildItemsMessage(game, location));
            }
        },
        isInputCaseSensitive: false,
        startLocation: "m2",
        partialMatchLimit: 2,
        inventoryLimit: 2,
        items: items,
        inventory: ["diamanty"],
        locations: locations,
        actions: actions
    }
    return game;
}

function buildExitsMessage(game, location) {
    let message = game.messages.locationExits + " ";
    const exitNames = location.exits.map(e => e.name);
    for (let idx = 0; idx < exitNames.length; idx++) {
        if (exitNames.length > 1 && idx === (exitNames.length - 1)) {
            message += " a ";
        }
        message += exitNames[idx];
        if (exitNames.length > 2 && idx < (exitNames.length - 2)) {
            message += ", ";
        }
    }
    message += ".";
    return message;
}

function buildItemsMessage(game, location) {
    let message = game.messages.locationItems + " ";
    const itemNames = location.items.map(
        i => location.decorateItemName ? location.decorateItemName(game.mapItem(i).name, game) : game.mapItem(i).name);
    for (let idx = 0; idx < itemNames.length; idx++) {
        if (itemNames.length > 1 && idx === (itemNames.length - 1)) {
            message += " a ";
        }
        message += itemNames[idx];
        if (itemNames.length > 2 && idx < (itemNames.length - 2)) {
            message += ", ";
        }
    }
    message += ".";
    return message;
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
