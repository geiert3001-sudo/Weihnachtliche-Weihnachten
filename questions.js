/* Original question set for the Christmas family quiz. No external dependencies. */
(function () {
  'use strict';
  const q = (text, options, correct, fact) => ({ text, options, correct, fact });
  window.QUIZ_DATA = Object.freeze({
    prizes: [50, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 500000, 1000000],
    teams: [
      { id: 'opa', name: 'Opa', icon: '🎩', tagline: 'Der Mann. Der Mythos. Der Quiz-Sessel.', color: '#e4b464', category: 'DDR, Geschichte, Musik & Allgemeinwissen' },
      { id: 'emilie', name: 'Emilie & Alex', icon: '✨', tagline: 'Doppeltes Gehirn, doppelter Nervenkitzel.', color: '#a4a6ff', category: 'Technik, Natur, Film & Kartenspiele' },
      { id: 'mama', name: 'Mama & Fred', icon: '🎄', tagline: 'Zwei Köpfe, ein Millionen-Geschenk.', color: '#86d9bf', category: 'Fotografie, Handwerk, Uganda & Mathe' }
    ],
    estimates: [
      { text: 'Wie viele Kilometer beträgt die durchschnittliche Entfernung zwischen Erde und Mond ungefähr?', answer: 384400, unit: 'km', fact: 'Im Mittel sind es rund 384.400 Kilometer. Die tatsächliche Entfernung schwankt.' },
      { text: 'Wie viele einzelne Felder hat ein klassisches Monopoly-Spielbrett insgesamt?', answer: 40, unit: 'Felder', fact: 'Das klassische Monopoly-Spielbrett hat 40 Felder – einschließlich der vier Eckfelder.' }
    ],
    quizzes: {
      emilie: [
        q('Auf welches Datum fällt in Deutschland Heiligabend?', ['23. Dezember', '25. Dezember', '24. Dezember', '26. Dezember'], 2, 'Heiligabend wird am 24. Dezember gefeiert.'),
        q('Welcher Bestandteil ist für klassisches Marzipan besonders charakteristisch?', ['Walnüsse', 'Mandeln', 'Kokosnüsse', 'Pistazien'], 1, 'Marzipan besteht im Wesentlichen aus gemahlenen Mandeln und Zucker.'),
        q('Wofür steht die Abkürzung WWW im Internet?', ['World Wide Web', 'World Wireless Window', 'Web Wide World', 'Worldwide Wireless Web'], 0, 'Das World Wide Web ist ein Informationssystem aus über Links verbundenen Webseiten.'),
        q('Welcher dieser in Europa heimischen Nadelbäume verliert im Herbst normalerweise seine Nadeln?', ['Waldkiefer', 'Gemeine Fichte', 'Europäische Eibe', 'Europäische Lärche'], 3, 'Die Europäische Lärche färbt ihre Nadeln goldgelb und wirft sie im Herbst ab.'),
        q('Was versteht man in der Informatik unter „Machine Learning“?', ['Die mechanische Reparatur von Computern', 'Das Erkennen von Mustern durch Lernen aus Daten', 'Das manuelle Programmieren jeder einzelnen Entscheidung', 'Das Speichern von Daten auf einem USB-Stick'], 1, 'Beim maschinellen Lernen verbessern Modelle ihre Leistung anhand von Beispieldaten.'),
        q('In welcher amerikanischen Stadt wurde der Ford Mustang im April 1964 auf einer Weltausstellung offiziell der Öffentlichkeit vorgestellt?', ['Chicago', 'Detroit', 'New York', 'San Francisco'], 2, 'Der Ford Mustang wurde 1964 auf der New Yorker Weltausstellung vorgestellt.'),
        q('Welches deutsche Schloss diente als wichtiger Drehort für „Drei Haselnüsse für Aschenbrödel“ (1973)?', ['Schloss Moritzburg', 'Schloss Heidelberg', 'Schloss Neuschwanstein', 'Schloss Sanssouci'], 0, 'Die winterlichen Außenaufnahmen entstanden unter anderem am sächsischen Schloss Moritzburg.'),
        q('Von welcher Baumart wird der größte Teil des weltweit gehandelten Naturkorks gewonnen?', ['Olivenbaum', 'Korkeiche', 'Mittelmeer-Zypresse', 'Pinie'], 1, 'Naturkork stammt aus der Rinde der Korkeiche, die vor allem im Mittelmeerraum wächst.'),
        q('Welcher Dezimalzahl entspricht die Binärzahl 1011?', ['9', '10', '11', '12'], 2, '1011₂ = 8 + 0 + 2 + 1 = 11₁₀.'),
        q('Was bezeichnet man bei generativer künstlicher Intelligenz als „Halluzination“?', ['Eine automatisch erstellte Datensicherung', 'Die bewusste Verschlüsselung einer Antwort', 'Die Erzeugung einer plausibel wirkenden, aber erfundenen Information', 'Eine Überhitzung der Grafikkarte'], 2, 'Auch selbstsicher formulierte KI-Ausgaben können sachlich falsch sein.'),
        q('Welcher chemische Stoff ist ein Hauptbestandteil von gewöhnlichem Fensterglas?', ['Natriumchlorid', 'Kalziumkarbonat', 'Reiner Kohlenstoff', 'Siliziumdioxid'], 3, 'Fensterglas ist in der Regel Kalk-Natron-Glas mit Siliziumdioxid als Hauptbestandteil.'),
        q('Welche Pokerhand steht in der üblichen Rangfolge unmittelbar über einem Full House?', ['Flush', 'Straße', 'Vierling', 'Drilling'], 2, 'Der Vierling (Four of a Kind) schlägt ein Full House.'),
        q('Welche Farbe des sichtbaren Lichts hat die kürzeste Wellenlänge?', ['Rot', 'Gelb', 'Grün', 'Violett'], 3, 'Violettes Licht liegt am kurzwelligen Ende des sichtbaren Spektrums.'),
        q('Welcher Informatik-Algorithmus dient dazu, in einem gewichteten Graphen ohne negative Kantengewichte kürzeste Wege zu bestimmen?', ['Dijkstra-Algorithmus', 'Caesar-Verfahren', 'Quicksort', 'RSA-Verfahren'], 0, 'Dijkstra findet von einem Startknoten aus kürzeste Wege bei nichtnegativen Kantengewichten.'),
        q('Wie viele unterschiedliche Pokerhände aus genau fünf Karten lassen sich aus einem normalen Kartenspiel mit 52 Karten bilden, wenn die Reihenfolge keine Rolle spielt?', ['52.000', '2.598.960', '311.875.200', '5.200.000'], 1, 'Es sind 52 über 5 Kombinationen: 52! / (5! × 47!) = 2.598.960.')
      ],
      mama: [
        q('Wie viele Grad hat ein rechter Winkel?', ['90 Grad', '45 Grad', '180 Grad', '60 Grad'], 0, 'Ein rechter Winkel misst genau 90 Grad.'),
        q('Wie bezeichnet man in der Fotografie das Gegenteil des Hochformats?', ['Hochglanzformat', 'Panoramaformat', 'Querformat', 'Makroformat'], 2, 'Querformat: Das Bild ist breiter als hoch.'),
        q('Welcher in Deutschland heimische Baum trägt die Früchte, die als Bucheckern bezeichnet werden?', ['Gemeine Fichte', 'Stieleiche', 'Rotbuche', 'Hängebirke'], 2, 'Bucheckern sind die Nussfrüchte der Rotbuche.'),
        q('Was bezeichnet ein Tischler als „Furnier“?', ['Eine spezielle Holzsorte, die nur in Tropenwäldern wächst', 'Eine Verbindungstechnik mit Nägeln', 'Eine Dämmplatte aus gepresstem Kunststoff', 'Ein dünnes Holzblatt zur Veredelung von Oberflächen'], 3, 'Furniere sind dünne Holzblätter, die auf Trägermaterial aufgebracht werden.'),
        q('Welche Verbindung nehmen grüne Pflanzen bei der Fotosynthese aus der Luft auf, um daraus organische Stoffe aufzubauen?', ['Stickstoff', 'Sauerstoff', 'Kohlenstoffdioxid', 'Methan'], 2, 'Pflanzen nehmen Kohlenstoffdioxid auf und wandeln dessen Kohlenstoff in organische Stoffe um.'),
        q('Welche Kameraeinstellung bestimmt, wie lange Licht auf den Bildsensor trifft?', ['Brennweite', 'ISO-Wert', 'Weißabgleich', 'Belichtungszeit'], 3, 'Die Belichtungszeit legt die Dauer fest, für die Licht auf den Sensor fällt.'),
        q('In welchem Nationalpark Kaliforniens steht der „General Sherman Tree“, der nach Stammvolumen größte lebende Einzelbaum der Erde?', ['Yellowstone-Nationalpark', 'Yosemite-Nationalpark', 'Sequoia-Nationalpark', 'Redwood-Nationalpark'], 2, 'Der General Sherman Tree steht im Sequoia-Nationalpark.'),
        q('Aus welcher Pflanze wird in Uganda das traditionelle Gericht „Matoke“ hauptsächlich zubereitet?', ['Bambus', 'Kochbananen', 'Vanilleschoten', 'Avocados'], 1, 'Matoke bezeichnet eine stärkehaltige Kochbanane und ein daraus zubereitetes Gericht.'),
        q('Ein Tischler baut einen rechteckigen Bilderrahmen. In welchem Winkel werden die Leisten bei einer klassischen Gehrungsverbindung an jeder Ecke zugeschnitten?', ['45 Grad', '30 Grad', '60 Grad', '90 Grad'], 0, 'Zwei Gehrungen zu je 45° ergeben gemeinsam den 90°-Winkel.'),
        q('Drei normale Würfel werden gleichzeitig geworfen. Wie hoch ist die Wahrscheinlichkeit, dass alle drei Würfel eine Sechs zeigen?', ['1 zu 36', '1 zu 216', '1 zu 18', '1 zu 108'], 1, 'Die Würfel sind unabhängig: (1/6)³ = 1/216.'),
        q('Welche Auswirkung hat bei einem Porträtfoto eine Blende von f/1,8 gegenüber f/8, wenn Brennweite, Fokusabstand und Sensorgröße unverändert bleiben?', ['Das Bild wird bei gleicher Belichtungszeit dunkler', 'Die Schärfentiefe wird geringer', 'Der Bildwinkel wird größer', 'Die Kamera erhält automatisch eine höhere Auflösung'], 1, 'Eine weiter geöffnete Blende ergibt typischerweise eine geringere Schärfentiefe.'),
        q('Wie groß ist die Quadratwurzel aus der Zahl 2025?', ['35', '40', '45', '55'], 2, '45 × 45 = 2025.'),
        q('Eine Digitalkamera nimmt ein Foto mit 6.000 × 4.000 Pixeln auf. Wie viele Megapixel hat dieses Bild ungefähr?', ['10 Megapixel', '16 Megapixel', '20 Megapixel', '24 Megapixel'], 3, '6.000 × 4.000 = 24.000.000 Pixel = 24 Megapixel.'),
        q('Bei einem Fotoshooting wird die Verschlusszeit von 1/125 Sekunde auf 1/500 Sekunde verkürzt. Um wie viele volle Belichtungsstufen reduziert sich dadurch die Lichtmenge, wenn alle anderen Einstellungen gleich bleiben?', ['Eine Stufe', 'Zwei Stufen', 'Drei Stufen', 'Vier Stufen'], 1, '1/125 → 1/250 → 1/500: zweimal halbiertes Licht, also zwei Stufen.'),
        q('Welches charakteristische Lichtmuster kennzeichnet die sogenannte Rembrandt-Beleuchtung bei einem professionellen Porträt-Fotoshooting?', ['Ein kreisförmiger Lichtreflex auf der Stirn', 'Ein heller Lichtkranz, der die gesamte Haarpartie umgibt', 'Ein kleines beleuchtetes Dreieck auf der im Schatten liegenden Wange', 'Zwei gleichmäßige Schatten direkt unter dem Kinn'], 2, 'Die typische Rembrandt-Lichtführung erzeugt ein kleines Lichtdreieck auf der Schattenwange.')
      ],
      opa: [
        q('Wie viele Kerzen hat ein klassischer Adventskranz?', ['Eine', 'Zwei', 'Vier', 'Sieben'], 2, 'Der klassische Adventskranz hat für jeden Adventssonntag eine Kerze.'),
        q('Welche Käsesorte gehört traditionell auf eine Pizza Margherita?', ['Mozzarella', 'Gouda', 'Feta', 'Cheddar'], 0, 'Bei der klassischen Margherita gehören Tomate, Mozzarella und Basilikum zusammen.'),
        q('Welches Fahrzeug wurde in der DDR liebevoll „Trabi“ genannt?', ['Wartburg 353', 'Barkas B1000', 'Trabant', 'Robur LO'], 2, 'Der Trabant war eines der bekanntesten Fahrzeuge der DDR.'),
        q('Welche italienische Stadt gilt als Heimat der Pizza Margherita?', ['Rom', 'Neapel', 'Turin', 'Mailand'], 1, 'Die Pizza Margherita ist eng mit der neapolitanischen Pizzatradition verbunden.'),
        q('Was konnte man in den „Intershops“ der DDR vor allem kaufen?', ['Begehrte Westwaren gegen Devisen beziehungsweise Forumschecks', 'Ausschließlich Lebensmittel gegen DDR-Mark', 'Landwirtschaftliche Maschinen für Bauern', 'Briefmarken und staatliche Urkunden'], 0, 'Intershops boten viele Westprodukte gegen konvertierbare Währung bzw. spezielle Schecks an.'),
        q('Welche beliebte Fernsehfigur brachte Kindern im DDR-Fernsehen regelmäßig eine Gute-Nacht-Geschichte?', ['Pittiplatsch als alleiniger Moderator aller Abendgeschichten', 'Das Sandmännchen', 'Meister Nadelöhr', 'Herr Fuchs als Nachrichtensprecher'], 1, 'Das Ost-Sandmännchen wurde erstmals 1959 ausgestrahlt.'),
        q('Welches traditionelle Weihnachtsgebäck ist besonders eng mit der sächsischen Stadt Dresden verbunden?', ['Aachener Printen', 'Nürnberger Lebkuchen', 'Frankfurter Bethmännchen', 'Christstollen'], 3, 'Der Dresdner Christstollen ist eine bekannte Spezialität aus Sachsen.'),
        q('Wofür stand die Abkürzung „HO“, die man in der DDR häufig an Geschäften und Gaststätten lesen konnte?', ['Handelsorganisation', 'Heimatorganisation Ost', 'Handelsoberaufsicht', 'Haushaltsordnung'], 0, 'Die HO war eine staatliche Handelsorganisation der DDR.'),
        q('Welche Handwerkskunst wurde 2017 von der UNESCO als immaterielles Kulturerbe anerkannt?', ['Das Backen der Chicago-Deep-Dish-Pizza', 'Die Kunst des neapolitanischen Pizzaiuolo', 'Die Herstellung römischer Tiefkühlpizza', 'Der Bau italienischer Steinöfen'], 1, '2017 wurde die Kunst des neapolitanischen Pizzaiuolo in die UNESCO-Liste aufgenommen.'),
        q('Welcher berühmte deutsche Boxer heiratete 1933 in Bad Saarow die Schauspielerin Anny Ondra?', ['Max Schmeling', 'Joe Louis', 'Jack Dempsey', 'Max Baer'], 0, 'Max Schmeling und Anny Ondra heirateten im Juli 1933 in Bad Saarow.'),
        q('Welcher historische Beiname wurde für die Region am Scharmützelsee, zu der Bad Saarow gehört, verwendet?', ['Das Preußische Monaco', 'Die Märkische Côte d’Azur', 'Die Brandenburger Adria', 'Die Berliner Riviera'], 3, 'Der Scharmützelsee wurde schon früh als „Berliner Riviera“ bezeichnet – ein Hinweis auf seine Beliebtheit als Ausflugsregion.'),
        q('Wie viele Gäste kann das Flusskreuzfahrtschiff „A-ROSA SILVA“ laut Reederei maximal aufnehmen?', ['164 Gäste', '178 Gäste', '186 Gäste', '204 Gäste'], 2, 'Die Reederei gibt für die A-ROSA SILVA eine Kapazität von 186 Gästen an.'),
        q('Das Lied „Sail Along, Silv’ry Moon“ wurde unter anderem durch Billy Vaughn berühmt. Wer schrieb ursprünglich Musik und Text?', ['Harry Owens', 'Bing Crosby', 'Billy Vaughn', 'Percy Wenrich und Harry Tobias'], 3, 'Percy Wenrich komponierte die Melodie; Harry Tobias schrieb den Text.'),
        q('In welchem Jahr fanden in Ost-Berlin die X. Weltfestspiele der Jugend und Studenten statt?', ['1968', '1973', '1976', '1983'], 1, 'Die X. Weltfestspiele fanden vom 28. Juli bis 5. August 1973 in Ost-Berlin statt.'),
        q('Sigmund Jähn flog 1978 als erster Deutscher ins All. Mit welchem sowjetischen Raumschiff startete er zur Raumstation Saljut 6?', ['Sojus 29', 'Sojus 30', 'Sojus 31', 'Sojus 32'], 2, 'Der Hinflug erfolgte mit Sojus 31, die Rückkehr mit Sojus 29.')
      ]
    }
  });
})();
