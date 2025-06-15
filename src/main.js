import { fetchAndDisplayEvents, setupEventDetailsToggle } from './events.js';
import { setupUserSearchSection, setupAddUserSection } from './users.js';
import { setupMeasureSection } from './measures.js';
import { setupThemeToggle } from './theme.js';

fetchAndDisplayEvents();
setupEventDetailsToggle();
setupUserSearchSection();
setupAddUserSection();
setupMeasureSection();
setupThemeToggle();
