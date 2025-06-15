import { API_BASE_URL } from '../config.js';

export const eventSelect = document.getElementById('eventSelect');
export const result = document.getElementById('result');

const eventIdCell = document.getElementById('eventId');
const eventNameCell = document.getElementById('eventName');
const eventStartDateCell = document.getElementById('eventStartDate');
const eventEndDateCell = document.getElementById('eventEndDate');
const eventMetersGoalCell = document.getElementById('eventMetersGoal');
const eventCoordinatesCell = document.getElementById('eventCoordinates');
const eventMeetingPointCell = document.getElementById('eventMeetingPoint');
const selectedEventIdHint = document.getElementById('selectedEventIdHint');

export function fetchAndDisplayEvents() {
  fetch(`${API_BASE_URL}/api/events`)
    .then(r => r.json())
    .then(events => {
      eventSelect.innerHTML = '';
      let defaultEvent = null;

      for (const e of events) {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = e.name;
        eventSelect.appendChild(opt);

        if (e.name === 'La Roue Qui Marche 2025') {
          defaultEvent = e;
          opt.selected = true;
        }
      }

      const savedEventId = localStorage.getItem('selectedEventId');
      if (savedEventId) {
        const savedEvent = events.find(e => e.id === parseInt(savedEventId, 10));
        if (savedEvent) {
          eventSelect.value = savedEvent.id;
          displayEventDetails(savedEvent);
          if (selectedEventIdHint) {
            selectedEventIdHint.textContent = savedEvent.id;
          }
        }
      } else if (defaultEvent) {
        displayEventDetails(defaultEvent);
        if (selectedEventIdHint) {
          selectedEventIdHint.textContent = defaultEvent.id;
        }
      }

      eventSelect.addEventListener('change', () => {
        const selectedEvent = events.find(e => e.id === parseInt(eventSelect.value, 10));
        if (selectedEvent) {
          localStorage.setItem('selectedEventId', selectedEvent.id); 
          displayEventDetails(selectedEvent);
          if (selectedEventIdHint) {
            selectedEventIdHint.textContent = selectedEvent.id;
          }
        }
      });
    })
    .catch(err => {
      result.textContent = 'Erreur : ' + err.message;
    });
}

function displayEventDetails(event) {
  eventIdCell.textContent = event.id;
  eventNameCell.textContent = event.name;
  eventStartDateCell.textContent = new Date(event.start_date).toLocaleString();
  eventEndDateCell.textContent = new Date(event.end_date).toLocaleString();
  eventMetersGoalCell.textContent = event.meters_goal;
  eventCoordinatesCell.textContent = `(${event.site_left_up_lat}, ${event.site_left_up_lng}) - (${event.site_right_down_lat}, ${event.site_right_down_lng})`;
  eventMeetingPointCell.textContent = `(${event.meeting_point_lat}, ${event.meeting_point_lng})`;
}

export function setupEventDetailsToggle() {
  const toggleBtn = document.getElementById('toggleEventDetails');
  const details = document.getElementById('eventDetails');
  
  toggleBtn.addEventListener('click', () => {
    if (details.style.display === 'none' || !details.style.display) {
      details.style.display = 'block';
      toggleBtn.textContent = 'Masquer ';
    } else {
      details.style.display = 'none';
      toggleBtn.textContent = 'Plus d\'infos';
    }
  });
  
  // Initially hide details
  details.style.display = 'none';
}
