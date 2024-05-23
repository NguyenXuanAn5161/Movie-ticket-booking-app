import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Divider from "../../components/Divider/Divider";
import { cancelInvoice, getInvoiceDetail } from "../../services/invoice";
import { COLORS, FONTSIZE } from "../../theme/theme";
import { dateFormat, formatTime, getDayInfo } from "../../utils/formatData";

const { width, height } = Dimensions.get("window");

const InvoiceDetail = ({ navigation, route }) => {
  const { invoiceId } = route.params;
  console.log(invoiceId);

  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetail(invoiceId);
    }
  }, [invoiceId]);

  const fetchInvoiceDetail = async (invoiceId) => {
    try {
      const response = await getInvoiceDetail(invoiceId);
      if (response) {
        setInvoiceDetail(response);
      } else {
        console.log("Error fetching invoice detail");
        Toast.show({
          type: "error",
          text1: "Lỗi từ hệ thống, vui lòng thử lại sau!",
        });
      }
    } catch (error) {
      console.error("Error fetching invoice detail:", error);
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra khi tải thông tin hóa đơn",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderImageQrCode = (invoiceDetail) => {
    return (
      <View style={styles.qrCodeContainer}>
        <Image
          source={{ uri: invoiceDetail?.movieDto?.imageLink }}
          style={styles.movieImage}
        />
        <QRCode
          value={JSON.stringify(invoiceId)}
          size={width * 0.4}
          color="black"
          backgroundColor="white"
        />
      </View>
    );
  };

  const renderTicket = (invoiceDetail) => {
    const standardSeats = invoiceDetail.invoiceTicketDetailDtos.filter(
      (seat) => seat.seatType === "STANDARD"
    );

    const vipSeats = invoiceDetail.invoiceTicketDetailDtos.filter(
      (seat) => seat.seatType === "VIP"
    );

    const sweetBox = invoiceDetail.invoiceFoodDetailDtos.filter(
      (food) => food.foodType === "SWEETBOX"
    );

    return (
      <View style={styles.containerTicket}>
        <View style={{ backgroundColor: COLORS.White, padding: 10 }}>
          <View style={styles.invoiceView}>
            <Text style={styles.boldText}>Rạp: </Text>
            <Text>{invoiceDetail.cinemaDto.name}</Text>
          </View>
          <View style={styles.invoiceView}>
            <Text style={styles.boldText}>Phòng: </Text>
            <Text>{invoiceDetail.roomDto.name}</Text>
          </View>
          <View style={styles.invoiceView}>
            <Text style={styles.boldText}>Tên phim: </Text>
            <Text>{invoiceDetail.movieDto.name}</Text>
          </View>
          <View style={styles.invoiceView}>
            <Text style={styles.boldText}>Lịch chiếu: </Text>
            <Text style={{ fontSize: FONTSIZE.size_16 }}>
              {formatTime(invoiceDetail.showTimeDto.showTime)} -{" "}
              {getDayInfo(invoiceDetail.showTimeDto.showDate)},{" "}
              {dateFormat(invoiceDetail.showTimeDto.showDate)}
            </Text>
          </View>
        </View>
        <Text style={{ marginLeft: 15, marginTop: 10 }}>Chi tiết vé:</Text>
        <View style={{ backgroundColor: COLORS.White, padding: 10 }}>
          {standardSeats.length > 0 && (
            <View style={styles.invoiceView}>
              <Text style={styles.boldText}>Ghế thường:</Text>
              <Text style={{ fontSize: FONTSIZE.size_16 }}>
                {standardSeats.map((seat) => seat.seatName).join(", ")}
              </Text>
            </View>
          )}
          {vipSeats.length > 0 && (
            <View style={styles.invoiceView}>
              <Text style={styles.boldText}>Ghế VIP:</Text>
              <Text style={{ fontSize: FONTSIZE.size_16 }}>
                {vipSeats.map((seat) => seat.seatName).join(", ")}
              </Text>
            </View>
          )}
          {sweetBox.length > 0 && (
            <View style={styles.invoiceView}>
              <Text style={styles.boldText}>Combo:</Text>
              <Text style={{ fontSize: FONTSIZE.size_16 }}>
                {sweetBox.map((food) => food.foodName).join(", ")}
              </Text>
            </View>
          )}
        </View>
        <Text style={{ marginLeft: 15, marginTop: 10 }}>Chi tiết đồ ăn:</Text>
        <View style={{ backgroundColor: COLORS.White, padding: 10 }}>
          {invoiceDetail.invoiceFoodDetailDtos.length > 0 &&
            invoiceDetail.invoiceFoodDetailDtos.map((food, index) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                key={index}
              >
                <Text style={styles.boldText}>{food.foodName}</Text>
                <Text>Số lượng: {food.quantity}</Text>
              </View>
            ))}
        </View>
        <Text style={{ marginLeft: 15, marginTop: 10 }}>
          Khuyến mãi đã nhận được:
        </Text>
        <View style={{ backgroundColor: COLORS.White, padding: 10 }}>
          {invoiceDetail?.promotionLineDtos.map((promotion, index) => (
            <Text key={promotion?.id || index} style={styles.boldText}>
              {promotion.name}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCancel = async () => {
    if (!cancelReason) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập lý do hủy",
      });
      return;
    }

    const resCancel = await cancelInvoice(invoiceId, cancelReason);
    console.log(">>>> resCancel", resCancel);
    if (resCancel) {
      Toast.show({
        type: "success",
        text1: "Hủy vé thành công",
      });
      handleGoBack();
    } else {
      Toast.show({
        type: "error",
        text1: "Hủy vé thất bại",
        text2: resCancel.message,
      });
    }
    setCancelModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.titleStyle}>Lịch sử giao dịch</Text>
      </View>
      <Divider marginTop={1} lineWidth={1} />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : invoiceDetail ? (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 / 2 }}>
              {renderImageQrCode(invoiceDetail)}
            </View>
            <Divider marginTop={10} lineWidth={1} />
            <ScrollView style={{ flex: 1 / 2 }}>
              <View style={{ flex: 1 }}>{renderTicket(invoiceDetail)}</View>
            </ScrollView>
          </View>
        ) : (
          <Text>No data available</Text>
        )}
        <TouchableOpacity onPress={() => setCancelModalVisible(true)}>
          <Text style={styles.cancelButton}>Hủy</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={cancelModalVisible}
        onRequestClose={() => {
          setCancelModalVisible(!cancelModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hủy hóa đơn</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập lý do hủy"
              value={cancelReason}
              onChangeText={setCancelReason}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.buttonText}>Quay lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSubmit}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Hủy vé</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default InvoiceDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  containerTicket: {
    marginTop: 10,
    backgroundColor: COLORS.LightGrey,
  },
  invoiceView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boldText: {
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.White,
  },
  titleStyle: {
    fontSize: FONTSIZE.size_20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  qrCodeContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: COLORS.White,
  },
  movieImage: {
    borderRadius: 10,
    width: width * 0.4,
    resizeMode: "contain",
    backgroundColor: COLORS.Pink,
  },
  cancelButton: {
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: FONTSIZE.size_16,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: FONTSIZE.size_18,
    fontWeight: "bold",
  },
  input: {
    width: width * 0.8,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonCancel: {
    backgroundColor: COLORS.LightGrey,
    padding: 10,
    borderRadius: 10,
  },
  buttonSubmit: {
    backgroundColor: COLORS.Red,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
  },
});
