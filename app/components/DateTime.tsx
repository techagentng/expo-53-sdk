import { View, Text, TouchableOpacity, Platform, Image } from "react-native";
import React, { useEffect, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { COLORS, icons } from "@/constants";


const DateTime = ({ date, setDate, time, setTime }: any) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === "ios");
    setTime(currentTime);
  };

  const showDateMode = () => {
    setShowDatePicker(true);
  };

  const showTimeMode = () => {
    setShowTimePicker(true);
  };
  
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 20,
              color: "#000000B2",
            }}
          >
            Date of Incident
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1.2,
              borderRadius: 5,
              width: 160,
              height: 45,
              paddingHorizontal: 10,
              borderColor: COLORS.gray2,
            }}
            onPress={showDateMode}
          >
            <Text style={{ fontSize: 16 }}>{date.toLocaleDateString()}</Text>
            {icons.datePicker ? (
              <Image
                source={icons.datePicker}
                style={{ width: 24, height: 24, tintColor: COLORS.primary }}
                resizeMode="contain"
              />
            ) : (
              <View
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: COLORS.primary,
                  borderRadius: 12,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 20,
              color: "#000000B2",
            }}
          >
            Time of Incident
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1.2,
              borderRadius: 5,
              width: 160,
              height: 45,
              paddingHorizontal: 10,
              borderColor: COLORS.gray2,
            }}
            onPress={showTimeMode}
          >
            <Text style={{ fontSize: 16 }}>{time.toLocaleTimeString()}</Text>
            {icons.watchicon ? (
              <Image
                source={icons.watchicon}
                style={{ width: 24, height: 24, tintColor: COLORS.primary }}
                resizeMode="contain"
              />
            ) : (
              <View
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: COLORS.primary,
                  borderRadius: 12,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <RNDateTimePicker
            mode="date"
            display="calendar"
            value={date}
            onChange={onDateChange}
          />
        )}
        {showTimePicker && (
          <RNDateTimePicker
            mode="time"
            display="clock"
            value={time}
            onChange={onTimeChange}
          />
        )}
      </View>
    </>
  );
};

export default DateTime;
