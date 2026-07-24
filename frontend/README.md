# LifeRadar

LifeRadar is a personal life-admin radar that helps people detect where they are about to lose money, miss a deadline, forget an obligation, or leave an entitlement unused.

## Current Prototype Status
- **Frontend Only**: The current prototype runs entirely in the browser.
- **Simulated Data**: All findings, deadlines, and inbox items are simulated demo data.
- **No Real Analysis**: Uploading documents simulates a delay but does not perform real OCR or AI analysis.
- **Local Features**: Reminders and Calendar ICS generation work locally in the browser.

## Installation
```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

## Running the App
```bash
npm run dev
```

## Testing
```bash
npm test --prefix frontend
```

## Building for Production
```bash
npm run build --prefix frontend
```
