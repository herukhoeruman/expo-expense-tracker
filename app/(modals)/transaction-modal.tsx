import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/modal-wrapper";
import Header from "@/components/header";
import BackButton from "@/components/back-button";
import Typo from "@/components/typo";
import { TransactionType, WalletType } from "@/types";
import Button from "@/components/button";
import { useAuth } from "@/context/authContext";
import { router, useLocalSearchParams } from "expo-router";
import ImageUpload from "@/components/image-upload";
import { deleteWallet } from "@/services/wallet-service";
import * as Icons from "phosphor-react-native";
import { Dropdown } from "react-native-element-dropdown";
import { expenseCategories, transactionTypes } from "@/constants/data";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Input from "@/components/input";

const TransactionModal = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const {
    data: wallets,
    isLoading: isLoadingWallets,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const oldTransaction: { name: string; image: string; id: string } =
    useLocalSearchParams();

  // useEffect(() => {
  //   if (oldTransaction?.id) {
  //     setTransaction({
  //       type: oldTransaction.type || "expense",
  //       amount: oldTransaction.amount || 0,
  //       description: oldTransaction.description || "",
  //       category: oldTransaction.category || "",
  //       date: oldTransaction.date ? new Date(oldTransaction.date) : new Date(),
  //       walletId: oldTransaction.walletId || "",
  //       image: oldTransaction.image || null,
  //     });
  //   }
  // }, []);

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;

    if (!type || !amount || !walletId || (type === "expense" && !category)) {
      Alert.alert("Transaction", "Please fill all the required fields");
      return;
    }

    let transactionData: TransactionType = {
      type,
      date,
      amount,
      description,
      category,
      image,
      walletId,
      uid: user?.uid || "",
    };

    console.log("transactionData", transactionData);
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;

    setIsLoading(true);
    const res = await deleteWallet(oldTransaction.id);
    setIsLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure want to do this? \nThis will remove all the  transactions related to this wallet",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(),
        },
      ]
    );
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(false);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Edit Transaction" : "Add Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Type
            </Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              inputSearchStyle={styles.dropdownInputSearch}
              iconStyle={styles.dropdownIcon}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              data={transactionTypes}
              // search
              maxHeight={300}
              labelField="label"
              valueField="value"
              // placeholder={!isFocus ? "Select item" : "..."}
              searchPlaceholder="Search..."
              value={transaction.type}
              // onFocus={() => setIsFocus(true)}
              // onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
              // renderLeftIcon={() => (
              //   <AntDesign
              //     style={styles.icon}
              //     color={isFocus ? 'blue' : 'black'}
              //     name="Safety"
              //     size={20}
              //   />
              // )}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Wallet
            </Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              inputSearchStyle={styles.dropdownInputSearch}
              iconStyle={styles.dropdownIcon}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              data={wallets.map((wallet) => ({
                label: `${wallet.name} Rp. ${wallet.amount}`,
                value: wallet.id,
              }))}
              // search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={"Select Wallet"}
              searchPlaceholder="Search..."
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
            />
          </View>

          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Expense Category
              </Typo>
              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                inputSearchStyle={styles.dropdownInputSearch}
                iconStyle={styles.dropdownIcon}
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                data={Object.values(expenseCategories)}
                // search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Select Wallet"}
                searchPlaceholder="Search..."
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
            </View>
          )}

          {/* date picker */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Date
            </Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}

            {showDatePicker && (
              <View>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor="white"
                  mode="date"
                  display="calendar"
                  onChange={onDateChange}
                />

                {Platform.OS === "ios" && (
                  <Pressable
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo color={colors.neutral200}>Ok</Typo>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Amount
            </Typo>
            <Input
              value={transaction.amount.toString()}
              keyboardType="numeric"
              onChangeText={(value) => {
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                });
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Description
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (optional)
              </Typo>
            </View>
            <Input
              value={transaction.description}
              multiline
              containerStyle={{
                height: verticalScale(100),
                flexDirection: "row",
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) => {
                setTransaction({
                  ...transaction,
                  description: value,
                });
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Receipt
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (optional)
              </Typo>
            </View>
            <ImageUpload
              placeholder="Upload Image"
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && !isLoading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._10,
            }}
          >
            <Icons.Trash
              size={verticalScale(24)}
              color={colors.white}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={isLoading}>
          <Typo color="black" fontWeight="700">
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropDown: {
    //  flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    // paddingHorizontal: spacingX._15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {
    // backgroundColor: "red"
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  dropdownInputSearch: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
    color: colors.white,
  },
});
