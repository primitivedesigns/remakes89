/*
* DOBRODRUŽSTVÍ INDIANA JONESE NA VÁCLAVSKÉM NÁMĚSTÍ V PRAZE DNE 16.1.1989
*/

// NOTE: the global context must define a "bundle" object that contains various localization stuff

let sideOpen = false;
let beepOn = true;
const beep = new Audio(bundle.snd_beep_path);

const items = [{
    name: bundle.item_diamonds_name,
    desc: bundle.item_diamonds_desc,
    readInit: function (obj) {
        obj.onDrop = function (game) {
            if (game.location.id === "m12") {
                game.print(bundle.item_diamonds_onDrop);
                game.removeItem(bundle.item_diamonds_name);
            }
        }
    }
}, {
    name: bundle.item_cop1_name,
    aliases: bundle.item_cop1_aliases,
    desc: bundle.item_cop1_desc,
    takeable: false
}, {
    name: bundle.item_corpse1_name,
    aliases: bundle.item_corpse1_aliases,
    readInit: function (obj) {
        obj.desc = function () {
            let ret = bundle.item_corpse1_desc;
            if (!obj.examined) {
                ret += bundle.item_corpse1_desc_shield;
            }
            return ret;
        };
        obj.onExamine = function (game) {
            if (!obj.examined) {
                game.addLocationItem(bundle.item_shield_name);
            }
        }
    },
    takeable: false
}, {
    name: bundle.item_shield_name,
    aliases: bundle.item_shield_aliases,
    desc: bundle.item_shield_desc,
    readInit: function (obj) {
        obj.onUse = function (game) {
            if (game.location.id === "m5" && !game.location.shieldUsed) {
                game.location.shieldUsed = true;
                const boulder = game.getLocationItem(bundle.item_stone_name);
                if (boulder) {
                    boulder.takeable = true;
                    boulder.unusable = false;
                }
                game.print(bundle.item_shield_onUse);
                game.onLocationItemAdded(game, boulder.name);
                return true;
            }
        }
    }
}, {
    name: bundle.item_tail_name,
    readInit: function (obj) {
        obj.onExamine = function (game) {
            if (!this.examined) {
                game.addLocationItem(bundle.item_axe_name)
            }
        };
        obj.desc = function () {
            let ret = bundle.item_tail_desc;
            if (!this.examined) {
                ret += bundle.item_tail_onExamine;
            }
            return ret;
        };
    },
    takeable: false
}, {
    name: bundle.item_axe_name,
    desc: bundle.item_axe_desc,
    readInit: function (obj) {
        obj.onUse = function (game) {
            const cop = game.getLocationItem(bundle.item_cop1_name);
            if (cop) {
                game.print(bundle.item_axe_onUse);
                game.removeItem(bundle.item_axe_name);
                game.removeLocationItem(cop.name);
                game.addLocationItem(bundle.item_corpse1_name);
                return true;
            }
        }
    }
}, {
    name: bundle.item_stone_name,
    aliases: bundle.item_stone_aliases,
    takeable: false,
    unusable: true,
    readInit: function (obj) {
        obj.onUse = function (game) {
            if (!this.used && game.location.id === "m5") {
                game.print(bundle.item_stone_onUse);
                // Set m6 property
                game.getLocation("m6").shouldFail = false;
                game.removeItem(obj.name);
                game.addLocationItem(bundle.item_corpse2_name, "m6", true);
                return true;
            }
        };
    }
}, {
    name: bundle.item_dictionary_name,
    aliases: bundle.item_dictionary_aliases,
    desc: bundle.item_dictionary_desc,
    readInit: function (obj) {
        obj.onUse = function (game) {
            if (game.location.id === "m7") {
                game.print(bundle.item_dictionary_onUse);
                return true;
            }
        }
    }
}, {
    name: bundle.item_corpse2_name,
    desc: bundle.item_corpse2_desc,
    takeable: false
}, {
    name: bundle.item_writing_name,
    aliases: bundle.item_writing_aliases,
    desc: bundle.item_writing_desc,
    takeable: false
}, {
    name: bundle.item_gun_name,
    desc: bundle.item_gun_desc,
}, {
    name: bundle.item_cop2_name,
    desc: bundle.item_cop2_desc,
    takeable: false
}, {
    name: bundle.item_rod_name,
    aliases: bundle.item_rod_aliases,
    desc: bundle.item_rod_desc,
    readInit: function (obj) {
        obj.onUse = function (game) {
            if (game.location.id === "m8" && game.getLocationItem(bundle.item_cop2_name)) {
                game.print(bundle.item_rod_onUse_cop2);
                game.removeLocationItem(bundle.item_cop2_name);
                return true;
            } else if (game.location.id === "m10" && game.getLocationItem(bundle.item_cop3_name)) {
                game.print(bundle.item_rod_onUse_cop3);
                game.removeLocationItem(bundle.item_cop3_name);
                game.addLocationItem(bundle.item_corpse3_name);
                return true;
            } else if (game.location.id === "m18" && obj.throwable) {
                game.print(bundle.item_rod_onUse_throw);
                game.removeItem(obj.name);
                game.addLocationItem(bundle.item_militiaman_corpse_name, "m17");
                return true;
            }
        }
    }
}, {
    name: bundle.item_cop3_name,
    aliases: bundle.item_cop3_aliases,
    desc: bundle.item_cop3_aliases,
    takeable: false,
}, {
    name: bundle.item_corpse3_name,
    aliases: bundle.item_corpse3_aliases,
    readInit: function (obj) {
        obj.desc = function () {
            let ret = bundle.item_corpse3_desc;
            if (!obj.examined) {
                ret += bundle.item_corpse3_desc_uniform;
            }
            return ret;
        };
        obj.onExamine = function (game) {
            if (!obj.examined) {
                game.addLocationItem(bundle.item_uniform_name);
            }
        };
    },
    takeable: false,
}, {
    name: bundle.item_uniform_name,
    desc: bundle.item_uniform_desc,
    readInit: function (obj) {
        const dressAction = {
            name: bundle.item_uniform_dress_action_name,
            aliases: bundle.item_uniform_dress_action_aliases,
            perform: function (game, params) {
                const uniform = game.findItem(bundle.item_uniform_name).item;
                if (uniform && game.aliasObjectNameStartsWith(uniform, params.join(" "))) {
                    let uniform = game.getInventoryItem(bundle.item_uniform_name);
                    if (!uniform) {
                        uniform = game.takeItem(bundle.item_uniform_name, false);
                    }
                    if (uniform && !uniform.dressed) {
                        obj.dressed = true;
                        game.print(bundle.item_uniform_dress_action_perform);
                    }
                }
            }
        };
        const undressAction = {
            name: bundle.item_uniform_undress_action_name,
            aliases: bundle.item_uniform_undress_action_aliases,
            perform: function (game, params) {
                const uniform = game.findItem(bundle.item_uniform_name).item;
                if (obj.dressed && uniform && game.aliasObjectNameStartsWith(uniform, params.join(" "))) {
                    obj.dressed = false;
                    game.print(bundle.item_uniform_undress_action_perform);
                }
            }
        };
        obj.onUse = function (game) {
            if (obj.dressed) {
                undressAction.perform(game, [bundle.item_uniform_name]);
            } else {
                dressAction.perform(game, [bundle.item_uniform_name]);
            }
            return true;
        };
        obj.actions = [undressAction, dressAction];
        obj.onDrop = function (game) {
            obj.dressed = false;
        };
    }
}, {
    name: bundle.item_cop4_name,
    aliases: bundle.item_cop4_aliases,
    desc: bundle.item_cop4_desc,
    takeable: false
}, {
    name: bundle.item_altar_name,
    aliases: bundle.item_altar_aliases,
    desc: bundle.item_altar_desc,
    takeable: false
}, {
    name: bundle.item_tag_name,
    desc: bundle.item_tag_desc,
    takeable: false
}, {
    name: bundle.item_civilian_name,
    desc: bundle.item_civilian_desc,
    takeable: false
}, {
    name: bundle.item_cop5_name,
    aliases: bundle.item_cop5_aliases,
    desc: bundle.item_cop5_desc,
    takeable: false
}, {
    name: bundle.item_civilian_corpse_name,
    desc: bundle.item_civilian_corpse_desc,
    takeable: false,
    readInit: function (obj) {
        obj.onExamine = function (game) {
            if (!obj.examined) {
                game.addLocationItem(bundle.item_idcard_name);
            }
        };
    }
}, {
    name: bundle.item_idcard_name,
    desc: bundle.item_idcard_desc,
}, {
    name: bundle.item_militiaman_corpse_name,
    aliases: bundle.item_militiaman_corpse_aliases,
    desc: bundle.item_militiaman_corpse_desc,
    takeable: false,
}, {
    name: bundle.item_spinach_name,
    aliases: bundle.item_spinach_aliases,
    desc: bundle.item_spinach_desc,
    readInit: function (obj) {
        obj.onUse = function (game) {
            game.print(bundle.item_spinach_onUse);
            const rodRet = game.findItem(bundle.item_rod_name);
            if (rodRet.item) {
                rodRet.item.throwable = true;
            }
            const location = game.removeItem(obj.name);
            if (location) {
                location.items.push(bundle.item_can_name);
            } else {
                game.inventory.push(bundle.item_can_name);
            }
            return true;
        }
    }
}, {
    name: bundle.item_can_name,
    desc: bundle.item_can_desc
}];

const locations = [{
    id: "m1",
    desc: bundle.location_m1_desc,
    items: [bundle.item_cop1_name],
    readInit: function (obj) {
        obj.killHero = function (game) {
            game.print(bundle.location_m1_kill, "end-lose");
            game.end("killed", false);
        };
        obj.beforeAction = function (game, action, params) {
            if (game.getLocationItem(bundle.item_cop1_name) && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function (game, action, params) {
            if (action.builtin) {
                return;
            }
            if (!game.getLocationItem(bundle.item_cop1_name) || isMovement(action) || game.actionMatches(action, params, bundle.action_use, bundle.item_axe_name)) {
                // Cop is dead, after-enter action or action matches
                return;
            }
            obj.killHero(game);
        };
    },
    exits: [{
        name: bundle.exit_down,
        location: "m4"
    }, {
        name: bundle.exit_right,
        location: "m2"
    }, {
        name: bundle.exit_inside,
        location: "m19"
    }],
    hint: bundle.location_m1_hint
}, {
    id: "m2",
    desc: bundle.location_m2_desc,
    items: [bundle.item_tail_name],
    exits: [{
        name: bundle.exit_left,
        location: "m1"
    }, {
        name: bundle.exit_right,
        location: "m3"
    }, {
        name: bundle.exit_down,
        location: "m5"
    }],
    hint: bundle.location_m2_hint
}, {
    id: "m3",
    readInit: function (obj) {
        obj.onEnter = function (game) {
            if (!game.getInventoryItem(bundle.item_idcard_name)) {
                game.print(bundle.location_m3_kill, "end-lose");
                game.end("killed", false);
            }
        };
        obj.desc = function (game) {
            if (game.getInventoryItem(bundle.item_idcard_name)) {
                return bundle.location_m3_desc_ok;
            } else {
                this.exits = [];
                this.items = [];
                return bundle.location_m3_desc_nok;
            }
        }
    },
    exits: [{
        name: bundle.exit_left,
        location: "m2"
    }, {
        name: bundle.exit_inside,
        location: "m20"
    }, {
        name: bundle.exit_down,
        location: "m6"
    }],
    hint: bundle.location_m3_hint
}, {
    id: "m4",
    desc: bundle.location_m4_desc,
    readInit: function (obj) {
        obj.onEnter = function (game) {
            game.print(bundle.location_m4_kill, "end-lose");
            game.end("killed", false);
        }
    }
}, {
    id: "m5",
    desc: bundle.location_m5_desc,
    hint: bundle.location_m5_hint,
    items: [bundle.item_stone_name, bundle.item_dictionary_name],
    exits: [{
        name: bundle.exit_left,
        location: "m4"
    }, {
        name: bundle.exit_right,
        location: "m6"
    }, {
        name: bundle.exit_up,
        location: "m2"
    }, {
        name: bundle.exit_down,
        location: "m8"
    }],
    readInit: function (obj) {
        obj.decorateItemName = function (name, item, game) {
            let decoratedName = name;
            if (name === bundle.item_stone_name) {
                const stone = game.getLocationItem(bundle.item_stone_name);
                if (stone && stone.unusable) {
                    decoratedName += bundle.location_m5_stone;
                }
            }
            return decoratedName;
        };
        obj.killHero = function (game) {
            game.print(bundle.location_m5_kill, "end-lose");
            game.end("killed", false);
        };
        obj.beforeAction = function (game, action, params) {
            if (!obj.shieldUsed && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function (game, action, params) {
            if (action.builtin) {
                return;
            }
            if (obj.shieldUsed || isMovement(action) || game.actionMatches(action, params, bundle.action_use, bundle.item_shield_name)) {
                // Shield was used, after-enter action or action matches
                return;
            }
            obj.killHero(game);
        };
    }
}, {
    id: "m6",
    desc: bundle.location_m6_desc,
    hint: bundle.location_m6_hint,
    // see item_stone
    shouldFail: true,
    readInit: function (obj) {
        obj.onEnter = function (game) {
            if (this.shouldFail) {
                game.print(bundle.location_m6_kill, "end-lose");
                game.end("killed", false);
            }
        }
    },
    items: [],
    exits: [{
        name: bundle.exit_up,
        location: "m3"
    }, {
        name: bundle.exit_down,
        location: "m9"
    }, {
        name: bundle.exit_left,
        location: "m5"
    }]
}, {
    id: "m7",
    desc: bundle.location_m7_desc,
    items: [bundle.item_writing_name, bundle.item_gun_name],
    hint: bundle.location_m7_hint,
    exits: [{
        name: bundle.exit_up,
        location: "m4"
    }, {
        name: bundle.exit_right,
        location: "m8"
    }, {
        name: bundle.exit_down,
        location: "m10"
    }]
}, {
    id: "m8",
    desc: bundle.location_m8_desc,
    hint: bundle.location_m8_hint,
    items: [bundle.item_cop2_name],
    exits: [{
        name: bundle.exit_left,
        location: "m7"
    }, {
        name: bundle.exit_right,
        location: "m9"
    }, {
        name: bundle.exit_up,
        location: "m5"
    }],
    readInit: function (obj) {
        obj.killHero = function (game) {
            game.print(bundle.location_m8_kill, "end-lose");
            game.end("killed", false);
        };
        obj.beforeAction = function (game, action, params) {
            if (game.getLocationItem(bundle.item_cop2_name) && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function (game, action, params) {
            if (action.builtin) {
                return;
            }
            if (!game.getLocationItem(bundle.item_cop2_name) || isMovement(action) || game.actionMatches(action, params, bundle.action_use, bundle.item_rod_name)) {
                // Cop is dead, after-enter action or action matches
                return;
            }
            obj.killHero(game);
        };
    }
}, {
    id: "m9",
    exploded: false,
    readInit: function (obj) {
        obj.desc = function () {
            if (this.exploded) {
                return bundle.location_m9_desc_exploded;
            } else {
                return bundle.location_m9_desc;
            }
        };
        obj.onEnter = function (game) {
            if (this.exploded) {
                game.print(bundle.location_m9_kill, "end-lose");
                game.end("killed", false);
            } else {
                this.countDownTime = game.time;
            }
        }
    },
    hint: bundle.location_m9_hint,
    items: [bundle.item_rod_name],
    exits: [{
        name: bundle.exit_left,
        location: "m8"
    }, {
        name: bundle.exit_up,
        location: "m6"
    }],
}, {
    id: "m10",
    desc: bundle.location_m10_desc,
    hint: bundle.location_m10_hint,
    items: [bundle.item_cop3_name],
    readInit: function (obj) {
        obj.onEnter = function (game) {
            if (!obj.explored) {
                if (game.getInventoryItem(bundle.item_gun_name)) {
                    game.print(bundle.location_m10_enter_kill, "end-lose");
                    game.end("kill", false);
                } else {
                    game.print(bundle.location_m10_enter_ok);
                }
            }
        };
        obj.killHero = function (game) {
            game.print(bundle.location_m10_kill, "end-lose");
            game.end("killed", false);
        };
        obj.beforeAction = function (game, action, params) {
            if (game.getLocationItem(bundle.item_cop3_name) && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function (game, action, params) {
            if (action.builtin) {
                return;
            }
            if (!game.getLocationItem(bundle.item_cop3_name) || isMovement(action)) {
                // Cop is dead or after-enter action
                return;
            }
            obj.killHero(game);
        };
    },
    exits: [{
        name: bundle.exit_up,
        location: "m7"
    }, {
        name: bundle.exit_right,
        location: "m11"
    }]
}, {
    id: "m11",
    desc: bundle.location_m11_desc,
    hint: bundle.location_m11_hint,
    items: [bundle.item_cop4_name],
    readInit: function (obj) {
        obj.onEnter = function (game) {
            const uniform = game.getInventoryItem(bundle.item_uniform_name);
            if (!uniform || !uniform.dressed) {
                game.print(bundle.location_m11_kill, "end-lose");
                game.end("killed", false);
            }
        }
    },
    exits: [{
        name: bundle.exit_left,
        location: "m10"
    }, {
        name: bundle.exit_right,
        location: "m12"
    }]
}, {
    id: "m12",
    desc: bundle.location_m12_desc,
    hint: bundle.location_m12_hint,
    items: [bundle.item_altar_name, bundle.item_tag_name],
    exits: [{
        name: bundle.exit_left,
        location: "m11"
    }, {
        name: bundle.exit_down,
        location: "m15"
    }]
}, {
    id: "m13",
    desc: bundle.location_m13_desc,
    readInit: function (obj) {
        obj.onEnter = function (game) {
            game.print(bundle.location_m13_kill, "end-lose");
            game.end("killed", false);
        }
    }
}, {
    id: "m14",
    cops: true,
    hint: bundle.location_m14_hint,
    readInit: function (obj) {
        obj.desc = function (game) {
            let ret = bundle.location_m14_desc;
            if (obj.cops) {
                ret += bundle.location_m14_desc_cops;
            }
            return ret;
        };
        obj.onLeave = function () {
            obj.cops = false;
        };
        obj.afterAction = function (game, action, params) {
            if (action.builtin || !obj.cops || isMovement(action)) {
                return;
            }
            game.print(bundle.location_m14_kill, "end-lose");
            game.end("killed", false);
        };
    },
    exits: [{
        name: bundle.exit_left,
        location: "m13"
    }, {
        name: bundle.exit_right,
        location: "m15"
    }, {
        name: bundle.exit_down,
        location: "m17"
    }],
}, {
    id: "m15",
    desc: bundle.location_m15_desc,
    hint: bundle.location_m15_hint,
    items: [bundle.item_civilian_name],
    readInit: function (obj) {
        obj.onEnter = function (game) {
            const uniform = game.getInventoryItem(bundle.item_uniform_name);
            if (uniform && uniform.dressed) {
                game.print(bundle.location_m15_kill, "end-lose");
                game.end("killed", false);
            }
        };
    },
    exits: [{
        name: bundle.exit_left,
        location: "m14"
    }, {
        name: bundle.exit_up,
        location: "m12"
    }],
}, {
    id: "m16",
    desc: bundle.location_m16_desc,
    items: [bundle.item_cop5_name, bundle.item_civilian_corpse_name],
    hint: bundle.location_m16_hint,
    exits: [{
        name: bundle.exit_right,
        location: "m17"
    }, {
        name: bundle.exit_up,
        location: "m13"
    }],
    readInit: function (obj) {
        obj.killHero = function (game) {
            game.print(bundle.location_m16_kill, "end-lose");
            game.end("killed", false);
        };
        obj.beforeAction = function (game, action, params) {
            if (game.getLocationItem(bundle.item_cop5_name) && isMovement(action)) {
                // Trying to escape...
                obj.killHero(game);
                return true;
            }
            return false;
        };
        obj.afterAction = function (game, action, params) {
            if (action.builtin || !game.getLocationItem(bundle.item_cop5_name) || isMovement(action)) {
                // Cop is dead or after-enter action
                return;
            }
            if (game.getLocationItem(bundle.item_diamonds_name)) {
                game.print(bundle.location_m16_cop_left);
                game.removeLocationItem(bundle.item_cop5_name);
                game.removeItem(bundle.item_diamonds_name);
                return;
            }
            obj.killHero(game);
        };
    }
}, {
    id: "m17",
    readInit: function (obj) {
        obj.desc = function (game) {
            if (!obj.explored) {
                return bundle.location_m17_desc_unexplored;
            } else {
                if (game.getLocationItem(bundle.item_militiaman_corpse_name)) {
                    return bundle.location_m17_desc_explored_ok;
                } else {
                    return bundle.location_m17_desc_explored_nok;
                }
            }
        };
        obj.onEnter = function (game) {
            if (obj.explored && !game.getLocationItem(bundle.item_militiaman_corpse_name)) {
                game.print(bundle.location_m17_kill, "end-lose");
                game.end("killed", false);
            }
        }
    },
    hint: bundle.location_m17_hint,
    exits: [{
        name: bundle.exit_left,
        location: "m16"
    }, {
        name: bundle.exit_right,
        location: "m18"
    }, {
        name: bundle.exit_up,
        location: "m14"
    }],
}, {
    id: "m18",
    desc: bundle.location_m18_desc,
    hint: bundle.location_m18_hint,
    items: [bundle.item_spinach_name],
    exits: [{
        name: bundle.exit_left,
        location: "m17"
    }],
}, {
    id: "m19",
    desc: bundle.location_m19_desc,
    readInit: function (obj) {
        obj.onEnter = function (game) {
            game.print(bundle.location_m19_kill, "end-lose");
            game.end("killed", false);
        }
    }
}, {
    id: "m20",
    desc: "",
    readInit: function (obj) {
        obj.onEnter = function (game) {
            game.end("win");
        }
    }
}];

const actions = [{
    name: bundle.action_explore,
    aliases: bundle.action_explore_aliases,
    perform: function (game, params) {
        if (!game.examineItem(params.join(" "))) {
            game.print(game.messages.unknownCommand);
        }
    },
    autocomplete: function (game, str) {
        return (!str || str.length === 0) ? game.getItems() : game.getItems().filter(item => game.aliasObjectNameStartsWith(item, str));
    }
}, {
    name: bundle.action_use,
    aliases: bundle.action_use_aliases,
    perform: function (game, params) {
        if (!game.useItem(params.join(" "))) {
            game.print(game.messages.unknownCommand);
        }
    },
    autocomplete: function (game, str) {
        return (!str || str.length === 0) ? game.getUsableItems() : game.getUsableItems().filter(item => game.aliasObjectNameStartsWith(item, str));
    }
}, {
    name: bundle.exit_down,
    aliases: bundle.exit_down_aliases,
    perform: function (game, params) {
        if (!game.goToLocation(bundle.exit_down)) {
            game.print(game.messages.unknownCommand);
        }
    }
}, {
    name: bundle.exit_up,
    aliases: bundle.exit_up_aliases,
    perform: function (game, params) {
        if (!game.goToLocation(bundle.exit_up)) {
            game.print(game.messages.unknownCommand);
        }
    }
}, {
    name: bundle.exit_left,
    aliases: bundle.exit_left_aliases,
    perform: function (game, params) {
        if (!game.goToLocation(bundle.exit_left)) {
            game.print(game.messages.unknownCommand);
        }
    }
}, {
    name: bundle.exit_right,
    aliases: bundle.exit_right_aliases,
    perform: function (game, params) {
        if (!game.goToLocation(bundle.exit_right)) {
            game.print(game.messages.unknownCommand);
        }
    }
}, {
    name: bundle.exit_inside,
    aliases: bundle.exit_inside_aliases,
    perform: function (game, params) {
        if (!game.goToLocation(bundle.exit_inside)) {
            game.print(game.messages.unknownCommand);
        }
    }
}, {
    name: bundle.action_drop,
    aliases: bundle.action_drop_aliases,
    perform: function (game, params) {
        const item = game.dropItem(params.join(" "), false);
        if (item) {
            game.print(bundle.action_drop_success + item.name + ".");
        } else {
            game.print(bundle.action_drop_fail);
        }
    },
    autocomplete: function (game, str) {
        const items = game.inventory.map(item => game.mapItem(item));
        return (!str || str.length === 0) ? items : items.filter(item => game.aliasObjectNameStartsWith(item, str));
    }
}, {
    name: bundle.action_take,
    aliases: bundle.action_take_aliases,
    perform: function (game, params) {
        const ret = game.takeItem(params.join(" "), false);
        if (ret.item) {
            game.print(bundle.action_take_success + ret.item.name + ".");
        } else if (!ret.full) {
            game.print(bundle.action_take_fail);
        }
    },
    autocomplete: function (game, str) {
        return (!str || str.length === 0) ? game.getTakeableItems() : game.getTakeableItems().filter(item => game.aliasObjectNameStartsWith(item, str));
    }
}, {
    name: bundle.action_inventory,
    aliases: bundle.action_inventory_aliases,
    perform: function (game) {
        if (game.inventory && game.inventory.length > 0) {
            const itemNames = game.inventory.map(function (i) {
                const item = game.mapItem(i);
                let itemName = item.name;
                // The bundle can define a function that decorates an item name
                if (bundle.item_name_decorate) {
                    itemName = bundle.item_name_decorate(itemName);
                }
                return itemName;
            });
            game.print(bundle.action_inventory_start + itemNames.join(", ") + bundle.action_inventory_end);
        } else {
            game.print(bundle.action_inventory_empty);
        }
    }
}, {
    name: bundle.action_dict,
    aliases: bundle.action_dict_aliases,
    perform: function (game) {
        game.print(bundle.action_dict_prefix + game.getActions().map(action => action.name).join(", "));
    }
}, {
    name: bundle.action_help,
    aliases: bundle.action_help_aliases,
    perform: function (game) {
        if (game.location && game.location.hint) {
            game.print(game.location.hint, "hint");
        }
    }
}, {
    name: "unknownCommand",
    system: true,
    perform: function (game) {
        game.print(game.messages.unknownCommand);
    }
}];

const initControls = function (gameContainer, game) {
    // Input tips
    const inputTips = document.querySelector("#game-input-tip");
    const tip1 = document.createElement("span");
    tip1.title = bundle.controls_autocomplete;
    tip1.innerHTML = "&nbsp;&#8633; TAB&nbsp;";
    inputTips.appendChild(tip1);
    const tip2 = document.createElement("span");
    tip2.title = bundle.controls_history_old;
    tip2.innerHTML = "&nbsp;&uparrow;&nbsp;";
    inputTips.appendChild(tip2);
    const tip3 = document.createElement("span");
    tip3.title = bundle.controls_history_new;
    tip3.innerHTML = "&nbsp;&downarrow;&nbsp;";
    inputTips.appendChild(tip3);
    const tip4 = document.createElement("span");
    tip4.title = bundle.controls_save;
    tip4.innerHTML = "&nbsp;SAVE&nbsp;";
    inputTips.appendChild(tip4);
    const tip5 = document.createElement("span");
    tip5.title = bundle.controls_load;
    tip5.innerHTML = "&nbsp;LOAD&nbsp;";
    inputTips.appendChild(tip5);
}

function initState() {

    const game = {
        savedPositionPrefix: "indy",
        messages: {
            locationItems: bundle.messages_locationItems,
            noLocationItems: "",
            locationExits: bundle.messages_locationExits,
            unknownCommand: bundle.messages_unknownCommand,
            multipleActionsMatch: bundle.messages_multipleActionsMatch,
            inputHelpTip: "\xa0",
            inputHelpPrefix: bundle.messages_inputHelpPrefix,
            gameSaved: bundle.messages_gameSaved,
            gameLoaded: bundle.messages_gameLoaded,
            gamePositions: bundle.messages_gamePositions,
            gamePositionsEmpty: bundle.messages_gamePositionsEmpty,
            gamePositionDoesNotExist: bundle.messages_gamePositionDoesNotExist,
            inventoryFull: bundle.messages_inventoryFull,
        },
        intro: [function (gameContainer) {
            // Image
            const title = document.createElement("div");
            gameContainer.appendChild(title);
            title.className = "intro-title";

            const img = document.createElement("img");
            img.src = bundle.intro_img_title_path;
            img.className = "intro-img";
            title.appendChild(img);

            const textEnter = document.createElement("div");
            title.appendChild(textEnter);

            queueOutput(textEnter, bundle.intro_enter, function () {
                textEnter.className = "intro-enter";
            });

        }, function (gameContainer) {
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

            queueOutput(text1_a, bundle.intro_text1_a);
            queueOutput(text1_b, bundle.intro_text1_b);
            queueOutput(text1_c, bundle.intro_text1_c);
            queueOutput(text1_d, bundle.intro_text1_d);

            queueOutput(text2, "&copy; 1989", undefined, undefined, true);

            queueOutput(textEnter, bundle.intro_enter, function () {
                textEnter.className = "intro-enter";
            });

        }, function (gameContainer) {
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

            queueOutput(text1, bundle.intro_text1);
            queueOutput(text2, bundle.intro_text2);

            queueOutput(textAdd, bundle.intro_textAdd);
            queueOutput(textAdd1, bundle.intro_textAdd1);
            queueOutput(textAdd2, bundle.intro_textAdd2);
            queueOutput(textAdd3, bundle.intro_textAdd3);
            queueOutput(textAdd4, bundle.intro_textAdd4);

            queueOutput(textPhone, bundle.intro_textPhone);
            queueOutput(textMilos, bundle.intro_textMilos);

            queueOutput(textEnter, bundle.intro_enter, function () {
                textEnter.className = "intro-enter";
            });
        }],
        onInitControls: initControls,
        onShiftTime: function (game) {
            const m9 = game.getLocation("m9");
            if (m9.countDownTime && !m9.exploded) {
                const bombTime = game.time - m9.countDownTime;
                if (bombTime > 2) {
                    if (game.location.id === "m9") {
                        game.print(bundle.location_m9_bomb_kill, "end-lose");
                        game.end("killed", false);
                    } else {
                        m9.exploded = true;
                        game.print(bundle.location_m9_bomb_exploded);
                        if (game.getLocationItem(bundle.item_rod_name, m9)) {
                            game.print(bundle.location_m9_bomb_hint, "hint");
                        }
                    }
                }
            }
        },
        onStart: function (game) {
            document.onkeydown = function (event) {
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
            this.printInputHelp(bundle.start_hint);
        },
        onEnd: function (endState) {
            if (endState === "killed") {
                this.print(bundle.end_killed1);
                this.print(bundle.end_killed2);
                this.print(bundle.end_killed3, "intro-enter");
                this.removeInputContainer();
            } else if (endState === "win") {
                this.print(bundle.end_win, "end-win");
                this.removeInputContainer();
                this.print(bundle.end_win_restart, "intro-enter");
            }
        },
        buildLocationMessage: function (location, game) {
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
        afterAction: function (game, action, params) {
            if (!action.builtin) {
                game.shiftTime(1);
            }
            const gameInput = document.querySelector("#game-input")
            if (gameInput) {
                gameInput.scrollIntoView();
            }
        },
        onLocationItemAdded: function (game) {
            const location = game.location;
            if (location.items && location.items.length > 0) {
                game.print(buildItemsMessage(game, location));
            }
        },
        adaptCommand: function (game, command) {
            if (command && command.length > 0 && bundle.command_start_replacements) {
                for (var i = 0; i < bundle.command_start_replacements.length; i++) {
                    const replacement = bundle.command_start_replacements[i];
                    const match = replacement.match.find(m => command.startsWith(m));
                    if (match) {
                        command = replacement.value + command.substring(match.length, command.length);
                        break;
                    }
                }
            }
            return command;
        },
        parameterFilter: function (param) {
            if (bundle.ignored_params) {
                return !bundle.ignored_params.find(p => param === p);
            }
            return true;
        },
        isInputCaseSensitive: false,
        startLocation: "m2",
        partialMatchLimit: 2,
        inventoryLimit: 2,
        items: items,
        inventory: [bundle.item_diamonds_name],
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
            message += bundle.conjunction_and;
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
    const itemNames = location.items.map(function (i) {
        const item = game.mapItem(i);
        let name = item.name;
        // Locations can decorate items names
        if (location.decorateItemName) {
            name = location.decorateItemName(name, item, game);
        }
        // The bundle can define a function that decorates an item name too
        if (bundle.item_name_decorate) {
            name = bundle.item_name_decorate(name, item);
        }

        return name;
    });
    for (let idx = 0; idx < itemNames.length; idx++) {
        if (itemNames.length > 1 && idx === (itemNames.length - 1)) {
            message += bundle.conjunction_and;
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
    return action.name === bundle.exit_down || action.name === bundle.exit_up || action.name === bundle.exit_left || action.name === bundle.exit_right || action.name === bundle.exit_inside;
}
