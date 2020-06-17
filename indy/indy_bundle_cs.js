const bundle = {
    // =====
    // Items
    // =====
    item_diamonds_name: "diamanty",
    item_diamonds_desc: "Jsou to čtyři nádherné drahokamy.",
    item_diamonds_onDrop: "Jakmile jsi je položil, někdo je z oltáře ukradl.",
    item_diamonds_failState: "Bez diamantů hru nepůjde dohrát. Nahraj pozici příkazem LOAD nebo napiš RESTART a začni znovu.",

    item_cop1_name: "fízla",
    item_cop1_desc: "Chystá se zmlátit tě.",
    item_cop1_aliases: ["fizla"],

    item_corpse1_name: "mrtvolu fízla",
    item_corpse1_aliases: ["mrtvolu fizla"],
    item_corpse1_desc: "Má hluboko v hlavě zaseklou sekeru (dobrá práce)!",
    item_corpse1_desc_shield: "Našels' u něj štít.",

    item_shield_name: "štít",
    item_shield_aliases: ["stit"],
    item_shield_desc: "Je vhodně upraven proti padajícímu kamení.",
    item_shield_onUse: "O.K. Odrazil jsi kámen štítem.",

    item_stone_name: "kámen",
    item_stone_aliases: ["kamen"],
    item_stone_desc: "Není to obyčejný kámen, je to dlažební kostka.",
    item_stone_onUse: "O.K. Vrhnul jsi kámen napravo. Zprava (a to je pozoruhodné) jsi zaslechl výkřik.",

    item_tail_name: "ocas",
    item_tail_desc: "Je to ocas koně, na kterém sedí svatý Václav.",
    item_tail_onExamine: " Ve skulince pod ocasem jsi našel sekeru.",

    item_axe_name: "sekeru",
    item_axe_desc: "Do tupé policajtské hlavy by zajela jako po másle.",
    item_axe_onUse: "O.K. Zasekl jsi mu sekeru do hlavy tak hluboko, že nejde vytáhnout.",

    item_dictionary_name: "slovník",
    item_dictionary_aliases: ["slovnik"],
    item_dictionary_desc: "Podrobný česko-anglicky slovník.",
    item_dictionary_onUse: "O.K. Přeložil sis nápis na zdi. Cituji: Jakeš je vůl, KAREL.",

    item_writing_name: "nápis na zdi",
    item_writing_aliases: ["napis na zdi"],
    item_writing_desc: "Bez slovníku jej nerozluštíš.",

    item_gun_name: "pistoli",
    item_gun_desc: "Bohužel v ní nejsou náboje.",

    item_cop2_name: "poldu",
    item_cop2_desc: "Chystá se zmlátit tě.",

    item_corpse2_name: "mrtvolu policajta",
    item_corpse2_desc: "Byl nepochybně zasažen dlažební kostkou.",

    item_rod_name: "tyč",
    item_rod_aliases: ["tyc"],
    item_rod_desc: "Na ledacos by se hodila.",
    item_rod_onUse_cop2: "O.K. Vypáčil jsi poklop kanálu. Poklop spadnul do šachty. Polda se na tebe s řevem vrhnul, ale v okamžiku, kdy tě chtěl udeřit, zahučel přímo před tebou do kanálu.",
    item_rod_onUse_cop3: "O.K. Praštil jsi chlupatýho tyčí přes hlavu.",
    item_rod_onUse_throw: "O.K. Mrštil jsi tyčí nalevo a uslyšel jsi zasténání. Cha, cha, cha, cha.",

    item_cop3_name: "chlupatýho",
    item_cop3_aliases: ["chlupatyho"],
    item_cop3_desc: "Chystá se zmlátit tě.",

    item_corpse3_name: "mrtvolu chlupatýho",
    item_corpse3_aliases: ["mrtvolu chlupatyho"],
    item_corpse3_desc: "Někdo mu rozrazil tyči lebku (kdo asi?).",
    item_corpse3_desc_uniform: " Má na sobě uniformu.",

    item_uniform_name: "uniformu",
    item_uniform_desc: "Je to uniforma člena Veřejné bezpečnosti.",
    item_uniform_dress_action_name: "obleč",
    item_uniform_dress_action_aliases: ["oblec", "oblekni", "oblékni", "obleknout", "obléknout"],
    item_uniform_dress_action_perform: "O.K. Oblékl sis uniformu člena Veřejné bezpečnosti.",
    item_uniform_undress_action_name: "svleč",
    item_uniform_undress_action_aliases: ["svlec", "svlekni", "svlékni"],
    item_uniform_undress_action_perform: "O.K. Svlékl sis uniformu.",

    item_cop4_name: "člena VB",
    item_cop4_aliases: ["clena VB"],
    item_cop4_desc: "Kontroluje kolemjdoucí.",

    item_altar_name: "oltář",
    item_altar_aliases: ["oltar"],
    item_altar_desc: "Jako by ti něco říkalo: Polož sem diamanty.",

    item_tag_name: "cedulku",
    item_tag_desc: "Je na ní napsáno: 'A ven se dostane jen ten, kdo má čtyři magické diamanty.'",

    item_civilian_name: "civila",
    item_civilian_desc: "Je na něm vidět, že nemá v lásce komunisty.",

    item_cop5_name: "příslušníka",
    item_cop5_aliases: ["prislusnika"],
    item_cop5_desc: "Chystá se zmlátit tě.",

    item_civilian_corpse_name: "mrtvolu civila",
    item_civilian_corpse_desc: "Je ti velice podobný. Má u sebe legitimaci.",

    item_idcard_name: "legitimaci",
    item_idcard_desc: "Patří členu tajné policie, který je ti velice podobný.",

    item_militiaman_corpse_name: "mrtvolu milicionáře",
    item_militiaman_corpse_aliases: ["mrtvolu milicionare"],
    item_militiaman_corpse_desc: "Někdo po něm mrštil tyči. Hádám tak dle toho, že ji má zaraženou v hlavě.",

    item_spinach_name: "špenát",
    item_spinach_aliases: ["spenat"],
    item_spinach_desc: "Ještě je v záruční lhůtě.",
    item_spinach_onUse: "O.K. Snědl jsi špenát a hned se cítíš silnější, že bys mohl tyčí házet.",

    item_can_name: "plechovku",
    item_can_desc: "Je to dočista vylízaná plechovka od špenátu.",

    // =========
    // Locations
    // =========

    location_m1_desc: "O.K. Stojíš před domem potravin. Vchod do metra je naštěstí volný. Z balkónu v domě se pobaveně dívá nepříjemný člověk (zřejmě komunista) na poctivě odváděnou práci členů VB.",
    location_m1_hint: "Bude třeba se nějak prosekat dál.",
    location_m1_kill: "Fízl se na tebe krvežíznivě vrhnul a začal tě mlátit. A mlátil a mlátil...",

    location_m2_desc: "O.K. Jsi pod sochou svatého Václava. Vidíš zatarasený vchod do metra. Nahoře je muzeum, ale přístup k němu je zatarasený.",
    location_m2_hint: "Pořádně se rozhlédni kolem sebe.",

    location_m3_desc_ok: "O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe našel legitimaci člena tajné policie, popřál mnoho štěstí v další práci, lehce se uklonil a odešel (hlupák).",
    location_m3_desc_nok: "O.K. Stojíš u volného vstupu u metra. Jakmile ses ukázal, přiběhl policajt, prošacoval tě, a když u tebe nic nenašel, zavolal si na pomoc 'kamarády' a zmlátili tě do němoty.",
    location_m3_kill: "Když od tebe odbíhali na nějakou ženu s kočárkem, jednomu z nich vypadla z pouzdra mačeta. Doplazil ses pro ni a spáchals' HARAKIRI.",
    location_m3_hint: "Nic už ti nebrání vydat se na cestu.",

    location_m4_desc: "O.K. Stojíš u prodejny Supraphon. Než ses však stačil rozhlédnout, pokropila tě sprška vodního děla.",
    location_m4_kill: "Spadl jsi na zem a rozbil sis hlavu.",

    location_m5_desc: "O.K. Ulevuješ si mezi kytičky ve velkém květináči.",
    location_m5_hint: "Jeden z policajtů jistě bude mít něco, čím jde kámen odrazit. S takovým kamenem pak jde zasáhnout i celkem vzdálený cíl.",
    location_m5_kill: "Kámen se přibližuje víc a víc. Pořád se zvětšuje a zvětšuje a zvětšuje a zvětšu-",
    location_m5_stone: ", který padá na tebe,",

    location_m6_desc: "O.K. Nacházíš se u domu módy v ústí do zatarasené Krakovské ulice.",
    location_m6_hint: "Tenhle policajt už ti k ničemu nebude.",
    location_m6_kill: "Vidíš policajta. Na tváři, která se k tobě víc a více přibližuje, je vidět, že je to maniak. Už mu neunikneš.",

    location_m7_desc: "O.K. Stojíš před prodejnou knihy. Není nic slyšet, protože veliký dav tu skanduje heslo 'AŤ ŽIJE KAREL!' Vlevo je zatarasený vchod do Opletalky.",
    location_m7_hint: "Václavák není místo, kde by tě pomohla pistole.",

    location_m8_desc: "O.K. Stojíš mezi patníky u kanálu. Není tu nic zvláštního. Dole jsou zátarasy.",
    location_m8_hint: "Nemohl by ti pomoct kanál?",
    location_m8_kill: "Jakmile tě polda zmerčil, vrhnul se na tebe. Nevzmohl jsi se ani na obranu. Chudáku.",

    location_m9_desc: "O.K. Stojíš pod lešením. Dole jsou zátarasy. Slyšíš tichý, leč podezřelý tikot. Vidíš do ústí zatarasené ulice Ve Smečkách.",
    location_m9_desc_exploded: "O.K. Balancuješ na kraji obrovského kráteru. Na dně vidíš ceduli 'Dům módy'.",
    location_m9_hint: "Slyšíš ten tikot? Seber, co jde, a rychle pryč!",
    location_m9_kill: "Neudržels' však rovnováhu a padáš dolů.",
    location_m9_bomb_kill: "Zahlédl jsi záblesk, po kterém následuje ohromný výbuch. Než tě zasáhla střepina, došlo ti,co znamenal ten tikot.",
    location_m9_bomb_exploded: "Místo, ze kterého jsi právě vyšel, vyletělo do povětří. Tys měl ale štěstí.",
    location_m9_bomb_failState: "Nahraj pozici příkazem LOAD nebo napiš RESTART a začni znovu.",

    location_m10_desc: "O.K. Nacházíš se před LUXOL CLUBEM. Vedle je kino Jalta. Dole vidíš zátarasy.",
    location_m10_hint: "Některé předměty ti pomůžou víckrát. A pak nezapomeň, že šaty dělají člověka!",
    location_m10_enter_ok: "Najednou se na tebe vrhnul chlupatej, a když u tebe nic nenašel, zklamaně odešel.",
    location_m10_enter_kill: "Najednou se na tebe vrhnul chlupatej. Prošacoval tě, a když u tebe našel pistoli, odprásknul tě.",
    location_m10_kill: "Policajta naštvalo, že u tebe nenašel, co hledal, a vrhnul se na tebe.",

    location_m11_desc: "O.K. Jsi v křoví.",
    location_m11_hint: "Někdo má uniformy rád, jiný zase nerad.",
    location_m11_kill: "Vrhnul se na tebe člen VB a odtáhnul tě do antona. Sedí tu pár milých tváří s železnými tyčemi v rukách. Začali si s tebou hrát.",

    location_m12_desc: "O.K. Stojíš před bankou. Nahoře jsou zátarasy.",
    location_m12_hint: "Cedulka nelže!",

    location_m13_desc: "O.K. Jsi před grandhotelem EVROPA. Zahlédl jsi však videokameru zamířenou přímo na tebe.",
    location_m13_kill: "Uznal jsi, že veškerý odpor je marný a spáchal jsi sebevraždu.",

    location_m14_desc: "O.K. Sedíš na lavičce. (Už nemůžeš, co?) Kolem ucha ti hvízdla kulka. Nahoře jsou zátarasy.",
    location_m14_desc_cops: " Blíží se k tobě řada policajtů.",
    location_m14_hint: "Některému nebezpečí se stačí jen uhnout.",
    location_m14_kill: "Řada policajtů se přiblížila až k tobě. Než jsi stačil vstát, pustili se do tebe obušky.",

    location_m15_desc: "O.K. Stojíš pod lešením. Napravo je ústí do zatarasené Štěpánské ulice. Dole jsou také zátarasy.",
    location_m15_hint: "Kdo má málo místa v kapsách, musí se často převlékat!",
    location_m15_kill: "Vrhnul se na tebe civilní občan pod dojmem, že jsi člen VB. Máš totiž ještě oblečenou uniformu.",

    location_m16_desc: "O.K. Ležíš před obchodním domem DRUŽBA. Praštil tě totiž příslušník. Vchod do metra je zatarasen. Dole za zátarasy je tramvajové koleje.",
    location_m16_hint: "Neber úplatky - dávej je!",
    location_m16_kill: "Příslušník se na tebe vrhnul a zmlátil tě.",
    location_m16_cop_left: "Příslušník správně pochopil a diskrétně odešel.",

    location_m17_desc_unexplored: "O.K. Sedíš v květináči mezi kytičkami a nadává ti milicionář. Cituji: 'Jestli tě tu uvidím ještě jednou, tak uvidíš.'",
    location_m17_desc_explored_ok: "O.K. Sedíš v květináči mezi kytičkami.",
    location_m17_desc_explored_nok: "O.K. Sedíš v květináči mezi kytičkami a nadává ti milicionář. Cituji: 'Já tě upozorňoval, ty hajzle.'",
    location_m17_kill: "Když se vypovídal, vrhnul se na tebe.",
    location_m17_hint: "Milicionář to myslí vážně!",

    location_m18_desc: "O.K. Stojíš u zataraseného vchodu do metra. Dole a nahoře jsou zátarasy.",
    location_m18_hint: "Na hod do dálky se budeš potřebovat posilnit.",

    location_m19_desc: "O.K. Dostal ses do metra. Všude je tu rozšířen slzný plyn.",
    location_m19_kill: "Je ho tu tolik, že ses udusil.",

    // =======
    // Actions
    // =======

    exit_up: "nahoru",
    exit_up_aliases: ["n"],
    exit_down: "dolů",
    exit_down_aliases: ["dolu", "d"],
    exit_right: "doprava",
    exit_right_aliases: ["vpravo", "p"],
    exit_left: "doleva",
    exit_left_aliases: ["vlevo", "l"],
    exit_inside: "dovnitř",
    exit_inside_aliases: ["dovnitr"],

    action_explore: "prozkoumej",
    action_explore_aliases: ["prozkoumat"],

    action_use: "použij",
    action_use_aliases: ["pouzij", "pouzit", "použít"],

    action_drop: "polož",
    action_drop_aliases: ["poloz", "polozit", "položit", "zahodit", "zahoď"],
    action_drop_success: "Položil jsi ",
    action_drop_fail: "Tohle nejde položit.",

    action_take: "vezmi",
    action_take_aliases: ["seber", "vzít", "vzit", "vem"],
    action_take_success: "Vzal jsi ",
    action_take_fail: "Tohle nejde vzít.",

    action_inventory: "inventář",
    action_inventory_aliases: ["věci", "veci", "i"],
    action_inventory_start: "Máš u sebe ",
    action_inventory_end: " a víc už ani >p<.",
    action_inventory_empty: "Máš u sebe hovno.",

    action_dict: "slovník",
    action_dict_aliases: ["slovnik", "akce"],
    action_dict_prefix: "Můžeš zadat příkazy: ",
    action_dict_list: "Můžeš zadat následující příkazy: PROZKOUMEJ, POUŽIJ, POLOŽ, VEZMI, OBLEČ, SVLEČ, INVENTÁŘ, DOLŮ, NAHORU, DOLEVA, DOPRAVA, DOVNITŘ, POMOC, SLOVNÍK, ALIASY PRO, SAVE, LOAD, RESTART."
    
    action_help: "pomoc",
    action_help_aliases: ["help"],

    action_aliases: "aliasy pro",
    action_aliases_none: "žádné",

    // ======
    // Global
    // ======

    snd_beep_path: "snd/beep.wav",
    save_position_prefix: "indy",

    // List of replacement objects - if the command starts with a value, the value is replaced with replacement
    command_start_replacements: [
        {
            match: ["jdi na ", "jit na ", "jít na ", "jdi ", "jit ", "jít "],
            value: ""
        }
    ],

    conjunction_and: " a ",

    start_hint: 'Zadej příkaz. Například "prozkoumej ocas". Pro automatické doplnění příkazu zkus klávesu TAB.',

    // Controls
    controls_autocomplete: "Speciální klávesa - doplň příkaz",
    controls_history_old: "Speciální klávesa - starší příkazy z historie",
    controls_history_new: "Speciální klávesa - novější příkazy z historie",
    controls_save: "Příkaz - ulož hru",
    controls_load: "Příkaz - nahraj hru",

    // Messages
    messages_locationItems: "Vidíš",
    messages_locationExits: "Můžeš jít",
    messages_unknownCommand: "To bohužel nejde!!!",
    messages_multipleActionsMatch: "Vstupu odpovídá více příkazů: ",
    messages_inputHelpPrefix: "Pokračuj: ",
    messages_gameSaved: "Hra uložena.",
    messages_gameLoaded: "Uložená pozice nahrána.",
    messages_gamePositions: "Uložené pozice: ",
    messages_gamePositionsEmpty: "Nemáš žádnou uloženou pozici.",
    messages_gamePositionDoesNotExist: "Nelze nahrát pozici: ",
    messages_inventoryFull: "Víc už toho neuneseš!",

    // Intro
    intro_img_title_path: "img/title.png",

    intro_enter: "Stiskni klávesu ENTER",
    intro_text1_a: "DOBRODRUŽSTVÍ INDIANA JONESE",
    intro_text1_b: "NA VÁCLAVSKÉM NÁMĚSTÍ",
    intro_text1_c: "V PRAZE",
    intro_text1_d: "DNE 16.1. 1989",

    intro_text1: "Jste Indiana Jones a vaším úkolem je dostat se do vaší rodné země, do Ameriky. Jste totiž na Václavském náměstí pod sochou svatého Václava. Je 16. 1. 1989.",
    intro_text2: "Tato hra je určena pro pokročilejší hráče textových her.",
    intro_textAdd: "S úctou",
    intro_textAdd1: "Zuzan Znovuzrozený",
    intro_textAdd2: "Ztracená bez čísla",
    intro_textAdd3: "Zapadákov City",
    intro_textAdd4: "TRAMTÁRIE",
    intro_textPhone: "Telefon: 16 1 1989",
    intro_textMilos: "BIJTE MILOŠE !!!",

    end_killed1: "INDIANA JONES JE MRTEV!",
    end_killed2: "ZPRÁVA Z AMERICKÉHO TISKU: Československá vláda oznámila, že náš drahý hrdina - INDIANA JONES - zemřel nešťastnou náhodou při autonehodě. Pokrač. na str. 54.",
    end_killed3: "Stiskni klávesu R pro RESTART nebo L a nahraje se poslední uložená pozice.",
    end_win: "O.K. OBELSTIL JSI I TU NEJVĚTŠÍ FÍZLOVSKOU SVINI. ŠTASTNĚ JSI SE DOSTAL NA LETIŠTĚ A ODLETĚL DOMŮ. GRATULUJI K VÍTĚZSTVÍ!!!!!!!!!!",
    end_win_restart: "Stiskni klávesu R pro RESTART",
}