// Membuat kelas Bank
class Bank {
  constructor(saldoAwal) {
    this.saldo = saldoAwal;
    alert(`+===BANK===+\n|| saldo anda ${saldoAwal} ||\n+==========+`);
  }

  // Fungsi untuk menambah saldo
  tambahSaldo() {
    let tambah = prompt("Masukkan jumlah saldo yang ingin ditambahkan");
    tambah = this.validasiNominal(tambah);
    this.saldo += tambah;
    alert(`${this.saldo} adalah saldo baru Anda`);
  }

  // Fungsi untuk mengurangi saldo
  kurangiSaldo() {
    let kurang = prompt("Masukkan jumlah saldo yang ingin dikurangi");
    kurang = this.validasiNominal(kurang);

    // Validasi saldo tidak kurang dari nol
    while (this.saldo - kurang < 0) {
      alert("Saldo tidak cukup. Silakan masukkan nominal yang valid.");
      kurang = prompt("Masukkan jumlah saldo yang ingin dikurangi");
      kurang = this.validasiNominal(kurang);
    }

    this.saldo -= kurang;
    alert(`${this.saldo} adalah saldo baru Anda`);
  }

  // Fungsi untuk validasi input nominal
  validasiNominal(input) {
    while (isNaN(input) || input === "" || input <= 0) {
      input = prompt(
        "Input tidak valid. Masukkan nominal yang benar (hanya angka):"
      );
    }
    return +input;
  }

  // Menampilkan saldo saat keluar
  tampilkanSaldo() {
    alert(`Terima kasih! Saldo Anda sekarang adalah ${this.saldo}`);
  }
}

function validasiTanya(input) {
  while (input !== "1" && input !== "2" && input !== "3") {
    input = prompt(
      "Input tidak valid. Pilih salah satu:\n1. Tambah saldo\n2. Kurangi saldo\n3. Keluar"
    );
  }
  return input;
}

const bankSaya = new Bank(100);

let tanya = prompt(
  "Apa yang kamu ingin lakukan?\n1. Tambah saldo\n2. Kurangi saldo\n3. Keluar"
);
tanya = validasiTanya(tanya); // Validasi input tanya

if (tanya === "1") {
  bankSaya.tambahSaldo();
} else if (tanya === "2") {
  bankSaya.kurangiSaldo();
} else {
  bankSaya.tampilkanSaldo();
}
