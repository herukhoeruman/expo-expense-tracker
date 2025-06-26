import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("firebase user:", user);
      if (user) {
        setUser({
          name: user?.displayName,
          email: user?.email,
          uid: user?.uid,
        });
        updateUserData(user.uid);
        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      return { success: true, msg: "Login successful" };
    } catch (error: any) {
      console.log("Login error:", error);
      let msg = error.message;
      if (msg.includes("(auth/invalid-credential)")) {
        msg = "Invalid email or password";
      }
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Invalid email format";
      }
      return {
        success: false,
        msg,
      };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(firestore, "users", response.user.uid), {
        name,
        email,
        uid: response.user.uid,
      });

      return { success: true, msg: "Registration successful" };
    } catch (error: any) {
      console.log("Login error:", error);
      let msg = error.message;
      if (msg.includes("(auth/email-already-in-use)")) {
        msg = "Email already in use";
      }
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Invalid email format";
      }
      return {
        success: false,
        msg,
      };
    }
  };

  // update user state in app
  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          name: data.name || "",
          email: data.email || "",
          uid: data.uid,
          image: data.image || "",
        };

        setUser(userData);
      }
    } catch (error: any) {
      console.error("Error updating user data:", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used wrapped inside AuthProvider");
  }
  return context;
};
