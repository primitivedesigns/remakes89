// const gameTitle = "DOBRODRUŽSTVÍ INDIANA JONESE NA VÁCLAVSKÉM NÁMĚSTÍ V PRAZE DNE 16.1.1989";

let sideOpen = false;
let beepOn = true;

function initState() {

    const game = {
        //title: gameTitle,
        messages: {
            locationItems: "Vidíš",
            noLocationItems: "",
            locationExits: "Můžeš jít",
            unknownAction: "To bohužel nejde!!!",
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
        }],
        onInitControls: function(gameContainer) {
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

            document.addEventListener("keydown", function(event) {
                if (event.key === "F1") {
                    event.preventDefault();
                    if (sideOpen) {
                        closeSide();
                    } else {
                        openSide();
                    }
                }
                // TODO Play beep sound
            });
        },
        onStart: function() {
            const sidebarOpen = document.querySelector("#game-sidebar-open");
            if (sidebarOpen) {
                sidebarOpen.style.display = "block";
            }
            this.printInputHelp('Zadej příkaz. Například "prozkoumej ocas". Pro automatické doplnění příkazu zkus klávesu TAB.');
        },
        onEnd: function(endState) {
            if (endState === "killed") {
                this.print("INDIANA JONES JE MRTEV!", null, 1000);
                this.print("ZPRÁVA Z AMERICKÉHO TISKU : Československa vláda oznámila, že náš drahý hrdina - INDIANA JONES - zemřel nešťastnou náhodou při autonehodě. Pokrač. na str. 54.", null, 1500);
                this.removeInputContainer();
            }
        },
        buildLocationMessage: function(location, game) {
            let message = "";
            if (location.desc) {
                message += location.desc instanceof Function ? location.desc() : location.desc;
                message += " ";
            }
            if (location.exits && location.exits.length > 0) {
                message += game.messages.locationExits + " " + location.exits.map(e => e.name).join(", ") + ".";
                message += " ";
            }
            if (location.items && location.items.length > 0) {
                message += game.messages.locationItems + " " + location.items.map(i => game.mapItem(i).name).join(", ") + ".";
            } else if (game.messages.noLocationItems) {
                message += game.messages.noLocationItems;
            }
            return message;
        },
        onActionPerformed: function(game, action, params) {
            if (!action.builtin) {
                game.shiftTime(1);

                if (game.location.id === "m1") {
                    if (game.location.actionTaken && game.getLocationItem("fízla")) {
                        game.print("Fízl se na tebe krvežíznivě vrhnul a začal tě mlátit. A mlátil a mlátil...", "end", 500);
                        game.end("killed", false);
                        // TODO restart
                    } else {
                        game.location.actionTaken = true;
                    }
                }
            }
        },
        isInputCaseSensitive: false,
        startLocation: "m2",
        partialMatchLimit: 2,
        inventoryLimit: 2,
        // ITEMS
        items: [{
            name: "diamanty",
            desc: "Jsou to čtyři nádherné drahokamy."
        }, {
            name: "fízla",
            aliases: ["fizla"],
            desc: "Chystá se zmlátit tě.",
            takeable: false
        }, {
            name: "mrtvolu fízla",
            // víceslovné předměty dávám s podtržítkem
            desc: "Má hluboko v hlavě zaseklou sekeru (dobrá práce)! Našels' u něj štít.",
            readInit: function(obj) {
                obj.onExamine = function(game) {
                    game.location.items.push("štít");
                }
            },
            takeable: false
        }, {
            name: "štít",
            aliases: ["stit"],
            desc: "Je vhodně upraven proti padajícímu kamení."
        }, {
            name: "ocas",
            readInit: function(obj) {
                obj.onExamine = function(game) {
                    if (!this.examined) {
                        this.examined = true;
                        game.location.items.push("sekeru");
                    }
                };
                obj.desc = function() {
                    let ret = "Je to ocas koně,na kterém sedí svatý Václav.";
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
                        game.print("O.K. Zasekl jsi mu sekeru do hlavy tak hluboko,že nejde vytáhnout. Vidíš mrtvolu fízla.");
                        game.location.items.splice(game.location.items.findIndex(item => item.name === "fízla"), 1);
                        game.location.items.push("mrtvolu fízla");
                    } else {
                        game.print(game.messages.unknownAction);
                    }
                }
            }
        }, {
            name: "kámen",
            desc: "Není to obyčejný kámen, je to dlažební kostka."
                // pokud v této místnosti použiješ kámen, tak "O.K. Vrhnul jsi kámen napravo. Zprava (a to je pozoruhodné) jsi zaslechl výkřik." Tím se zpřístupní M6
        }, {
            name: "slovník",
            desc: "Podrobný česko-anglicky slovník."
        }, {
            name: "mrtvolu_policajta",
            desc: "Byl nepochybně zasažen dlažební kostkou.",
            takeable: false
        }, {
            name: "nápis_na_zdi",
            desc: "Bez slovníku jej nerozluštíš.",
            takeable: false
                // POUŽIJ SLOVNÍK: "O.K. Přeložil sis nápis na zdi. Cituji: Jakeš je vůl, KAREL."
        }, {
            name: "pistoli",
            desc: "Bohužel v ní nejsou náboje.",
        }, {
            name: "poldu",
            desc: "Chystá se zmlátit tě.",
            //fízla lze zabít použitím tyče. Pokud okamžitě nepoužiješ sekeru, pak message: "Jakmile tě polda zmerčil, vrhnul se na tebe. Nevzmohl jsi se ani na obranu. Chudáku." a GAMEOVER
            // použít tyč - hláška "O.K. Vypáčil jsi poklop kanálu. Poklop spadnul do šachty. Polda se na tebe z řevem vrhnul,ale v okamžiku, kdy tě chtěl udeřit, zahučel přímo před tebou do kanálu."
            takeable: false
        }, {
            name: "tyč",
            desc: "Na ledacos by se hodila.",
        }, {
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
            },
            takeable: false,
        }, {
            name: "člena_VB",
            desc: "Kontroluje kolemjdoucí.",
            // opět to nebylo v původní hře, deskripci jsem dopsal
            takeable: false
        }, {
            name: "oltář",
            desc: "Jako by ti něco říkalo: Polož sem diamanty.",
            // pokud položíš diamanty: "Jakmile jsi je položil, někdo je z oltáře ukradl." - item zmizí. Neděje se to jinde, pouze v této místnosti. 
            takeable: false
        }, {
            name: "cedulku",
            desc: "Je na ní napsáno: 'A ven se dostane jen ten, kdo má čtyři magické diamanty.'",
            takeable: false
        }],
        inventory: ["diamanty"],
        locations: [{
            id: "m1",
            desc: "O.K. Stojíš před domem potravin. Vchod do metra je naštěstí volný. Z balkónu v domě se pobaveně dívá nepříjemný člověk (zřejmě komunista) na poctivě odváděnou práci členů VB.",
            items: ["fízla"],
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
            actionTaken: false
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
            desc: "O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe našel legitimaci člena tajné policie, popřál mnoho štěstí v další práci, lehce se uklonil a odešel (hlupák).",
            //verze, pokud nemáš legitimaci: O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe nic nenašel, zavolal si na pomoc 'kamarády' a zmlátili tě do němoty. Když od tebe odbíhali na nějakou ženu s kočárkem, jednomu z nich vypadla z pouzdra mačeta. Doplazil ses pro ni a spáchals' HARAKIRI.
            onEnter: function(game) {
                if (true) {
                    // TODO
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
            desc: "O.K. Stojíš u prodejny Supraphon. Než ses však stačil rozhlédnout, pokropila tě sprška vodního děla. Spadl jsi na zem a rozbil sis hlavu.",
            readInit: function(obj) {
                    obj.onEnter = function() {
                        // TODO
                    }
                }
                // automatický GAME OVER
        }, {
            id: "m5",
            desc: "O.K. Ulevuješ si mezi kytičky ve velkém květináči.",
            // Když poprvé přijdeš, kámen se jmenuje "kámen, který padá na tebe" a pokud okamžitě nepoužiješ štít, tak je GAME OVER s hláškou: "Kámen se přibližuje víc a víc. Pořád se zvětšuje a zvětšuje a zvětšuje a zvětšu-"
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
                    // pokud jsou možné 4 směry z 5, hra vypíše: "Můžeš kamkoli kromě Y." Nevím, jestli je nutné to dodržovat
            }]
        }, {
            id: "m6",
            desc: "O.K. Nacházíš se u domu módy v ústí do zatarasené Krakovské ulice.",
            // Pokud jsi v M5 nepoužil kámen, tak text pokračuje: "Vidíš policajta. Na tváři, která se k tobě víc a více přibližuje, je vidět, že je to maniak. Už mu neunikneš." GAMEOVER

            items: ["mrtvolu_policajta"],
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
            items: ["nápis_na_zdi", "pistoli"],
            exits: [{
                name: "doleva",
                location: "m9"
            }]
        }, {
            id: "m8",
            //chybí
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
        }, {
            id: "m9",
            desc: "O.K. Stojíš pod lešením. Dole jsou zátarasy. Slyšíš tichý, leč podezřelý tikot. Vidíš do ústí zatarasené ulice Ve Smečkách.",
            // pokud došlo k výbuchu: "O.K. Balancuješ na kraji obrovského kráteru. Na dně vidíš ceduli 'Dům módy'. Neudržels' však rovnováhu a padáš dolů." a GAME OVER
            items: ["tyč"],
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
            items: ["chlupatýho"],
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
            items: ["člena_VB"],
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
        }],
        // GLOBAL ACTIONS
        actions: [{
            name: "prozkoumej",
            aliases: ["prozkoumat"],
            perform: function(game, params) {
                if (!game.examineItem(params.join(" "))) {
                    game.print(game.messages.unknownAction);
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
                    game.print(game.messages.unknownAction);
                }
            },
            autocomplete: function(game, str) {
                return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => game.aliasObjectNameStartsWith(item, str));
            }
        }, {
            name: "dolů",
            perform: function(game, params) {
                game.goToLocation("dolů");
            }
        }, {
            name: "nahoru",
            perform: function(game, params) {
                game.goToLocation("nahoru");
            }
        }, {
            name: "doleva",
            perform: function(game, params) {
                game.goToLocation("doleva");
            }
        }, {
            name: "doprava",
            perform: function(game, params) {
                game.goToLocation("doprava");
            }
        }, {
            name: "dovnitř",
            perform: function(game, params) {
                game.goToLocation("dovnitř");
            }
        }, {
            name: "polož",
            aliases: ["poloz", "polozit", "položit"],
            perform: function(game, params) {
                const item = game.dropItem(params[0], false);
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
                if (game.inventory.length >= 2) {
                    game.print("Inventář je plný!");
                } else {
                    const item = game.takeItem(params[0], false);
                    if (item) {
                        game.print("Vzal jsi " + item.name + ".");
                    } else {
                        game.print("Tohle nejde vzít.");
                    }
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
                    game.print("Máš u sebe: " + game.inventory.join(", "));
                } else {
                    game.print("Nemáš u sebe nic.");
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
        }]
    }

    return game;
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