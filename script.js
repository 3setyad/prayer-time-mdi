document.addEventListener('DOMContentLoaded', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const timings = data.data.timings;
          const location = data.data.meta.timezone;

          document.getElementById('location').innerText = `Lokasi: ${location}`;

          // Menyembunyikan waktu tertentu
          const hiddenTimes = ['Sunset', 'Midnight', 'Firstthird', 'Lastthird'];
          
          const prayerTimesContainer = document.getElementById('prayer-times');
          // Memindahkan waktu Imsak sebelum Shubuh
          const sortedTimes = [
            { name: 'Imsak', time: timings['Imsak'] },
            { name: 'Fajr', time: timings['Fajr'] },
            { name: 'Dhuhr', time: timings['Dhuhr'] },
            { name: 'Asr', time: timings['Asr'] },
            { name: 'Maghrib', time: timings['Maghrib'] },
            { name: 'Isha', time: timings['Isha'] }
          ];

          // Tampilkan waktu sholat jika tidak ada dalam daftar hiddenTimes
          sortedTimes.forEach(({ name, time }) => {
            if (!hiddenTimes.includes(name)) {
              const card = `
                <div style="width:100%" class="col-md-4 text-center">
                  <div class="card shadow-sm">
                    <div class="card-body">
                      <h5 class="card-title text-primary">${name}</h5>
                      <p class="card-text">${time}</p>
                    </div>
                  </div>
                </div>
              `;
              prayerTimesContainer.innerHTML += card;
            }
          });
        })
        .catch(err => console.error('Error fetching prayer times:', err));
    });
  } else {
    alert('Geolocation tidak didukung oleh browser ini.');
  }
});
