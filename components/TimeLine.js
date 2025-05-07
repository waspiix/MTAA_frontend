import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Timeline = ({ stations }) => {
  return (
    <View>
      {stations.map((item, index) => (
        <View key={item.id} style={styles.timelineItem}>
          {/* Timeline Line */}
          <View style={styles.timeline}>
            {index !== 0 && <View style={styles.line} />} {/* Line above */}
            <View
              style={[
                styles.circle,
                index === 0 && styles.startCircle, // Highlight start station
                index === stations.length - 1 && styles.endCircle, // Highlight end station
              ]}
            />
            {index !== stations.length - 1 && <View style={styles.line} />} {/* Line below */}
          </View>

          {/* Station Info */}
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{item.station_name}</Text>
            <Text style={styles.stationTime}>{item.departure_time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  timeline: {
    alignItems: "center",
    width: 30, // Fixed width for the timeline
  },
  line: {
    width: 2,
    height: 20,
    backgroundColor: "#FFA500", // Orange color for the line
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFA500", // Orange color for the circle
  },
  startCircle: {
    backgroundColor: "#FFA500", // Highlight start station
  },
  endCircle: {
    backgroundColor: "#FF4500", // Highlight end station
  },
  stationInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  stationTime: {
    fontSize: 14,
    color: "#666",
  },
});

export default Timeline;