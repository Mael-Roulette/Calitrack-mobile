import CustomButton from "@/components/ui/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface SessionRestProps {
  restTime: number; // en secondes
  onRestComplete: () => void;
}

const SIZE = 256;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;
const CENTER = SIZE / 2;

const SessionRest = ({ restTime, onRestComplete }: SessionRestProps) => {
  const [timeRemaining, setTimeRemaining] = useState(restTime);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const toggleTimer = () => setIsRunning((v) => !v);

  const skipRest = () => {
    setTimeRemaining(0);
    setIsRunning(false);
    onRestComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progress = (restTime - timeRemaining) / restTime;
  const strokeDashoffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

  const rotateTransform = `rotate(-90, ${CENTER}, ${CENTER})`;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5">
        <View className="flex-row justify-center items-center gap-3 mt-2 mb-8">
          <Ionicons name="time-outline" size={40} color="#FC7942" />
          <Text className="title text-center">Temps de repos</Text>
        </View>

        <View className="items-center justify-center">
          <View style={{ width: SIZE, height: SIZE }}>
            <Svg width={SIZE} height={SIZE}>
              {/* Piste de fond */}
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke="#132541"
                strokeWidth={STROKE_WIDTH}
                strokeOpacity={0.1}
                fill="none"
              />

              {/* Arc de progression */}
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke="#FC7942"
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                transform={rotateTransform}
              />
            </Svg>

            {/* Temps au centre */}
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-6xl font-sbold text-primary">
                {formatTime(timeRemaining)}
              </Text>
              <Text className="text-primary-100 font-sregular text-base mt-2">
                {timeRemaining === 0 ? "Repos terminé !" : "restantes"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="w-full gap-3 px-5 pb-5">
        {timeRemaining > 0 ? (
          <>
            <CustomButton
              title={isRunning ? "Pause" : "Reprendre"}
              variant="secondary"
              onPress={toggleTimer}
            />
            <CustomButton title="Passer le repos" onPress={skipRest} />
          </>
        ) : (
          <CustomButton title="Continuer" onPress={onRestComplete} />
        )}
      </View>
    </View>
  );
};

export default SessionRest;