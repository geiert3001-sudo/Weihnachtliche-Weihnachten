# 🎄 Weihnachts-Millionenquiz

Ein komplett spielbares, deutschsprachiges Weihnachts-Familienquiz im Stil einer großen TV-Quizshow – mit **3 Teams, einer Reaktions-Einstiegsfrage, 45 Quizfragen, Jokern, wachsenden Weihnachtsgeschenken, einer witzigen Quizkatze und einem original erstellten Video-Abspann**.

## Sofort spielen

1. Die ZIP-Datei entpacken.
2. `index.html` doppelklicken – funktioniert ohne Webserver und auch offline.
3. Auf **„Spielshow starten“** klicken.
4. Bei der Einstiegsfrage gleichzeitig die zugewiesenen Tasten nutzen (oder die Touch-Schaltflächen). **Die erste richtige Antwort** entscheidet, wer beginnt.
5. Danach spielt jedes Team **seine eigenen 15 Fragen**. Eine falsche Antwort beendet die Runde nicht – weiterprobieren, bis alle 15 Fragen richtig beantwortet sind.
6. Bei jeder richtigen Antwort wird das Geschenk größer. Nach der dritten Runde segelt **Käpt’n Keks** im Video-Abspann davon.

## Teams und Fragen

| Team | Quiz | Schwerpunkte | Tasten in der Einstiegsfrage |
|---|---|---|---|
| Opa | Quiz 3 | DDR, Bad Saarow, A-ROSA SILVA, Lied, Pizza, Weltraum, Allgemeinwissen | **1 2 3 4** |
| Emilie & Alex | Quiz 1 | Informatik, KI, Europa-Pflanzen, Mustang, Aschenbrödel, Kartenspiele | **Q W E R** |
| Mama & Fred | Quiz 2 | Fotografie, Tischlerei, Uganda, Deutschland, General Sherman Tree, Mathe | **A S D F** |

Die vier Tasten einer Reihe stehen für **Antwort A, B, C, D**. Im eigentlichen Quiz kann man immer **A / B / C / D** für die Antworten nutzen und mit **Enter** nach einer richtigen Antwort fortfahren.

## Spielregeln

- **Einstiegsfrage:** eine gemeinsame Blitzfrage, erster korrekter Tastendruck gewinnt. Bei einer falschen Antwort gibt es 1,2 Sekunden Sperrzeit für das betreffende Team.
- **Reihenfolge:** Gewinner zuerst, die anderen Teams danach in der Reihenfolge Opa → Emilie & Alex → Mama & Fred (ohne den Gewinner).
- **45 Fragen:** jedes Team erhält genau 15 eigene Fragen mit vier Antwortmöglichkeiten.
- **Keine Ausscheidung:** falsch geratene Antwortmöglichkeiten werden gesperrt. Man darf so oft erneut antworten, bis die richtige Antwort gefunden ist.
- **Geschenke:** bei jeder richtig beantworteten Frage steigt das Geschenke-Level um 1, insgesamt auf Level 15 pro Team.
- **Joker:** pro Team einmal 50:50, fiktives Publikum und Katzenjoker. Publikumsstimmen sind ausdrücklich simuliert und kein echter Vote.
- **Preisleiter:** 50 € bis 1.000.000 € – reine Spielpunkte, natürlich kein echtes Geld.
- **Fortschritt:** wird automatisch im Browser auf diesem Gerät gespeichert (localStorage). Oben rechts kann der Spielstand zurückgesetzt werden.
- **Ton:** oben rechts an-/ausschalten; animierter Abspann mit selbst erstellter Musik.

## Auf GitHub Pages veröffentlichen

1. Neues GitHub-Repository erstellen, z. B. `weihnachts-millionenquiz`.
2. **Den Inhalt des entpackten Ordners** (insbesondere `index.html`, `js`, `css`, `assets`) ins Root-Verzeichnis des Repositorys hochladen und committen.
3. Unter **Settings → Pages → Build and deployment** die Option **Deploy from a branch** auswählen.
4. Als Branch `main` und Ordner `/ (root)` einstellen und speichern.
5. GitHub stellt anschließend eine URL nach dem Muster `https://DEIN-NAME.github.io/weihnachts-millionenquiz/` bereit.

Es ist **kein npm, Backend, Build-Schritt, Konto oder API-Schlüssel** nötig. Alle App-Dateien sind relativ verlinkt und laufen sowohl lokal als auch unter einem GitHub-Pages-Projektpfad.

## Anpassungen

- `questions.js`: alle 45 Fragen, Antworten, Erklärungen, Teamnamen und Preisstufen.
- `app.js`: Spiellogik, Einstiegsfrage, Joker, Fortschritt, Katze, Animationen.
- `styles.css`: visuelle Gestaltung und Responsive-Layout.
- `katze-segelt-davon.mp4`: originaler 8-Sekunden-Abspann mit Katze auf einem weihnachtlichen Schiff.

## Quellenhinweise zu ausgewählten Spezialfragen

Die Fragen wurden für dieses Spiel zusammengestellt. Diese Onlinequellen erlauben das Nachprüfen besonders spezifischer Antworten:

- A-ROSA SILVA – **186 Gäste**: https://www.a-rosa.de/a-rosa-flotte/schiff/a-rosa-silva.html
- General Sherman – **Sequoia National Park**: https://www.nps.gov/seki/learn/nature/sherman.htm
- Sigmund Jähn – Hinflug **Sojus 31**: https://www.esa.int/Space_in_Member_States/Germany/Biografie_von_Sigmund_Jaehn
- Max Schmeling / Anny Ondra – Heirat **1933 in Bad Saarow**: https://www.max-schmeling-stiftung.de/max-schmeling/der-ehemann
- X. Weltfestspiele **1973 in Ost-Berlin**: https://www.bundesarchiv.de/themen-entdecken/online-entdecken/themenbeitraege/die-welt-zu-gast-hinter-der-mauer/
- „Sail Along, Silv'ry Moon“ – **Percy Wenrich und Harry Tobias**: https://en.wikipedia.org/wiki/Sail_Along%2C_Silv%27ry_Moon
- Historischer Ausdruck „Berliner Riviera“ **für die Region am Scharmützelsee**: ein Zeitungstext aus 1911 belegt diese Bezeichnung bereits früh: https://kpbc.umk.pl/Content/166229/PDF/KM_01427_1911_I_131.pdf

Die Fragen basieren überwiegend auf der zuvor gemeinsam zusammengestellten Version. Für **Opa** wurden die vier besonders leichten Anfangsfragen und eine spätere Frage zugunsten von mehr allgemeinem Wissen und Pizza verändert. 

## Technik / Hinweise

- Statisches HTML, CSS und Vanilla JavaScript.
- Keine Tracking-Skripte, kein Backend, keine externen JavaScript-Bibliotheken.
- Optional werden Google Fonts geladen; ohne Internet erscheinen automatisch lokale Systemschriften.
- Die selbst erstellten Katzenillustrationen und der Video-Abspann sind als Dateien enthalten.
- Keine offiziellen Grafiken oder Audiodateien einer Fernsehproduktion werden verwendet.

Frohe Weihnachten und viel Spaß! 🎁
