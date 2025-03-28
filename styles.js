import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1, 
    },
    headerContainer: {
      backgroundColor: "#007bff",
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    topSection: {
      backgroundColor: "#007bff",
      padding: 20,
      alignItems: "flex-start",
      justifyContent: "center",
      height: "35%",
      gap: 10,
      paddingTop: 50,
    },
    bottomSection: {
      flex: 1,
      backgroundColor: "#f5f5f5", 
      padding: 20,
      alignItems: "center",
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
    input: {
      width: "100%",
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      marginBottom: 5,
      backgroundColor: "#fff",
    },
    dateButton: {
      padding: 10,
      backgroundColor: "#fff",
      borderRadius: 10,
    },

  });
  

  export default styles;