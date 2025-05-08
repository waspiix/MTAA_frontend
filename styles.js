import { StyleSheet } from "react-native";

export const getStyles = (isDarkMode) =>
  StyleSheet.create({
    // Common styles
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? "#121212" : "#f5f5f5", // Commonly used light grey in apps
    },
    tile: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      padding: 16,
      marginVertical: 8,
      borderRadius: 8,
      elevation: 2,
    },
    tileTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    tileSubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#555',
    },
    noResultsText: {
      fontSize: 16,
      color: isDarkMode ? '#aaa' : '#888',
      textAlign: 'center',
      marginTop: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      color: isDarkMode ? "#ffffff" : "#000000",
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 20,
      color: isDarkMode ? "#ffffff" : "#000000",
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 16,
      color: isDarkMode ? "#ffffff" : "#000000",
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
    },
    inputContainer: {
      marginBottom: 20,
      position: "relative",
    },
    reserveButton: {
      backgroundColor: '#0066cc',
      padding: 10,
      borderRadius: 6,
      marginVertical: 16,
      alignItems: 'center',
    },
    reserveButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 20,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    input: {
      height: 50,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderRadius: 10,
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#000",
      borderColor: isDarkMode ? "#444" : "#ccc",
      marginBottom: 15,
    },
    overlay: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
      borderRadius: 8,
      elevation: 5,
      zIndex: 10,
      maxHeight: 200,
    },
    selectedStation: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      backgroundColor: isDarkMode ? '#777' : '#ddd',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    timeButton: {
      backgroundColor: isDarkMode ? '#888' : '#eee',
      padding: 6,
      borderRadius: 4,
    },
    stationItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#555" : "#ccc",
      color: isDarkMode ? "#fff" : "#000",
    },
    listTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 24,
      marginBottom: 8,
    },
    resultText: {
      color: isDarkMode ? "#fff" : "#000",
    },
    dateButton: {
      padding: 15,
      backgroundColor: "#1F5D6C",
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 10,
    },
    dateButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    dateText: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      color: isDarkMode ? "#fff" : "#000",
    },
    searchButton: {
      padding: 15,
      backgroundColor: "#1F5D6C",
      borderRadius: 10,
      alignItems: "center",
    },
    searchButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    searchButtonContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: 10,
    },

    // Profile-specific
    profileCard: {
      backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
      borderWidth: 1,
      borderColor: isDarkMode ? "#333" : "#ddd",
      marginBottom: 10,
    },
    info: {
      fontSize: 16,
      marginBottom: 10,
      color: isDarkMode ? "#ccc" : "#000",
    },
    label: {
      fontWeight: "600",
      color: isDarkMode ? "#ccc" : "#333",
    },
    button: {
      backgroundColor: "#1F5D6C",
      padding: 15,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    toggleButton: {
      marginTop: 10,
      alignItems: "center",
    },
    toggleButtonText: {
      color: "#007BFF",
      fontSize: 14,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 50,
      alignSelf: "center",
      marginBottom: 20,
    },
    smallProfileImage: {
      width: 25,
      height: 25,
      borderRadius: 50,
      alignSelf: "center",
    },
  });
