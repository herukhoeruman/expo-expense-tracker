import { firestore } from "@/config/firebase";
import { TransactionType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./get-profile-image";

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
