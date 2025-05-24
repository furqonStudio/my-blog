// data/posts.ts (atau lib/posts.ts)

import { Post } from './features/post/post.type' // Sesuaikan path

export const posts: Post[] = [
  {
    id: 1,
    title: 'Teknik Pomodoro untuk Produktivitas Maksimal',
    slug: 'teknik-pomodoro-produktivitas',
    image: 'https://picsum.photos/id/1011/600/400',
    publishedAt: '2025-05-24',
    content: `
      <p><strong>Teknik Pomodoro</strong> adalah metode manajemen waktu yang membantu Anda fokus dan produktif dengan membagi pekerjaan dalam interval waktu tertentu.</p>
      <h2>Bagaimana Cara Kerjanya?</h2>
      <ol>
        <li><strong>Tentukan Tugas:</strong> Pilih tugas yang akan Anda kerjakan.</li>
        <li><strong>Setel Timer:</strong> Atur timer Pomodoro selama 25 menit.</li>
        <li><strong>Fokus Penuh:</strong> Bekerja tanpa gangguan sampai timer berbunyi.</li>
        <li><strong>Istirahat Singkat:</strong> Setelah 25 menit, ambil istirahat 5 menit.</li>
        <li><strong>Istirahat Panjang:</strong> Setelah empat 'Pomodoro', ambil istirahat lebih panjang (15-30 menit).</li>
      </ol>
      <p>Teknik ini terbukti dapat mengurangi kelelahan mental, meningkatkan konsentrasi, dan membantu Anda menyelesaikan lebih banyak pekerjaan dalam waktu yang lebih singkat. Cobalah dan rasakan perbedaannya!</p>
    `,
    category: 'Produktivitas',
    author: 'Admin Blog',
  },
  {
    id: 2,
    title: 'Mengenal Dasar-Dasar React Hooks untuk Pemula',
    slug: 'dasar-react-hooks',
    image: 'https://picsum.photos/id/1025/600/400',
    publishedAt: '2025-05-22',
    content: `
      <p><strong>React Hooks</strong> merevolusi cara kita menulis komponen React. Sejak diperkenalkan di React 16.8, Hooks memungkinkan kita menggunakan state dan lifecycle features di komponen fungsional.</p>
      <h3>Mengapa Menggunakan Hooks?</h3>
      <ul>
        <li>Menulis logika stateful tanpa menulis class.</li>
        <li>Lebih mudah berbagi logika stateful antar komponen.</li>
        <li>Membuat kode lebih ringkas dan mudah dibaca.</li>
      </ul>
      <p>Hook paling umum adalah <code>useState</code> untuk state lokal dan <code>useEffect</code> untuk efek samping. Memahaminya adalah langkah pertama menuju pengembangan React yang lebih efisien.</p>
      <p>Kami akan membahas contoh penggunaan <code>useState</code> dan <code>useEffect</code> dalam artikel selanjutnya!</p>
    `,
    category: 'Pengembangan Web',
    author: 'Tim Developer',
  },
  {
    id: 3,
    title: 'Panduan Lengkap SEO On-Page untuk Pemula',
    slug: 'panduan-seo-on-page',
    image: 'https://picsum.photos/id/1040/600/400',
    publishedAt: '2025-05-20',
    content: `
      <p><strong>SEO On-Page</strong> adalah optimasi yang dilakukan langsung di dalam halaman web Anda untuk meningkatkan peringkat di mesin pencari.</p>
      <h2>Elemen Kunci SEO On-Page:</h2>
      <ol>
        <li><strong>Judul Halaman (Title Tag):</strong> Harus menarik dan mengandung kata kunci utama.</li>
        <li><strong>Meta Deskripsi:</strong> Ringkasan singkat konten, juga mengandung kata kunci.</li>
        <li><strong>Heading Tags (H1, H2, dll.):</strong> Strukturkan konten dengan rapi menggunakan heading.</li>
        <li><strong>URL Friendly:</strong> Buat URL yang singkat, relevan, dan mudah dibaca.</li>
        <li><strong>Optimasi Gambar:</strong> Gunakan atribut <code>alt</code> dan kompresi gambar.</li>
        <li><strong>Konten Berkualitas:</strong> Konten yang relevan, informatif, dan unik adalah raja!</li>
      </ol>
      <p>Dengan menerapkan teknik-teknik SEO On-Page ini, Anda dapat secara signifikan meningkatkan visibilitas website Anda di hasil pencarian.</p>
    `,
    category: 'SEO',
    author: 'Pakar SEO',
  },
  {
    id: 4,
    title: 'Memulai Perjalanan Data Science Anda: Tools dan Konsep',
    slug: 'memulai-data-science',
    image: 'https://picsum.photos/id/1084/600/400',
    publishedAt: '2025-05-18',
    content: `
      <p><strong>Data Science</strong> adalah bidang interdisipliner yang menggunakan metode ilmiah, proses, algoritma, dan sistem untuk mengekstrak pengetahuan atau wawasan dari data.</p>
      <h3>Tools Penting:</h3>
      <ul>
        <li><strong>Python:</strong> Bahasa pemrograman paling populer untuk Data Science (dengan library seperti Pandas, NumPy, Scikit-learn).</li>
        <li><strong>R:</strong> Bahasa lain yang kuat untuk analisis statistik dan visualisasi.</li>
        <li><strong>SQL:</strong> Penting untuk mengelola dan mengambil data dari database.</li>
        <li><strong>Jupyter Notebook:</strong> Lingkungan interaktif untuk pengembangan.</li>
      </ul>
      <p>Memahami konsep dasar seperti statistik, probabilitas, dan aljabar linier juga krusial. Selamat datang di dunia data!</p>
    `,
    category: 'Data Science',
    author: 'Analisis Data',
  },
  {
    id: 5,
    title: 'Rahasia Keamanan Siber untuk Pengguna Internet Sehari-hari',
    slug: 'keamanan-siber-sehari-hari',
    image: 'https://picsum.photos/id/1057/600/400',
    publishedAt: '2025-05-15',
    content: `
      <p>Di era digital ini, <strong>keamanan siber</strong> bukan lagi pilihan, melainkan keharusan. Setiap hari, jutaan data pribadi menjadi target serangan siber.</p>
      <h2>Tips Praktis:</h2>
      <ol>
        <li><strong>Gunakan Kata Sandi Kuat:</strong> Kombinasi huruf besar/kecil, angka, dan simbol.</li>
        <li><strong>Aktifkan Otentikasi Dua Faktor (2FA):</strong> Lapisan keamanan ekstra yang vital.</li>
        <li><strong>Waspada Phishing:</strong> Jangan klik tautan atau lampiran yang mencurigakan.</li>
        <li><strong>Perbarui Perangkat Lunak:</strong> Perbarui sistem operasi, browser, dan aplikasi secara rutin.</li>
        <li><strong>Gunakan VPN:</strong> Terutama saat menggunakan Wi-Fi publik.</li>
      </ol>
      <p>Dengan langkah-langkah sederhana ini, Anda dapat melindungi diri dari sebagian besar ancaman siber.</p>
    `,
    category: 'Keamanan Siber',
    author: 'Pakar Keamanan',
  },
]
