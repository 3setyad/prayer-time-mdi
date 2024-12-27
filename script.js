// URL API Aladhan (sesuaikan kota dan negara)
const apiURL = "https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=2";

// Objek untuk menyimpan waktu sholat
let prayerTimes = {};

// Fungsi untuk mendapatkan data waktu sholat dari API
async function fetchPrayerTimes() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    // Ambil waktu sholat dari respons API
    const timings = data.data.timings;

    // Simpan waktu sholat ke objek prayerTimes
    prayerTimes = {
      Imsak: timings.Imsak, 
      Fajr: timings.Fajr,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha
    };

    // Tampilkan waktu sholat di halaman
    displayPrayerTimes();
    updateCountdown(); // Memulai countdown setelah data diterima
  } catch (error) {
    console.error("Gagal mendapatkan waktu sholat:", error);
  }
}

// Menampilkan waktu sholat pada setiap card
function displayPrayerTimes() {
  const prayerTimesContainer = document.getElementById("prayer-times");
  prayerTimesContainer.innerHTML = "";

  for (const [prayer, time] of Object.entries(prayerTimes)) {
    const col = document.createElement("div");
    col.className = "card shadow-sm";

    col.innerHTML = `
      <div class="card-body text-center">
        <h5 class="card-title">${prayer}</h5>
        <p class="card-text">${time}</p>
      </div>
    `;
    prayerTimesContainer.appendChild(col);
  }
}


// Fungsi untuk mendapatkan waktu sholat berikutnya
function getNextPrayerTime() {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Waktu dalam menit

  let nextPrayer = null;
  let nextPrayerTimeInMinutes = null;

  for (const [prayer, time] of Object.entries(prayerTimes)) {
    const [hours, minutes] = time.split(":").map(Number);
    const prayerTimeInMinutes = hours * 60 + minutes;

    if (prayerTimeInMinutes > currentTime) {
      nextPrayer = prayer;
      nextPrayerTimeInMinutes = prayerTimeInMinutes;
      break;
    }
  }

  if (!nextPrayer) {
    const [fajrHours, fajrMinutes] = prayerTimes.Fajr.split(":").map(Number);
    nextPrayer = "Fajr (Esok Hari)";
    nextPrayerTimeInMinutes = fajrHours * 60 + fajrMinutes + 1440; // Tambahkan 1440 menit (1 hari)
  }

  return { prayer: nextPrayer, timeInMinutes: nextPrayerTimeInMinutes };
}

// Fungsi untuk memperbarui countdown
function updateCountdown() {
  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();

  const { prayer, timeInMinutes } = getNextPrayerTime();
  const remainingTimeInMinutes = timeInMinutes - currentTimeInMinutes - 1;
  const remainingSeconds = 59 - currentSeconds;

  const hours = Math.floor(remainingTimeInMinutes / 60);
  const minutes = remainingTimeInMinutes % 60;

  document.getElementById("countdown").textContent = `${prayer} { ${hours} : ${minutes} : ${remainingSeconds} }`;
}

// Ambil data waktu sholat saat halaman pertama kali dimuat
fetchPrayerTimes();

// Memperbarui countdown setiap detik
setInterval(updateCountdown, 1000);

// Fungsi untuk memperbarui waktu
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}:${seconds}`;
  
  // Menampilkan waktu di elemen dengan ID current-time
  document.getElementById('current-time').textContent = currentTime;
}

// Memperbarui waktu setiap detik
setInterval(updateTime, 1000);

// Memperbarui waktu saat halaman pertama kali dimuat
updateTime();
