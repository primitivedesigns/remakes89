/*
* DOBRODRUŽSTVÍ INDIANA JONESE NA VÁCLAVSKÉM NÁMĚSTÍ V PRAZE DNE 16.1.1989
*/

let sideOpen = false;
let beepOn = true;
const beep = new Audio("snd/beep.wav");

const items = [{
    name: "diamanty",    
    desc: "Jsou to čtyři nádherné drahokamy.",
    // Four beautiful gems.
    readInit: function(obj) {
        obj.onDrop = function(game) {
            if (game.location.id === "m12") {
                game.print("Jakmile jsi je položil, někdo je z oltáře ukradl.");
                // As soon as you put them down, someone has snatched them from the altar.
                game.removeItem("diamanty");
            }
        }
    }
}, {
    name: "fízla",
    aliases: ["fizla"],
    desc: "Chystá se zmlátit tě.",
    // He's about to beat you up.
    takeable: false
}, {
    name: "mrtvolu fízla",
    aliases: ["mrtvolu fizla"],
    desc: "Má hluboko v hlavě zaseklou sekeru (dobrá práce)! Našels' u něj štít.",
    // The axe has cut down deep inside his skull (good job)! He's equipped with a shield."
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
    // It is designed to shield you from falling rocks.
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
                // You have used the shield to deflect the rock.
                game.onLocationItemAdded(game, boulder.name);
                return true;
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
            // It's the tail of the horse that St. Wenceslas sits on.
            if (!this.examined) {
                ret += " Ve skulince pod ocasem jsi našel sekeru.";
                // You've found an axe in a little crevice.
            }
            return ret;
        };
    },
    takeable: false
}, {
    name: "sekeru",
    desc: "Do tupé policajtské hlavy by zajela jako po másle.",
    // It would cut cops' stupid heads like butter.
    readInit: function(obj) {
        obj.onUse = function(game) {
            const cop = game.getLocationItem("fízla");
            if (cop) {
                game.print("O.K. Zasekl jsi mu sekeru do hlavy tak hluboko, že nejde vytáhnout.");
                // You've driven your axe so deep inside his skull that it cannot be pulled out.
                game.removeItem("sekeru");
                game.removeLocationItem(cop.name);
                game.addLocationItem("mrtvolu fízla");
                return true;
            }
        }
    }
}, {
    name: "kámen",
    aliases: ["kamen"],
    desc: "Není to obyčejný kámen, je to dlažební kostka.",
    // It's no ordinary rock, it's a cobblestone.
    takeable: false,
    unusable: true,
    readInit: function(obj) {
        obj.onUse = function(game) {
            if (!this.used && game.location.id === "m5") {
                game.print("O.K. Vrhnul jsi kámen napravo. Zprava (a to je pozoruhodné) jsi zaslechl výkřik.");
                // You have cast the rock to the right. You have heard a scream (and that is intriguing) from the right.
                // Set m6 property
                game.getLocation("m6").shouldFail = false;
                game.removeItem(obj.name);
                game.addLocationItem("mrtvolu policajta", "m6", true);
                return true;
            }
        }
    }
}, {
    name: "slovník",
    aliases: ["slovnik"],
    desc: "Podrobný česko-anglicky slovník.",
    // A comprehensive Czech-English dictionary.
    readInit: function(obj) {
        obj.onUse = function(game) {
            if (game.location.id === "m7") {
                game.print("O.K. Přeložil sis nápis na zdi. Cituji: Jakeš je vůl, KAREL.");
                // O.K. You've translated the writing on the wall. It says that the General Secretary Jakeš "is a dumbass". It's signed KAREL.
                return true;
            }
        }
    }
}, {
    name: "mrtvolu policajta",
    desc: "Byl nepochybně zasažen dlažební kostkou.",
    // Apparatently, he has been hit by a cobblestone. 
    takeable: false
}, {
    name: "nápis na zdi",
    aliases: ["napis na zdi"],
    desc: "Bez slovníku jej nerozluštíš.",
    // You won't decipher it without a dictionary.
    takeable: false
}, {
    name: "pistoli",
    desc: "Bohužel v ní nejsou náboje.",
    // There's no ammunition, unfortunately.
}, {
    name: "poldu",
    desc: "Chystá se zmlátit tě.",
    // He's about to beat you up.
    takeable: false
}, {
    name: "tyč",
    aliases: ["tyc"],
    desc: "Na ledacos by se hodila.",
    // It could come in handy.
    readInit: function(obj) {
        obj.onUse = function(game) {
            if (game.location.id === "m8" && game.getLocationItem("poldu")) {
                game.print("O.K. Vypáčil jsi poklop kanálu. Poklop spadnul do šachty. Polda se na tebe s řevem vrhnul, ale v okamžiku, kdy tě chtěl udeřit, zahučel přímo před tebou do kanálu.");
                // O.K. You have pried the drain cover open, and it fell down into the manhole. Screaming, the cop charged at you, but at the very moment he was about to hit you, he dropped down the open manhole right in front of you.
                game.removeLocationItem("poldu");
                return true;
            } else if (game.location.id === "m10" && game.getLocationItem("chlupatýho")) {
                game.print("O.K. Praštil jsi chlupatýho tyčí přes hlavu.");
                // O.K. You have hit the cop with the iron rod, right into the head.
                game.removeLocationItem("chlupatýho");
                game.addLocationItem("mrtvolu chlupatýho");
                return true;
            } else if (game.location.id === "m18" && obj.throwable) {
                game.print("O.K. Mrštil jsi tyčí nalevo a uslyšel jsi zasténání. Cha, cha, cha, cha.");
                // O.K. You have hurled the rod to the left and heard a groan. Ha ha ha ha.
                game.removeItem(obj.name);
                game.addLocationItem("mrtvolu milicionáře", "m17");
                return true;
            }
        }
    }
}, {
    name: "chlupatýho",
    aliases: ["chlupatyho"],
    desc: "Chystá se zmlátit tě.",
    // He's about to beat you up.
    takeable: false,
}, {
    name: "mrtvolu chlupatýho",
    aliases: ["mrtvolu chlupatyho"],
    desc: "Někdo mu rozrazil tyči lebku (kdo asi?). Má na sobě uniformu.",
    // Someone (guess who?) has split his skull with an iron rod. He's wearing a uniform.
    readInit: function(obj) {
        obj.onExamine = function(game) {
            game.addLocationItem("uniformu");
        };
    },
    takeable: false,
}, {
    name: "uniformu",
    desc: "Je to uniforma člena Veřejné bezpečnosti.",
    // It's the uniform of a member of the Public Security, or the Czechoslovak police.
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
                        // O.K. You've put on the police uniform.
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
                    // O.K. You've put down the uniform.
                }
            }
        };
        obj.onUse = function(game) {
            if (obj.dressed) {
                undressAction.perform(game, ["uniformu"]);
            } else {
                dressAction.perform(game, ["uniformu"]);
            }
            return true;
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
    // He's checking the passersby.
    takeable: false
}, {
    name: "oltář",
    aliases: ["oltar"],
    desc: "Jako by ti něco říkalo: Polož sem diamanty.",
    // As if something was telling you: Put the diamonds here.
    takeable: false
}, {
    name: "cedulku",
    desc: "Je na ní napsáno: 'A ven se dostane jen ten, kdo má čtyři magické diamanty.'",
    // It reads: Only that who has four magic diamonds will make it out of here.
    takeable: false
}, {
    name: "civila",
    desc: "Je na něm vidět, že nemá v lásce komunisty.",
    // You can see that he's not fond of communists.
    takeable: false
}, {
    name: "příslušníka",
    aliases: ["prislusnika"],
    desc: "Chystá se zmlátit tě.",
    // He's about to beat you up.
    takeable: false
}, {
    name: "mrtvolu civila",
    desc: "Je ti velice podobný. Má u sebe legitimaci.",
    // He looks very much like you. He's got an ID card on him.
    takeable: false,
    readInit: function(obj) {
        obj.onExamine = function(game) {
            game.addLocationItem("legitimaci");
        };
    }
}, {
    name: "legitimaci",
    desc: "Patří členu tajné policie, který je ti velice podobný.",
    // It belongs to the member of the secret police who looks very much like you.
}, {
    name: "mrtvolu milicionáře",
    aliases: ["mrtvolu milicionare"],
    desc: "Někdo po něm mrštil tyči. Hádám tak dle toho, že ji má zaraženou v hlavě.",
    // Someone has thrown an iron bar at him, guessing from the fact that it is sticking out of his head.
    takeable: false,
}, {
    name: "špenát",
    aliases: ["spenat"],
    desc: "Ještě je v záruční lhůtě.",
    // It's still before its best before date.
    readInit: function(obj) {
        obj.onUse = function(game) {
            game.print("O.K. Snědl jsi špenát a hned se cítíš silnější, že bys mohl tyčí házet.");
            // O.K. You've eaten the spinach and you feel stronger at once - so strong you could throw javelin.
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
            return true;
        }
    }
}, {
    name: "plechovku",
    desc: "Je to dočista vylízaná plechovka od špenátu."
    // It's a spinach can, licked completely clean.
}];

const locations = [{
    id: "m1",
    desc: "O.K. Stojíš před domem potravin. Vchod do metra je naštěstí volný. Z balkónu v domě se pobaveně dívá nepříjemný člověk (zřejmě komunista) na poctivě odváděnou práci členů VB.",
    // O.K. You are standing in front of the Grocery Store Building. The entrance into the subway is fortunately clear. An annoying man (probably a communist) is looking out of a balcony and happily watching the good work of the members of the Public Security.
    items: ["fízla"],
    readInit: function(obj) {
        obj.killHero = function(game) {
            game.print("Fízl se na tebe krvežíznivě vrhnul a začal tě mlátit. A mlátil a mlátil...", "end-lose");
            // "The bloodthirsty cop has grabbed you and started beating you up. And kept on beating and beating."
            game.end("killed", false);
        };
        obj.beforeAction = function(game, action, params) {
            if (game.getLocationItem("fízla") && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function(game, action, params) {
            if (!game.getLocationItem("fízla") || isMovement(action) || game.actionMatches(action, params, "použij", "sekeru")) {
                // Cop is dead, after-enter action or action matches
                return;
            }
            obj.killHero(game);
        };
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
    hint: "Bude třeba se nějak prosekat dál."
    // You will have to chop your way through.
}, {
    id: "m2",
    desc: "O.K. Jsi pod sochou svatého Václava. Vidíš zatarasený vchod do metra. Nahoře je muzeum, ale přístup k němu je zatarasený.",
    // O.K. You are under the statue of St. Wenceslas. The entrance into the subway is blocked. The National Museum is above you, but the entryway is also blocked.
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
    }],
    hint: "Pořádně se rozhlédni kolem sebe."
    // Take a good look around you.
}, {
    id: "m3",
    readInit: function(obj) {
        obj.onEnter = function(game) {
            if (!game.getInventoryItem("legitimaci")) {
                game.print("Když od tebe odbíhali na nějakou ženu s kočárkem, jednomu z nich vypadla z pouzdra mačeta. Doplazil ses pro ni a spáchals' HARAKIRI.", "end-lose");
                // As they were running away to deal with some woman with a baby carriage, one of them lost a machete. You crawled for it and committed hara-kiri. 
                game.end("killed", false);
            }
        };
        obj.desc = function(game) {
            if (game.getInventoryItem("legitimaci")) {
                return "O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe našel legitimaci člena tajné policie, popřál mnoho štěstí v další práci, lehce se uklonil a odešel (hlupák).";
                // O.K. You are standing at an unobstructed entrance into the subway. As soon as you showed up, an officer came to you and searched you. Having found the secret police ID card, he wished you good luck in your future endeavors, bowed, and left (the moron!).
            } else {
                this.exits = [];
                this.items = [];
                return "O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe nic nenašel, zavolal si na pomoc 'kamarády' a zmlátili tě do němoty."
                // O.K. You are standing at an unobstructed entrance into the subway. As soon as you showed up, an officer came to you and searched you. Having found nothing, he called on his “comrades” and they beat you senseless.
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
    }],
    hint: "Nic už ti nebrání vydat se na cestu."
    // Nothing keeps you from departing.
}, {
    id: "m4",
    desc: "O.K. Stojíš u prodejny Supraphon. Než ses však stačil rozhlédnout, pokropila tě sprška vodního děla.",
    // O.K. You are standing by the Supraphon record store. But before you could even look around, you have been hit by a water cannon.
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Spadl jsi na zem a rozbil sis hlavu.", "end-lose");
            // You fell down and struck your head on the ground.
            game.end("killed", false);
        }
    }
}, {
    id: "m5",
    desc: "O.K. Ulevuješ si mezi kytičky ve velkém květináči.",
    // O.K. You take a leak among the flowers in a big flowerpot.
    hint: "Jeden z policajtů jistě bude mít něco, čím jde kámen odrazit. S takovým kamenem pak jde zasáhnout i celkem vzdálený cíl.",
    // One of the cops is likely to have something that can deflect the rock. The rock can then hit a fairly distant target.
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
        obj.killHero = function(game) {
            game.print("Kámen se přibližuje víc a víc. Pořád se zvětšuje a zvětšuje a zvětšuje a zvětšu-", "end-lose");
            game.end("killed", false);
        };
        obj.beforeAction = function(game, action, params) {
            if (!obj.shieldUsed && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function(game, action, params) {
            if (obj.shieldUsed || isMovement(action) || game.actionMatches(action, params, "použij", "štít")) {
                // Shield was used, after-enter action or action matches
                return;
            }
            obj.killHero(game);
        };
    }
}, {
    id: "m6",
    desc: "O.K. Nacházíš se u domu módy v ústí do zatarasené Krakovské ulice.",
    // O.K. You're standing by the Fashion Building, next to the barricaded Krakovská street. 
    hint: "Tenhle policajt už ti k ničemu nebude.",
    // This cop will be of no more use to you.
    // see item "kámen"
    shouldFail: true,
    readInit: function(obj) {
        obj.onEnter = function(game) {
            if (this.shouldFail) {
                game.print("Vidíš policajta. Na tváři, která se k tobě víc a více přibližuje, je vidět, že je to maniak. Už mu neunikneš.", "end-lose");
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
    // O.K. You're standing in front of the bookstore. You cannot hear anything, because a large crowd keeps chanting the slogan 'LONG LIVE KAREL!' To the left, you can see a blocked entrace into the Opletalova street.
    items: ["nápis na zdi", "pistoli"],
    hint: "Václavák není místo, kde by tě pomohla pistole.",
    // Wencleslas Square is not a place where a gun would help you.
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
    // O.K. You're standing between traffic posts, right by a drain. There is nothing special here. There are roadblocks downward.
    hint: "Nemohl by ti pomoct kanál?",
    // Could the drain be of any use?
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
        obj.killHero = function(game) {
            game.print("Jakmile tě polda zmerčil, vrhnul se na tebe. Nevzmohl jsi se ani na obranu. Chudáku.", "end-lose");
            // As soon as the cop spotted you, he charged at you. You didn't even put up a fight. You loser.
            game.end("killed", false);
        };
        obj.beforeAction = function(game, action, params) {
            if (game.getLocationItem("poldu") && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function(game, action, params) {
            if (!game.getLocationItem("poldu") || isMovement(action) || game.actionMatches(action, params, "použij", "tyč")) {
                // Cop is dead, after-enter action or action matches
                return;
            }
            obj.killHero(game);
        };
    }
}, {
    id: "m9",
    exploded: false,
    readInit: function(obj) {
        obj.desc = function() {
            if (this.exploded) {
                return "O.K. Balancuješ na kraji obrovského kráteru. Na dně vidíš ceduli 'Dům módy'.";
                // O.K. You're balancing on the edge of a huge crater. At the bottom, you can see a sign saying 'The Fashion Building'.
            } else {
                return "O.K. Stojíš pod lešením. Dole jsou zátarasy. Slyšíš tichý, leč podezřelý tikot. Vidíš do ústí zatarasené ulice Ve Smečkách.";
                // O.K. You are standing under the scaffolding. There are roadblocks downward. You can hear a quiet, yet suspicious ticking. You can see the blocked entrance into the Ve Smečkách street.
            }
        };
        obj.onEnter = function(game) {
            if (this.exploded) {
                game.print("Neudržels' však rovnováhu a padáš dolů.", "end-lose");
                // You couldn't keep balance and you're falling down.
                game.end("killed", false);
            } else {
                this.countDownTime = game.time;
            }
        }
    },
    hint: "Slyšíš ten tikot? Seber, co jde, a rychle pryč!",
    // Can you hear the ticking? Pick up what you can, and scram!
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
    // O.K. You find yourself in front of the Luxol Club. The Jalta cinema is next door. You can see roadblocks further down.
    hint: "Některé předměty ti pomůžou víckrát. A pak nezapomeň, že šaty dělají člověka!",
    // Some items will help you more than once. And don't forget to dress up for each occasion!
    items: ["chlupatýho"],
    readInit: function(obj) {
        obj.onEnter = function(game) {
            if (!obj.explored) {
                if (game.getInventoryItem("pistoli")) {
                    game.print("Najednou se na tebe vrhnul chlupatej. Prošacoval tě, a když u tebe našel pistoli, odprásknul tě.", "end-lose");
                    // Suddenly, a cop charged at you. He frisked you, and as soon as he found the pistol on you, he shot you dead on the spot.
                    game.end("kill", false);
                } else {
                    game.print("Najednou se na tebe vrhnul chlupatej, a když u tebe nic nenašel, zklamaně odešel.");
                    // Suddenly, a cop charged at you, and having found nothing, he left in disappoinment.
                }
            }
        };
        obj.killHero = function(game) {
            game.print("Policajta naštvalo, že u tebe nenašel, co hledal, a vrhnul se na tebe.", "end-lose");
            // Not finding what he was looking for, the policeman lost his nerve and beat you up.
            game.end("killed", false);
        };
        obj.beforeAction = function(game, action, params) {
            if (game.getLocationItem("chlupatýho") && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function(game, action, params) {
            if (!game.getLocationItem("chlupatýho") || isMovement(action)) {
                // Cop is dead or after-enter action
                return;
            }
            obj.killHero(game);
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
    // O.K. You're in the shrubs.
    hint: "Někdo má uniformy rád, jiný zase nerad.",
    // Someone likes uniforms, someone doesn't.
    items: ["člena VB"],
    readInit: function(obj) {
        obj.onEnter = function(game) {
            const uniform = game.getInventoryItem("uniformu");
            if (!uniform || !uniform.dressed) {
                game.print("Vrhnul se na tebe člen VB a odtáhnul tě do antona. Sedí tu pár milých tváří s železnými tyčemi v rukách. Začali si s tebou hrát.", "end-lose");
                // A member of the Public Security tackled you and dragged you into an armed truck. Sitting here are some fine young men with iron bars in their hands. They start to play with you.
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
    // O.K. You're standing in front of a bank. There are roadblocks uphill.
    hint: "Cedulka nelže!",
    // The note does not lie!
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
    // O.K. You're in front of the grand hotel Europe. But you've noticed a video camera pointed right at you.
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Uznal jsi, že veškerý odpor je marný a spáchal jsi sebevraždu.", "end-lose");
            // You've concluded that resistance is futile and committed suicide.
            game.end("killed", false);
        }
    }
}, {
    id: "m14",
    cops: true,
    hint: "Některému nebezpečí se stačí jen uhnout.",
    // There are dangers that you can simply avoid.
        readInit: function(obj) {
        obj.desc = function(game) {
            let ret = "O.K. Sedíš na lavičce. (Už nemůžeš, co?) Kolem ucha ti hvízdla kulka. Nahoře jsou zátarasy.";
            // O.K. You're sitting on a bench. (You're out of breath, aren't you?) A bullet just swooshed past your ear. There are roadblocks up ahead.
            if (obj.cops) {
                ret += " Blíží se k tobě řada policajtů.";
                // A group of policemen are coming toward you.
            }
            return ret;
        };
        obj.onLeave = function() {
            obj.cops = false;
        };
        obj.afterAction = function(game, action, params) {
            if (!obj.cops || isMovement(action)) {
                return;
            }
            game.print("Řada policajtů se přiblížila až k tobě. Než jsi stačil vstát, pustili se do tebe obušky.", "end-lose");
            // A group of policemen has approached you. Before you managed to get up, they were already beating you with batons.
            game.end("killed", false);
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
    // O.K. You're standing under a scaffolding. To the right, the way into the Štěpánská street is blocked. There are roadblocks downhill, too.
    hint: "Kdo má málo místa v kapsách, musí se často převlékat!",
    // If you don't have enough room in your pockets, you'll have to change clothes often!
    items: ["civila"],
    readInit: function(obj) {
        obj.onEnter = function(game) {
            const uniform = game.getInventoryItem("uniformu");
            if (uniform && uniform.dressed) {
                game.print("Vrhnul se na tebe civilní občan pod dojmem, že jsi člen VB. Máš totiž ještě oblečenou uniformu.", "end-lose");
                // A civilian charged at you thinking that you are with the Public Security. That's because you're still wearing the uniform.
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
    // O.K. You are lying on the ground in front of the COMRADERIE department store. That's because an officer has just hit you. The entrace into the metro is blocked. There are tram tracks further down behind roadblocks.
    items: ["příslušníka", "mrtvolu civila"],
    hint: "Neber úplatky - dávej je!",
    // Bribery is the enemy of socialism - but it works!
    exits: [{
        name: "doprava",
        location: "m17"
    }, {
        name: "nahoru",
        location: "m13"
    }],
    readInit: function(obj) {
        obj.killHero = function(game) {
            game.print("Příslušník se na tebe vrhnul a zmlátil tě.", "end-lose");
            // A member of the police charged at you and beat you up.
            game.end("killed", false);
        };
        obj.beforeAction = function(game, action, params) {
            if (game.getLocationItem("příslušníka") && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function(game, action, params) {
            if (!game.getLocationItem("příslušníka") || isMovement(action)) {
                // Cop is dead or after-enter action
                return;
            }
            if (game.getLocationItem("diamanty")) {
                game.print("Příslušník správně pochopil a diskrétně odešel.");
                game.removeLocationItem("příslušníka");
                game.removeItem("diamanty");
                return;
            }
            obj.killHero(game);
        };
    }
}, {
    id: "m17",
    readInit: function(obj) {
        obj.desc = function(game) {
            if (!obj.explored) {
                return "O.K. Sedíš v květináči mezi kytičkami a nadává ti milicionář. Cituji: 'Jestli tě tu uvidím ještě jednou, tak uvidíš.'";
                // O.K. You're sitting in a flowerpot between flowers and a militiaman is shouting at you. To quote: 'If I see you here again, you're a dead man.'
            } else {
                if (game.getLocationItem("mrtvolu milicionáře")) {
                    return "O.K. Sedíš v květináči mezi kytičkami.";
                    // O.K. You're sitting in a flowerpot between flowers
                } else {
                    return "O.K. Sedíš v květináči mezi kytičkami a nadává ti milicionář. Cituji: 'Já tě upozorňoval, ty hajzle.'";
                    // O.K. You're sitting in a flowerpot between flowers and the militia man is shouting at you. To quote: 'I've warned you, you fucker.'
                }
            }
        };
        obj.onEnter = function(game) {
            if (obj.explored && !game.getLocationItem("mrtvolu milicionáře")) {
                game.print("Když se vypovídal, vrhnul se na tebe.", "end-lose");
                // As soon as he was done talking, he charged at you.
                game.end("killed", false);
            }
        }
    },
    hint: "Milicionář to myslí vážně!",
    // The militiaman is being serious!
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
    // O.K. You're standing by a blocked entrance into the subway. There are roadblocks up- and downhill.
    hint: "Na hod do dálky se budeš potřebovat posilnit.",
    // To throw anywhere far, you'll need some energy.
    items: ["špenát"],
    exits: [{
        name: "doleva",
        location: "m17"
    }],
}, {
    id: "m19",
    desc: "O.K. Dostal ses do metra. Všude je tu rozšířen slzný plyn.",
    // O.K. You've entered the subway. There's teargas everywhere.
    readInit: function(obj) {
        obj.onEnter = function(game) {
            game.print("Je ho tu tolik, že ses udusil.", "end-lose");
            // There's so much of it here that you've suffocated.
            game.end("killed", false);
        }
    }
}, {
    id: "m20",
    desc: "",
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
    aliases: ["pouzij", "pouzit", "použít"],
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
    aliases: ["poloz", "polozit", "položit", "zahodit", "zahoď"],
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
    aliases: ["seber", "vzít", "vzit", "vem"],
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
            game.print(game.location.hint, "hint");
        }
    }
}, {
    name: "unknownCommand",
    system: true,
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
            gamePositions: "Uložené pozice: ",
            gamePositionsEmpty: "Nemáš žádnou uloženou pozici.",
            gamePositionDoesNotExist: "Nelze nahrát pozici: ",
            inventoryFull: "Víc už toho neuneseš!",
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
            text1_b.className = "intro-text1";
            gameContainer.appendChild(text1_b);
            const text1_c = document.createElement("div");
            text1_c.className = "intro-text1";
            gameContainer.appendChild(text1_c);
            const text1_d = document.createElement("div");
            text1_d.className = "intro-text1";
            gameContainer.appendChild(text1_d);

            const text2 = document.createElement("div");
            text2.className = "intro-text2";
            gameContainer.appendChild(text2);

            const textEnter = document.createElement("div");
            gameContainer.appendChild(textEnter);

            queueOutput(text1_a, "DOBRODRUŽSTVÍ INDIANA JONESE");
            // THE ADVENTURES OF INDIANA JONES
            queueOutput(text1_b, "NA VÁCLAVSKÉM NÁMĚSTÍ");
            // IN WENCESLAS SQUARE
            queueOutput(text1_c, "V PRAZE");
            // IN PRAGUE
            queueOutput(text1_d, "DNE 16.1. 1989");
            // ON JANUARY 16, 1989

            queueOutput(text2, "&copy; 1989", undefined, undefined, true);

            queueOutput(textEnter, "Stiskni klávesu ENTER", function() {
                textEnter.className = "intro-enter";
            });
            // Press ENTER

        }, function(gameContainer) {
            // Story
            while (gameContainer.firstChild) {
                gameContainer.removeChild(gameContainer.firstChild);
            }

            const text1 = document.createElement("div");
            text1.className = "intro-story1";
            gameContainer.appendChild(text1);
            const text2 = document.createElement("div");
            text2.className = "intro-story2";
            gameContainer.appendChild(text2);

            const textAdd = document.createElement("div");
            textAdd.className = "intro-add";
            gameContainer.appendChild(textAdd);

            const textAdd1 = document.createElement("div");
            textAdd1.className = "intro-add-next";
            gameContainer.appendChild(textAdd1);
            const textAdd2 = document.createElement("div");
            textAdd2.className = "intro-add-next";
            gameContainer.appendChild(textAdd2);
            const textAdd3 = document.createElement("div");
            textAdd3.className = "intro-add-next";
            gameContainer.appendChild(textAdd3);
            const textAdd4 = document.createElement("div");
            textAdd4.className = "intro-add-next";
            gameContainer.appendChild(textAdd4);

            const textPhone = document.createElement("div");
            textPhone.className = "intro-phone";
            gameContainer.appendChild(textPhone);

            const textMilos = document.createElement("div");
            textMilos.className = "intro-milos";
            gameContainer.appendChild(textMilos);

            const textEnter = document.createElement("div");
            gameContainer.appendChild(textEnter);

            queueOutput(text1, "Jste Indiana Jones a vaším úkolem je dostat se do vaší rodné země, do Ameriky. Jste totiž na Václavském náměstí pod sochou svatého Václava. Je 16. 1. 1989.");
            // You are Indiana Jones and your goal is to get to your homeland, America. Incidentally, you find yourself on Wenceslas Square under the statue of St. Wenceslas. The date is January 16, 1989.
            queueOutput(text2, "Tato hra je určena pro pokročilejší hráče textových her.");
            // This game is designed for advanced adventure game players.

            queueOutput(textAdd, "S úctou");
            // Yours sincerely,
            queueOutput(textAdd1, "Zuzan Znovuzrozený");
            queueOutput(textAdd2, "Ztracená bez čísla");
            // Zillion and One Overlooked Street
            queueOutput(textAdd3, "Zapadákov City");
            // Zero City
            queueOutput(textAdd4, "TRAMTÁRIE");

            queueOutput(textPhone, "Telefon: 16 1 1989");
            // Phone no.: 16 1 1989
            queueOutput(textMilos, "BIJTE MILOŠE !!!");
            // BEAT 'EM UP!

            queueOutput(textEnter, "Stiskni klávesu ENTER", function() {
                // Press ENTER
                textEnter.className = "intro-enter";
            });
        }],
        onInitControls: initControls,
        onShiftTime: function(game) {
            const m9 = game.getLocation("m9");
            if (m9.countDownTime && !m9.exploded) {
                const bombTime = game.time - m9.countDownTime;
                if (bombTime > 2) {
                    if (game.location.id === "m9") {
                        game.print("Zahlédl jsi záblesk, po kterém následuje ohromný výbuch. Než tě zasáhla střepina, došlo ti,co znamenal ten tikot.", "end-lose");
                        // You noticed a flash, followed by a massive explosion. Right before a shard hit you, you've realized what the ticking was.
                        game.end("killed", false);
                    } else {
                        m9.exploded = true;
                        game.print("Místo, ze kterého jsi právě vyšel, vyletělo do povětří. Tys měl ale štěstí.");
                        // The spot that you've just left, has now exploded. Lucky you!
                        if (game.getLocationItem("tyč", m9)) {
                            game.print("Výbuch zničil předmět, který jsi potřeboval k dohrání hry. Napiš RESTART a začni znovu.", "hint");
                            // The explosion destroyed an object that you required to finish the game. Type in RESTART to try again.
                        }
                    }
                }
            }
        },
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
                } else if (game.endState) {
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
                if (beepOn) {
                    beep.play();
                }
            };
            const sidebarOpen = document.querySelector("#game-sidebar-open");
            if (sidebarOpen) {
                sidebarOpen.style.display = "block";
            }
            this.printInputHelp('Zadej příkaz. Například "prozkoumej ocas". Pro automatické doplnění příkazu zkus klávesu TAB.');
        },
        onEnd: function(endState) {
            if (endState === "killed") {
                this.print("INDIANA JONES JE MRTEV!");
                //INDIANA JONES IS DEAD!
                this.print("ZPRÁVA Z AMERICKÉHO TISKU: Československá vláda oznámila, že náš drahý hrdina - INDIANA JONES - zemřel nešťastnou náhodou při autonehodě. Pokrač. na str. 54.");
                // BREAKING NEWS FROM AMERICAN PRESS: The Czechoslovak government has announced that our dear hero - INDIANA JONES - died in an unforunate traffic accident. Continue reading on page 54.
                this.print("Stiskni klávesu R pro RESTART nebo L a nahraje se poslední uložená pozice.", "intro-enter");
                this.removeInputContainer();
            } else if (endState === "win") {
                this.print("O.K. OBELSTIL JSI I TU NEJVĚTŠÍ FÍZLOVSKOU SVINI. ŠTASTNĚ JSI SE DOSTAL NA LETIŠTĚ A ODLETĚL DOMŮ. GRATULUJI K VÍTĚZSTVÍ!!!!!!!!!!", "end-win");
                // O.K. YOU HAVE OUTSMARTED EVEN THE WORST POLICE SCUM. YOU HAVE SAFELY ARRIVED AT THE AIRPORT AND TOOK A PLANE HOME. CONGRATULATIONS!!!!!!!!!!
                this.removeInputContainer();
                this.print("Stiskni klávesu R pro RESTART", "intro-enter");
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
        afterAction: function(game, action, params) {
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
        adaptCommand: function(game, command) {
            if (command && command.length > 0) {
                if (command.startsWith("jdi na ") || command.startsWith("jit na ") || command.startsWith("jít na ")) {
                    return command.substring(7, command.length);
                }
                if (command.startsWith("jdi ") || command.startsWith("jit ") || command.startsWith("jít ")) {
                    return command.substring(4, command.length);
                }
            }
            return command;
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

function isMovement(action) {
    return action.name === "dolů" || action.name === "nahoru" || action.name === "doleva" || action.name === "doprava" || action.name === "dovnitř";
}
