# Audit performa — 6 September 2026

Audit ini membandingkan kode dan aset production sebelum perubahan dengan build
lokal sesudah optimasi. Browser tidak terhubung pada sesi ini: **tidak ada klaim
skor Lighthouse, FPS, INP, atau LCP yang sudah diukur**.

## Temuan dan perbaikan

| Sumber beban | Perbaikan |
| --- | --- |
| Cursor menggerakkan backdrop-filter, banyak bayangan, dan spring; ikut menangani sentuhan | Cursor dekoratif ringan berbasis transform, maksimum satu pembaruan per animation frame. Pointer native tetap tersedia. Tidak aktif pada touch/reduced-motion dan membatalkan frame saat tab tersembunyi/unmount. |
| Mouse dan sensor orientasi mengubah CSS variables pada root setiap gerakan | Hapus pembaruan global; gradasi glass menjadi statis. |
| Blob bergerak di bawah blur seluruh layar, ditambah blur pada setiap kartu/skill | Latar tetap lembut tetapi statis; hapus blur overlay dan blur berlapis pada kartu/skill. Blur navigasi 40 → 16 px; panel mobile memakai warna transparan ringan. |
| WebGL dan fisika berjalan di luar viewport | Muat Lanyard saat mendekati viewport (160 px), pause fisika dan render ketika tidak terlihat atau tab disembunyikan. |
| Render beresolusi tinggi dan pembuatan ulang titik tali setiap frame | Batas DPR desktop 2 → 1,5, mobile 1,5 → 1,25. Titik tali dipakai ulang; geometri berhenti diperbarui ketika rigid body tidur. Environment map 256 → 128 px, satu capture. |
| Tekstur bawaan GLB sudah diganti kedua sisinya, tetapi masih dikirim ke pengguna | Buat GLB turunan tanpa bitmap bawaan; seluruh byte geometri, node dan accessor tetap sama. Aset asli disimpan. |
| Tab dan aset berat dipraunduh terlalu dini | Lazy-load Projects/Skills/Contact. Precache PWA hanya shell, aset lain CacheFirst setelah dipakai. |
| Tilt kartu proyek membaca ukuran DOM pada setiap event mouse | Gabungkan pembaruan per animation frame dan batalkan saat mouse keluar/unmount. |

## Ukuran terukur

Ukuran di bawah menggunakan byte file, bukan perkiraan waktu muat.

| Aset | Sebelum | Sesudah | Pengurangan |
| --- | ---: | ---: | ---: |
| JavaScript entry | 337.926 B | 299.441 B | 11,4% |
| JavaScript entry, gzip | 110.392 B | 97.402 B | 11,8% |
| CSS entry | sekitar 36,08 kB | 18,71 kB | sekitar 48% |
| Model GLB | 2.457.784 B | 162.612 B | 93,4% |
| Precache PWA (output Workbox) | 7.636 KiB / 25 aset | 1.336 KiB / 8 aset | sekitar 82,5% |

Chunk 3D tetap sekitar 3,05 MB (1,04 MB gzip) karena renderer dan engine fisika.
Perbaikannya terutama menunda pemuatan dan menghentikan pekerjaan saat tidak
dibutuhkan, bukan mengklaim bahwa engine tersebut menjadi kecil.

## Validasi

- `node --test tests/performance.test.mjs`: batching cursor, pembatalan listener/frame,
  visibility/tab lifecycle, dan kesamaan geometri GLB.
- ESLint pada file implementasi yang diubah.
- `npm run build`: build production dan service worker.
- Lint global masih memiliki masalah lama di AccessibilityMenu, Hero,
  LiquidCardCanvas yang belum dipakai, serta peringatan Fast Refresh pada context.

Tes lifecycle memakai mock browser APIs, bukan pengukuran rendering browser.
Pada perangkat nyata masih perlu mengecek drag/flip, scroll mobile, perpindahan tab,
dan rekaman Performance DevTools. Jangan menganggap semua perangkat sudah 60 FPS.

## Perubahan perilaku yang disengaja

- Latar tidak lagi bergerak mengikuti mouse/sensor, sedangkan interaksi kartu 3D tetap ada.
- Bagian yang belum pernah dibuka tidak dijamin tersedia offline. Asetnya masuk cache
  setelah digunakan.
- Tampilan kartu 3D sedikit menurunkan resolusi pada layar ber-DPR tinggi; bentuk,
  desain, kilau, dan titik status tetap dipertahankan.

Regenerasi model: `node scripts/optimize-lanyard.mjs`.
