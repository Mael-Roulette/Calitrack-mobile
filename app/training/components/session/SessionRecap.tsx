import { Training } from "@/types";
import { Text, View, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

interface PerformanceData {
    seriesId: string;
    setNumber: number;
    reachValue: number;
    notes?: string;
}

interface SessionRecapProps {
    training: Training;
    startTime: Date;
    endTime: Date;
    performances: PerformanceData[];
}

const SessionRecap = ( {
    training,
    startTime,
    endTime,
    performances,
}: SessionRecapProps ) => {
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.floor( durationMs / 60000 );
    const hours = Math.floor( durationMinutes / 60 );
    const minutes = durationMinutes % 60;

    const formattedDuration =
        hours > 0 ? `${hours}h${minutes > 0 ? minutes : ""}` : `${minutes} min`;

    const totalSeries = training.series?.length || 0;
    const totalSets =
        training.series?.reduce( ( acc, s ) => acc + s.sets, 0 ) || 0;

    // Calculer les statistiques de performance
    const performanceStats = training.series?.map( ( series ) => {
        const seriesPerformances = performances.filter(
            ( p ) => p.seriesId === series.$id
        );

        const avgPerformance =
            seriesPerformances.length > 0
                ? seriesPerformances.reduce( ( acc, p ) => acc + p.reachValue, 0 ) /
                seriesPerformances.length
                : 0;

        const targetReached =
            avgPerformance >= series.targetValue * 0.9; // 90% de l'objectif

        return {
            series,
            performances: seriesPerformances,
            avgPerformance: Math.round( avgPerformance ),
            targetReached,
        };
    } );

    return (
        <ScrollView className="flex-1 px-5 pt-8">
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
            <View className="bg-background border border-secondary rounded-2xl p-6 gap-5 mb-6">
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
                            { totalSeries }{ " " }
                            { totalSeries > 1 ? "exercices" : "exercice" }
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

            {/* Détails des performances */ }
            { performanceStats && performanceStats.length > 0 && (
                <View className="bg-background border border-secondary rounded-2xl p-6 gap-4 mb-6">
                    <Text className="title-3 text-center mb-2">
                        Vos performances
                    </Text>

                    { performanceStats.map( ( stat, index ) => {
                        const exercise =
                            typeof stat.series.exercise === "string"
                                ? null
                                : stat.series.exercise;

                        return (
                            <View
                                key={ index }
                                className="pb-4 border-b border-primary-100/20 last:border-b-0 last:pb-0"
                            >
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-primary font-sregular text-base flex-1">
                                        { exercise?.name || "Exercice" }
                                    </Text>
                                    { stat.targetReached && (
                                        <View className="bg-green-100 px-2 py-1 rounded">
                                            <Text className="text-green-800 text-xs font-sregular">
                                                ✓ Objectif atteint
                                            </Text>
                                        </View>
                                    ) }
                                </View>

                                <View className="flex-row items-center gap-4">
                                    <View>
                                        <Text className="text-primary-100 text-xs">
                                            Objectif
                                        </Text>
                                        <Text className="text-primary font-sregular">
                                            { stat.series.targetValue }
                                            { exercise?.format === "hold"
                                                ? "s"
                                                : " reps" }
                                        </Text>
                                    </View>

                                    <View>
                                        <Text className="text-primary-100 text-xs">
                                            Moyenne
                                        </Text>
                                        <Text
                                            className={ `font-sregular ${stat.targetReached
                                                    ? "text-green-600"
                                                    : "text-primary"
                                                }` }
                                        >
                                            { stat.avgPerformance }
                                            { exercise?.format === "hold"
                                                ? "s"
                                                : " reps" }
                                        </Text>
                                    </View>

                                    <View>
                                        <Text className="text-primary-100 text-xs">
                                            Sets
                                        </Text>
                                        <Text className="text-primary font-sregular">
                                            { stat.performances.length } /{ " " }
                                            { stat.series.sets }
                                        </Text>
                                    </View>
                                </View>

                                {/* Notes si présentes */ }
                                { stat.performances.some( ( p ) => p.notes ) && (
                                    <View className="mt-2 bg-primary-100/10 p-2 rounded">
                                        <Text className="text-primary-100 text-xs mb-1">
                                            Notes:
                                        </Text>
                                        { stat.performances
                                            .filter( ( p ) => p.notes )
                                            .map( ( p, idx ) => (
                                                <Text
                                                    key={ idx }
                                                    className="text-primary text-xs italic"
                                                >
                                                    • { p.notes }
                                                </Text>
                                            ) ) }
                                    </View>
                                ) }
                            </View>
                        );
                    } ) }
                </View>
            ) }

            {/* Message motivationnel */ }
            <View className="mt-4 bg-secondary/10 rounded-xl p-4 mb-8">
                <Text className="text-primary font-sregular text-center">
                    Continue comme ça ! Chaque séance te rapproche de tes
                    objectifs.
                </Text>
            </View>
        </ScrollView>
    );
};

export default SessionRecap;