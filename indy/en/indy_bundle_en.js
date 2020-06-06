const bundle = {
    // =====
    // Items
    // =====
    item_diamonds_name: "diamonds",
    item_diamonds_desc: "Four beautiful gems.",
    item_diamonds_onDrop: "As soon as you put them down, someone snatched them from the altar.",

    item_cop1_name: "cop",
    item_cop1_desc: "He's about to beat you up.",

    item_corpse1_name: "dead cop",
    item_corpse1_desc: "The axe is wedged deep in his skull (good job)!",
    item_corpse1_desc_shield: " He's equipped with a riot shield.",

    item_shield_name: "riot shield",
    item_shield_aliases: ["shield"],
    item_shield_desc: "Sturdy enough to shield you from falling rocks.",
    item_shield_onUse: "O.K. You have deflected the stone with the riot shield.",

    item_stone_name: "stone",
    item_stone_aliases: ["rock"],
    item_stone_desc: "It's no ordinary rock, it's a cobblestone.",
    item_stone_onUse: "You threw the stone to the right. You heard a scream from the right (which is intriguing).",

    item_tail_name: "tail",
    item_tail_desc: "It's the tail of St. Wenceslas' horse.",
    item_tail_onExamine: " You've found an axe in a little crevice below the tail.",

    item_axe_name: "axe",
    item_axe_desc: "It would cut through a cop's stupid head like a knife through butter.",
    item_axe_onUse: "O.K. You've driven your axe so deep inside his skull that it cannot be pulled out.",

    item_dictionary_name: "dictionary",
    item_dictionary_desc: "A comprehensive Czech-English dictionary.",
    item_dictionary_onUse: "O.K. You've translated the writing on the wall. It says that the General Secretary Jakeš is a dumbass. It's signed KAREL.",

    item_writing_name: "writing on the wall",
    item_writing_aliases: ["writing"],
    item_writing_desc: "You won't decipher it without a dictionary.",

    item_gun_name: "pistol",
    item_gun_desc: "There's no ammunition, unfortunately.",

    item_cop2_name: "policeman",
    item_cop2_desc: "He's about to beat you up.",

    item_corpse2_name: "dead policeman",
    item_corpse2_desc: "Undoubtedly hit by a cobblestone.",

    item_rod_name: "rod",
    item_rod_desc: "It could come in handy.",
    item_rod_onUse_cop2: "O.K. You have pried the drain cover open, and it fell down into the manhole. The cop charged at you screaming, but just as he was about to hit you, he dropped down the open manhole right in front of you.",
    item_rod_onUse_cop3: "O.K. You have hit the cop over the head with the rod.",
    item_rod_onUse_throw: "O.K. You have thrown the rod to the left and heard a groan. Ha ha ha ha.",

    item_cop3_name: "copper",
    item_cop3_desc: "He's about to beat you up.",

    item_corpse3_name: "dead copper",
    item_corpse3_desc: "A dead cop. Someone (guess who?) has split his skull in two with an iron rod.",
    item_corpse3_desc_uniform: " He's wearing a uniform.",

    item_uniform_name: "uniform",
    item_uniform_desc: "It's the uniform of a member of the Public Security, or the Czechoslovak police.",
    item_uniform_dress_action_name: "wear",
    item_uniform_dress_action_aliases: ["put on"],
    item_uniform_dress_action_perform: "O.K. You've put on the police uniform.",
    item_uniform_undress_action_name: "remove",
    item_uniform_undress_action_aliases: ["put down", "take off"],
    item_uniform_undress_action_perform: "O.K. You've taken off the uniform.",

    item_cop4_name: "member of the police force",
    item_cop4_aliases: ["police", "member"],
    item_cop4_desc: "He's checking the passersby.",

    item_altar_name: "altar",
    item_altar_desc: "Something seems to be telling you: 'Put the diamonds here.'",

    item_tag_name: "note",
    item_tag_desc: "It reads: 'Only the holder of the four magic diamonds will make it out of here.'",

    item_civilian_name: "civilian",
    item_civilian_desc: "He's obviously not fond of communists.",

    item_cop5_name: "police officer",
    item_cop5_aliases: ["officer"],
    item_cop5_desc: "He's about to beat you up.",

    item_civilian_corpse_name: "dead civilian",
    item_civilian_corpse_aliases: ["civilian"],
    item_civilian_corpse_desc: "He looks very much like you. He's got an ID card on him.",

    item_idcard_name: "ID card",
    item_idcard_aliases: ["card", "id"],
    item_idcard_desc: "It belongs to the member of the secret police who looks very much like you.",

    item_militiaman_corpse_name: "dead militiaman",
    item_militiaman_corpse_desc: "Someone has thrown an iron bar at him. You've deduced that from the fact that it's sticking out of his head.",

    item_spinach_name: "spinach",
    item_spinach_desc: "A can of spinach. Hasn't expired yet.",
    item_spinach_onUse: "O.K. You've eaten the spinach and you suddenly feel strong enough to throw a javelin.",

    item_can_name: "can",
    item_can_desc: "It's a spinach can, licked completely clean.",

    // Decorate item names - if needed prefix the name with an article
    item_name_decorate: function (itemName) {
        let article = "a ";
        switch (itemName) {
            case this.item_spinach_name:
            case this.item_diamonds_name:
                article = "";
                break;
            case this.item_axe_name:
            case this.item_altar_name:
            case this.item_idcard_name:
                article = "an ";
                break;
            case this.item_writing_name:
                article = "some ";
                break;
        }
        return article + itemName;
    },

    // =========
    // Locations
    // =========

    location_m1_desc: "O.K. You're standing in front of the Grocery Store building. The subway entrance is fortunately clear. An unpleasant man (probably a Communist) is looking from a balcony, watching in amusement the good work of the Public Security.",
    location_m1_hint: "You will have to chop your way through.",
    location_m1_kill: "The bloodthirsty cop grabbed you and started beating you up. And kept on beating and beating...",

    location_m2_desc: "O.K. You're under the statue of St. Wenceslas. The entrance into the subway is blocked. The National Museum is above you, but the entryway is also blocked.",
    location_m2_hint: "Take a good look around you.",

    location_m3_desc_ok: "O.K. You're standing at an unobstructed entrance into the subway. As soon as you showed up, an officer came to you and frisked you. Having found the secret police ID card, he wished you good luck in your future endeavors, bowed slightly, and left (the moron!).",
    location_m3_desc_nok: "O.K. You're standing at an unobstructed entrance into the subway. As soon as you showed up, an officer came to you and searched you. Having found nothing, he called on his “friends” and they beat you senseless.",
    location_m3_kill: "As they ran off to deal with some woman with a baby carriage, one of them dropped a machete. You crawled for it and committed hara-kiri.",
    location_m3_hint: "Nothing keeps you from departing now.",

    location_m4_desc: "O.K. You're standing by the Supraphon record store. But before you could even look around, you were hit by a water cannon.",
    location_m4_kill: "You fell down and struck your head on the ground.",

    location_m5_desc: "O.K. You take a leak on some flowers in a big flowerpot.",
    location_m5_hint: "One of the cops will probably have something that can deflect the rock. Such a rock can hit a fairly distant target.",
    location_m5_kill: "The stone is getting closer and closer to you. It keeps getting bigger and bigger and bigger and big-",
    location_m5_stone: " that is about to hit you,",

    location_m6_desc: "O.K. You're standing by the House of Fashion Building, next to the barricaded Krakovská street.",
    location_m6_hint: "This cop will be of no more use to you.",
    location_m6_kill: "You see a cop. His face, which is getting closer and closer to you, is maniacal. There is no escaping him.",

    location_m7_desc: "O.K. You're standing in front of a bookstore. You cannot hear anything, because a large crowd keeps chanting the slogan 'LONG LIVE KAREL!' To the left, you can see a blocked entrance into Opletalova street.",
    location_m7_hint: "A gun won't help you in Wencleslas Square.",

    location_m8_desc: "O.K. You're standing between traffic posts, right by a drain. There is nothing special here. There are roadblocks further down.",
    location_m8_hint: "Could the drain be of any use?",
    location_m8_kill: "As soon as the cop spotted you, he charged at you. You didn't even put up a fight. You loser.",

    location_m9_desc: "O.K. You're standing under a scaffolding. There are roadblocks further down. You can hear a quiet, yet suspicious ticking. You can see the blocked entrance into the Ve Smečkách street.",
    location_m9_desc_exploded: "O.K. You're balancing on the edge of a huge crater. At the bottom, you can see a sign saying 'The Fashion Building'.",
    location_m9_hint: "Can you hear the ticking? Pick up what you can, and scram!",
    location_m9_kill: "But couldn't keep balance, and you're falling down.",
    location_m9_bomb_kill: "You noticed a flash followed by a massive explosion. Right before a shard hit you, you've realized what the ticking was.",
    location_m9_bomb_exploded: "The spot that you've just left has exploded. Lucky you!",
    location_m9_bomb_hint: "The explosion destroyed an object that you needed to finish the game. Type in RESTART to try again.",

    location_m10_desc: "O.K. You find yourself in front of the Luxol Club. The Jalta cinema is next door. You can see roadblocks further down.",
    location_m10_hint: "Some items will help you more than once. And don't forget that clothes make the man!",
    location_m10_enter_ok: "Suddenly, a cop charged at you, and having found nothing, he left with a frown.",
    location_m10_enter_kill: "Suddenly, a cop charged at you. He frisked you, and as soon as he found the pistol on you, he shot you dead on the spot.",
    location_m10_kill: "Not finding what he was looking for, the policeman lost his nerve and beat you up.",

    location_m11_desc: "O.K. You're in the shrubs.",
    location_m11_hint: "Some people like uniforms, others don't.",
    location_m11_kill: "A member of the Public Security tackled you and dragged you into an armed truck. Sitting here are some fine young men with iron rods in their hands. They start to play with you.",

    location_m12_desc: "O.K. You're standing in front of a bank. There are roadblocks further up.",
    location_m12_hint: "The note does not lie!",

    location_m13_desc: "O.K. You're in front of the Grand Hotel EVROPA. But then you notice a video camera pointed right at you.",
    location_m13_kill: "You've acknowledged that resistance is futile and committed suicide.",

    location_m14_desc: "O.K. You're sitting on a bench. (You can't keep up, can you?) A bullet just swooshed past your ear. There are roadblocks up ahead.",
    location_m14_desc_cops: " A group of policemen are coming toward you.",
    location_m14_hint: "Some dangers you can simply dodge.",
    location_m14_kill: "The policemen approached you. Before you managed to get up, they were already beating you with batons.",

    location_m15_desc: "O.K. You're standing under a scaffolding. The way into Štěpánská street on the right is blocked. There are roadblocks further down, too.",
    location_m15_hint: "If you don't have enough room in your pockets, you'll have to change clothes often!",
    location_m15_kill: "A civilian charged at you thinking that you are with the Public Security. That's because you're still wearing the uniform.",

    location_m16_desc: "O.K. You are lying on the ground in front of the COMRADERIE department store. That's because an officer has just hit you. The subway entrance is blocked. There are tram tracks further down behind some roadblocks.",
    location_m16_hint: "Bribery is the enemy of socialism - but it works!",
    location_m16_kill: "The officer charged at you and beat you up.",
    location_m16_cop_left: "The officer accepted the deal and discreetly left.",

    location_m17_desc_unexplored: "O.K. You're sitting next to some flowers in a flowerpot and a militiaman is shouting at you. To quote: 'If I see you here again, you're a dead man.",
    location_m17_desc_explored_ok: "O.K. You're sitting next to some flowers in a flowerpot.",
    location_m17_desc_explored_nok: "O.K. You're sitting next to some flowers in a flowerpot and the militiaman is shouting at you. To quote: 'I've warned you, you fucker.'",
    location_m17_kill: "As soon as he was done talking, he charged at you.",
    location_m17_hint: "The militiaman is being serious!",

    location_m18_desc: "O.K. You're standing by a blocked entrance into the subway. There are roadblocks further up and down.",
    location_m18_hint: "To be able to throw far, you'll need some energy.",

    location_m19_desc: "O.K. You've entered the subway. There's tear gas everywhere.",
    location_m19_kill: "There's so much of it here that you've suffocated.",

    // =======
    // Actions
    // =======

    exit_up: "up",
    exit_up_aliases: ["go up", "u"],
    exit_down: "down",
    exit_down_aliases: ["go down", "d"],
    exit_right: "right",
    exit_right_aliases: ["go right", "r"],
    exit_left: "left",
    exit_left_aliases: ["go left", "l"],
    exit_inside: "inside",
    exit_inside_aliases: ["go inside"],

    action_explore: "examine",
    action_explore_aliases: ["inspect", "read", "explore", "look at"],

    action_use: "use",
    action_use_aliases: [],

    action_drop: "drop",
    action_drop_aliases: ["put down", "throw away"],
    action_drop_success: "You have dropped the ",
    action_drop_fail: "You can't drop that.",

    action_take: "take",
    action_take_aliases: ["pick up", "get"],
    action_take_success: "You've picked up the ",
    action_take_fail: "You can't pick that up.",

    action_inventory: "inventory",
    action_inventory_aliases: ["things", "i"],
    action_inventory_start: "You're carrying ",
    action_inventory_end: ", nothing more, nothing less.",
    action_inventory_empty: "You don't have shit.",

    action_dict: "vocabulary",
    action_dict_aliases: ["verbs", "actions"],
    action_dict_prefix: "You can use the following actions: ",

    action_help: "help",
    action_help_aliases: ["hint"],

    // ======
    // Global
    // ======

    snd_beep_path: "../snd/beep.wav",
    // The prefix is used to distinguish saved games on localhost - not all browsers keep a separate local storage per page 
    // This one starts with "en_" to retain backward compatibility for cs version
    save_position_prefix: "en_indy",

    conjunction_and: " and ",
    ignored_params: ["the"],

    start_hint: 'Enter a command, such as "examine tail". To auto-complete a command, try pressing TAB.',

    // Controls
    controls_autocomplete: "Special key - auto-complete command",
    controls_history_old: "Special key - show previous command",
    controls_history_new: "Special key - show next command",
    controls_save: "Command - save game",
    controls_load: "Command - load game",

    // Messages
    messages_locationItems: "You see",
    messages_locationExits: "You can go",
    messages_unknownCommand: "You can't do that!!!",
    messages_multipleActionsMatch: "The input corresponds to multiple commands: ",
    messages_inputHelpPrefix: "Continue: ",
    messages_gameSaved: "Game saved.",
    messages_gameLoaded: "Savegame loaded.",
    messages_gamePositions: "The following savegames are available: ",
    messages_gamePositionsEmpty: "No savegames available.",
    messages_gamePositionDoesNotExist: "Cannot load savegame: ",
    messages_inventoryFull: "You can't carry anything more!",

    // Intro
    intro_img_title_path: "../img/title.png",

    intro_enter: "Press ENTER",
    intro_text1_a: "THE ADVENTURES OF INDIANA JONES",
    intro_text1_b: "IN WENCESLAS SQUARE",
    intro_text1_c: "IN PRAGUE",
    intro_text1_d: "ON JANUARY 16, 1989",

    intro_text1: "You are Indiana Jones and your goal is to get to your homeland, America. Somehow, you find yourself in Wenceslas Square under the statue of St. Wenceslas. The date is January 16, 1989.",
    intro_text2: "This game is designed for advanced adventure game players.",
    intro_textAdd: "Yours sincerely,",
    intro_textAdd1: "Zuzan Znovuzrozený",
    intro_textAdd2: "Zero Unpleasant Street",
    intro_textAdd3: "Zilch City",
    intro_textAdd4: "NOWHERELAND",
    intro_textPhone: "Phone no.: 16 1 1989",
    intro_textMilos: "BEAT 'EM UP!!!",

    end_killed1: "INDIANA JONES IS DEAD!",
    end_killed2: "BREAKING NEWS FROM THE AMERICAN PRESS: The Czechoslovak government has announced that our beloved hero - INDIANA JONES - died in a traffic accident with no signs of foul play. Continue reading on page 54.",
    end_killed3: "Press R to RESTART or L to LOAD the latest savegame.",
    end_win: "O.K. YOU HAVE OUTSMARTED EVEN THE WORST OF THE POLICE SCUM. YOU SAFELY ARRIVED AT THE AIRPORT AND TOOK A PLANE HOME. CONGRATULATIONS!!!!!!!!!!",
    end_win_restart: "Press R to RESTART",
}