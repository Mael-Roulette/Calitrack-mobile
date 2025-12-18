import { Training } from "@/types";
import { Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SessionRecapProps {
    training: Training;
    startTime: Date;
    endTime: Date;
}

const SessionRecap = ( { training, startTime, endTime }: SessionRecapProps ) => {
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.floor( durationMs / 60000 );
    const hours = Math.floor( durationMinutes / 60 );
    const minutes = durationMinutes % 60;

    const formattedDuration = hours > 0
        ? `${hours}h${minutes > 0 ? minutes : ""}`
        : `${minutes} min`;

    const totalSeries = training.series?.length || 0;
    const totalSets = training.series?.reduce( ( acc, s ) => acc + s.sets, 0 ) || 0;

    return (
        <View className="flex-1 px-5 pt-8">
            {/* Header de félicitations */ }
            <View className="items-center mb-8">
                <View className="w-20 h-20 bg-secondary/20 rounded-full items-center justify-center mb-4">
                    <Feather name="check" size={ 40 } color="#FC7942" />
                </View>
                <Text className="text-primary-100 text-center font-sregular text-base">
                    Vous avez terminé votre séance
                </Text>
            </View>

            {/* Statistiques de la session */ }
            <View className="bg-background border border-secondary rounded-2xl p-6 gap-5">
                <Text className="title-3 text-center mb-2">
                    Résumé de la séance
                </Text>

                {/* Nom de l'entraînement */ }
                <View className="flex-row items-center gap-3 pb-4 border-b border-primary-100/20">
                    <View className="w-10 h-10 bg-secondary/20 rounded-full items-center justify-center">
                        <Feather name="clipboard" size={ 20 } color="#FC7942" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-primary-100 font-sregular text-sm">
                            Entraînement
                        </Text>
                        <Text className="text-primary font-sregular text-base">
                            { training.name }
                        </Text>
                    </View>
                </View>

                {/* Durée */ }
                <View className="flex-row items-center gap-3 pb-4 border-b border-primary-100/20">
                    <View className="w-10 h-10 bg-secondary/20 rounded-full items-center justify-center">
                        <Ionicons name="time-outline" size={ 20 } color="#FC7942" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-primary-100 font-sregular text-sm">
                            Durée totale
                        </Text>
                        <Text className="text-primary font-sregular text-base">
                            { formattedDuration }
                        </Text>
                    </View>
                </View>

                {/* Exercices */ }
                <View className="flex-row items-center gap-3 pb-4 border-b border-primary-100/20">
                    <View className="w-10 h-10 bg-secondary/20 rounded-full items-center justify-center">
                        <Feather name="activity" size={ 20 } color="#FC7942" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-primary-100 font-sregular text-sm">
                            Exercices complétés
                        </Text>
                        <Text className="text-primary font-sregular text-base">
                            { totalSeries } { totalSeries > 1 ? "exercices" : "exercice" }
                        </Text>
                    </View>
                </View>

                {/* Sets totaux */ }
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-secondary/20 rounded-full items-center justify-center">
                        <Feather name="repeat" size={ 20 } color="#FC7942" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-primary-100 font-sregular text-sm">
                            Sets totaux
                        </Text>
                        <Text className="text-primary font-sregular text-base">
                            { totalSets } sets
                        </Text>
                    </View>
                </View>
            </View>

            {/* Message motivationnel */ }
            <View className="mt-8 bg-secondary/10 rounded-xl p-4">
                <Text className="text-primary font-sregular text-center">
                    Continue comme ça ! Chaque séance te rapproche de tes objectifs.
                </Text>
            </View>
        </View>
    );
};

export default SessionRecap;