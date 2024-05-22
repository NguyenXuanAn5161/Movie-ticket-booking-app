import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { verifyPayment } from "../../services/invoice";

const VnPayVerify = ({ route, navigation }) => {
  const { params } = route.params;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("params", params);
    fetchVerify(params);
  }, [params]);

  const fetchVerify = async (params) => {
    setLoading(true);
    const resVerify = await verifyPayment(params);
    setLoading(false);
    console.log("resVerify", resVerify);
    if (resVerify?.status === 200) {
      Toast.show({
        type: "success",
        position: "top",
        text1: resVerify?.message || "Thanh toán thành công",
        // text2: "Vui lòng kiểm tra email của bạn để nhận vé",
        visibilityTime: 3000,
        autoHide: true,
      });
      navigation.navigate("Home");
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: resVerify?.message || "Thanh toán thất bại",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && <ActivityIndicator size="large" />}
    </SafeAreaView>
  );
};

export default VnPayVerify;

const styles = StyleSheet.create({});
