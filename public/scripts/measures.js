import { showNotification } from './notifications.js';

export function setupMeasureSection() {
  const measureBibInput = document.getElementById('measureBibInput');
  const contributorsInput = document.getElementById('contributorsInput');
  const measureMetersInput = document.getElementById('measureMetersInput');
  const addMetersBtn = document.getElementById('addMetersBtn');

  addMetersBtn.addEventListener('click', async () => {
    try {
      const bibId = measureBibInput.value.trim();
      const contributors = parseInt(contributorsInput.value, 10);
      const meters = parseInt(measureMetersInput.value, 10);

      // Validation first
      if (!bibId) throw new Error('Veuillez entrer un numéro de dossard');
      if (!contributors || contributors < 1 || contributors > 4) throw new Error('Le nombre de contributeurs doit être entre 1 et 4');
      if (!meters || meters < 1) throw new Error('Veuillez entrer une distance valide');

      // Show confirmation modal
      const modal = new bootstrap.Modal(document.getElementById('confirmMeasureModal'));
      document.getElementById('confirmBibId').textContent = bibId;
      document.getElementById('confirmContributors').textContent = contributors;
      document.getElementById('confirmMeters').textContent = meters;

      // Handle confirmation
      const confirmBtn = document.getElementById('confirmMeasureBtn');

      // Remove any existing click handler
      confirmBtn.replaceWith(confirmBtn.cloneNode(true));
      const newConfirmBtn = document.getElementById('confirmMeasureBtn');

      newConfirmBtn.onclick = async () => {
        const selectedEventId = localStorage.getItem('selectedEventId');
        if (!selectedEventId) {
          throw new Error('Aucun événement sélectionné');
        }
        modal.hide();
        await processMeasure(bibId, contributors, meters, selectedEventId);
      };

      modal.show();

    } catch (err) {
      showNotification(err.message, 'error');
    }
  });

  async function processMeasure(bibId, contributors, meters, selectedEventId) {
    try {
      // Use the passed selectedEventId
      const usersResponse = await fetch(`/api/users`);
      const users = await usersResponse.json();
      const user = users.find(u => u.bib_id === bibId && u.event_id === parseInt(selectedEventId, 10));
      if (!user) throw new Error('Utilisateur introuvable pour ce numéro de dossard');

      // 1. Start measure
      const startResponse = await fetch(`/api/measures/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          contributors_number: contributors
        })
      });
      if (!startResponse.ok) throw new Error('Erreur lors du démarrage de la mesure');
      const measureData = await startResponse.json();

      // 2. Edit meters
      const editResponse = await fetch(`/api/measures/${measureData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meters })
      });
      if (!editResponse.ok) throw new Error('Erreur lors de l\'ajout des mètres');

      // 3. Stop measure
      const stopResponse = await fetch(`/api/measures/${measureData.id}/stop`, {
        method: 'PUT'
      });
      if (!stopResponse.ok) throw new Error('Erreur lors de l\'arrêt de la mesure');

      // Success
      showNotification(`Mesure ajoutée : ${meters}m pour le dossard ${bibId}`, 'success');
      measureBibInput.value = '';
      contributorsInput.value = '1';
      measureMetersInput.value = '';
    } catch (err) {
      showNotification(err.message, 'error');
    }
  }
}
