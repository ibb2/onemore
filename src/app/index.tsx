import * as Device from "expo-device";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import { Host, Button, VStack, HStack } from "@expo/ui/swift-ui";
import { buttonStyle, controlSize } from "@expo/ui/swift-ui/modifiers";
import { useEffect, useState } from "react";
import Storage from "expo-sqlite/kv-store";

export default function HomeScreen() {
  const today = format(new Date(), "do MMMM");
  const [anotherDay, setAnotherDay] = useState(
    JSON.parse(
      Storage.getItemSync("onemoreday") ||
        JSON.stringify({
          oneMoreDay: false,
          timestamp: getUnixTime(new Date()),
        }),
    ),
  );

  const oneMoreDay = async () => {
    const committed = {
      oneMoreDay: true,
      timestamp: getUnixTime(new Date()),
    };

    await Storage.setItem("onemoreday", JSON.stringify(committed));
    setAnotherDay(committed);
  };

  const clear = async () => {
    const cleared = {
      oneMoreDay: false,
      timestamp: getUnixTime(new Date()),
    };

    await Storage.setItem("onemoreday", JSON.stringify(cleared));
    setAnotherDay(cleared);
  };

  useEffect(() => {
    const reset = async () => {
      const commitedAt = fromUnixTime(anotherDay.timestamp); // Maybe poor choice for variable name
      const now = new Date();

      const isAfterCutoff = now.getHours() >= 8;
      const isDifferentDay =
        commitedAt.getFullYear() !== now.getFullYear() ||
        commitedAt.getMonth() !== now.getMonth() ||
        commitedAt.getDate() !== now.getDate();

      if (anotherDay.oneMoreDay && isAfterCutoff && isDifferentDay) {
        const cleared = {
          oneMoreDay: false,
          timestamp: getUnixTime(now),
        };
        Storage.setItem("onemoreday", JSON.stringify(cleared));
        setAnotherDay(cleared);
      }

      if (anotherDay)
        if (anotherDay["timestamp"]) {
        }
    };
    reset();
  }, []);

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
              {anotherDay.oneMoreDay ? "Ok, another day" : "Another day?"}
            </ThemedText>
            {anotherDay.oneMoreDay && (
              <>
                <ThemedText type="code" className="text-lg">
                  Thank you
                </ThemedText>
                <ThemedText type="code" className="text-lg">
                  see you tomorrow at 8
                </ThemedText>
              </>
            )}
          </ThemedView>
          <Host matchContents>
            <HStack spacing={8}>
              {!anotherDay.oneMoreDay && (
                <Button
                  label="another day"
                  modifiers={[buttonStyle("glassProminent")]}
                  onPress={oneMoreDay}
                />
              )}
              <Button
                label="clear"
                modifiers={[controlSize("regular"), buttonStyle("glass")]}
                onPress={clear}
              />
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
