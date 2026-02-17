# Power Level & Streak System - Implementation Guide

## 🎯 Overview

The Power Level system gamifies AURA by rewarding users with XP for daily logins and challenge completions. Users level up based on accumulated XP and maintain streaks for consecutive daily logins.

---

## 📊 Database Schema

### Modified Table: `profiles`

```sql
ALTER TABLE profiles
ADD COLUMN xp INTEGER DEFAULT 0 CHECK (xp >= 0),
ADD COLUMN level INTEGER DEFAULT 1 CHECK (level >= 1),
ADD COLUMN last_login TIMESTAMPTZ,
ADD COLUMN streak_count INTEGER DEFAULT 0 CHECK (streak_count >= 0),
ADD COLUMN max_streak INTEGER DEFAULT 0 CHECK (max_streak >= 0);
```

**Migration File:** `supabase/migrations/20260217_add_power_level_system.sql`

---

## 🧮 Level Calculation Formula

```typescript
level = Math.floor(Math.sqrt(xp / 10))
```

### XP Requirements per Level:
- **Level 1:** 0-9 XP
- **Level 2:** 10-39 XP
- **Level 3:** 40-89 XP
- **Level 4:** 90-159 XP
- **Level 5:** 160-249 XP
- **Level 10:** 1000+ XP

---

## 🔥 Streak Logic

### Daily Login Flow:

1. **User opens app** → `updateDailyStreak()` is called
2. **Check last login:**
   - **Same day:** No update, return current profile
   - **Yesterday:** Increment `streak_count` by 1
   - **More than 1 day ago:** Reset `streak_count` to 1
3. **Award XP:** User gains 10 XP for daily login
4. **Update level:** Recalculate level based on new XP
5. **Update max_streak:** If current streak > max_streak, update it

---

## 🏗️ Architecture

### Repository Pattern

```
repositories/
├── UserRepository.ts              # Interface
└── SupabaseUserRepository.ts      # Implementation
```

**Key Methods:**
- `getProfile(userId)` - Fetch user profile
- `updateDailyStreak(userId)` - Handle daily login logic
- `addXP(userId, amount)` - Award XP from challenges
- `markQuoteAsSeen(userId, quoteId)` - Mark quote as seen and award XP
- `getSeenQuoteIds(userId)` - Fetch IDs of all seen quotes
- `updateProfile(userId, updates)` - Update profile fields

---

## 📡 Realtime Profile Sync

AURA uses Supabase Realtime to keep the user's profile in sync across all components.

1. **Subscription:** `PowerLevelContext` subscribes to the `profiles` table.
2. **Detection:** When a database update occurs (streak increase, XP gain), the UI updates instantly.
3. **Optimistic Updates:** Local state is updated via `setProfile` for immediate feedback while the background subscription ensures consistency.

---

## 🎨 UI Components & Animations

### PowerLevelBar
Animated progress bar with electric gradient, pulsing effects, and rank badges.

### XPGainAnimation
**Location:** `app/(tabs)/index.tsx`
- **Impact Flow:** Shows `+5 XP` in a large, animated manga-style font (`Bangers`).
- **Level Up:** Special epic animation showing **LEVEL UP! AURA AUGMENTÉE!** when a new level is reached.
- **Timing:** Displays for 2 seconds with a smooth pop-in and slide-up exit.

### QuoteCard Indicators
- **Already Seen:** A discreet `Eye` icon + "DÉJÀ LU" badge in the top-right corner to identify revisited content.

---

## 🪝 React Hook

### usePowerLevel

**Location:** `hooks/usePowerLevel.ts`

**Returns:**
```typescript
{
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateDailyStreak: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  markQuoteAsSeen: (quoteId: string) => Promise<...>;
  isQuoteSeen: (quoteId: string) => boolean;
  xpProgress: number;          // 0-1 progress to next level
  xpForNextLevel: number;      // Total XP needed for next level
}
```

**Example:**
```tsx
const { profile, updateDailyStreak, addXP } = usePowerLevel();

useEffect(() => {
  updateDailyStreak(); // Call on app launch
}, []);

// Award XP for completing a challenge
const handleChallengeComplete = () => {
  addXP(25);
};
```

---

## 🚀 Integration Steps

### 1. Run Database Migration

```bash
# In Supabase Dashboard → SQL Editor
# Paste and run: supabase/migrations/20260217_add_power_level_system.sql
```

### 2. Update App Layout

In your main `_layout.tsx` or root component:

```tsx
import { usePowerLevel } from '@/hooks/usePowerLevel';

export default function RootLayout() {
  const { updateDailyStreak } = usePowerLevel();

  useEffect(() => {
    // Update streak on app launch
    updateDailyStreak();
  }, []);

  return (
    // Your layout
  );
}
```

### 3. Add to Profile Screen

```tsx
import { PowerLevelBar } from '@/components/PowerLevelBar';
import { usePowerLevel } from '@/hooks/usePowerLevel';

export default function ProfileScreen() {
  const { profile } = usePowerLevel();

  return (
    <View>
      <PowerLevelBar level={profile.level} xp={profile.xp} />
      <Text>Streak: {profile.streakCount} days 🔥</Text>
    </View>
  );
}
```

### 4. Award XP for Actions

```tsx
const { addXP } = usePowerLevel();

// When user completes a challenge
const handleChallengeComplete = async () => {
  await addXP(25); // Award 25 XP
};

// When user shares a quote
const handleShare = async () => {
  await addXP(5); // Award 5 XP
};
```

---

## 🎮 XP Reward Recommendations

| Action | XP Reward |
|--------|-----------|
| Daily Login | 10 XP |
| Complete Challenge | 25 XP |
| Share Quote | 5 XP |
| Add to Favorites | 3 XP |
| 7-Day Streak Bonus | 50 XP |
| 30-Day Streak Bonus | 200 XP |

---

## 🧪 Testing

### Test Daily Streak Logic

```typescript
// Day 1: First login
await updateDailyStreak(userId);
// Result: streak_count = 1, xp = 10

// Day 2: Consecutive login
await updateDailyStreak(userId);
// Result: streak_count = 2, xp = 20

// Day 5: Missed days (last login was Day 2)
await updateDailyStreak(userId);
// Result: streak_count = 1 (reset), xp = 30
```

### Test Level Progression

```typescript
// Level 1 → 2 requires 10 XP
await addXP(userId, 10);
// Result: level = 2

// Level 2 → 3 requires 40 total XP (30 more)
await addXP(userId, 30);
// Result: level = 3
```

---

## 🔮 Future Enhancements

1. **Achievements System:** Unlock badges for milestones
2. **Leaderboard:** Compare power levels with friends
3. **Daily Challenges:** Bonus XP for completing specific tasks
4. **Power-Up Items:** Temporary XP multipliers
5. **Level Rewards:** Unlock themes/features at certain levels

---

## 🐛 Troubleshooting

### Streak not incrementing?
- Check `last_login` timestamp in database
- Verify timezone handling (all dates use ISO 8601 UTC)

### Level not updating?
- Ensure `calculateLevel()` formula is correct
- Check XP value in database

### Animation not working?
- Verify `react-native-reanimated` is installed
- Check that `animated={true}` prop is set

---

**"Le travail acharné bat le talent quand le talent ne travaille pas dur."** - Rock Lee

Your Power Level system is ready. Now go Plus Ultra! ⚡
