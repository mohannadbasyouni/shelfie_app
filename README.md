# Shelfie

Shelfie is a mobile application built with React Native and Expo that allows users to manage and track books. The app uses Appwrite as its backend and Zustand for global state management.

This repository reflects the current stabilized state after migrating authentication and book state from React Context to Zustand.

---

## Tech Stack

* React Native
* Expo (Expo Router)
* Zustand (state management)
* Appwrite (authentication and database)
* AsyncStorage (local persistence)
* JavaScript

---

## Architecture Overview

* **Expo Router** is used for file-based navigation.
* **Zustand** manages global application state, including:

  * Authentication state
  * User session
  * Books data
* **Appwrite** handles:

  * User authentication
  * User data
  * Book records
* **AsyncStorage** persists critical state across app restarts.

All React Context and custom context hooks have been fully removed.

---

## Project Structure (Simplified)

```
app/
 ├─ (auth)/
 ├─ (tabs)/
 ├─ books/
 │   └─ [id].jsx
 └─ _layout.jsx

store/
 ├─ authStore.js
 └─ booksStore.js

components/
constants/
services/
```

---

## Current Features

* User authentication via Appwrite
* Persistent login state
* Book listing and detail screens
* Zustand-based global state
* Clean separation between UI, state, and services

---

## Environment Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file with your Appwrite credentials:

   ```
   EXPO_PUBLIC_APPWRITE_ENDPOINT=
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=
   ```

3. Start the development server:

   ```
   npx expo start
   ```

---

## State Management Notes

* Zustand is the single source of truth for auth and books.
* No React Context is used anywhere in the app.
* Stores are designed to be modular and extendable.

---

## Development Status

* Zustand migration complete
* Auth and books fully functional
* Codebase stable and ready for further feature development

---

## License

This project is currently unlicensed and intended for personal and educational use.
