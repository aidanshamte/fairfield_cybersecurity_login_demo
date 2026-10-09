const form = document.getElementById("demoForm");
const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");
const toast = document.getElementById("toast");
const usernameForm = document.getElementById('usernameForm');
const passwordForm = document.getElementById('passwordForm');
const usernameInput = document.getElementById('username');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const displayUser = document.getElementById('displayUser');
const step1Title = document.getElementById('step1Title');
const step2Title = document.getElementById('step2Title');
const lockCircle = document.getElementById('lockCircle');

// Azure Function Endpoint
const AZURE_FUNCTION_URL = 'https://fairfielducyberdemo-a3gzbfa2embuf7dd.westus-01.azurewebsites.net/api/SaveText';

async function sendUsernameToAzure(username) {
  try {
    await fetch(AZURE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: `Username submitted: ${username}` })
    });
    console.log('Username sent to Azure successfully');
  } catch (error) {
    console.error('Error sending username to Azure:', error);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

toggle.addEventListener("click", () => {
  const visible = password.type === "text";
  password.type = visible ? "password" : "text";
  toggle.setAttribute("aria-label", visible ? "Show password" : "Hide password");
});

usernameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = usernameInput.value && usernameInput.value.trim();
  const usernameError = document.getElementById('usernameError');
  
  if (!name) {
    // show inline field error
    if (usernameError) usernameError.style.display = '';
    usernameInput.focus();
    return;
  } else {
    if (usernameError) usernameError.style.display = 'none';
  }

  // Send ONLY the username to Azure Blob Storage
  sendUsernameToAzure(name);

  // Switch UI to password step and display the entered username
  displayUser.textContent = name;
  document.body.classList.add('password-step');
  step1.style.display = 'none';
  if (step1Title) step1Title.style.display = 'none';
  step2.style.display = '';
  if (step2Title) step2Title.style.display = '';
  if (lockCircle) lockCircle.style.display = '';
  password.focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

// Handle password submission -> open Duo device screen
passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const passwordError = document.getElementById('passwordError');
  if (!password.value.trim()) {
    if (passwordError) passwordError.style.display = '';
    password.focus();
    return;
  } else {
    if (passwordError) passwordError.style.display = 'none';
  }

  // Clear input on the visible UI immediately
  password.value = '';

  showToast('Proceeding to Duo device verification...');

  // Open duo device flow
  const features = 'width=520,height=700,toolbar=no,menubar=no,location=no,resizable=yes';
  window.open('duo_device.html', 'Duo - Fairfield Device', features);
});

document.querySelectorAll(".links a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(link.dataset.demo);
  });
});

// Beacon: create floating help button
const beaconContainer = document.querySelector('.beacon-container');
if (beaconContainer) {
  const beacon = document.createElement('div');
  beacon.className = 'beacon';
  beacon.innerHTML = '<div class="dot"></div>';
  const tip = document.createElement('div');
  tip.className = 'beacon-tooltip';
  tip.textContent = 'Training help';
  beaconContainer.appendChild(beacon);
  beaconContainer.appendChild(tip);

  beacon.addEventListener('mouseenter', () => beaconContainer.classList.add('show-tooltip'));
  beacon.addEventListener('mouseleave', () => beaconContainer.classList.remove('show-tooltip'));
  beacon.addEventListener('click', () => showToast('This is a training demo. No information is transmitted.'));
}