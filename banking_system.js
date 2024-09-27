class BankAccount {
  constructor(uangAwal = 100) {
    this.balance = uangAwal;
  }

  // Method deposit
  deposit(jumlah) {
    return new Promise((resolve, reject) => {
      if (jumlah <= 0 || isNaN(jumlah)) {
        reject("Invalid. mohon masukan angka.");
      } else {
        setTimeout(() => {
          this.balance += jumlah;
          resolve(`Deposit successful. Your new balance is: ${this.balance}`);
        }, 1000); // Simulate 2 seconds delay
      }
    });
  }

  // Method withdraw
  withdraw(jumlah) {
    return new Promise((resolve, reject) => {
      if (jumlah <= 0 || isNaN(jumlah)) {
        reject("Invalid. Mohon masukan angka.");
      } else if (jumlah > this.balance) {
        reject(`saldo anda kurang. saldo anda adalah: ${this.balance}`);
      } else {
        setTimeout(() => {
          this.balance -= jumlah;
          resolve(
            "penarikan berhasil. saldo anda sekarnag adalah:" + this.balance
          );
        }, 1000); // Simulate 2 seconds delay
      }
    });
  }

  // Method to get the current balance
  getBalance() {
    return `saldo anda sekarang adalah: ${this.balance}`;
  }
}

// Function to validate user input
function validasiNominal(input) {
  while (isNaN(input) || input === "" || input <= 0) {
    input = prompt(
      "Input tidak valid. Masukkan nominal yang benar (hanya angka):"
    );
  }
  return +input; // Convert to number after validation
}

// Function to validate menu choice
function validasiTanya(input) {
  while (input !== "1" && input !== "2" && input !== "3") {
    input = prompt(
      "Input tidak valid. Pilih salah satu:\n1. Tambah saldo\n2. Kurangi saldo\n3. Keluar"
    );
  }
  return input;
}

// Create a new BankAccount object with initial balance
const account = new BankAccount();

// Show initial balance
alert("+===BANK===+\n|| saldo anda " + account.balance + " ||\n+==========+");

// Ask the user what they want to do
let tanya = prompt(
  "Apa yang kamu ingin lakukan?\n1. Tambah saldo\n2. Kurangi saldo\n3. Keluar"
);
tanya = validasiTanya(tanya); // Validate input

if (tanya === "1") {
  // If user wants to deposit money
  let tambah = prompt("Masukkan jumlah saldo yang ingin ditambahkan");
  tambah = validasiNominal(tambah); // Validate input

  account
    .deposit(tambah)
    .then((message) => {
      alert(message);
    })
    .catch((error) => {
      alert(error);
    });
} else if (tanya === "2") {
  // If user wants to withdraw money
  let kurang = prompt("Masukkan jumlah saldo yang ingin dikurangi");
  kurang = validasiNominal(kurang); // Validate input

  account
    .withdraw(kurang)
    .then((message) => {
      alert(message);
    })
    .catch((error) => {
      alert(error);
    });
} else {
  // If user chooses to exit
  alert("Terima kasih! Saldo Anda sekarang adalah " + account.getBalance());
}
