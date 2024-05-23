// import PropTypes from "prop-types";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const CImage = ({ image }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
    </View>
  );
};

CImage.defaultProps = {
  image:
    "https://kynguyenlamdep.com/wp-content/uploads/2022/06/avatar-cute-cho-co-nang-nghien-tra-sua.jpg",
};

// CImage.propTypes = {
//   image: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
// };

export default CImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    borderWidth: 1,
    borderColor: "black",
    resizeMode: "contain",
  },
});
