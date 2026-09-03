# Study Room Widget

A customizable study session widget designed for Notion, with Pomodoro and Flow modes, preparation sessions, breaks, notifications, and automatic study session tracking.

## Features

- 🍅 Pomodoro timer
- 🌊 Flow mode
- ⏳ Customizable preparation time
- ☕ Short and long breaks
- 🔔 Customizable notification sounds
- 🎨 Customizable color palette
- ✨ Customizable session icons
- 📝 Optional session names
- 📊 Session tracking
- 📅 Automatic creation of study sessions in Notion
- 🔗 Secure Notion integration using OAuth

## Notion Integration

The widget can connect to a user's Notion workspace through OAuth.

When a study session is completed, the widget can automatically create a `Session de travail` entry in the user's `Planning` database.

The integration:

- uses OAuth authentication
- keeps authentication credentials on the backend
- does not require users to enter or share a Notion token
- leaves the `Matière` property empty in the Notion template so it can be completed by the user
- records the session name and start/end times when available

## Project Structure

```text
study-room-widget/
├── index.html
├── style.css
├── main.js
├── pomodoro.js
├── flow.js
├── notifications.js
├── preparation.js
├── storage.js
├── wheel.js
├── sounds/
│   ├── carillon.wav
│   ├── feerie.wav
│   ├── joyeux.wav
│   ├── classique.wav
│   └── serenite.wav
└── README.md
