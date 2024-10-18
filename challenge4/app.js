const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(bodyParser.json());

// Create User + profile
app.post("/api/v1/users", async (req, res) => {
  const { name, email, password, identityType, identityNumber, address } =
    req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        profile: {
          create: {
            identityType,
            identityNumber,
            address,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Account
app.post("/api/v1/accounts", async (req, res) => {
  const { bankName, bankAccountNumber, balance, userId } = req.body;

  const bankAccount = await prisma.bankAccount.create({
    data: {
      bankName: bankName,
      bankAccountNumber: bankAccountNumber,
      balance: balance,
      userId: userId,
    },
  });

  res.status(201).json(bankAccount);
});

// Create Transfer
app.post("/api/v1/transfers", async (req, res) => {
  const { amount, sourceAccountId, destinationAccountId } = req.body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Get source account
      const sourceAccount = await prisma.bankAccount.findUnique({
        where: { id: sourceAccountId },
      });

      if (!sourceAccount) {
        throw new Error("akun tidak ditemukan");
      }

      if (sourceAccount.balance < amount) {
        throw new Error("kekurangan saldo");
      }

      // Get destination account
      const destinationAccount = await prisma.bankAccount.findUnique({
        where: { id: destinationAccountId },
      });

      if (!destinationAccount) {
        throw new Error("akun yang dituju tidak ditemukan");
      }

      // Update source account
      const updatedSourceAccount = await prisma.bankAccount.update({
        where: { id: sourceAccountId },
        data: { balance: sourceAccount.balance - amount },
      });

      // Update destination account
      const updatedDestinationAccount = await prisma.bankAccount.update({
        where: { id: destinationAccountId },
        data: { balance: destinationAccount.balance + amount },
      });

      // Create transfer record
      const transfer = await prisma.transfer.create({
        data: {
          amount: amount,
          sourceAccountId: sourceAccountId,
          destinationAccountId: destinationAccountId,
        },
      });

      return {
        transfer,
        sourceAccount: updatedSourceAccount,
        destinationAccount: updatedDestinationAccount,
      };
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get menampilkan semua user
app.get("/api/v1/users", async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
  });

  res.json(users);
});

// Get menampilkan user dengan id
app.get("/api/v1/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      profile: true,
      bankAccounts: true,
    },
  });

  if (!user) {
    return res
      .status(404)
      .json({ message: `User dengan id ${req.params.id} tidak ditemukan.` });
  }

  res.json(user);
});

// Get amenampilkan akun
app.get("/api/v1/accounts", async (req, res) => {
  try {
    const accounts = await prisma.bankAccount.findMany({
      select: {
        id: true,
        bankName: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET menampilkan detail akun
app.get("/api/v1/accounts/:accountId", async (req, res) => {
  const accountId = parseInt(req.params.accountId);

  try {
    const account = await prisma.bankAccount.findUnique({
      where: { id: accountId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!account) {
      return res.status(404).json({ error: "akun tidak ditemukan" });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menampilkan transaksi
app.get("/api/v1/transactions", async (req, res) => {
  try {
    const transactions = await prisma.transfer.findMany({
      orderBy: { id: "desc" },
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menampilkan detail transaksi
app.get("/api/v1/transactions/:transactionId", async (req, res) => {
  const transactionId = parseInt(req.params.transactionId);

  try {
    const transaction = await prisma.transfer.findUnique({
      where: { id: transactionId },
      include: {
        sourceAccount: {
          select: {
            bankAccountNumber: true,
            bankName: true,
            user: { select: { name: true, email: true } },
          },
        },
        destinationAccount: {
          select: {
            bankAccountNumber: true,
            bankName: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: "transaksi tidak ditemukan" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put("/api/v1/users/:id", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { name: name, email: email, password: password },
  });

  res.json(user);
});

//delete user
app.delete("/api/v1/users/:id", async (req, res) => {
  const userId = Number(req.params.id);

  // Hapus semua akun bank yang terkait dengan user
  await prisma.bankAccount.deleteMany({
    where: { userId: userId },
  });

  // Hapus profil yang terkait dengan user
  await prisma.profile.delete({
    where: { userId: userId },
  });

  // Hapus user setelah entitas terkait dihapus
  const user = await prisma.user.delete({
    where: { id: userId },
  });

  res.json({ message: "user berhasil dihapus", user });
});

app.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
