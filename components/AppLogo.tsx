import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Svg, Circle, Path, Ellipse } from "react-native-svg";

type Props = { size?: number; showText?: boolean };

export default function AppLogo({ size = 120, showText = true }: Props) {
  return (
    <View style={styles.wrapper}>
      <Svg viewBox="0 0 120 120" width={size} height={size}>
        <Circle cx="60" cy="60" r="55" stroke="white" strokeWidth={2.5} fill="none" />
        <Path d="M38 75 Q30 55 50 45 Q45 65 38 75Z" fill="white" opacity={0.88} />
        <Path d="M82 75 Q90 55 70 45 Q75 65 82 75Z" fill="white" opacity={0.88} />
        <Path d="M60 28 C60 28 48 35 50 48 C52 58 68 58 70 68 C72 78 60 85 60 85" stroke="white" strokeWidth={5} strokeLinecap="round" fill="none" />
        <Ellipse cx="60" cy="26" rx="5" ry="7" fill="white" />
        <Path d="M58 19 L60 15 L62 19" stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <Path d="M60 85 C58 90 54 92 52 90 C50 88 52 84 56 85" stroke="white" strokeWidth={3} strokeLinecap="round" fill="none" />
      </Svg>
      {showText && (
        <>
          <Text style={styles.brand}>UTOPÍA</Text>
          <View style={styles.line} />
          <Text style={styles.subtitle}>C L Í N I C A   M É D I C A</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center" },
  brand: { color: "white", fontSize: 30, fontWeight: "500", letterSpacing: 9, marginTop: -8 },
  line: { width: 122, height: 1, backgroundColor: "white", opacity: 0.8, marginVertical: 7 },
  subtitle: { color: "white", fontSize: 7, letterSpacing: 4, fontWeight: "600" },
});
