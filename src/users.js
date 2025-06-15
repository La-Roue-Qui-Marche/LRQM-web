import { showNotification } from './notifications.js';
import { API_BASE_URL } from '../config.js';

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}

export function setupUserSearchSection() {
  const bibInput = document.getElementById('bibInput');
  const usernameSearchInput = document.getElementById('usernameSearchInput');
  const searchByBibBtn = document.getElementById('searchByBibBtn');
  const searchByUsernameBtn = document.getElementById('searchByUsernameBtn');

  const userIdCell = document.getElementById('userId');
  const userNameCell = document.getElementById('userName');
  const userBibIdCell = document.getElementById('userBibId');
  const userEventIdCell = document.getElementById('userEventId');
  const userMetersCell = document.getElementById('userMeters');
  const userTimeCell = document.getElementById('userTime');

  function clearUserDetails() {
    userIdCell.textContent = '-';
    userNameCell.textContent = '-';
    userBibIdCell.textContent = '-';
    userEventIdCell.textContent = '-';
    userMetersCell.textContent = '-';
    userTimeCell.textContent = '-';
  }

  function fillUserDetails(user) {
    userIdCell.textContent = user.id;
    userNameCell.textContent = user.username || 'Non disponible';
    userBibIdCell.textContent = user.bib_id;
    userEventIdCell.textContent = user.event_id;

    // Fetch additional user details
    Promise.all([
      fetch(`/api/users/${user.id}/meters`).then(r => r.json()),
      fetch(`/api/users/${user.id}/time`).then(r => r.json())
    ])
      .then(([meters, time]) => {
        userMetersCell.textContent = `${meters.meters || 'Non disponible'} m`;
        userTimeCell.textContent = formatTime(time.time || 0);
      })
      .catch(err => {
        showNotification(`Erreur lors de la récupération des détails supplémentaires: ${err.message}`, 'error');
      });
  }

  function performSearch(searchType) {
    const selectedEventId = localStorage.getItem('selectedEventId');

    if (!selectedEventId) {
      showNotification('Aucun événement sélectionné.', 'error');
      return;
    }

    fetch(`${API_BASE_URL}/api/users`)
      .then(r => r.json())
      .then(users => {
        const filteredUsers = users.filter(user => user.event_id === parseInt(selectedEventId, 10));
        let user;
        
        if (searchType === 'bib') {
          const bibId = parseInt(bibInput.value, 10);
          if (!bibId) {
            showNotification('Veuillez entrer un numéro de dossard valide.', 'error');
            return;
          }
          user = filteredUsers.find(u => parseInt(u.bib_id, 10) === bibId);
        } else {
          const username = usernameSearchInput.value.trim();
          if (!username) {
            showNotification('Veuillez entrer un pseudo.', 'error');
            return;
          }
          user = filteredUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
        }

        if (!user) {
          showNotification('Utilisateur introuvable', 'error');
          clearUserDetails();
          return;
        }

        // Fill table with user data and show success
        fillUserDetails(user);
        showNotification('Utilisateur trouvé', 'success');
      })
      .catch(err => {
        showNotification(err.message, 'error');
      });
  }

  searchByBibBtn.addEventListener('click', () => performSearch('bib'));
  searchByUsernameBtn.addEventListener('click', () => performSearch('username'));
}

export function setupAddUserSection() {
  const usernameInput = document.getElementById('usernameInput');
  const bibIdInput = document.getElementById('bibIdInput');
  const autoFillBibIdBtn = document.getElementById('autoFillBibIdBtn');
  const addUserBtn = document.getElementById('addUserBtn');

  // Auto-fill functionality
  async function fetchNextBibId() {
    const selectedEventId = localStorage.getItem('selectedEventId');
    if (!selectedEventId) {
      showNotification('Aucun événement sélectionné.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      const users = await response.json();
      const filteredUsers = users.filter(user => user.event_id === parseInt(selectedEventId, 10));
      
      // Sort bib_ids numerically
      const usedBibIds = filteredUsers.map(user => parseInt(user.bib_id, 10)).sort((a, b) => a - b);
      
      // Find first available number
      let nextBibId = 1;
      for (const currentBibId of usedBibIds) {
        if (currentBibId !== nextBibId) {
          break;
        }
        nextBibId++;
      }
      
      bibIdInput.value = nextBibId;
    } catch (err) {
      showNotification(`Erreur lors de la récupération des utilisateurs: ${err.message}`, 'error');
    }
  }

  // Keep the auto-fill button functionality
  autoFillBibIdBtn.addEventListener('click', () => {
    fetchNextBibId();
  });

  // Add user functionality
  addUserBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const bibId = bibIdInput.value.trim();
    const eventId = parseInt(localStorage.getItem('selectedEventId'), 10);

    if (!username || !bibId) {
      showNotification('Veuillez remplir tous les champs', 'error');
      return;
    }

    const payload = { 
      username, 
      bib_id: bibId.toString(), // Ensure bib_id is a string
      event_id: eventId 
    };
    console.log('Sending user creation request with payload:', payload);

    fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then(response => {
        showNotification(`Utilisateur ${username} ajouté avec succès`, 'success');
        usernameInput.value = '';
        bibIdInput.value = '';
      })
      .catch(err => showNotification(err.message, 'error'));
  });
}
