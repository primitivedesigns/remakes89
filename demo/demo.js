const demo = {
    title : "Zapal noviny 1.0",
    messages : {
      locationItems: "Vidíš",  
      locationExits: "Můžeš jít"
    },
    startLocation : "m1",
    inventory : [ {
        name : "sirka",
        state : {},
        desc : function() {
            if (this.state.start == null) {
                return "Nová sirka";
            } else if (this.state.isIgnited()) {
                return "Hořící sirka";
            } else {
                return "Vyhořelá sirka"
            }
        },
        onUse : function(game) {
            if (!this.state.start) {
                game.print("Zapálil jsi sirku!");
                this.state = {
                        isIgnited : function() {
                            return this.start != null && ((this.game.time - this.start) < 10);
                        },
                        start : game.time,
                        game : game
                };    
            } else {
                game.print("S touhle sirkou už nic neuděláš.");
            }
        }
    } ],
    locations : [ {
        id : "m1",
        name : "První místnost",
        desc : "Je úplně prázdná.",
        exits : [ {
            name : "dolů",
            location : "m2"
        } ]
    }, {
        id : "m2",
        name : "Další místnost.",
        desc : "Tahle místnost je taky skoro prázdná.",
        items : [{
            name : "noviny",
            desc : "Suché staré noviny.",
            onUse : function(game) {
                const sirka = game.getInventoryItem('sirka');
                if (sirka && sirka.state.start && sirka.state.isIgnited()) {
                    game.end("Hurá! Zapálil jsi noviny a dokončil jsi hru.");
                } else {
                    game.print("Přečetl jsi noviny. Nic zajímavého.");
                }
            }}, {
                name : "podlaha",
                desc : "Na dřevěné podlaze není nic zajímavého.",
                takeable : false,
                onUse : function(game) {
                    game.print("Dupl jsi na podlahu. Nic se nestalo.");
                }
            }
        ],
        exits : [ {
            name : "nahoru",
            location : "m1"
        } ]
    } ],
    actions : [{
        name:"inv",
        perform: function(game) {
            if (game.inventory && game.inventory.length > 0) {
                game.print("V inventáři máš: " + game.inventory.map(item => item.name).join(", "));
            } else {
                game.print("V inventáři nemáš nic.");
            }
        }
    }, {
        name:"jdi",
        perform: function(game,params) {
            game.goToLocation(params[0]);
        },
        autocomplete: function(game,str) {
            return game.location.exits.filter(exit => exit.name.startsWith(str));
        }
    },{
        name:"prozkoumat",
        perform: function(game,params) {
                game.printItemInfo(params[0]);
        },
        autocomplete: function(game,str) {
            return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => item.name.startsWith(str));
        }
    }, {
        name:"pomoc",
        perform: function(game) {
            game.print("Použij klávesu Tab pro zobrazení a doplňování akcí. V historii se můžeš pohybovat pomocí šipky nahoru a dolů.");
        }
    },{
        name:"poloz",
        perform: function(game,params) {
            if(game.dropItem(params[0])) {
                game.print("Položil jsi " + params[0]);
            }
        },
        autocomplete: function(game,str) {
            return (!str || str.length === 0) ? game.inventory : game.inventory.filter(item => item.name.startsWith(str));
        }
    },{
        name:"vezmi",
        perform: function(game,params) {
            if(game.takeItem(params[0])) {
                game.print("Vzal jsi " + params[0]);
            } else {
                game.print("Tohle nelze vzít.");
            }
        },
        autocomplete: function(game,str) {
            return (!str || str.length === 0) ? game.getTakeableItems() : game.getTakeableItems().filter(item => item.name.startsWith(str));
        }
    },{
        name:"cas",
        perform: function(game) {
                game.print("Čas: " + game.time);
        }
    },{
        name:"pouzij",
        perform: function(game,params) {
                game.useItem(params[0]);
        },
        autocomplete: function(game,str) {
            return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => item.name.startsWith(str));
        }
    },{
        name:"cekej",
        perform: function(game) {
                game.shiftTime(1);
        }
    }]
}