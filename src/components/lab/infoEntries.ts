import type { InfoEntry } from "./InfoLabel";

/** Penjelasan label diagram Reaksi Terang. */
export const lightInfo: Record<string, InfoEntry> = {
  cahaya: {
    id: "cahaya",
    label: "Cahaya",
    title: "Cahaya Matahari",
    description:
      "Sumber energi reaksi terang. Foton diserap klorofil pada fotosistem sehingga elektron tereksitasi dan memulai rantai transpor elektron.",
  },
  h2o: {
    id: "h2o",
    label: "H₂O",
    title: "Air (H₂O)",
    description:
      "Substrat fotolisis di lumen tilakoid. Air dipecah menjadi 2H⁺, ½O₂, dan elektron oleh kompleks pemecah air pada PSII.",
  },
  psii: {
    id: "psii",
    label: "PSII",
    title: "Fotosistem II",
    description:
      "Kompleks protein yang menyerap cahaya (puncak 680 nm) dan memecah air. Elektron yang hilang digantikan oleh elektron hasil fotolisis air.",
  },
  psi: {
    id: "psi",
    label: "PSI",
    title: "Fotosistem I",
    description:
      "Menyerap cahaya pada 700 nm dan menggunakan energinya untuk mereduksi NADP⁺ menjadi NADPH melalui feredoksin.",
  },
  pq: {
    id: "pq",
    label: "PQ",
    title: "Plastoquinon",
    description:
      "Pembawa elektron mobile di dalam membran tilakoid. Mengangkut elektron dari PSII ke kompleks sitokrom b6f sambil memompa H⁺ ke lumen.",
  },
  cytb6f: {
    id: "cytb6f",
    label: "Cyt b6f",
    title: "Kompleks Sitokrom b6f",
    description:
      "Memompa proton (H⁺) ke lumen tilakoid sehingga terbentuk gradien proton — sumber energi untuk ATP-sintase.",
  },
  pc: {
    id: "pc",
    label: "PC",
    title: "Plastosianin",
    description:
      "Protein mengandung tembaga yang membawa elektron dari sitokrom b6f menuju PSI.",
  },
  atpsintase: {
    id: "atpsintase",
    label: "ATP Sintase",
    title: "ATP Sintase (Kemiosmosis)",
    description:
      "Enzim turbin molekuler. Aliran balik H⁺ dari lumen ke stroma memutar ATP-sintase dan menyatukan ADP + Pi → ATP.",
  },
  o2: {
    id: "o2",
    label: "O₂",
    title: "Oksigen",
    description:
      "Produk samping fotolisis air. O₂ keluar dari daun melalui stomata — inilah oksigen yang kita hirup.",
  },
  atp: {
    id: "atp",
    label: "ATP",
    title: "ATP — Mata Uang Energi",
    description:
      "Adenosin trifosfat. Energi siap pakai yang dipasok ke Siklus Calvin untuk mereduksi 3-PGA menjadi G3P.",
  },
  nadph: {
    id: "nadph",
    label: "NADPH",
    title: "NADPH — Daya Reduksi",
    description:
      "Pembawa elektron berenergi tinggi. Menyumbang elektron untuk reduksi karbon pada Siklus Calvin.",
  },
};

/** Penjelasan label diagram Reaksi Gelap (Siklus Calvin). */
export const darkInfo: Record<string, InfoEntry> = {
  co2: {
    id: "co2",
    label: "CO₂",
    title: "Karbon Dioksida",
    description:
      "Gas dari atmosfer yang masuk daun melalui stomata. Menjadi sumber atom karbon untuk pembentukan glukosa.",
  },
  rubp: {
    id: "rubp",
    label: "RuBP",
    title: "Ribulosa-1,5-bifosfat (5C)",
    description:
      "Molekul akseptor CO₂ berkarbon 5. Bergabung dengan CO₂ pada tahap fiksasi karbon menjadi 2 molekul 3-PGA.",
  },
  rubisco: {
    id: "rubisco",
    label: "RuBisCO",
    title: "Enzim RuBisCO",
    description:
      "Ribulosa-1,5-bifosfat karboksilase. Enzim paling melimpah di Bumi — mengkatalisis fiksasi CO₂ ke RuBP.",
  },
  pga: {
    id: "pga",
    label: "3-PGA",
    title: "3-Fosfogliserat (3C)",
    description:
      "Produk pertama fiksasi karbon. Akan direduksi oleh ATP dan NADPH menjadi G3P.",
  },
  g3p: {
    id: "g3p",
    label: "G3P",
    title: "Gliseraldehida-3-fosfat (3C)",
    description:
      "Gula triosa berenergi tinggi. Sebagian dipakai membentuk glukosa, sebagian lainnya untuk meregenerasi RuBP.",
  },
  atp: {
    id: "atp",
    label: "ATP",
    title: "ATP (dari Reaksi Terang)",
    description:
      "Memberikan energi untuk fosforilasi 3-PGA menjadi 1,3-bifosfogliserat sebelum direduksi menjadi G3P.",
  },
  nadph: {
    id: "nadph",
    label: "NADPH",
    title: "NADPH (dari Reaksi Terang)",
    description:
      "Menyumbang elektron untuk mereduksi 1,3-bifosfogliserat menjadi G3P. Tanpa NADPH, siklus berhenti.",
  },
  glukosa: {
    id: "glukosa",
    label: "Glukosa",
    title: "Glukosa (C₆H₁₂O₆)",
    description:
      "Produk akhir fotosintesis. Disintesis dari 2 molekul G3P. Dapat disimpan sebagai pati atau dipakai untuk respirasi.",
  },
  regenerasi: {
    id: "regenerasi",
    label: "Regenerasi",
    title: "Regenerasi RuBP",
    description:
      "Sebagian G3P diatur ulang menggunakan ATP menjadi RuBP. Tahap ini menjaga siklus tetap berjalan secara berkelanjutan.",
  },
};
