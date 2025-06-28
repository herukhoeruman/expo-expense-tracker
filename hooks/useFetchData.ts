import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";

const useFetchData = <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) return;
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...constraints);

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as T[];
        console.log("Fetched data: ", fetchedData);
        setData(fetchedData);
        setIsLoading(false);
      },
      (error) => {
        console.log("Error fetching data: ", error);
        setError(error.message);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { data, isLoading, error };
};

export default useFetchData;
