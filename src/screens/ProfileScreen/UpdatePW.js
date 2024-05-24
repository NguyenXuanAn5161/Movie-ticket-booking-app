import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import { callUpdatePassWord } from "../../services/UserAPI";
import { COLORS, FONTSIZE } from "../../theme/theme";
import { comparePassword, validatePassword } from "../../utils/validation";

const UpdatePW = ({ navigation }) => {
  const user = useSelector((state) => state.user.user);

  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newErrorPassword, setNewErrorPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmNewErrorPassword, setConfirmNewErrorPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputPassword = (text) => {
    setPassword(text);
    setErrorPassword(validatePassword(text));
  };
  const handleInputNewPassword = (text) => {
    setNewPassword(text);
    setNewErrorPassword(validatePassword(password, text));
  };
  const handleInputConfirmNewPassword = (text) => {
    setConfirmNewPassword(text);
    setConfirmNewErrorPassword(comparePassword(newPassword, text));
  };

  //   kiểm tra xem có sự thay đổi không?
  const isFormChanged = () => {
    return (
      password.length > 5 &&
      newPassword.length > 5 &&
      confirmNewPassword.length > 5
    );
  };

  useEffect(() => {
    isFormChanged();
  }, [password, newPassword, confirmNewPassword]);

  const handleSubmit = async () => {
    if (
      errorPassword !== "" ||
      newErrorPassword !== "" ||
      confirmNewErrorPassword !== ""
    ) {
      return;
    }
    setIsSubmit(true);
    const resUpdatePass = await callUpdatePassWord(
      user.id,
      password,
      newPassword,
      confirmNewPassword
    );

    console.log("resUpdatePass: ", resUpdatePass);
    if (resUpdatePass?.status === 200) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "Cập nhật thành công",
        visibilityTime: 2000,
        autoHide: true,
      });
      setIsSubmit(false);
      navigation.goBack();
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: resUpdatePass?.message,
        visibilityTime: 2000,
        autoHide: true,
        text2Style: { fontSize: 13 },
      });
      setIsSubmit(false);
    }
  };

  return (
    <SafeAreaView style={[styles.wrapper, styles.containerSign]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => handleGoBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={[styles.titleStyle]}>Cập nhật mật khẩu</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <KeyboardAwareScrollView>
          <View style={styles.innerUpdate}>
            {/* password */}
            <CustomInput
              placeholder={"Mật khẩu cũ"}
              icon={"lock"}
              secureTextEntry={showPassword}
              onChangeText={(text) => handleInputPassword(text)}
              value={password}
              error={errorPassword}
              showPassword={showPassword}
              handleShowPassword={handleShowPassword}
            />
            {/* new pass */}
            <CustomInput
              placeholder={"Mật khẩu mới"}
              icon={"lock"}
              secureTextEntry={showPassword}
              onChangeText={(text) => handleInputNewPassword(text)}
              value={newPassword}
              error={newErrorPassword}
              showPassword={showPassword}
              handleShowPassword={handleShowPassword}
            />
            {/* confirm pass */}
            <CustomInput
              placeholder={"Nhập lại mật khẩu mới"}
              icon={"lock"}
              secureTextEntry={showPassword}
              onChangeText={(text) => handleInputConfirmNewPassword(text)}
              value={confirmNewPassword}
              error={confirmNewErrorPassword}
              showPassword={showPassword}
              handleShowPassword={handleShowPassword}
            />
            <View style={[styles.btnContainer, { marginBottom: 30 }]}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: !isFormChanged()
                      ? COLORS.DarkGrey
                      : COLORS.Orange,
                  },
                ]}
                onPress={() => handleSubmit()}
                disabled={!isFormChanged() || isSubmit}
              >
                {isSubmit ? (
                  <ActivityIndicator size="small" color={COLORS.White} />
                ) : (
                  <Text style={styles.textBtn}>Cập nhật</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UpdatePW;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.White,
  },
  containerSign: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  titleStyle: {
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
    fontSize: FONTSIZE.size_24,
    color: COLORS.Black,
  },
  btn: {
    backgroundColor: COLORS.Orange,
    padding: 10,
    borderRadius: 24,
    alignItems: "center",
  },
  textBtn: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
    fontWeight: "bold",
  },
  innerUpdate: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 10,
    gap: 10,
    width: "100%",
  },
  btnContainer: {
    backgroundColor: COLORS.White,
  },
});
