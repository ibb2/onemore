import * as Device from "expo-device";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { format } from "date-fns";
import { Host, Button, VStack, HStack } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const today = format(new Date(), "do MMMM");
  const [anotherDay, setAnotherDay] = useState<boolean>(false);

  const oneMoreDay = () => {
    console.log("Another day");
    setAnotherDay(true);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView className="flex items-center justify-center px-6 gap-6">
          <ThemedText type="code" className="text-center">
            {today}
          </ThemedText>
        </ThemedView>

        <ThemedView className="flex-1 items-center justify-center gap-8">
          <ThemedView className="items-center">
            <ThemedText type="code" className="text-lg">
              Another day{!anotherDay && "?"}
            </ThemedText>
            {anotherDay && (
              <>
                <ThemedText type="code" className="text-lg">
                  Thank you
                </ThemedText>
                <ThemedText type="code" className="text-lg">
                  see you tomorrow
                </ThemedText>
              </>
            )}
          </ThemedView>
          <Host matchContents>
            <HStack spacing={8}>
              {!anotherDay && (
                <Button
                  label="ok, another day"
                  modifiers={[buttonStyle("glassProminent")]}
                  onPress={oneMoreDay}
                />
              )}
              {/*<Button
                label="no 😔"
                modifiers={[controlSize("regular"), buttonStyle("glass")]}
              />*/}
            </HStack>
          </Host>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
