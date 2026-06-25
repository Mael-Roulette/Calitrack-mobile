import CustomButton from "@/components/ui/CustomButton";
import { NotificationService } from "@/services/notification";
import {
  clearRestTimerState,
  getRemainingSeconds,
  getRestTimerState,
  saveRestTimerState,
} from "@/utils/restTimer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, ScrollView, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const SIZE = 256;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;
const CENTER = SIZE / 2;

interface SessionRestProps {
  restTime: number; // en secondes
  onRestComplete: () => void;
  nextExercise: string;
}

const SessionRest = ({ restTime, onRestComplete, nextExercise }: SessionRestProps) => {
  const [timeRemaining, setTimeRemaining] = useState(restTime);
  const [isRunning, setIsRunning] = useState(true);

  // Récupération et initialisation de l'audio
  const audioSource = require( "@/assets/audios/rest-timer-1.mp3" );
  const player = useAudioPlayer(audioSource);

  const endTimeRef = useRef(Date.now() + restTime * 1000);
  const notificationService = NotificationService.getInstance();

  /**
   * INIT TIMER
   * notif uniquement si app en background
   */
  useEffect(() => {
    const endTime = Date.now() + restTime * 1000;

    endTimeRef.current = endTime;

    setTimeRemaining(restTime);
    setIsRunning(true);

    saveRestTimerState(endTime);

    return () => {
      clearRestTimerState();
      notificationService.cancelRestEndNotification();
    };
  }, []);

  /**
   * TIMER LOOP (UI only)
   */
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const remaining = getRemainingSeconds(endTimeRef.current);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setIsRunning(false);

        // Lancement du son à la fin du timer
        player.play();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  /**
   * APP STATE HANDLER
   */
  useEffect(() => {
    const handleAppStateChange = async (state: AppStateStatus) => {
      const stored = await getRestTimerState();
      const endTime = stored?.endTime ?? endTimeRef.current;
      const remaining = getRemainingSeconds(endTime);

      if (state === "active") {
        // retour dans l'app → resync immédiat
        setTimeRemaining(remaining);
        setIsRunning(remaining > 0);

        // si repos terminé pendant absence → on déclenche action
        if (remaining <= 0) {
          clearRestTimerState();
        }

        return;
      }

      // pas en foreground → on ne programme notif que si encore du temps
      if (remaining > 0) {
        notificationService.scheduleRestEndNotification(endTime);
      }
    };

    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, []);

  const toggleTimer = () => setIsRunning(v => !v);

  const skipRest = () => {
    setTimeRemaining(0);
    setIsRunning(false);
    clearRestTimerState();
    notificationService.cancelRestEndNotification();
    onRestComplete();
  };

  const handleContinue = () => {
    clearRestTimerState();
    notificationService.cancelRestEndNotification();
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
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke="#132541"
                strokeWidth={STROKE_WIDTH}
                strokeOpacity={0.1}
                fill="none"
              />

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

        {nextExercise && (
          <View className="items-center mt-8">
            <Text className="label-text">Prochain exercice</Text>
            <Text className="text-lg-custom mt-1">{nextExercise}</Text>
          </View>
        )}
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
          <CustomButton title="Continuer" onPress={handleContinue} />
        )}
      </View>
    </View>
  );
};

export default SessionRest;