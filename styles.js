import { StyleSheet } from "react-native";

export const getStyles = (
  isDarkMode, isTablet = false, isBiggerText = false, isHighContrast = false
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: isTablet ? 40 : 20,
      backgroundColor: isHighContrast
        ? isDarkMode ? "#000" : "#fff"
        : isDarkMode ? "#121212" : "#f5f5f5",
    },
    listContainer: {
      paddingBottom: isTablet ? 24 : 16,
    },
    tile: {
      backgroundColor: isHighContrast
        ? isDarkMode ? "#000" : "#fff"
        : isDarkMode ? "#1e1e1e" : "#fff",
      padding: isTablet ? 32 : 16,
      marginVertical: isTablet ? 12 : 8,
      borderRadius: isTablet ? 16 : 12,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      width: "100%",
      borderWidth: isHighContrast ? 2 : 0,
      borderColor: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : "transparent",
    },
    routeContainer: {
      flexDirection: "row",
    },
    tileTitle: {
      fontSize: (isTablet ? 28 : 18) + (isBiggerText ? 2 : 0),
      fontWeight: "bold",
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#fff" : "#333",
    },
    tileSubtitle: {
      fontSize: (isTablet ? 22 : 14) + (isBiggerText ? 2 : 0),
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#bbb" : "#555",
    },
    tileSubtitleTime: {
      fontSize: (isTablet ? 18 : 12) + (isBiggerText ? 2 : 0),
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#bbb" : "#666",
      marginTop: isTablet ? 6 : 4,
    },
    delayText: {
      fontSize: (isTablet ? 16 : 12) + (isBiggerText ? 2 : 0),
      fontWeight: "bold",
      color: "#ff3b30",
      marginLeft: isTablet ? 12 : 8,
      paddingHorizontal: isTablet ? 8 : 6,
      paddingVertical: isTablet ? 4 : 2,
      borderRadius: isTablet ? 6 : 4,
      backgroundColor: "rgba(255, 59, 48, 0.1)",
    },
    stationContainer: {
      flex: 4,
    },
    lightTile: {
      backgroundColor: "#fff",
    },
    darkTile: {
      backgroundColor: "#2a2a2a",
    },
    trainTile: {
      marginBottom: isTablet ? 16 : 12,
      borderRadius: isTablet ? 16 : 12,
      padding: isTablet ? 24 : 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      backgroundColor: isHighContrast
        ? isDarkMode ? "#000" : "#fff"
        : isDarkMode ? "#1e1e1e" : "#fff",
      borderWidth: isHighContrast ? 2 : 0,
      borderColor: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : "transparent",
    },
    arrowContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    stationLabel: {
      fontSize: (isTablet ? 16 : 12) + (isBiggerText ? 2 : 0),
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#aaa" : "#888",
      marginBottom: isTablet ? 4 : 2,
    },
    stationName: {
      fontSize: (isTablet ? 18 : 14) + (isBiggerText ? 2 : 0),
      fontWeight: "500",
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#fff" : "#333",
      marginBottom: isTablet ? 4 : 2,
    },
    trainHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: isTablet ? 16 : 12,
    },
    trainName: {
      fontSize: (isTablet ? 20 : 16) + (isBiggerText ? 2 : 0),
      fontWeight: "bold",
      flex: 1,
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : "#333",
    },
    timeText: {
      fontSize: (isTablet ? 16 : 13) + (isBiggerText ? 2 : 0),
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : "#666",
    },
    heading: {
      fontSize: (isTablet ? 36 : 24) + (isBiggerText ? 4 : 0),
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: isTablet ? 30 : 20,
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#ffffff" : "#000000",
    },
    title: {
      fontSize: (isTablet ? 40 : 28) + (isBiggerText ? 4 : 0),
      fontWeight: "800",
      textAlign: "center",
      marginBottom: isTablet ? 30 : 20,
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#ffffff" : "#000000",
    },
    subtitle: {
      fontSize: (isTablet ? 24 : 16) + (isBiggerText ? 4 : 0),
      fontWeight: "bold",
      marginBottom: isTablet ? 20 : 16,
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#ffffff" : "#000000",
    },
    noResultsText: {
      fontSize: (isTablet ? 24 : 16) + (isBiggerText ? 2 : 0),
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#aaa" : "#888",
      textAlign: "center",
      marginTop: isTablet ? 30 : 20,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: isTablet ? 8 : 5,
    },
    inputContainer: {
      marginBottom: isTablet ? 15 : 10,
      position: "relative",
    },
    reserveButton: {
      backgroundColor: isHighContrast ? "#000" : "#0066cc",
      padding: isTablet ? 20 : 10,
      borderRadius: isTablet ? 8 : 6,
      marginVertical: isTablet ? 20 : 16,
      alignItems: "center",
      borderWidth: isHighContrast ? 2 : 0,
      borderColor: isHighContrast ? "#fff" : "transparent",
    },
    reserveButtonText: {
      color: "#fff",
      fontSize: (isTablet ? 20 : 14) + (isBiggerText ? 2 : 0),
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: isTablet ? 30 : 20,
    },
    modalContent: {
      backgroundColor: isHighContrast
        ? isDarkMode ? "#000" : "#fff"
        : "white",
      borderRadius: isTablet ? 12 : 8,
      padding: isTablet ? 40 : 20,
      borderWidth: isHighContrast ? 2 : 0,
      borderColor: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : "transparent",
    },
    modalTitle: {
      fontSize: (isTablet ? 26 : 18) + (isBiggerText ? 2 : 0),
      fontWeight: "bold",
      marginBottom: isTablet ? 16 : 12,
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#fff" : "#000",
    },
    input: {
      height: isTablet ? 70 : 50,
      paddingHorizontal: isTablet ? 20 : 15,
      borderWidth: 1,
      borderRadius: isTablet ? 12 : 10,
      fontSize: (isTablet ? 20 : 16) + (isBiggerText ? 2 : 0),
      color: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#fff" : "#000",
      borderColor: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : isDarkMode ? "#444" : "#ccc",
      marginBottom: isTablet ? 20 : 15,
      backgroundColor: isHighContrast
        ? isDarkMode ? "#000" : "#fff"
        : "transparent",
    },
    overlay: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: isHighContrast
        ? isDarkMode ? "#000" : "#fff"
        : isDarkMode ? "#1e1e1e" : "#fff",
      borderRadius: isTablet ? 12 : 8,
      elevation: 5,
      zIndex: 10,
      maxHeight: isTablet ? 300 : 200,
      borderWidth: isHighContrast ? 2 : 0,
      borderColor: isHighContrast
        ? isDarkMode ? "#fff" : "#000"
        : "transparent",
    },
  selectedStation: {
    paddingVertical: isTablet ? 12 : 8,
    borderBottomWidth: 1,
    backgroundColor: isHighContrast ? '#000' : (isDarkMode ? '#777' : '#ddd'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  stationItem: {
    padding: isTablet ? 15 : 10,
    borderBottomWidth: 1,
    borderBottomColor: isHighContrast ? "#fff" : (isDarkMode ? "#555" : "#ccc"),
    color: isHighContrast ? "#fff" : (isDarkMode ? "#fff" : "#000"),
  },

  loadingFooter: {
    paddingVertical: isTablet ? 30 : 20,
    alignItems: 'center',
  },

  listTitle: {
    fontSize: (isTablet ? 26 : 18) + (isBiggerText ? 2 : 0),
    fontWeight: 'bold',
    marginTop: isTablet ? 30 : 24,
    marginBottom: isTablet ? 12 : 8,
  },

  resultText: {
    color: isDarkMode ? "#fff" : "#000",
  },

  dateButton: {
    padding: isTablet ? 24 : 15,
    backgroundColor: isHighContrast ? "#000" : "#1F5D6C",
    borderRadius: isTablet ? 12 : 10,
    alignItems: "center",
    marginBottom: isTablet ? 15 : 10,
  },

  dateButtonText: {
    color: "#fff",
    fontSize: (isTablet ? 20 : 16) + (isBiggerText ? 2 : 0),
    fontWeight: "bold",
  },

  dateText: {
    fontSize: (isTablet ? 20 : 16) + (isBiggerText ? 2 : 0),
    textAlign: "center",
    marginBottom: isTablet ? 30 : 20,
    color: isDarkMode ? "#fff" : "#000",
  },

  searchButton: {
    padding: isTablet ? 24 : 15,
    backgroundColor: isHighContrast ? "#000" : "#1F5D6C",
    borderRadius: isTablet ? 12 : 10,
    alignItems: "center",
  },

  searchButtonText: {
    color: "#fff",
    fontSize: (isTablet ? 20 : 16) + (isBiggerText ? 2 : 0),
    fontWeight: "bold",
  },

  searchButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginRight: isTablet ? 12 : 10,
  },

  profileCard: {
    backgroundColor: (isDarkMode ? "#1e1e1e" : "#ffffff"),
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 40 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: isTablet ? 30 : 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 15 : 10,
    borderRadius: isTablet ? 12 : 10,
    backgroundColor: isHighContrast ? "#000" : (isDarkMode ? "#1e1e1e" : "#fff"),
    borderWidth: 1,
    borderColor: isHighContrast ? "#fff" : (isDarkMode ? "#333" : "#ddd"),
    marginBottom: isTablet ? 20 : 15,
  },

  info: {
    fontSize: (isTablet ? 20 : 16) + (isBiggerText ? 2 : 0),
    marginBottom: isTablet ? 15 : 10,
    color: isHighContrast ? "#000" : (isDarkMode ? "#ccc" : "#000"),
  },

  label: {
    fontWeight: "600",
    fontSize: (isTablet ? 18 : 14) + (isBiggerText ? 3 : 0),
    color: isHighContrast ? "#000" : (isDarkMode ? "#ccc" : "#333"),
  },

  label_notif: {
    fontWeight: "600",
    fontSize: (isTablet ? 18 : 14) + (isBiggerText ? 3 : 0),
    color: isHighContrast ? "#fff" : (isDarkMode ? "#ccc" : "#333"),
  },

  button: {
    backgroundColor: isHighContrast ? "#000" : "#1F5D6C",
    padding: isTablet ? 24 : 15,
    borderRadius: isTablet ? 16 : 12,
    alignItems: "center",
    marginBottom: isTablet ? 15 : 10,
  },

  buttonImage: {
    backgroundColor: isHighContrast ? "#000" : "#c0c0c0",
    padding: isTablet ? 24 : 15,
    borderRadius: isTablet ? 16 : 12,
    alignItems: "center",
    marginBottom: isTablet ? 15 : 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: (isTablet ? 20 : 16) + (isBiggerText ? 2 : 0),
    fontWeight: "bold",
  },

  toggleButton: {
    marginTop: isTablet ? 15 : 10,
    alignItems: "center",
  },

  toggleButtonText: {
    color: "#007BFF",
    fontSize: (isTablet ? 20 : 14) + (isBiggerText ? 2 : 0),
  },

  profileImage: {
    width: isTablet ? 100 : 50,
    height: isTablet ? 100 : 50,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: isTablet ? 30 : 20,
  },

  smallProfileImage: {
    width: isTablet ? 50 : 25,
    height: isTablet ? 50 : 25,
    borderRadius: 50,
    alignSelf: "center",
  },

  trainImage: {
    width: '100%',
    height: isTablet ? 300 : 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginVertical: 16,
  }
  });
