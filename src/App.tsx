import React, { useState, useRef, useEffect, useCallback } from 'react';

// --- Data Types ---
interface RaidRecord {
  id: string;
  pokemon: string;
  raidTier: string;
  habitat: string;
  timeAEST: string;
  region: string;
  caught: number;
  shiny: number;
  hundo: number;
  shundo: number;
  candy: number;
  megaEnergy: number;
  primalEnergy: number;
  priority: 'High' | 'Medium' | 'Low' | 'None';
  hidden?: boolean;
}

interface Toast {
  id: number;
  title: string;
  icon: string;
  action?: () => void;
  actionLabel?: string;
}

// --- Custom Hook for Local Storage ---
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// --- Custom Hook for Previous State ---
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const animationStyles = `
  @keyframes slideInUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; transform: scale(0.9); }
  }
  @keyframes modalFadeIn {
    from { opacity: 0; backdrop-filter: blur(0px); }
    to { opacity: 1; backdrop-filter: blur(5px); }
  }
  @keyframes modalSlideUp {
    from { transform: translateY(50px) scale(0.95); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes shundoGlow {
    0% { box-shadow: inset 0 0 10px #ffd700, 0 0 10px #ffd700; background-color: #fffdf0; }
    50% { box-shadow: inset 0 0 25px #ff8c00, 0 0 20px #ff4500; background-color: #fff5e6; }
    100% { box-shadow: inset 0 0 10px #ffd700, 0 0 10px #ffd700; background-color: #fffdf0; }
  }
`;

const StyleInjector = ({ css }: { css: string }) => <style>{css}</style>;

const INITIAL_SATURDAY_DATA: RaidRecord[] = [
  { id: 'sat-0', pokemon: 'Mega Mewtwo X', raidTier: 'Super Mega', habitat: 'All Day', timeAEST: '10:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  
  // Stormfire Peaks
  { id: 'sat-1', pokemon: 'Mega Abomasnow', raidTier: 'Mega', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-2', pokemon: 'Mega Blaziken', raidTier: 'Mega', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-3', pokemon: 'Raikou', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-4', pokemon: 'Suicune', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-5', pokemon: 'Mega Ampharos', raidTier: 'Mega', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-6', pokemon: 'Articuno', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-7', pokemon: 'Entei', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-8', pokemon: 'Ho-Oh', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-9', pokemon: 'Lugia', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-10', pokemon: 'Moltres', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-11', pokemon: 'Zapdos', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  
  // Astral Tides
  { id: 'sat-12', pokemon: 'Mega Gengar', raidTier: 'Mega', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-13', pokemon: 'Mega Swampert', raidTier: 'Mega', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-14', pokemon: 'Uxie', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Asia-Pacific', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-15', pokemon: 'Mesprit', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Europe/ME/Africa/India', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-16', pokemon: 'Azelf', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Americas', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-17', pokemon: 'Xerneas', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-18', pokemon: 'Yveltal', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-19', pokemon: 'Solgaleo', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-20', pokemon: 'Lunala', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-21', pokemon: 'Dialga', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-22', pokemon: 'Origin Giratina', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-23', pokemon: 'Mega Alakazam', raidTier: 'Mega', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-24', pokemon: 'Palkia', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-25', pokemon: 'Altered Giratina', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  
  // Dragonflight Summit
  { id: 'sat-26', pokemon: 'Rayquaza', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-27', pokemon: 'Kyurem', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-28', pokemon: 'Kyogre', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-29', pokemon: 'Mega Aerodactyl', raidTier: 'Mega', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-30', pokemon: 'Mega Pidgeot', raidTier: 'Mega', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sat-31', pokemon: 'Mega Salamence', raidTier: 'Mega', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-32', pokemon: 'Groudon', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-33', pokemon: 'Reshiram', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sat-34', pokemon: 'Zekrom', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' }
];

const INITIAL_SUNDAY_DATA: RaidRecord[] = [
  { id: 'sun-0', pokemon: 'Mega Mewtwo Y', raidTier: 'Super Mega', habitat: 'All Day', timeAEST: '10:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },

  // Earthforged Domain
  { id: 'sun-1', pokemon: 'Origin Dialga', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-2', pokemon: 'Mega Garchomp', raidTier: 'Mega', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-3', pokemon: 'Registeel', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-4', pokemon: 'Origin Palkia', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-5', pokemon: 'Regigigas', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-6', pokemon: 'Therian Tornadus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-7', pokemon: 'Incarnate Thundurus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-8', pokemon: 'Therian Thundurus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-9', pokemon: 'Therian Landorus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-10', pokemon: 'Incarnate Enamorus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-11', pokemon: 'Therian Enamorus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-12', pokemon: 'Regieleki', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-13', pokemon: 'Regidrago', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-14', pokemon: 'Mega Metagross', raidTier: 'Mega', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-15', pokemon: 'Regirock', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-16', pokemon: 'Regice', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-17', pokemon: 'Heatran', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-18', pokemon: 'Incarnate Tornadus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-19', pokemon: 'Incarnate Landorus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-20', pokemon: 'Mega Audino', raidTier: 'Mega', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Low' },

  // Verdant Anomaly
  { id: 'sun-21', pokemon: 'Buzzwole', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Americas/Greenland', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-22', pokemon: 'Pheromosa', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Europe/ME/Africa/India', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-23', pokemon: 'Kartana', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Northern Hemisphere', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-24', pokemon: 'Blacephalon', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Western Hemisphere', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-25', pokemon: 'Mega Pinsir', raidTier: 'Mega', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-26', pokemon: 'Mega Sceptile', raidTier: 'Mega', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-27', pokemon: 'Normal Deoxys', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-28', pokemon: 'Attack Deoxys', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-29', pokemon: 'Defense Deoxys', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-30', pokemon: 'Douse Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-31', pokemon: 'Shock Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-32', pokemon: 'Burn Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-33', pokemon: 'Chill Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-34', pokemon: 'Nihilego', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-35', pokemon: 'Xurkitree', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Asia-Pacific', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-36', pokemon: 'Celesteela', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Southern Hemisphere', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-37', pokemon: 'Guzzlord', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-38', pokemon: 'Stakataka', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Eastern Hemisphere', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-39', pokemon: 'Tapu Koko', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-40', pokemon: 'Speed Deoxys', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-41', pokemon: 'Tapu Bulu', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-42', pokemon: 'Tapu Fini', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-43', pokemon: 'Mega Beedrill', raidTier: 'Mega', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-44', pokemon: 'Normal Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-45', pokemon: 'Necrozma', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-46', pokemon: 'Tapu Lele', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },

  // Twilight Battlefield
  { id: 'sun-47', pokemon: 'Mega Tyranitar', raidTier: 'Mega', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-48', pokemon: 'Mega Gardevoir', raidTier: 'Mega', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-49', pokemon: 'Mega Lucario', raidTier: 'Mega', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-50', pokemon: 'Hero Zacian', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-51', pokemon: 'Latios', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-52', pokemon: 'Cresselia', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-53', pokemon: 'Cobalion', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-54', pokemon: 'Terrakion', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-55', pokemon: 'Hero Zamazenta', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-56', pokemon: 'Latias', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' },
  { id: 'sun-57', pokemon: 'Darkrai', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'High' },
  { id: 'sun-58', pokemon: 'Virizion', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, shundo: 0, candy: 0, megaEnergy: 0, primalEnergy: 0, priority: 'Medium' }
];

const POKEMON_SPRITE_IDS: { [key: string]: number } = {
  'Mega Mewtwo X': 10043, 'Mega Mewtwo Y': 10044,
  'Mega Abomasnow': 10060, 'Mega Blaziken': 10050,
  'Raikou': 243, 'Suicune': 245,
  'Mega Ampharos': 10045, 'Articuno': 144,
  'Entei': 244, 'Ho-Oh': 250,
  'Lugia': 249, 'Moltres': 146,
  'Zapdos': 145, 'Mega Gengar': 10038,
  'Mega Swampert': 10064, 'Uxie': 480,
  'Mesprit': 481, 'Azelf': 482,
  'Xerneas': 716, 'Yveltal': 717,
  'Solgaleo': 791, 'Lunala': 792,
  'Dialga': 483, 'Origin Giratina': 10007,
  'Mega Alakazam': 10037, 'Palkia': 484,
  'Altered Giratina': 487, 'Rayquaza': 384,
  'Kyurem': 646, 'Kyogre': 382,
  'Mega Aerodactyl': 10042, 'Mega Pidgeot': 10073,
  'Mega Salamence': 10089, 'Groudon': 383,
  'Reshiram': 643, 'Zekrom': 644,
  'Origin Dialga': 10248, 'Mega Garchomp': 10058,
  'Registeel': 379, 'Origin Palkia': 10249,
  'Regigigas': 486, 'Therian Tornadus': 10019,
  'Incarnate Thundurus': 642, 'Therian Thundurus': 10020,
  'Therian Landorus': 10021, 'Incarnate Enamorus': 905,
  'Therian Enamorus': 10228, 'Regieleki': 894,
  'Regidrago': 895, 'Mega Metagross': 10076,
  'Regirock': 377, 'Regice': 378,
  'Heatran': 485, 'Incarnate Tornadus': 641,
  'Incarnate Landorus': 645, 'Mega Audino': 10069,
  'Buzzwole': 794, 'Pheromosa': 795,
  'Kartana': 798, 'Blacephalon': 806,
  'Mega Pinsir': 10040, 'Mega Sceptile': 10065,
  'Normal Deoxys': 386, 'Attack Deoxys': 10001,
  'Defense Deoxys': 10002, 'Douse Genesect': 10077,
  'Shock Genesect': 10078, 'Burn Genesect': 10079,
  'Chill Genesect': 10080, 'Nihilego': 793,
  'Xurkitree': 796, 'Celesteela': 797,
  'Guzzlord': 799, 'Stakataka': 805,
  'Tapu Koko': 785, 'Speed Deoxys': 10003,
  'Tapu Bulu': 787, 'Tapu Fini': 788,
  'Mega Beedrill': 10090, 'Normal Genesect': 649,
  'Necrozma': 800, 'Tapu Lele': 786,
  'Mega Tyranitar': 10049, 'Mega Gardevoir': 10051,
  'Mega Lucario': 10059, 'Hero Zacian': 888,
  'Latios': 381, 'Cresselia': 488,
  'Cobalion': 638, 'Terrakion': 639,
  'Hero Zamazenta': 889, 'Latias': 380,
  'Darkrai': 491, 'Virizion': 640
};

const getSpriteUrl = (pokemonName: string) => {
  const id = POKEMON_SPRITE_IDS[pokemonName];
  if (id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }
  return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
};

// --- Swipeable List Component ---
const SwipeableItem = ({ record, onEdit, onHide }: { record: RaidRecord, onEdit: () => void, onHide: () => void }) => {
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    isDragging.current = true;
  };
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX.current;
    if (diff > 120) setOffset(120);
    else if (diff < -120) setOffset(-120);
    else setOffset(diff);
  };
  const handleEnd = () => {
    isDragging.current = false;
    if (offset > 70) onHide();
    else if (offset < -70) onEdit();
    setOffset(0);
  };

  let dynamicStyle: React.CSSProperties = { 
    ...styles.swipeForeground, 
    transform: `translateX(${offset}px)`, 
    transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
  };

  if (record.priority === 'High') {
    dynamicStyle = { ...dynamicStyle, ...styles.rowHighPriority };
  }

  if (record.shundo > 0) {
    dynamicStyle = { ...dynamicStyle, ...styles.rowShundo };
  } else if (record.shiny > 0 && record.hundo > 0) {
    dynamicStyle = { ...dynamicStyle, ...styles.rowShinyHundo };
  } else if (record.shiny > 0) {
    dynamicStyle = { ...dynamicStyle, ...styles.rowShiny };
  } else if (record.hundo > 0) {
    dynamicStyle = { ...dynamicStyle, ...styles.rowHundo };
  } else if (record.caught > 0) {
    dynamicStyle = { ...dynamicStyle, ...styles.rowCaught };
  }

  return (
    <div style={styles.swipeContainer}>
      <div style={{ ...styles.swipeBackground, backgroundColor: offset > 0 ? '#ef4444' : '#3b82f6' }}>
        <div style={{ opacity: offset > 20 ? 1 : 0, transform: `scale(${Math.min(offset / 70, 1)})`, transition: 'all 0.2s' }}>🗑️ Hide</div>
        <div style={{ opacity: offset < -20 ? 1 : 0, transform: `scale(${Math.min(Math.abs(offset) / 70, 1)})`, transition: 'all 0.2s' }}>✏️ Edit</div>
      </div>
      <div 
        onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}
        onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
        onClick={onEdit}
        style={dynamicStyle}
      >
        <img src={getSpriteUrl(record.pokemon)} alt={record.pokemon} style={styles.pokemonSprite} loading="lazy" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a1a' }}>{record.pokemon}</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={styles.badgeTier}>{record.raidTier}</span>
            <span style={styles.badgeHabitat}>{record.habitat}</span>
            {record.region !== 'Global' && <span style={styles.badgeRegion}>📍 {record.region}</span>}
          </div>
          {(record.caught > 0 || record.shiny > 0 || record.hundo > 0 || record.shundo > 0 || record.candy > 0 || record.megaEnergy > 0 || record.primalEnergy > 0) && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
              {record.caught > 0 && <span style={styles.statBadgeCaught}>✅ {record.caught}</span>}
              {record.shiny > 0 && <span style={styles.statBadgeShiny}>✨ {record.shiny}</span>}
              {record.hundo > 0 && <span style={styles.statBadgeHundo}>💯 {record.hundo}</span>}
              {record.shundo > 0 && <span style={styles.statBadgeShundo}>🦄 {record.shundo}</span>}
              {record.candy > 0 && <span style={styles.statBadgeCandy}>🍬 {record.candy}</span>}
              {record.megaEnergy > 0 && <span style={styles.statBadgeMega}>🧬 {record.megaEnergy}</span>}
              {record.primalEnergy > 0 && <span style={styles.statBadgePrimal}>🌋 {record.primalEnergy}</span>}
            </div>
          )}
        </div>
        <div style={{ color: '#cbd5e1', paddingLeft: '8px', display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [displayName, setDisplayName] = useLocalStorage<string>('gofest_displayName', '');
  const [activeTab, setActiveTab] = useState<'Summary' | 'Saturday' | 'Sunday' | 'Achievements'>('Summary');

  // Initial mock data - you will replace this with your Excel data
  const [saturdayData, setSaturdayData] = useLocalStorage<RaidRecord[]>('gofest_sat', INITIAL_SATURDAY_DATA);
  const [sundayData, setSundayData] = useLocalStorage<RaidRecord[]>('gofest_sun', INITIAL_SUNDAY_DATA);

  // Form state for adding new custom raids
  const [newPokemon, setNewPokemon] = useState('');
  const [hideCaught, setHideCaught] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [editingRecord, setEditingRecord] = useState<{id: string, day: 'Saturday'|'Sunday'} | null>(null);
  const [hasUnhiddenAll, setHasUnhiddenAll] = useLocalStorage<boolean>('gofest_unhiddenAll', false);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useLocalStorage<string[]>('gofest_unlocked_achievements', []);
  
  // --- Global Timer for Countdowns ---
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Achievement Logic ---
  const calculateAchievements = useCallback((satData: RaidRecord[], sunData: RaidRecord[], unhiddenAll: boolean, unlockedIds: string[]) => {
    const allData = [...satData, ...sunData];
    const totalCaught = allData.reduce((sum, r) => sum + (r.caught || 0), 0);
    const totalShiny = allData.reduce((sum, r) => sum + (r.shiny || 0), 0);
    const totalHundo = allData.reduce((sum, r) => sum + (r.hundo || 0), 0);
    const totalShundo = allData.reduce((sum, r) => sum + (r.shundo || 0), 0);
    const caughtMewtwoX = satData.find(r => r.pokemon === 'Mega Mewtwo X')?.caught || 0;
    const caughtMewtwoY = sunData.find(r => r.pokemon === 'Mega Mewtwo Y')?.caught || 0;
    
    const uniqueUltraBeasts = allData.filter(r => ['Nihilego', 'Buzzwole', 'Pheromosa', 'Xurkitree', 'Celesteela', 'Kartana', 'Guzzlord', 'Stakataka', 'Blacephalon'].includes(r.pokemon) && r.caught > 0).length;

    const allInitialPokemon = [...INITIAL_SATURDAY_DATA, ...INITIAL_SUNDAY_DATA];
    const allCaught = allInitialPokemon.every(initialPokemon => {
        // Find the corresponding pokemon in the user's data
        const userPokemon = allData.find(p => p.id === initialPokemon.id);
        return userPokemon ? (userPokemon.caught || 0) > 0 : false;
    });

    const saturdayTotal = satData.reduce((sum, r) => sum + (r.caught || 0), 0);
    const sundayTotal = sunData.reduce((sum, r) => sum + (r.caught || 0), 0);
    
    const highPriorityTargets = allData.filter(r => r.priority === 'High');
    const completedHighPriority = highPriorityTargets.length > 0 && highPriorityTargets.every(r => (r.caught || 0) > 0);

    const caughtSolgaleo = (allData.find(r => r.pokemon === 'Solgaleo')?.caught || 0) > 0;
    const caughtLunala = (allData.find(r => r.pokemon === 'Lunala')?.caught || 0) > 0;
    const caughtWeatherTrio = ['Kyogre', 'Groudon', 'Rayquaza'].every(p => (allData.find(r => r.pokemon === p)?.caught || 0) > 0);
    
    const caughtForcesOfNature = allData.some(r => r.pokemon.includes('Tornadus') && r.caught > 0) &&
                                 allData.some(r => r.pokemon.includes('Thundurus') && r.caught > 0) &&
                                 allData.some(r => r.pokemon.includes('Landorus') && r.caught > 0);

    const megaTotal = allData.filter(r => r.raidTier === 'Mega').reduce((sum, r) => sum + (r.caught || 0), 0);

    const totalCandy = allData.reduce((sum, r) => sum + (r.candy || 0), 0);
    const totalMegaEnergy = allData.reduce((sum, r) => sum + (r.megaEnergy || 0), 0);
    const totalPrimalEnergy = allData.reduce((sum, r) => sum + (r.primalEnergy || 0), 0);
    const mewtwoXMegaEnergy = satData.find(r => r.pokemon === 'Mega Mewtwo X')?.megaEnergy || 0;
    const mewtwoYMegaEnergy = sunData.find(r => r.pokemon === 'Mega Mewtwo Y')?.megaEnergy || 0;

    const requiredHabitats = [
      '⚡🔥❄️ Stormfire Peaks',
      '🔮👻💧 Astral Tides',
      '🦅🪨🐉 Dragonflight Summit',
      '🪨⚙️⬜ Earthforged Domain',
      '🐛🌿☠️ Verdant Anomaly',
      '🌑🧚🥊 Twilight Battlefield'
    ];
    const allHabitatsExplored = requiredHabitats.every(h => allData.some(r => r.habitat === h && (r.caught || 0) > 0));

    const rawAchievements = [
      { id: 'first-blood', title: 'First Blood', desc: 'Complete your first raid of GO Fest.', icon: '🎯', unlocked: totalCaught >= 1 },
      { id: 'raid-novice', title: 'Raid Novice', desc: 'Complete 10 total raids.', icon: '🥉', unlocked: totalCaught >= 10 },
      { id: 'raid-pro', title: 'Raid Professional', desc: 'Complete 30 total raids.', icon: '🥈', unlocked: totalCaught >= 30 },
      { id: 'raid-master', title: 'Raid Master', desc: 'Complete 50 total raids.', icon: '🥇', unlocked: totalCaught >= 50 },
      { id: 'raid-legend', title: 'Raid Legend', desc: 'Complete 100 total raids.', icon: '👑', unlocked: totalCaught >= 100 },
      { id: 'shiny-spark', title: 'Ooh, Sparkly!', desc: 'Catch your first Shiny Pokémon.', icon: '✨', unlocked: totalShiny >= 1 },
      { id: 'shiny-hunter', title: 'Shiny Hunter', desc: 'Catch 5 or more Shiny Pokémon.', icon: '🌟', unlocked: totalShiny >= 5 },
      { id: 'shiny-master', title: 'Shiny Master', desc: 'Catch 15 or more Shiny Pokémon.', icon: '💫', unlocked: totalShiny >= 15 },
      { id: 'perfect-catch', title: 'Perfection', desc: 'Catch a 100% IV (Hundo) Pokémon.', icon: '💯', unlocked: totalHundo >= 1 },
      { id: 'hundo-hunter', title: 'Hundo Hunter', desc: 'Catch 3 or more 100% IV Pokémon.', icon: '🎰', unlocked: totalHundo >= 3 },
      { id: 'super-mega', title: 'Super Mega Power', desc: 'Catch both Mega Mewtwo X and Mega Mewtwo Y.', icon: '🧬', unlocked: caughtMewtwoX > 0 && caughtMewtwoY > 0 },
      { id: 'mega-maniac', title: 'Mega Maniac', desc: 'Complete 10 or more standard Mega Raids.', icon: '💪', unlocked: megaTotal >= 10 },
      { id: 'sweet-tooth', title: 'Sweet Tooth', desc: 'Collect 1,000 total Candy.', icon: '🍬', unlocked: totalCandy >= 1000 },
      { id: 'candy-collector', title: 'Candy Collector', desc: 'Collect 5,000 total Candy.', icon: '🍭', unlocked: totalCandy >= 5000 },
      { id: 'mega-evolution-master', title: 'Mega Evolution Master', desc: 'Collect 2,000 total Mega Energy.', icon: '🌌', unlocked: totalMegaEnergy >= 2000 },
      { id: 'primal-reversion-master', title: 'Primal Reversion Master', desc: 'Collect 2,000 total Primal Energy.', icon: '🌋', unlocked: totalPrimalEnergy >= 2000 },
      { id: 'project-mewtwo', title: 'Project Mewtwo', desc: 'Collect 1,000 Mega Energy for BOTH Mega Mewtwo X and Mega Mewtwo Y.', icon: '🧪', unlocked: mewtwoXMegaEnergy >= 1000 && mewtwoYMegaEnergy >= 1000 },
      { id: 'shundo', title: 'SHUNDO!!!', desc: 'Catch a Shundo (100% IV Shiny) Pokémon!', icon: '🦄', unlocked: totalShundo >= 1, secret: true },
      { id: 'beast-ball', title: 'Ultra Beast Collector', desc: 'Catch at least 5 different Ultra Beasts.', icon: '🌌', unlocked: uniqueUltraBeasts >= 5 },
      { id: 'beast-master', title: 'Ultra Beast Master', desc: 'Catch all 9 featured Ultra Beasts.', icon: '🛸', unlocked: uniqueUltraBeasts >= 9 },
      { id: 'priority-target', title: 'Target Acquired', desc: 'Complete all of your "High" priority raids.', icon: '🔥', unlocked: completedHighPriority },
      { id: 'cosmic-duo', title: 'Cosmic Duo', desc: 'Catch both Solgaleo and Lunala.', icon: '🌘', unlocked: caughtSolgaleo && caughtLunala },
      { id: 'weather-trio', title: 'Weather Trio', desc: 'Catch Kyogre, Groudon, and Rayquaza.', icon: '⛈️', unlocked: caughtWeatherTrio },
      { id: 'forces-of-nature', title: 'Forces of Nature', desc: 'Catch Tornadus, Thundurus, and Landorus.', icon: '🌪️', unlocked: caughtForcesOfNature },
      { id: 'sat-warrior', title: 'Saturday Warrior', desc: 'Complete 20 raids on Saturday.', icon: '☀️', unlocked: saturdayTotal >= 20 },
      { id: 'sun-warrior', title: 'Sunday Warrior', desc: 'Complete 20 raids on Sunday.', icon: '🌙', unlocked: sundayTotal >= 20 },
      { id: 'world-traveler', title: 'World Traveler', desc: 'Complete a raid in all 6 rotating habitats.', icon: '🗺️', unlocked: allHabitatsExplored },
      { id: 'catch-em-all', title: 'Gotta Catch \'Em All', desc: 'Catch at least one of every possible raid boss.', icon: '🏅', unlocked: allCaught },
      { id: 'custom-boss', title: 'Off the Beaten Path', desc: 'Track a custom added raid boss.', icon: '🛤️', unlocked: allData.some(r => r.raidTier === 'Custom' && r.caught > 0), secret: true },
      { id: 'hide-record', title: 'Nothing to See Here', desc: 'Hide a Pokémon from the tracker.', icon: '🙈', unlocked: allData.some(r => r.hidden === true), secret: true },
      { id: 'unhide-all', title: 'The Great Reveal', desc: 'Unhide all Pokémon to give them a second chance.', icon: '👀', unlocked: unhiddenAll, secret: true }
    ];

    return rawAchievements.map(a => ({ ...a, unlocked: unlockedIds.includes(a.id) || a.unlocked }));
  }, []);

  const addToast = useCallback((title: string, icon: string, action?: () => void, actionLabel?: string) => {
    const newToast = { id: Date.now(), title, icon, action, actionLabel };
    setToasts(prevToasts => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(t => t.id !== newToast.id));
    }, 4000); // Remove after 4 seconds
  }, []);

  const prevSaturdayData = usePrevious(saturdayData);
  const prevSundayData = usePrevious(sundayData);
  const prevUnhiddenAll = usePrevious(hasUnhiddenAll);
  const prevUnlockedIds = usePrevious(unlockedAchievementIds);

  useEffect(() => {
    // Don't run on initial render or if previous data is not available
    if (!prevSaturdayData || !prevSundayData) {
      return;
    }

    const prevAchievements = calculateAchievements(prevSaturdayData, prevSundayData, prevUnhiddenAll || false, prevUnlockedIds || []);
    const currentAchievements = calculateAchievements(saturdayData, sundayData, hasUnhiddenAll, unlockedAchievementIds);

    let newUnlocks = false;
    const updatedUnlockedIds = [...unlockedAchievementIds];

    currentAchievements.forEach((current, index) => {
      const prev = prevAchievements[index];
      const alreadyUnlocked = unlockedAchievementIds.includes(current.id);

      // Only fire a toast if the achievement is newly met AND not already in our permanent history
      if (current.unlocked && !prev.unlocked && !alreadyUnlocked) {
        addToast(current.title, current.icon);
        if (!updatedUnlockedIds.includes(current.id)) {
          updatedUnlockedIds.push(current.id);
          newUnlocks = true;
        }
      }
    });

    if (newUnlocks) {
      setUnlockedAchievementIds(updatedUnlockedIds);
    }
  }, [saturdayData, sundayData, hasUnhiddenAll, unlockedAchievementIds, prevSaturdayData, prevSundayData, prevUnhiddenAll, prevUnlockedIds, calculateAchievements, addToast]);

  // --- Handlers ---
  const updateCount = (id: string, day: 'Saturday' | 'Sunday', field: 'caught' | 'shiny' | 'hundo' | 'shundo' | 'candy' | 'megaEnergy' | 'primalEnergy', value: number) => {
    const data = day === 'Saturday' ? saturdayData : sundayData;
    const setData = day === 'Saturday' ? setSaturdayData : setSundayData;
    setData(data.map(r => r.id === id ? { ...r, [field]: Math.max(0, value) } : r));
  };

  const updatePriority = (id: string, day: 'Saturday' | 'Sunday', newPriority: RaidRecord['priority']) => {
    const data = day === 'Saturday' ? saturdayData : sundayData;
    const setData = day === 'Saturday' ? setSaturdayData : setSundayData;
    setData(data.map(r => r.id === id ? { ...r, priority: newPriority } : r));
  };

  const hideRecord = (id: string, day: 'Saturday' | 'Sunday') => {
    const data = day === 'Saturday' ? saturdayData : sundayData;
    const setData = day === 'Saturday' ? setSaturdayData : setSundayData;
    setData(data.map(r => r.id === id ? { ...r, hidden: true } : r));
    const record = data.find(r => r.id === id);
    if (record) addToast(`Hidden ${record.pokemon}`, '🙈', () => unhideRecord(id, day), 'UNDO');
  };
  const unhideRecord = (id: string, day: 'Saturday' | 'Sunday') => {
    const data = day === 'Saturday' ? saturdayData : sundayData;
    const setData = day === 'Saturday' ? setSaturdayData : setSundayData;
    setData(data.map(r => r.id === id ? { ...r, hidden: false } : r));
  };

  const addCustomRaid = (day: 'Saturday' | 'Sunday', e: React.FormEvent) => {
    e.preventDefault();
    if (!newPokemon.trim()) return;

    const newRecord: RaidRecord = {
      id: Date.now().toString(),
      pokemon: newPokemon,
      raidTier: 'Custom',
      habitat: 'Any',
      timeAEST: 'Any',
      region: 'Global',
      caught: 0,
      shiny: 0,
      hundo: 0,
      shundo: 0,
      candy: 0,
      megaEnergy: 0,
      primalEnergy: 0,
      priority: 'Medium'
    };

    if (day === 'Saturday') {
      setSaturdayData([...saturdayData, newRecord]);
    } else {
      setSundayData([...sundayData, newRecord]);
    }
    setNewPokemon('');
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all raid progress? This cannot be undone.")) {
      setSaturdayData(INITIAL_SATURDAY_DATA);
      setSundayData(INITIAL_SUNDAY_DATA);
      setHasUnhiddenAll(false);
      setUnlockedAchievementIds([]);
    }
  };

  const unhideAllRecords = () => {
    setSaturdayData(saturdayData.map(r => ({ ...r, hidden: false })));
    setSundayData(sundayData.map(r => ({ ...r, hidden: false })));
    setHasUnhiddenAll(true);
  };

  // --- Render Helpers ---
  const renderSummaryTab = () => (
    <div style={styles.card}>
      <h2 style={styles.header}>Summary & Tips</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={styles.subHeader}>📅 Event Dates & Times (AEST)</h3>
        <p style={{ margin: '0' }}>Saturday July 11 & Sunday July 12, 2026<br/>10:00 AM – 7:00 PM AEST</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={styles.subHeader}>🦘 Australia-Specific Notes</h3>
        <ul style={{ lineHeight: '1.6', margin: '5px 0', paddingLeft: '20px' }}>
          <li>✅ <strong>Uxie</strong> – Asia-Pacific region (you can raid this IN Australia) <em>Sat 13:00–16:00</em></li>
          <li>❌ <strong>Mesprit</strong> – Europe/ME/Africa/India only (need remote invite) <em>Sat 13:00–16:00</em></li>
          <li>❌ <strong>Azelf</strong> – Americas only (need remote invite) <em>Sat 13:00–16:00</em></li>
          <li>✅ <strong>Xurkitree</strong> – Asia-Pacific (available in AUS) <em>Sun 13:00–16:00</em></li>
          <li>✅ <strong>Celesteela</strong> – Southern Hemisphere (available in AUS) <em>Sun 13:00–16:00</em></li>
          <li>✅ <strong>Stakataka</strong> – Eastern Hemisphere (available in AUS) <em>Sun 13:00–16:00</em></li>
          <li>❌ <strong>Kartana</strong> – Northern Hemisphere only (need remote invite) <em>Sun 13:00–16:00</em></li>
          <li>❌ <strong>Blacephalon</strong> – Western Hemisphere only (need remote invite) <em>Sun 13:00–16:00</em></li>
          <li>❌ <strong>Buzzwole</strong> – Americas & Greenland only (need remote invite) <em>Sun 13:00–16:00</em></li>
          <li>❌ <strong>Pheromosa</strong> – Europe/ME/Africa/India (need remote invite) <em>Sun 13:00–16:00</em></li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={styles.subHeader}>🧬 Super Mega Raids</h3>
        <ul style={{ lineHeight: '1.6', margin: '5px 0', paddingLeft: '20px' }}>
          <li>⭐ <strong>Saturday:</strong> Mega Mewtwo X – all day 10:00–19:00</li>
          <li>⭐ <strong>Sunday:</strong> Mega Mewtwo Y – all day 10:00–19:00</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={styles.subHeader}>💡 Pro Tips</h3>
        <ul style={{ lineHeight: '1.6', margin: '5px 0', paddingLeft: '20px' }}>
          <li>Stock up on Remote Raid Passes before the event for region-locked Pokémon!</li>
          <li>Add international friends now to get invites for Mesprit, Azelf, Kartana, Blacephalon, Buzzwole, and Pheromosa.</li>
          <li>You get up to 9 FREE Raid Passes per day by spinning Gym Photo Discs.</li>
          <li>Shiny rates are boosted for all featured Pokémon during the event.</li>
          <li><strong>App Usage:</strong> Navigate to the Saturday and Sunday tabs to mark off caught bosses. Add unexpected raids using the "Add Custom Raid" feature at the bottom of the tables.</li>
          <li><strong>Offline Mode:</strong> This app works offline! If you lose connection at the park, your changes are still safely saved locally to your device.</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
        <button onClick={unhideAllRecords} style={{ ...styles.button, background: '#3b82f6', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)', margin: '0' }}>Unhide All Pokémon</button>
        <button onClick={resetProgress} style={{ ...styles.button, background: '#ef4444', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)', margin: '0' }}>Reset All Progress</button>
      </div>
    </div>
  );

  const renderAchievementsTab = () => {
    const achievements = calculateAchievements(saturdayData, sundayData, hasUnhiddenAll, unlockedAchievementIds);
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
      <div style={styles.card}>
        <h2 style={styles.header}>🏆 Achievements ({unlockedCount}/{achievements.length})</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>Track your overall progress throughout the event. Can you unlock them all?</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {achievements.map(a => {
            const isSecret = (a as any).secret;
            
            if (isSecret && !a.unlocked) {
              return (
                <div key={a.id} style={{ ...styles.achievementCard, ...styles.achievementLocked }}>
                  <div style={styles.achievementIcon}>❓</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#555' }}>Secret Achievement</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Keep playing to discover how to unlock this!</p>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={a.id} style={{ ...styles.achievementCard, ...(a.unlocked ? styles.achievementUnlocked : styles.achievementLocked) }}>
                <div style={styles.achievementIcon}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', ...(a.unlocked ? { background: 'linear-gradient(135deg, #FF007A, #7000FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: '#555' }) }}>{a.title}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{a.desc}</p>
                </div>
                {a.unlocked && <div style={{ fontSize: '24px', color: '#4CAF50' }}>✅</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTrackerTable = (day: 'Saturday' | 'Sunday', data: RaidRecord[]) => {
    const timeSlots = [
      { label: '⭐ All Day', timeAEST: '10:00 - 19:00', startHour: 10, endHour: 19 },
      { label: '🕐 10:00 AM - 1:00 PM', timeAEST: '10:00 - 13:00', startHour: 10, endHour: 13 },
      { label: '🕒 1:00 PM - 4:00 PM', timeAEST: '13:00 - 16:00', startHour: 13, endHour: 16 },
      { label: '🕓 4:00 PM - 7:00 PM', timeAEST: '16:00 - 19:00', startHour: 16, endHour: 19 },
      { label: '➕ Custom Raids', timeAEST: 'Any', startHour: null, endHour: null },
    ];

    const getCountdown = (startHour: number | null, endHour: number | null) => {
      if (startHour === null || endHour === null) return null;
      const dateStr = day === 'Saturday' ? '2026-07-11' : '2026-07-12';
      const startTime = new Date(`${dateStr}T${startHour.toString().padStart(2, '0')}:00:00+10:00`).getTime();
      const endTime = new Date(`${dateStr}T${endHour.toString().padStart(2, '0')}:00:00+10:00`).getTime();
      
      if (currentTime < startTime) {
        const diff = startTime - currentTime;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        return { text: d > 0 ? `⏳ Starts in ${d}d ${h}h ${m}m` : `⏳ Starts in ${h}h ${m}m ${s}s`, color: '#d97706' };
      } else if (currentTime >= startTime && currentTime < endTime) {
        const diff = endTime - currentTime;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        return { text: `🔥 Ends in ${h}h ${m}m ${s}s`, color: '#E3350D' };
      } else {
        return { text: `✅ Ended`, color: '#64748b' };
      }
    };

    const isSlotActive = (startHour: number | null, endHour: number | null) => {
      if (startHour === null || endHour === null) return true; // Always show Custom Raids
      const dateStr = day === 'Saturday' ? '2026-07-11' : '2026-07-12';
      const startTime = new Date(`${dateStr}T${startHour.toString().padStart(2, '0')}:00:00+10:00`).getTime();
      const endTime = new Date(`${dateStr}T${endHour.toString().padStart(2, '0')}:00:00+10:00`).getTime();
      return currentTime >= startTime && currentTime < endTime;
    };

    const activeData = data.filter(r => !r.hidden);
    const visibleData = hideCaught ? activeData.filter(r => r.caught === 0) : activeData;
    const caughtCount = activeData.filter(r => r.caught > 0).length;
    const totalCount = activeData.length;
    const progressPercent = totalCount === 0 ? 0 : Math.round((caughtCount / totalCount) * 100);

    const priorityWeight = { High: 0, Medium: 1, Low: 2, None: 3 };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={styles.toolbar}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={styles.progressText}>🏆 Progress: {caughtCount} / {totalCount}</span>
              <span style={{ fontWeight: 'bold', color: '#666' }}>{progressPercent}%</span>
            </div>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }}></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <label style={styles.filterLabel}>
              <input type="checkbox" checked={showActiveOnly} onChange={(e) => setShowActiveOnly(e.target.checked)} style={{ marginRight: '8px', transform: 'scale(1.1)', cursor: 'pointer' }} />
              Active Only
            </label>
            <label style={styles.filterLabel}>
              <input type="checkbox" checked={hideCaught} onChange={(e) => setHideCaught(e.target.checked)} style={{ marginRight: '8px', transform: 'scale(1.1)', cursor: 'pointer' }} />
              Hide Caught
            </label>
          </div>
        </div>

        {timeSlots.map((slot) => {
          const slotData = visibleData.filter((r) => r.timeAEST === slot.timeAEST);
          
          if (slotData.length === 0 && slot.timeAEST !== 'Any') return null;
          if (showActiveOnly && !isSlotActive(slot.startHour, slot.endHour)) return null;

          slotData.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);

          const countdown = getCountdown(slot.startHour, slot.endHour);

          return (
            <div key={slot.label} style={{...styles.card, padding: '16px'}}>
              <h3 style={{ color: '#333', borderBottom: '2px solid #E3350D', paddingBottom: '8px', marginTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span>{slot.label}</span>
                {countdown && (
                  <span style={{ fontSize: '14px', color: countdown.color, fontWeight: 'bold', backgroundColor: '#f8fafc', padding: '4px 10px', borderRadius: '999px', border: `1px solid ${countdown.color}40` }}>
                    {countdown.text}
                  </span>
                )}
              </h3>
              
              {slotData.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {slotData.map((record) => (
                    <SwipeableItem key={record.id} record={record} onEdit={() => setEditingRecord({id: record.id, day})} onHide={() => hideRecord(record.id, day)} />
                  ))}
                </div>
              )}
              
              {slot.timeAEST === 'Any' && (
                <form onSubmit={(e) => addCustomRaid(day, e)} style={styles.addForm}>
                  <input 
                    type="text" 
                    value={newPokemon} 
                    onChange={(e) => setNewPokemon(e.target.value)}
                    placeholder="Unexpected Raid Boss?" 
                    style={styles.input}
                  />
                  <button type="submit" style={styles.button}>+ Add Custom</button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderEditModal = () => {
    if (!editingRecord) return null;
    const data = editingRecord.day === 'Saturday' ? saturdayData : sundayData;
    const record = data.find(r => r.id === editingRecord.id);
    if (!record) return null;

    const isMega = record.raidTier.includes('Mega') || record.pokemon === 'Rayquaza' || record.pokemon.toLowerCase().includes('mega');
    const isPrimal = record.pokemon === 'Groudon' || record.pokemon === 'Kyogre' || record.pokemon.toLowerCase().includes('primal');
    const showEnergy = isMega || isPrimal;

    return (
      <div style={styles.modalOverlay} onClick={() => setEditingRecord(null)}>
        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style={{ margin: 0, ...styles.header }}>{record.pokemon}</h2>
            <button onClick={() => setEditingRecord(null)} style={styles.modalCloseBtn}>✕</button>
          </div>
          
          <img src={getSpriteUrl(record.pokemon)} alt={record.pokemon} style={{ width: '100px', height: '100px', objectFit: 'contain', display: 'block', margin: '0 auto 20px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }} />

          <div style={{ marginBottom: '15px' }}>
            <label style={styles.modalLabel}>Tracking Priority</label>
            <select value={record.priority} onChange={(e) => updatePriority(record.id, editingRecord.day, e.target.value as RaidRecord['priority'])} style={{...styles.select, width: '100%'}}>
              <option value="High">🔥 High Priority</option><option value="Medium">⭐ Medium Priority</option><option value="Low">👍 Low Priority</option><option value="None">None</option>
            </select>
          </div>

          <div style={styles.modalGrid}>
            <div style={styles.inputGroup}><label style={styles.modalLabel}>✅ Caught</label><input type="number" min="0" value={record.caught || ''} placeholder="0" onChange={(e) => updateCount(record.id, editingRecord.day, 'caught', parseInt(e.target.value) || 0)} style={styles.largeNumberInput} /></div>
            <div style={styles.inputGroup}><label style={styles.modalLabel}>✨ Shiny</label><input type="number" min="0" value={record.shiny || ''} placeholder="0" onChange={(e) => updateCount(record.id, editingRecord.day, 'shiny', parseInt(e.target.value) || 0)} style={styles.largeNumberInput} /></div>
            <div style={styles.inputGroup}><label style={styles.modalLabel}>💯 Hundo</label><input type="number" min="0" value={record.hundo || ''} placeholder="0" onChange={(e) => updateCount(record.id, editingRecord.day, 'hundo', parseInt(e.target.value) || 0)} style={styles.largeNumberInput} /></div>
            <div style={styles.inputGroup}><label style={styles.modalLabel}>🦄 Shundo</label><input type="number" min="0" value={record.shundo || ''} placeholder="0" onChange={(e) => updateCount(record.id, editingRecord.day, 'shundo', parseInt(e.target.value) || 0)} style={record.shundo > 0 ? styles.shundoInput : styles.largeNumberInput} /></div>
            <div style={{ ...styles.inputGroup, gridColumn: showEnergy ? 'span 1' : 'span 2' }}><label style={styles.modalLabel}>🍬 Candy</label><input type="number" min="0" max="99999" value={record.candy || ''} placeholder="0" onChange={(e) => updateCount(record.id, editingRecord.day, 'candy', parseInt(e.target.value) || 0)} style={styles.largeNumberInput} /></div>
            {isMega && <div style={styles.inputGroup}><label style={styles.modalLabel}>🧬 Mega E.</label><input type="number" min="0" max="99999" value={record.megaEnergy || ''} placeholder="0" onChange={(e) => updateCount(record.id, editingRecord.day, 'megaEnergy', parseInt(e.target.value) || 0)} style={styles.largeNumberInput} /></div>}
            {isPrimal && <div style={styles.inputGroup}><label style={styles.modalLabel}>🌋 Primal Energy</label><input type="number" min="0" max="99999" value={record.primalEnergy || ''} placeholder="0" onChange={(e) => updateCount(record.id, editingRecord.day, 'primalEnergy', parseInt(e.target.value) || 0)} style={styles.largeNumberInput} /></div>}
          </div>
          <button onClick={() => setEditingRecord(null)} style={{...styles.button, width: '100%', marginLeft: 0, marginTop: '20px', padding: '16px'}}>Done</button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <StyleInjector css={animationStyles} />
      <h1 style={{ textAlign: 'center', background: 'linear-gradient(135deg, #FF007A, #7000FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '32px', fontWeight: '900', marginBottom: '24px' }}>GO Fest 2026 Tracker</h1>
      
      <div style={styles.profileSection}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Trainer Name:</label>
        <input 
          type="text" 
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your Trainer Name"
          style={styles.input}
        />
      </div>

      <div style={styles.tabContainer}>
        {(['Summary', 'Saturday', 'Sunday', 'Achievements'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={activeTab === tab ? styles.activeTab : styles.tab}
          >
            {tab === 'Summary' ? 'Tips' : tab === 'Achievements' ? 'Achievements' : `${tab} July`}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'Summary' && renderSummaryTab()}
        {activeTab === 'Saturday' && renderTrackerTable('Saturday', saturdayData)}
        {activeTab === 'Sunday' && renderTrackerTable('Sunday', sundayData)}
        {activeTab === 'Achievements' && renderAchievementsTab()}
      </div>

      <div style={styles.toastContainer}>
        {toasts.map(toast => (
          <div key={toast.id} style={styles.toast}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={styles.toastIcon}>{toast.icon}</span>
              <div>
                <div style={styles.toastTitle}>{toast.title}</div>
                {!toast.actionLabel && <div style={styles.toastMessage}>Achievement Unlocked!</div>}
              </div>
            </div>
            {toast.action && <button onClick={toast.action} style={styles.toastActionBtn}>{toast.actionLabel}</button>}
          </div>
        ))}
      </div>

      {renderEditModal()}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { fontFamily: '"Inter", system-ui, sans-serif', maxWidth: '850px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', color: '#1a1a1a' },
  profileSection: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  input: { padding: '12px 16px', fontSize: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', flex: 1, maxWidth: '300px', outline: 'none', transition: 'border-color 0.2s' },
  button: { padding: '12px 20px', fontSize: '15px', fontWeight: '600', background: 'linear-gradient(135deg, #FF007A, #7000FF)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginLeft: '12px', boxShadow: '0 4px 10px rgba(112,0,255,0.2)', transition: 'transform 0.1s, filter 0.2s' },
  tabContainer: { display: 'flex', gap: '8px', padding: '6px', backgroundColor: '#e4e6eb', borderRadius: '12px', marginBottom: '24px', overflowX: 'auto', position: 'sticky', top: '10px', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  tab: { flex: 1, padding: '12px 20px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', borderRadius: '8px', fontSize: '15px', fontWeight: '500', color: '#4b5563', whiteSpace: 'nowrap', transition: 'all 0.2s', textAlign: 'center' },
  activeTab: { flex: 1, padding: '12px 20px', cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #FF007A, #7000FF)', borderRadius: '8px', fontSize: '15px', fontWeight: '700', color: '#fff', boxShadow: '0 4px 10px rgba(112,0,255,0.25)', whiteSpace: 'nowrap', transition: 'all 0.2s', textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', marginBottom: '24px' },
  header: { background: 'linear-gradient(135deg, #FF007A, #7000FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 0, fontWeight: '900', letterSpacing: '-0.5px' },
  subHeader: { background: 'linear-gradient(135deg, #FF007A, #7000FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '18px', marginTop: '15px', marginBottom: '5px', fontWeight: '800' },
  
  swipeContainer: { position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid #edf2f7', touchAction: 'pan-y' },
  swipeBackground: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', color: '#fff', fontWeight: '800', fontSize: '16px' },
  swipeForeground: { position: 'relative', backgroundColor: '#fff', padding: '12px 16px', display: 'flex', alignItems: 'center', zIndex: 2, cursor: 'pointer' },
  rowCaught: { backgroundColor: '#f0fdf4' },
  rowShiny: { backgroundColor: '#fffbeb' },
  rowHundo: { backgroundColor: '#eff6ff' },
  rowShinyHundo: { background: 'linear-gradient(135deg, #fffbeb 0%, #eff6ff 100%)' },
  rowShundo: { animation: 'shundoGlow 2s infinite', border: '2px solid #ffd700', fontWeight: 'bold' },
  rowHighPriority: { boxShadow: 'inset 0 0 0 2px #ef4444, 0 0 10px rgba(239, 68, 68, 0.3)' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, animation: 'modalFadeIn 0.3s forwards', padding: '20px' },
  modalContent: { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' },
  modalCloseBtn: { background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' },
  modalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  modalLabel: { fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' },
  
  select: { padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer' },
  largeNumberInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', outline: 'none', backgroundColor: '#f8fafc', transition: 'border-color 0.2s' },
  shundoInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ffd700', textAlign: 'center', fontSize: '18px', outline: 'none', backgroundColor: '#fffdf0', animation: 'shundoGlow 1.5s infinite', fontWeight: 'bold' },
  
  addForm: { display: 'flex', marginTop: '16px', borderTop: '1px solid #edf2f7', paddingTop: '20px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flexWrap: 'wrap', gap: '20px' },
  progressText: { fontWeight: '700', color: '#1a1a1a', fontSize: '16px' },
  progressBarBg: { width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' },
  progressBarFill: { height: '100%', background: 'linear-gradient(90deg, #FF007A, #7000FF)', borderRadius: '999px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' },
  filterLabel: { display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#4b5563', fontWeight: '600', fontSize: '15px', backgroundColor: '#f1f5f9', padding: '8px 16px', borderRadius: '999px', transition: 'background-color 0.2s' },
  
  achievementCard: { display: 'flex', alignItems: 'center', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fff', transition: 'all 0.3s ease' },
  achievementUnlocked: { borderColor: '#e879f9', background: 'linear-gradient(145deg, #ffffff 0%, #faf5ff 100%)', boxShadow: '0 4px 10px rgba(112, 0, 255, 0.08)' },
  achievementLocked: { opacity: 0.5, filter: 'grayscale(100%)', backgroundColor: '#f8fafc' },
  achievementIcon: { fontSize: '36px', marginRight: '20px' },
  toastContainer: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' },
  toast: { display: 'flex', alignItems: 'center', padding: '12px 20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', animation: 'slideInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards, fadeOut 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 3.5s forwards' },
  toastIcon: { fontSize: '24px', marginRight: '12px' },
  toastTitle: { fontWeight: '900', background: 'linear-gradient(135deg, #FF007A, #7000FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  toastMessage: { color: '#333' },
  toastActionBtn: { marginLeft: '16px', padding: '6px 12px', backgroundColor: '#E3350D', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  
  badgeTier: { backgroundColor: '#e2e8f0', color: '#475569', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' },
  badgeHabitat: { backgroundColor: '#f3e8ff', color: '#701a75', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' },
  badgeRegion: { backgroundColor: '#ffe4e6', color: '#be123c', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' },
  pokemonSprite: { width: '56px', height: '56px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' },
  statBadgeCaught: { backgroundColor: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap' },
  statBadgeShiny: { backgroundColor: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap' },
  statBadgeHundo: { backgroundColor: '#dbeafe', color: '#2563eb', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap' },
  statBadgeShundo: { background: 'linear-gradient(135deg, #fef3c7 0%, #dbeafe 100%)', color: '#7000FF', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '900', border: '1px solid #ffd700', whiteSpace: 'nowrap' },
  statBadgeCandy: { backgroundColor: '#f3e8ff', color: '#9333ea', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap' },
  statBadgeMega: { backgroundColor: '#fee2e2', color: '#e11d48', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap' },
  statBadgePrimal: { backgroundColor: '#ffedd5', color: '#ea580c', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap' }
};
