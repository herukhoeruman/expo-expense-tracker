import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import Typo from "./typo";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";

const HomeCard = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    isLoading: isLoadingWallets,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotals = () => {
    return wallets?.reduce(
      (totals: any, item: WalletType) => {
        totals.balance = totals.balance + Number(item.amount);
        totals.income = totals.income + Number(item.totalIncome);
        totals.expense = totals.expense + Number(item.totalExpenses);

        return totals;
      },
      { balance: 0, income: 0, expense: 0 }
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/images/card.png")}
      style={styles.bgImage}
      resizeMode="stretch"
    >
      <View style={styles.container}>
        <View>
          <View style={styles.totalBalanceRow}>
            <Typo size={17} fontWeight="500" color={colors.neutral800}>
              Total Balance
            </Typo>
            <Icons.DotsThreeOutline
              size={verticalScale(23)}
              color="black"
              weight="fill"
            />
          </View>
          <Typo size={30} fontWeight="bold" color={colors.black}>
            Rp.{" "}
            {isLoadingWallets
              ? "---"
              : getTotals()?.balance?.toLocaleString("id-ID") || "0"}
          </Typo>
        </View>

        {/* total expense and income */}
        <View style={styles.stats}>
          {/* income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowDown
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} fontWeight="500" color={colors.neutral700}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} fontWeight="600" color={colors.green}>
                Rp.{" "}
                {isLoadingWallets
                  ? "---"
                  : getTotals()?.income?.toLocaleString("id-ID") || "0"}
              </Typo>
            </View>
          </View>

          {/* expense */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUp
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} fontWeight="500" color={colors.neutral700}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} fontWeight="600" color={colors.rose}>
                Rp.{" "}
                {isLoadingWallets
                  ? "---"
                  : getTotals()?.expense?.toLocaleString("id-ID") || "0"}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
