import { Text, View } from "react-native";
import CustomButton from "../ui/CustomButton";

interface UsageTrainingSectionProps {
  // Props pour la gestion de l'état de l'écran
  isKeepAwakeAvailable: boolean,
  isKeepAwakeActive: boolean,
  toggleKeepAwake: () => Promise<void>,

  // Props pour la gestion des notifications de l'entrainement
  isRestNotificationAvailable: boolean,
  isRestNotificationActive: boolean,
  toggleRestNotification: () => Promise<void>

  // Props pour la gestion des notifications de l'entrainement
  isRestSoundActive: boolean,
  toggleRestSound: () => Promise<void>
}

export default function UsageTrainingSection ( {
  isKeepAwakeAvailable,
  isKeepAwakeActive,
  toggleKeepAwake,
  isRestNotificationAvailable,
  isRestNotificationActive,
  toggleRestNotification,
  isRestSoundActive,
  toggleRestSound
}: UsageTrainingSectionProps ) {
  return (
    <View>
      <View>
        <Text className="title-2 mb-1">État de l&apos;écran : </Text>
        {!isKeepAwakeAvailable ? (
          <Text className="text-red-500 mb-2">
            Cette fonctionnalité n&apos;est pas prise en charge sur cet appareil.
          </Text>
        ) : (
          <>
            <Text className="indicator-text mb-2">
              Pendant vos entraînements, l&apos;écran restera allumé afin d&apos;éviter la mise en veille automatique.
            </Text>
            <CustomButton
              title={ isKeepAwakeActive ? "Désactiver" : "Activer" }
              onPress={ toggleKeepAwake }
            />
          </>
        )}

      </View>

      <View className="mt-8">
        <Text className="title-2 mb-1">Notifications de fin de repos : </Text>
        {!isRestNotificationAvailable ? (
          <Text className="text-red-500 mb-2">
            Cette fonctionnalité n&apos;est pas prise en charge sur cet appareil.
          </Text>
        ) : (
          <>
            <Text className="indicator-text mb-2">
              Vous recevrez une notification lorsque votre temps de repos est terminé, même si l&apos;application est en arrière-plan ou si votre écran est éteint.
            </Text>
            <CustomButton
              title={ isRestNotificationActive ? "Désactiver" : "Activer" }
              onPress={ toggleRestNotification }
            />
          </>
        )}
      </View>

      <View className="mt-8">
        <Text className="title-2 mb-1">Notifications de fin de repos : </Text>
        <Text className="indicator-text mb-2">
          Un signal sonore sera joué à la fin de chaque période de repos si cette option est activée.
        </Text>
        <CustomButton
          title={ isRestSoundActive ? "Désactiver" : "Activer" }
          onPress={ toggleRestSound }
        />
      </View>
    </View>
  );
}