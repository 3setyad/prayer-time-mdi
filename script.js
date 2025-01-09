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
      Shubuh: timings.Fajr,
      Dhuhur: timings.Dhuhr,
      Ashar: timings.Asr,
      Maghrib: timings.Maghrib,
      Isya: timings.Isha
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
    col.className = "row border border-black rounded mb-3 p-2 shadow-sm";

    col.innerHTML = `
      <div class="col text-center border-end border-black">
        <h3>${prayer}</h3>
      </div>
      <div class="col text-center">
        <h3>${time}</h3>
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
    const [fajrHours, fajrMinutes] = prayerTimes.Shubuh.split(":").map(Number);
    nextPrayer = "Shubuh";
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

  // Menghitung jam dan menit yang tersisa
  const hours = Math.floor(remainingTimeInMinutes / 60);
  const minutes = remainingTimeInMinutes % 60;

  // Menambahkan angka nol di depan jika kurang dari 2 digit
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  // Menampilkan waktu dalam format 2 digit
  document.getElementById("countdown").textContent = `${prayer} { ${formattedHours} : ${formattedMinutes} : ${formattedSeconds} }`;
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

// Fungsi untuk memeriksa apakah sekarang adalah waktu sholat
function checkPrayerTime() {
  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  const { prayer, timeInMinutes } = getNextPrayerTime();

  if (currentTimeInMinutes === timeInMinutes) {
    // Redirect ke halaman countdown
    window.location.href = `countdown.html?prayer=${encodeURIComponent(prayer)}`;
  }
}

// Jalankan pengecekan setiap menit
setInterval(checkPrayerTime, 60000); // Periksa setiap 60 detik
checkPrayerTime(); // Jalankan sekali saat halaman dimuat

// Generate QR Code Presensi
function generateQRCode(data) {
  console.log("Generating QR Code for:", data);

  // Dapatkan elemen target
  const qrCodeContainer = document.getElementById("qr-code-container");
  qrCodeContainer.innerHTML = ""; // Hapus konten sebelumnya

  // Buat elemen canvas
  const canvas = document.createElement("canvas");
  qrCodeContainer.appendChild(canvas); // Tambahkan ke container

  // Render QR Code di elemen canvas
  QRCode.toCanvas(canvas, data, {
    width: 150,
    margin: 2,
    color: {
      dark: "#000000", // Warna QR Code
      light: "#ffffff" // Warna latar belakang
    }
  }, function (error) {
    if (error) {
      console.error("Error generating QR code:", error);
    } else {
      console.log("QR Code successfully generated!");
    }
  });
}

// Data QR Code (gabungan nama sholat dan waktu saat ini)
const qrCodeData = `${prayerName}-${new Date().toISOString()}`;
generateQRCode(qrCodeData);
