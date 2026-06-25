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
            Cette fonctionnalité n&apos;est pas disponible sur cet appareil.
          </Text>
        ) : (
          <>
            <Text className="indicator-text mb-2">
              Si cette fonction est activée, pendant vos entraînements votre écran restera allumé.
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
            Cette fonctionnalité n&apos;est pas disponible sur cet appareil.
          </Text>
        ) : (
          <>
            <Text className="indicator-text mb-2">
              Si cette fonction est activée, si vous changez d&apos;application ou si vous éteingez votre téléphone. Vous recevrez une notification de fin de repos.
            </Text>
            <CustomButton
              title={ isRestNotificationActive ? "Désactiver" : "Activer" }
              onPress={ toggleRestNotification }
            />
          </>
        )}
      </View>
    </View>
  );
}