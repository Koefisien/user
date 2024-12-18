import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get, push, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMcax3DSMbwCdf6ilMStGr7-wL3GVf8-Q",
  authDomain: "codingkan.firebaseapp.com",
  databaseURL: "https://codingkan-default-rtdb.firebaseio.com",
  projectId: "codingkan",
  storageBucket: "codingkan.appspot.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const userNameInput = document.getElementById('user-name');
const userClassInput = document.getElementById('user-class');
const userTokenInput = document.getElementById('user-token');
const submitTokenBtn = document.getElementById('submit-token-btn');

// Dialog Modal Elements
const dialogTitle = document.getElementById('dialogTitle');
const dialogMessage = document.getElementById('dialogMessage');
const dialogModal = new bootstrap.Modal(document.getElementById('dialogModal'));

// Show dialog
function showDialog(title, message) {
  dialogTitle.textContent = title;
  dialogMessage.textContent = message;
  dialogModal.show();
}

// Submit token logic
submitTokenBtn.addEventListener('click', async () => {
  const userName = userNameInput.value.trim();
  const userClass = userClassInput.value.trim();
  const userToken = userTokenInput.value.trim();

  if (!userName || !userClass || !userToken) {
    showDialog('Field Kosong', 'Harap isi semua field!');
    return;
  }

  const tokenSnapshot = await get(ref(db, 'codes/current_code'));
  if (tokenSnapshot.exists() && tokenSnapshot.val() === userToken) {
    const attendanceRef = ref(db, `classes/${userClass}/users`);
    await push(attendanceRef, {
      name: userName,
      attendance: new Date().toISOString(),
      token: userToken
    });

    const newToken = generateToken();
    await update(ref(db, 'codes'), { current_code: newToken });

    showDialog('Absen Berhasil', 'Token berhasil digunakan!');
    userNameInput.value = '';
    userClassInput.value = '';
    userTokenInput.value = '';
  } else {
    showDialog('Token Tidak Valid', 'Harap periksa kembali token Anda.');
  }
});

function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 4; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Initialize Feather Icons
feather.replace();
