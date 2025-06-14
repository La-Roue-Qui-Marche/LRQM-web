import { fetchAndDisplayEvents, setupEventDetailsToggle } from './events.js';
import { setupUserSearchSection, setupAddUserSection } from './users.js';
import { setupMeasureSection } from './measures.js';

// Initialize the application
fetchAndDisplayEvents();
setupEventDetailsToggle();
setupUserSearchSection();
setupAddUserSection();
setupMeasureSection();
