# LifeRadar
> **Wir haben dein Leben auf dem Schirm.**

LifeRadar ist ein ruhiger, local-first Prototyp für persönliche Fristen, stille Kosten, offene Ansprüche und nächste sinnvolle Schritte.

Die Leitfrage lautet:

> **Was würdest du sonst zu spät bemerken?**

LifeRadar bündelt relevante Hinweise an einem Ort, priorisiert sie verständlich und zeigt transparent, worauf eine Einschätzung basiert.

## Aktueller Status

LifeRadar befindet sich aktuell im Prototyp-Stadium.

Der derzeitige Stand enthält:

- eine responsive React-Oberfläche
- die Bereiche „Heute“, „Geld & Ansprüche“, „Wichtige Fristen“, „Deine Quellen“ und „Einstellungen“
- simulierte Demo-Findings
- eine lokale Priorisierungslogik für dringende Fristen und finanzielle Hinweise
- Detailansichten für Findings
- lokale Erinnerungsfunktionen
- vorbereitete Kalendereinträge und ICS-Export
- JSON-, CSV- und druckfreundliche Exporte
- Light Mode und Dark Mode
- Tastatur- und Dialog-Barrierefreiheit
- Tests für Datums-, Priorisierungs- und Kalenderlogik

## Wichtiger Hinweis

Die aktuell dargestellten Findings stammen aus Demodaten.

LifeRadar führt derzeit noch keine echte automatische Dokumentanalyse, keine E-Mail-Auswertung, keine Cloud-Synchronisierung und keine externen Aktionen im Namen des Nutzers aus.

Kalendereinträge und Erinnerungen werden lediglich vorbereitet oder lokal gespeichert. Die Oberfläche behauptet nicht, dass ein Eintrag bereits erfolgreich an einen externen Kalender übertragen wurde.

## Produktprinzipien

LifeRadar folgt einigen klaren Grundsätzen:

- **Unknown is not zero.**
- Keine erfundene Sicherheit.
- Keine stillen externen Aktionen.
- Quelle und Grundlage müssen nachvollziehbar sein.
- Relevanz vor Informationsmenge.
- Maximal wenige, wirklich wichtige Hinweise auf dem Heute-Screen.
- Local-first, solange kein bewusster externer Dienst aktiviert wurde.

Die Grundlage eines Findings wird derzeit über folgende Begriffe beschrieben:

- **Beobachtet**
- **Berechnet**
- **Geschätzt**
- **Unbekannt**

## Technischer Aufbau

```text
LifeRadar/
├── README.md
├── package.json
├── frontend/
│   ├── components/
│   ├── screens/
│   ├── App.tsx
│   ├── StateContext.tsx
│   ├── constants.ts
│   ├── types.ts
│   ├── utils.ts
│   ├── index.html
│   ├── index.tsx
│   ├── package.json
│   └── vite.config.ts
└── .gitignore
```