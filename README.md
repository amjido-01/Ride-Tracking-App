# Drive - Ride Tracking App

A React Native technical assessment assignment that simulates a ride tracking experience. Built with Expo, TypeScript, and `react-native-maps`.

## Features

- **Live Ride Tracking:** A smooth, animated driver marker on a map that follows a predefined route towards the destination.
- **Premium UI:** A clean, minimalistic, and modern black-and-white design aesthetic.
- **Driver Card:** Floating interactive bottom sheet displaying the driver's profile, vehicle details, remaining distance, and an animated ETA.
- **Trip Summary:** An automatic transition to a final receipt screen upon arrival, displaying calculated distance, duration, and final fare in NGN (₦).
- **Cancel Flow:** Ability to gracefully cancel the ride and restart the simulation.
- **Unit Tested:** Built-in Jest test suite for mathematical distance and fare calculation utilities.

## Tech Stack

- React Native (Expo)
- TypeScript
- React Native Maps
- React Native Safe Area Context
- Expo Vector Icons
- Jest (Unit Testing)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run Unit Tests:**
   ```bash
   npx jest
   ```

## Project Structure

- `app/` - Application screens (Next.js-like file-based routing via Expo Router)
- `components/` - Reusable UI building blocks (Buttons, Cards, Empty States) and Ride-specific widgets (Map, Driver Card, Ride Stats)
- `context/` - Centralized State Management (`RideContext`) handling the simulation loop and state sharing.
- `hooks/` - Custom hooks, including the `useRideSimulation` engine.
- `utils/` - Mathematical helpers for calculating distance (Haversine formula), duration, and fare formatting.
- `types/` - Core TypeScript interfaces for typesafety across the project.
- `__tests__/` - Jest test suite for the math engine.
# Ride-Tracking-App
