import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Clipboard from "expo-clipboard";

export default function Index() {
  const [promoCode, setPromoCode] = useState("");
  const [itemCount, setItemCount] = useState(1);
  const [promoApplied, setPromoApplied] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync("BF2025");
    setCopied(true);
  };

  const translateX = useSharedValue(0);
  const gestureStartX = useSharedValue(0);

  const drag = Gesture.Pan()
    .onBegin(() => {
      gestureStartX.value = translateX.value;
    })
    .onUpdate((event) => {
      if (cardWidth === 0) return;
      const nextX = gestureStartX.value + event.translationX;
      translateX.value = Math.max(-cardWidth, Math.min(0, nextX));
    })
    .onEnd(() => {
      if (cardWidth === 0) return;
      const threshold = -cardWidth * 0.35;
      const snapPoint = translateX.value <= threshold ? -cardWidth : 0;
      translateX.value = withSpring(snapPoint, {
        damping: 18,
        stiffness: 180,
      });
    });

  const currentCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const incomingCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value + cardWidth,
        },
      ],
    };
  });

  const totalPrice = () => {
    if (promoCode === "BF2025" && promoApplied) {
      return (199 * itemCount * 0.75).toFixed(0);
    } else {
      return (199 * itemCount).toFixed(0);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <View className="pt-30 px-4">
        <GestureDetector gesture={drag}>
          <View
            className="relative h-37 w-full overflow-hidden"
            onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
          >
            <Animated.View
              className="absolute inset-0 h-37 px-4 bg-linear-to-r from-discount-start to-discount-end flex-row items-center justify-between"
              style={incomingCardStyle}
            >
              <View>
                <Text className="text-white font-extralight pb-7">
                  BLACK FRIDAY SALE
                </Text>
                <Text className="text-white font-bold text-5xl">25%</Text>
                <Text className="text-white font-medium">OFF</Text>
              </View>

              <View className="flex-row items-center justify-center">
                <Text className="font-bold text-xl py-2 px-3 border border-white text-white">
                  BF2025
                </Text>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Ionicons
                    name="copy-outline"
                    size={20}
                    color="#7c1414"
                    className="bg-white h-12.5 px-2 py-3.5"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View
              className="absolute inset-0 z-10 w-full h-37 bg-white flex-row items-center"
              style={currentCardStyle}
            >
              <Image
                source={require("@/assets/images/product.png")}
                style={{
                  height: 96,
                  width: 96,
                  marginLeft: 8,
                }}
              />

              <View className="pt-2 pl-2">
                <Text className="text-xl font-bold">
                  Google Pixel Buds Pros
                </Text>
                <Text className="text-xs text-gray-500 pt-1 pb-5 w-2/3">
                  Noise-cancelling wireless earbuds with rich sound and long
                  battery life.
                </Text>

                <View className="flex-row pb-3 items-center">
                  <Pressable
                    onPress={() => setItemCount((prev) => prev - 1)}
                    disabled={itemCount === 1}
                  >
                    <Ionicons
                      name="remove"
                      size={20}
                      color="black"
                      className="border border-outline"
                    />
                  </Pressable>
                  <Text className="text-xl font-bold px-4 w-12">
                    {itemCount}
                  </Text>
                  <Pressable
                    onPress={() => setItemCount((prev) => prev + 1)}
                    disabled={itemCount === 5}
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color="black"
                      className="border border-outline"
                    />
                  </Pressable>

                  <View className="w-16" />

                  {promoApplied ? (
                    <View className="flex-row items-baseline">
                      <Text className="text-2xl font-bold w-18">
                        ${totalPrice()}
                      </Text>
                      <Text className="text-lg font-bold text-text-disabled pl-1 line-through">
                        ${(199 * itemCount).toFixed(0)}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-2xl font-bold pl-14">
                      ${totalPrice()}
                    </Text>
                  )}
                </View>
              </View>
            </Animated.View>
          </View>
        </GestureDetector>
      </View>

      <View className="flex-1 px-4 pt-8">
        <View className="flex-row items-center justify-center">
          <TextInput
            value={promoCode}
            onChangeText={setPromoCode}
            placeholder="Enter Promo Code"
            placeholderTextColor="#9a9795"
            autoCapitalize="characters"
            autoCorrect={false}
            keyboardType="default"
            textAlign="left"
            textAlignVertical="top"
            multiline={false}
            className="border border-outline text-text-disabled w-3/4 py-3 pl-2"
          />
          <TouchableOpacity
            onPress={() => setPromoApplied(true)}
            className="w-1/4 border border-outline h-11.25 bg-outline items-center justify-center"
          >
            <Text className="text-lg font-bold">
              {promoApplied ? "Applied" : "Apply"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-black w-full p-4 mt-4 items-center">
          <Text className="text-white font-bold text-xl">Buy</Text>
        </TouchableOpacity>

        {promoApplied && (
          <View className="items-center justify-center w-full bg-snackbar/70 p-2 mt-4">
            <Text className="text-white font-lg font-semibold">
              Discount applied
            </Text>
          </View>
        )}

        {copied && !promoApplied && (
          <View className="items-center justify-center w-full bg-snackbar/70 p-2 mt-4">
            <Text className="text-white font-lg font-semibold">Copied!</Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
