import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";

export const updateUser = async (
  uid: string,
  updaedData: UserDataType
): Promise<ResponseType> => {
  try {
    // todo: imgae upload

    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updaedData);

    return { success: true, msg: "User data updated successfully" };
  } catch (error: any) {
    console.log("Error updating user data:", error);
    return { success: false, msg: error.message };
  }
};
