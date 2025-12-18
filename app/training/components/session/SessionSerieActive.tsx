import CustomButton from "@/components/CustomButton";
import { getExerciseImage } from "@/constants/exercises";
import { SeriesParams } from "@/types/series";
import { Image, ScrollView, Text, View } from "react-native";

interface SessionSerieActiveProps {
    series: SeriesParams;
    currentSet: number;
    totalSets: number;
    seriesNumber: number;
    totalSeries: number;
    onSetComplete: () => void;
}

const SessionSerieActive = ( {
    series,
    currentSet,
    totalSets,
    seriesNumber,
    totalSeries,
    onSetComplete
}: SessionSerieActiveProps ) => {
    const exercise = typeof series.exercise === "string" ? null : series.exercise;

    const formatTargetValue = () => {
        if ( !exercise ) return series.targetValue;

        if ( exercise.format === "hold" ) {
            return `${series.targetValue}s`;
        }
        return `${series.targetValue} reps`;
    };

    return (
        <>
            <ScrollView className="flex-1 h-full">
                <View className="flex-row gap-5 items-center justify-center mt-2 mb-4">
                    <Text className="text-primary-100 text-lg text-center">
                        Progression de l&apos;entraînement ( { seriesNumber } / { totalSeries } )
                    </Text>
                </View>
                {/* Progression globale */ }
                <View className="bg-primary-100/20 flex-1 rounded-full h-2 mb-6">
                    <View
                        className="bg-secondary h-2 rounded-full"
                        style={ { width: `${( ( seriesNumber - 1 ) / totalSeries ) * 100}%` } }
                    />
                </View>

                {/* Image de l'exercice */ }
                { exercise?.image && (
                    <View className="w-full h-[200px] flex justify-center items-center rounded-2xl bg-secondary overflow-hidden mb-6">
                        <Image
                            source={ getExerciseImage( exercise.image ) }
                            style={ { width: 250, height: 250 } }
                        />
                    </View>
                ) }

                {/* Nom de l'exercice */ }
                <Text className="title text-center mb-5">
                    { exercise?.name || "Exercice" }
                </Text>

                <View className="flex-row items-center justify-around mb-8">
                    {/* Objectif */ }
                    <View>
                        <Text className="text-primary-100 text-xl text-center mb-1">
                            Objectif
                        </Text>
                        <Text className="title-2 text-secondary text-center">
                            { formatTargetValue() }
                        </Text>
                    </View>

                    {/* RPE: effort perçu */ }
                    <View>
                        <Text className="text-primary-100 text-xl text-center mb-1">
                            RPE cible
                        </Text>
                        <Text className="title-2 text-secondary  text-center">
                            { series.rpe } / 10
                        </Text>
                    </View>
                </View>

                {/* Note personnelle */ }
                { series.note && (
                    <View className="mb-6">
                        <Text className="text-primary-100 text-xl text-center mb-1">
                            Note personnelle
                        </Text>
                        <Text className="text-primary italic text-lg">
                            { series.note }
                        </Text>
                    </View>
                ) }
            </ScrollView>

            <View className="w-full bg-background pt-5 flex-col gap-5 justify-center items-center">
                {/* Progression des sets */ }
                <View>
                    <Text className="text-primary font-bold text-xl text-center mb-4">Sets restants</Text>
                    <View className="flex-row gap-2 items-center">
                        { Array.from( { length: totalSets } ).map( ( _, index ) => (
                            <View
                                key={ index }
                                className={ `w-12 h-12 rounded-full items-center justify-center border-2 ${index < currentSet
                                    ? "bg-secondary border-secondary"
                                    : index === currentSet - 1
                                        ? "border-secondary"
                                        : "border-primary"
                                    }` }
                            >
                                <Text
                                    className={ `text-xl ${index < currentSet
                                        ? "text-background"
                                        : index === currentSet - 1
                                            ? "text-secondary"
                                            : "text-primary"
                                        }` }
                                >
                                    { index + 1 }
                                </Text>
                            </View>
                        ) ) }
                    </View>
                </View>

                {/* Bouton de validation */ }
                <CustomButton
                    title={ currentSet === totalSets ? "Série terminée" : "Set terminé" }
                    customStyles="w-full"
                    onPress={ onSetComplete }
                />
            </View>
        </>
    );
};

export default SessionSerieActive;