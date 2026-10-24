import { firestore } from "@/config/firebase";
import { TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./get-profile-image";
import { createOrUpdateWallet } from "./wallet-service";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
) => {
  try {
    const { id, type, amount, walletId, image } = transactionData;

    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data" };
    }

    if (id) {
      // Update existing transaction
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id)
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOriginal =
        oldTransaction?.type !== type ||
        oldTransaction?.walletId !== walletId ||
        oldTransaction?.amount !== amount;

      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallet(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
    } else {
      // update wallet for new transaction
      let res = await updateWalletForNewTransaction(walletId, amount, type);
      if (!res.success) return res;
    }

    // upload image if provided
    if (image) {
      const imageUpdate = await uploadFileToCloudinary(
        image,
        "expense-tracker"
      );

      if (!imageUpdate.success) {
        return {
          success: false,
          msg: imageUpdate.msg || "Failed to upload receipt",
        };
      }

      transactionData.image = imageUpdate.data;
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, {
      merge: true,
    });

    return {
      success: true,
      data: { id: transactionRef.id, ...transactionData },
      msg: "Transaction created or updated successfully",
    };
  } catch (error: any) {
    console.error("Error create or update transaction:", error);
    return { success: false, msg: error.message };
  }
};

export const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data();

    if (type === "expense" && walletData.amount - amount < 0) {
      return { success: false, msg: "Insufficient funds in wallet" };
    }

    const updateType = type == "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });

    return { success: true, msg: "Wallet updated successfully" };
  } catch (error: any) {
    console.error("Error updating wallet for new transaction:", error);
    return { success: false, msg: error.message };
  }
};

export const revertAndUpdateWallet = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    const originalWalletSanpshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );
    const originalWallet = originalWalletSanpshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );
    const newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType === "expense") {
      // if user tries to convert income to expense on the same wallet
      // or the user tries to increase the expense amount and don't have enough balance
      if (
        oldTransaction.walletId === newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet does not have enough balance",
        };
      }

      // if user tries to add expense to a different wallet but the wallet does not have enough balance
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "The selected wallet does not have enough balancee",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    // refetch the new wallet to update it
    newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));
    const updatedNewWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount =
      Number(updatedNewWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount =
      Number(newWallet[updateType]) + Number(newTransactionAmount);

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true, msg: "Wallet updated successfully" };
  } catch (error: any) {
    console.error("Error updating wallet for new transaction:", error);
    return { success: false, msg: error.message };
  }
};
