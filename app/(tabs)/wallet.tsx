import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/screen-wrapper";
import { colors, radius, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/typo";
import { router } from "expo-router";
import * as Icons from "phosphor-react-native";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import Loading from "@/components/loading";
import WalletListItem from "@/components/wallet-list-item";

const Wallet = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    isLoading,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotalBalance = () => {
    return wallets.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);
  };

  const convertToRupiah = (amount: number) => {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* balance view */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={35} fontWeight={500}>
              {convertToRupiah(getTotalBalance())}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>

        {/* wallet */}
        <View style={styles.wallet}>
          {/* header */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={500}>
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/wallet-modal")}
            >
              <Icons.PlusCircle
                weight="fill"
                size={verticalScale(33)}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {isLoading && <Loading />}

          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem
                  key={item.id}
                  item={item}
                  index={index}
                  router={router}
                />
              );
            }}
            contentContainerStyle={styles.listStyle}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  wallet: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingY._20,
    paddingTop: spacingY._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
