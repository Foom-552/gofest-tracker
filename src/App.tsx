import React, { useState } from 'react';

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
  priority: 'High' | 'Medium' | 'Low' | 'None';
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

const INITIAL_SATURDAY_DATA: RaidRecord[] = [
  { id: 'sat-0', pokemon: 'Mega Mewtwo X', raidTier: 'Super Mega', habitat: 'All Day', timeAEST: '10:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  
  // Stormfire Peaks
  { id: 'sat-1', pokemon: 'Mega Abomasnow', raidTier: 'Mega', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-2', pokemon: 'Mega Blaziken', raidTier: 'Mega', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-3', pokemon: 'Raikou', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-4', pokemon: 'Suicune', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-5', pokemon: 'Mega Ampharos', raidTier: 'Mega', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-6', pokemon: 'Articuno', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-7', pokemon: 'Entei', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-8', pokemon: 'Ho-Oh', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-9', pokemon: 'Lugia', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-10', pokemon: 'Moltres', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-11', pokemon: 'Zapdos', raidTier: '5-Star', habitat: '⚡🔥❄️ Stormfire Peaks', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  
  // Astral Tides
  { id: 'sat-12', pokemon: 'Mega Gengar', raidTier: 'Mega', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-13', pokemon: 'Mega Swampert', raidTier: 'Mega', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-14', pokemon: 'Uxie', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Asia-Pacific', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-15', pokemon: 'Mesprit', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Europe/ME/Africa/India', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-16', pokemon: 'Azelf', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Americas', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-17', pokemon: 'Xerneas', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-18', pokemon: 'Yveltal', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-19', pokemon: 'Solgaleo', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-20', pokemon: 'Lunala', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-21', pokemon: 'Dialga', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-22', pokemon: 'Origin Giratina', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-23', pokemon: 'Mega Alakazam', raidTier: 'Mega', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-24', pokemon: 'Palkia', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-25', pokemon: 'Altered Giratina', raidTier: '5-Star', habitat: '🔮👻💧 Astral Tides', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  
  // Dragonflight Summit
  { id: 'sat-26', pokemon: 'Rayquaza', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-27', pokemon: 'Kyurem', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-28', pokemon: 'Kyogre', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-29', pokemon: 'Mega Aerodactyl', raidTier: 'Mega', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-30', pokemon: 'Mega Pidgeot', raidTier: 'Mega', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sat-31', pokemon: 'Mega Salamence', raidTier: 'Mega', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-32', pokemon: 'Groudon', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-33', pokemon: 'Reshiram', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sat-34', pokemon: 'Zekrom', raidTier: '5-Star', habitat: '🦅🪨🐉 Dragonflight Summit', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' }
];

const INITIAL_SUNDAY_DATA: RaidRecord[] = [
  { id: 'sun-0', pokemon: 'Mega Mewtwo Y', raidTier: 'Super Mega', habitat: 'All Day', timeAEST: '10:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },

  // Earthforged Domain
  { id: 'sun-1', pokemon: 'Origin Dialga', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-2', pokemon: 'Mega Garchomp', raidTier: 'Mega', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-3', pokemon: 'Registeel', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-4', pokemon: 'Origin Palkia', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-5', pokemon: 'Regigigas', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-6', pokemon: 'Therian Tornadus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-7', pokemon: 'Incarnate Thundurus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-8', pokemon: 'Therian Thundurus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-9', pokemon: 'Therian Landorus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-10', pokemon: 'Incarnate Enamorus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-11', pokemon: 'Therian Enamorus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-12', pokemon: 'Regieleki', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-13', pokemon: 'Regidrago', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-14', pokemon: 'Mega Metagross', raidTier: 'Mega', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-15', pokemon: 'Regirock', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-16', pokemon: 'Regice', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-17', pokemon: 'Heatran', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-18', pokemon: 'Incarnate Tornadus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-19', pokemon: 'Incarnate Landorus', raidTier: '5-Star', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-20', pokemon: 'Mega Audino', raidTier: 'Mega', habitat: '🪨⚙️⬜ Earthforged Domain', timeAEST: '10:00 - 13:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Low' },

  // Verdant Anomaly
  { id: 'sun-21', pokemon: 'Buzzwole', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Americas/Greenland', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-22', pokemon: 'Pheromosa', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Europe/ME/Africa/India', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-23', pokemon: 'Kartana', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Northern Hemisphere', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-24', pokemon: 'Blacephalon', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Western Hemisphere', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-25', pokemon: 'Mega Pinsir', raidTier: 'Mega', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-26', pokemon: 'Mega Sceptile', raidTier: 'Mega', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-27', pokemon: 'Normal Deoxys', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-28', pokemon: 'Attack Deoxys', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-29', pokemon: 'Defense Deoxys', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-30', pokemon: 'Douse Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-31', pokemon: 'Shock Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-32', pokemon: 'Burn Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-33', pokemon: 'Chill Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-34', pokemon: 'Nihilego', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-35', pokemon: 'Xurkitree', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Asia-Pacific', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-36', pokemon: 'Celesteela', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Southern Hemisphere', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-37', pokemon: 'Guzzlord', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-38', pokemon: 'Stakataka', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Eastern Hemisphere', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-39', pokemon: 'Tapu Koko', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-40', pokemon: 'Speed Deoxys', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-41', pokemon: 'Tapu Bulu', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-42', pokemon: 'Tapu Fini', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-43', pokemon: 'Mega Beedrill', raidTier: 'Mega', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-44', pokemon: 'Normal Genesect', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-45', pokemon: 'Necrozma', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-46', pokemon: 'Tapu Lele', raidTier: '5-Star', habitat: '🐛🌿☠️ Verdant Anomaly', timeAEST: '13:00 - 16:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },

  // Twilight Battlefield
  { id: 'sun-47', pokemon: 'Mega Tyranitar', raidTier: 'Mega', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-48', pokemon: 'Mega Gardevoir', raidTier: 'Mega', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-49', pokemon: 'Mega Lucario', raidTier: 'Mega', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-50', pokemon: 'Hero Zacian', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-51', pokemon: 'Latios', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-52', pokemon: 'Cresselia', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-53', pokemon: 'Cobalion', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-54', pokemon: 'Terrakion', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-55', pokemon: 'Hero Zamazenta', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-56', pokemon: 'Latias', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' },
  { id: 'sun-57', pokemon: 'Darkrai', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'High' },
  { id: 'sun-58', pokemon: 'Virizion', raidTier: '5-Star', habitat: '🌑🧚🥊 Twilight Battlefield', timeAEST: '16:00 - 19:00', region: 'Global', caught: 0, shiny: 0, hundo: 0, priority: 'Medium' }
];

export default function App() {
  const [displayName, setDisplayName] = useLocalStorage<string>('gofest_displayName', '');
  const [activeTab, setActiveTab] = useState<'Summary' | 'Saturday' | 'Sunday' | 'Achievements'>('Summary');

  // Initial mock data - you will replace this with your Excel data
  const [saturdayData, setSaturdayData] = useLocalStorage<RaidRecord[]>('gofest_sat', INITIAL_SATURDAY_DATA);

  const [sundayData, setSundayData] = useLocalStorage<RaidRecord[]>('gofest_sun', INITIAL_SUNDAY_DATA);

  // Form state for adding new custom raids
  const [newPokemon, setNewPokemon] = useState('');
  const [hideCaught, setHideCaught] = useState(false);

  // --- Handlers ---
  const updateCount = (id: string, day: 'Saturday' | 'Sunday', field: 'caught' | 'shiny' | 'hundo', value: number) => {
    const data = day === 'Saturday' ? saturdayData : sundayData;
    const setData = day === 'Saturday' ? setSaturdayData : setSundayData;
    setData(data.map(r => r.id === id ? { ...r, [field]: Math.max(0, value) } : r));
  };

  const updatePriority = (id: string, day: 'Saturday' | 'Sunday', newPriority: RaidRecord['priority']) => {
    const data = day === 'Saturday' ? saturdayData : sundayData;
    const setData = day === 'Saturday' ? setSaturdayData : setSundayData;
    setData(data.map(r => r.id === id ? { ...r, priority: newPriority } : r));
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
    }
  };

  // --- Render Helpers ---
  const renderSummaryTab = () => (
    <div style={styles.card}>
      <h2 style={styles.header}>Summary & Tips</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#E3350D', fontSize: '18px', marginTop: '15px', marginBottom: '5px' }}>📅 Event Dates & Times (AEST)</h3>
        <p style={{ margin: '0' }}>Saturday July 11 & Sunday July 12, 2026<br/>10:00 AM – 7:00 PM AEST</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#E3350D', fontSize: '18px', marginTop: '15px', marginBottom: '5px' }}>🦘 Australia-Specific Notes</h3>
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
        <h3 style={{ color: '#E3350D', fontSize: '18px', marginTop: '15px', marginBottom: '5px' }}>🧬 Super Mega Raids</h3>
        <ul style={{ lineHeight: '1.6', margin: '5px 0', paddingLeft: '20px' }}>
          <li>⭐ <strong>Saturday:</strong> Mega Mewtwo X – all day 10:00–19:00</li>
          <li>⭐ <strong>Sunday:</strong> Mega Mewtwo Y – all day 10:00–19:00</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#E3350D', fontSize: '18px', marginTop: '15px', marginBottom: '5px' }}>💡 Pro Tips</h3>
        <ul style={{ lineHeight: '1.6', margin: '5px 0', paddingLeft: '20px' }}>
          <li>Stock up on Remote Raid Passes before the event for region-locked Pokémon!</li>
          <li>Add international friends now to get invites for Mesprit, Azelf, Kartana, Blacephalon, Buzzwole, and Pheromosa.</li>
          <li>You get up to 9 FREE Raid Passes per day by spinning Gym Photo Discs.</li>
          <li>Shiny rates are boosted for all featured Pokémon during the event.</li>
          <li><strong>App Usage:</strong> Navigate to the Saturday and Sunday tabs to mark off caught bosses. Add unexpected raids using the "Add Custom Raid" feature at the bottom of the tables.</li>
          <li><strong>Offline Mode:</strong> This app works offline! If you lose connection at the park, your changes are still safely saved locally to your device.</li>
        </ul>
      </div>

      <button onClick={resetProgress} style={{ ...styles.button, backgroundColor: '#dc3545', marginTop: '10px', marginLeft: '0' }}>Reset All Progress</button>
    </div>
  );

  const renderAchievementsTab = () => {
    const allData = [...saturdayData, ...sundayData];
    const totalCaught = allData.reduce((sum, r) => sum + (r.caught || 0), 0);
    const totalShiny = allData.reduce((sum, r) => sum + (r.shiny || 0), 0);
    const totalHundo = allData.reduce((sum, r) => sum + (r.hundo || 0), 0);
    const caughtMewtwoX = saturdayData.find(r => r.pokemon === 'Mega Mewtwo X')?.caught || 0;
    const caughtMewtwoY = sundayData.find(r => r.pokemon === 'Mega Mewtwo Y')?.caught || 0;
    
    const uniqueUltraBeasts = allData.filter(r => ['Nihilego', 'Buzzwole', 'Pheromosa', 'Xurkitree', 'Celesteela', 'Kartana', 'Guzzlord', 'Stakataka', 'Blacephalon'].includes(r.pokemon) && r.caught > 0).length;

    const achievements = [
      { id: 'first-blood', title: 'First Blood', desc: 'Complete your first raid of GO Fest.', icon: '🎯', unlocked: totalCaught >= 1 },
      { id: 'raid-novice', title: 'Raid Novice', desc: 'Complete 10 total raids.', icon: '🥉', unlocked: totalCaught >= 10 },
      { id: 'raid-pro', title: 'Raid Professional', desc: 'Complete 30 total raids.', icon: '🥈', unlocked: totalCaught >= 30 },
      { id: 'raid-master', title: 'Raid Master', desc: 'Complete 50 total raids.', icon: '🥇', unlocked: totalCaught >= 50 },
      { id: 'shiny-spark', title: 'Ooh, Sparkly!', desc: 'Catch your first Shiny Pokémon.', icon: '✨', unlocked: totalShiny >= 1 },
      { id: 'shiny-hunter', title: 'Shiny Hunter', desc: 'Catch 5 or more Shiny Pokémon.', icon: '🌟', unlocked: totalShiny >= 5 },
      { id: 'perfect-catch', title: 'Perfection', desc: 'Catch a 100% IV (Hundo) Pokémon.', icon: '💯', unlocked: totalHundo >= 1 },
      { id: 'super-mega', title: 'Super Mega Power', desc: 'Catch both Mega Mewtwo X and Mega Mewtwo Y.', icon: '🧬', unlocked: caughtMewtwoX > 0 && caughtMewtwoY > 0 },
      { id: 'beast-ball', title: 'Ultra Beast Collector', desc: 'Catch at least 5 different Ultra Beasts.', icon: '🌌', unlocked: uniqueUltraBeasts >= 5 }
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
      <div style={styles.card}>
        <h2 style={styles.header}>🏆 Achievements ({unlockedCount}/{achievements.length})</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>Track your overall progress throughout the event. Can you unlock them all?</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {achievements.map(a => (
            <div key={a.id} style={{ ...styles.achievementCard, ...(a.unlocked ? styles.achievementUnlocked : styles.achievementLocked) }}>
              <div style={styles.achievementIcon}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: a.unlocked ? '#E3350D' : '#555' }}>{a.title}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{a.desc}</p>
              </div>
              {a.unlocked && <div style={{ fontSize: '24px', color: '#4CAF50' }}>✅</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTrackerTable = (day: 'Saturday' | 'Sunday', data: RaidRecord[]) => {
    const timeSlots = [
      { label: '⭐ All Day', timeAEST: '10:00 - 19:00' },
      { label: '🕐 10:00 AM - 1:00 PM', timeAEST: '10:00 - 13:00' },
      { label: '🕒 1:00 PM - 4:00 PM', timeAEST: '13:00 - 16:00' },
      { label: '🕓 4:00 PM - 7:00 PM', timeAEST: '16:00 - 19:00' },
      { label: '➕ Custom Raids', timeAEST: 'Any' },
    ];

    const visibleData = hideCaught ? data.filter(r => r.caught === 0) : data;
    const caughtCount = data.filter(r => r.caught > 0).length;
    const totalCount = data.length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={styles.toolbar}>
          <span style={styles.progressText}>🏆 Progress: {caughtCount} / {totalCount}</span>
          <label style={styles.filterLabel}>
            <input type="checkbox" checked={hideCaught} onChange={(e) => setHideCaught(e.target.checked)} style={{ marginRight: '8px', transform: 'scale(1.2)', cursor: 'pointer' }} />
            Hide Caught
          </label>
        </div>

        {timeSlots.map((slot) => {
          const slotData = visibleData.filter((r) => r.timeAEST === slot.timeAEST);
          
          // Hide section if it's empty, EXCEPT for Custom Raids
          if (slotData.length === 0 && slot.timeAEST !== 'Any') return null;

          return (
            <div key={slot.label} style={styles.card}>
              <h3 style={{ color: '#333', borderBottom: '2px solid #E3350D', paddingBottom: '8px', marginTop: 0 }}>
                {slot.label}
              </h3>
              
              {slotData.length > 0 && (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Pokémon</th>
                        <th style={styles.th}>Raid Tier</th>
                        <th style={styles.th}>Habitat</th>
                        <th style={styles.th}>Region</th>
                        <th style={styles.th}>Priority</th>
                        <th style={styles.th}>Caught?</th>
                        <th style={styles.th}>Shiny?</th>
                        <th style={styles.th}>Hundo?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slotData.map((record) => (
                        <tr key={record.id} style={record.caught > 0 ? styles.rowCaught : styles.row}>
                          <td style={styles.td}><strong>{record.pokemon}</strong></td>
                          <td style={styles.td}>{record.raidTier}</td>
                          <td style={styles.td}>{record.habitat}</td>
                          <td style={styles.td}>{record.region}</td>
                          <td style={styles.td}>
                            <select 
                              value={record.priority} 
                              onChange={(e) => updatePriority(record.id, day, e.target.value as RaidRecord['priority'])}
                              style={styles.select}
                            >
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                              <option value="None">None</option>
                            </select>
                          </td>
                          <td style={styles.td}>
                            <input 
                              type="number" 
                              min="0"
                              placeholder="0"
                              value={record.caught || ''} 
                              onChange={(e) => updateCount(record.id, day, 'caught', parseInt(e.target.value) || 0)} 
                              style={styles.numberInput}
                            />
                          </td>
                          <td style={styles.td}>
                            <input 
                              type="number" 
                              min="0"
                              placeholder="0"
                              value={record.shiny || ''} 
                              onChange={(e) => updateCount(record.id, day, 'shiny', parseInt(e.target.value) || 0)} 
                              style={styles.numberInput}
                            />
                          </td>
                          <td style={styles.td}>
                            <input 
                              type="number" 
                              min="0"
                              placeholder="0"
                              value={record.hundo || ''} 
                              onChange={(e) => updateCount(record.id, day, 'hundo', parseInt(e.target.value) || 0)} 
                              style={styles.numberInput}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Show Custom Raid Form under the Custom Raids section */}
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

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>GO Fest 2026 Tracker</h1>
      
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
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '15px', backgroundColor: '#fafafa', minHeight: '100vh' },
  profileSection: { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ddd', flex: 1, maxWidth: '300px' },
  button: { padding: '10px 15px', fontSize: '16px', backgroundColor: '#E3350D', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: '10px' },
  tabContainer: { display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '20px', overflowX: 'auto', position: 'sticky', top: 0, backgroundColor: '#fafafa', zIndex: 10, paddingTop: '10px' },
  tab: { padding: '12px 20px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', fontSize: '16px', color: '#666', whiteSpace: 'nowrap' },
  activeTab: { padding: '12px 20px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', fontSize: '16px', fontWeight: 'bold', color: '#E3350D', borderBottom: '3px solid #E3350D', whiteSpace: 'nowrap' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  header: { color: '#E3350D', marginTop: 0 },
  tableContainer: { overflowX: 'auto', marginBottom: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd', whiteSpace: 'nowrap' },
  td: { padding: '12px', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' },
  row: { transition: 'background-color 0.2s' },
  rowCaught: { backgroundColor: '#e8f5e9', color: '#888', textDecoration: 'line-through' },
  select: { padding: '6px', borderRadius: '4px', border: '1px solid #ccc' },
  numberInput: { width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'center', fontSize: '14px' },
  addForm: { display: 'flex', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '15px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  progressText: { fontWeight: 'bold', color: '#E3350D', fontSize: '16px' },
  filterLabel: { display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#555', fontWeight: 'bold', fontSize: '16px' },
  achievementCard: { display: 'flex', alignItems: 'center', padding: '15px', border: '2px solid #eee', borderRadius: '8px', backgroundColor: '#fff', transition: 'all 0.3s ease' },
  achievementUnlocked: { borderColor: '#E3350D', backgroundColor: '#fff9f9', boxShadow: '0 2px 5px rgba(227, 53, 13, 0.1)' },
  achievementLocked: { opacity: 0.6, filter: 'grayscale(100%)' },
  achievementIcon: { fontSize: '32px', marginRight: '15px' }
};
