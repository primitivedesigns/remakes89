# P.R.E.S.T.A.V.B.A. PKUS

## Jak hrát textovku

Textovky (někdy také nazývané "interaktivní fikce") popisují herní svět pomocí psaného textu. V každé lokaci v rámci herního světa si můžete přečíst její popis, seznam věcí, které vaše postava vidí, a seznam možných východů. Tyto hry se zpravidla ovládají pomocí psaných příkazů, které jsou adresované hlavní postavě hry. Příkazy se píšou na klávesnici a odesílají se klávesou Enter - připomínají tedy příkazovou řádku ve starších i současných operačních systémech. Československé textovky z 80. let dovolovaly psát jednoduché příkazy skládající se ze slovesa a předmětu, jako například:

    PROZKOUMEJ POKLOP
    VEZMI KLÍČ

Naše verze textovek dovolují psát příkazy s diakritikou i bez, a dokonce i zkracovat příkazy na tři první písmena. Výše uvedené příkazy tedy můžete napsat i jako:

    PRO POK
    VEZ KLI

Mezi místnostmi se pohybujete pomocí slov nebo písmen označujících směr, kterým se chcete vydat, jako například:

    SEVER (nebo S)
    DOLŮ (nebo D)

/////////////////PRIDAT SAVE/LOAD

Seznam všech dovolených sloves můžete vypsat příkazem "SLOVNÍK".
Pokud si nevíte rady, příkaz "POMOC" zobrazí nápovědu k dané místnosti. V originálních verzích her však tato nápověda nebyla, přidali jsme ji až do současných remaků.

## O hře P.R.E.S.T.A.V.B.A.

Hru naprogramoval v roce 1988 Miroslav Fídler z Prahy 6, známý pod značkou Cybexlab Software. V roce 1988 byl jedním z nejznámějších a nejrespektovanějších československých herních tvůrců. Hru P.R.E.S.T.A.V.B.A. však vydal pod pseudonymem ÚV Software coby „naivní formu protestu“ a jeho autorství vyšlo najevo až po roce 1989. Hra je ironicky dedikována „20. výročí osvobození Československa spojeneckými armádami“, ale ze samotné hry je jasné, že toto věnování je zamýšleno satiricky. Cílem hry je vyhodit do povětří sochu Lenina v bezejmenném československém městě. Původní verze vyšla pro počítače kompatibilní se standardem ZX Spectrum, později ji neznámý programátor (nikoli však Fídler) převedl na osmibitový počítač Atari. Podobně jako většina her v tehdejším Československu se i P.R.E.S.T.A.V.B.A. šířila kopírováním z kazety na kazetu mezi přáteli a známými.

## Jak jsme hru rekonstruovali

Hru jsme přepsali ze zdrojové kódu v programovacím jazyce ZX Spectrum BASIC do JavaScriptu. Veškeré texty jsou původní, pouze s přidanou diakritikou a případnou opravou překlepů. Hádanky a jednotlivé herní mechaniky jsme se snažili co nejvěrněji reprodukovat.
Oproti původní verzi jsou však v našem remaku i následující změny:

- Úvodní obrázek byl nakreslen pro potřeby remaku ve formátu odpovídajícím grafice původní platformy (ZX Spectrum). Původní verze žádný obrázek neměla.
- Remake umožňuje použití některých synonym (SEBER místo VEZMI apod.)
- Remake obsahuje nápovědy (POMOC), které nebyly v původní hře přítomny.
- Remake umožňuje uložit a nahrát pozici ve hře (SAVE a LOAD).
- Remake používá čitelnější font a velmi lehce mění interface hry.
- Interface remaku umožňuje opakovat příkazy pomocí šipek nahoru a dolů, případně klávesy TAB.

## Často kladené otázky (FAQ)
