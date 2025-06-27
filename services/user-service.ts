import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./get-profile-image";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    if (updatedData.image && updatedData?.image?.uri) {
      const imageUpdate = await uploadFileToCloudinary(
        updatedData.image,
        "expense-tracker"
      );

      if (!imageUpdate.success) {
        return {
          success: false,
          msg: imageUpdate.msg || "Failed to upload image",
        };
      }

      updatedData.image = imageUpdate.data;
    }

    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updatedData);

    return { success: true, msg: "User data updated successfully" };
  } catch (error: any) {
    console.log("Error updating user data:", error);
    return { success: false, msg: error.message };
  }
};
