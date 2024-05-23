import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getInvoicesByUserId } from "../../services/invoice";

const ExpenseSlider = () => {
  const [expense, setExpense] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user?.id) fetchInvoice(user.id);
  }, []);

  const fetchInvoice = async (id) => {
    const resInvoice = await getInvoicesByUserId(id, 1000);
    console.log("resInvoice: ", resInvoice);
    const totalExpense = resInvoice.reduce(
      (total, invoice) => total + invoice.totalPrice,
      0
    );
    console.log("totalExpense: ", totalExpense);
    setExpense(totalExpense);
  };

  const maxExpense = 4000000;

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Chi tiêu:{" "}
        {expense.toLocaleString(undefined, { maximumFractionDigits: 0 })} VND
      </Text>
      <View style={styles.sliderContainer} onLayout={handleLayout}>
        <View style={styles.sliderTrack} />
        <View
          style={[
            styles.sliderThumb,
            { left: (expense / maxExpense) * sliderWidth - 10 },
          ]}
        />
      </View>
      <View style={styles.scale}>
        <Text>0</Text>
        <Text>2,000,000</Text>
        <Text>4,000,000</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 20,
  },
  sliderContainer: {
    width: "100%",
    height: 40,
    justifyContent: "center",
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "#d3d3d3",
    position: "absolute",
    left: 0,
    right: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1E90FF",
    position: "absolute",
    top: 10,
  },
  scale: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
    paddingBottom: 10,
  },
});

export default ExpenseSlider;
