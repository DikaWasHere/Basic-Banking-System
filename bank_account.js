let saldo = 100; // Variabel saldo dengan nilai awal

alert("+===BANK===+\n|| saldo anda 100 ||\n+==========+");

// Fungsi untuk memvalidasi input tanya (1, 2, atau 3)
function validasiTanya(input) {
  while (input !== "1" && input !== "2" && input !== "3") {
    input = prompt(
      "Input tidak valid. Pilih salah satu:\n1. Tambah saldo\n2. Kurangi saldo\n3. Keluar"
    );
  }
  return input;
}

// Meminta input dari pengguna dan melakukan validasi
let tanya = prompt(
  "Apa yang kamu ingin lakukan?\n1. Tambah saldo\n2. Kurangi saldo\n3. Keluar"
);
tanya = validasiTanya(tanya); // Validasi input tanya

// Fungsi untuk memastikan input hanya angka
function validasiNominal(input) {
  while (isNaN(input) || input === "" || input <= 0) {
    input = prompt(
      "Input tidak valid. Masukkan nominal yang benar (hanya angka):"
    );
  }
  return +input; // Konversi ke tipe angka setelah validasi
}

if (tanya === "1") {
  // Function tambahSaldo
  function tambahSaldo() {
    let tambah = prompt("Masukkan jumlah saldo yang ingin ditambahkan");
    tambah = validasiNominal(tambah); // Validasi input

    saldo += tambah;
    return saldo;
  }
  console.log("Saldo Anda sekarang adalah " + tambahSaldo());
  alert(saldo + " adalah saldo baru Anda");
} else if (tanya === "2") {
  // Function kurangiSaldo
  function kurangiSaldo() {
    let kurang = prompt("Masukkan jumlah saldo yang ingin dikurangi");
    kurang = validasiNominal(kurang); // Validasi input

    // Validasi saldo tidak kurang dari nol
    while (saldo - kurang < 0) {
      alert("Saldo tidak cukup. Silakan masukkan nominal yang valid.");
      kurang = prompt("Masukkan jumlah saldo yang ingin dikurangi");
      kurang = validasiNominal(kurang); // Validasi input lagi
    }

    saldo -= kurang;
    return saldo;
  }

  console.log("Saldo Anda sekarang adalah " + kurangiSaldo());
  alert(saldo + " adalah saldo baru Anda");
} else {
  // Jika tanya == "3" (Keluar)
  console.log("Saldo Anda adalah " + saldo);
  alert("Terima kasih! Saldo Anda sekarang adalah " + saldo);
}
