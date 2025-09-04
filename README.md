# 🎯 CaliTrack

**CaliTrack** est une application mobile développée en **React Native** avec **Expo**, permettant aux utilisateurs de gérer leurs entraînements et objectifs.

## 📱 Fonctionnalités

- Création et suivi d’objectifs personnalisés
- Création d'entrainement personnalisé

## 🛠️ Stack technique

- **React Native** (Expo)
- **Expo Router**
- **NativeWind** pour le style (avec Tailwind-like syntax)
- **TypeScript**
- **Icons** via `react-native-vector-icons` / `@expo/vector-icons`

## 🔧 Installation

```bash
git clone https://github.com/ton-pseudo/calitrack.git
cd calitrack
npm install
npx expo start
```

## Arborescence du projet
home.tsx
```
└── 📁calitrack-ts
    └── 📁app
        └── 📁(auth)
            ├── _layout.tsx
            ├──
            ├── sign-in.tsx
            ├── sign-up.tsx
        └── 📁(tabs)
            ├── _layout.tsx
            ├── calendar.tsx
            ├── goals.tsx
            ├── index.tsx
            ├── profile.tsx
            ├── trainings.tsx
        └── 📁calendar
            └── 📁components
                ├── CustomCalendar.tsx
            ├── _layout.tsx
            ├── day.tsx
        └── 📁exercise
            └── 📁components
                ├── ExerciseItem.tsx
        └── 📁goal
            └── 📁components
                ├── GoalChart.tsx
                ├── GoalItem.tsx
                ├── GoalStats.tsx
            ├── _layout.tsx
            ├── add-goal.tsx
            ├── stats.tsx
        └── 📁notifications
            ├── _layout.tsx
            ├── index.tsx
        └── 📁settings
            └── 📁account
                ├── index.tsx
            └── 📁notifications
                ├── index.tsx
            ├── _layout.tsx
            ├── index.tsx
        └── 📁training
            └── 📁[id]
                ├── edit.tsx
                ├── index.tsx
                ├── session.tsx
            └── 📁components
                ├── ExerciseSelectionModal.tsx
                ├── TrainingItem.tsx
            ├── _layout.tsx
            ├── add-training.tsx
        ├── _layout.tsx
        ├── globals.css
    └── 📁assets
        └── 📁fonts
            ├── CalSans-Regular.ttf
            ├── Sora-Regular.ttf
        └── 📁icons
            ├── calendar_focus.png
            ├── calendar.png
            ├── goals_focus.png
            ├── goals.png
            ├── home_focus.png
            ├── home.png
            ├── profile_focus.png
            ├── profile.png
            ├── stats.png
            ├── training_focus.png
            ├── training.png
        └── 📁images
            ├── adaptive-icon.png
            ├── favicon.png
            ├── icon.png
            ├── logo.png
            ├── splash-icon.png
    └── 📁components
        ├── CustomButton.tsx
        ├── CustomHeader.tsx
        ├── CustomInput.tsx
        ├── CustomTags.tsx
        ├── PrimaryGradient.tsx
        ├── ProgressOverview.tsx
    └── 📁constants
        ├── icons.js
        ├── value.js
    └── 📁lib
        ├── appwrite.ts
        ├── exercise.appwrite.ts
        ├── goal.appwrite.ts
        ├── training.appwrite.ts
        ├── user.appwrite.ts
    └── 📁store
        ├── auth.store.ts
        ├── exercises.stores.ts
        ├── goals.store.ts
        ├── index.ts
        ├── trainings.store.ts
    ├── .env.example
    ├── .env.local
    ├── .gitignore
    ├── app.json
    ├── babel.config.js
    ├── eslint.config.js
    ├── expo-env.d.ts
    ├── metro.config.js
    ├── nativewind-env.d.ts
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tailwind.config.js
    ├── tsconfig.json
    └── type.d.ts
```