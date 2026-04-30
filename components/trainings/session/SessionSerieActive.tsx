import CustomButton from "@/components/ui/CustomButton";
import { getExerciseImage } from "@/constants/exercises";
import { Series } from "@/types";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View
} from "react-native";

interface SessionSerieActiveProps {
  series: Series;
  currentSet: number;
  totalSets: number;
  seriesNumber: number;
  totalSeries: number;
  onSetComplete: ( achievedValue: number ) => void;
}

export default function SessionSerieActive ( {
  series,
  currentSet,
  totalSets,
  seriesNumber,
  totalSeries,
  onSetComplete,
}: SessionSerieActiveProps ) {
  const exercise = typeof series.exercise === "string" ? null : series.exercise;
  const target = series.targetValue;

  const [ selectedValue, setSelectedValue ] = useState( target );

  const formatValue = ( v: number ) => {
    if ( !exercise ) return `${v}`;
    return exercise.format === "hold" ? `${v}s` : `${v}`;
  };

  const data = [ ...Array( 100 ).keys() ].map( ( index ) => ( {
    value: index,
    label: exercise?.format === "hold" ? `${index}s` : `${index}rep`,
  } ) );

  const [ value, setValue ] = useState( 0 );

  return (
    <View className="flex-1 bg-background">
      {/* Contenu scrollable */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={ { flexGrow: 1 } }
        showsVerticalScrollIndicator={ true }
      >
        <View className="px-5 pt-4">
          {/* Progression */}
          <Text className="text-primary-100 text-base text-center mb-3">
            Exercice {seriesNumber} / {totalSeries}
          </Text>
          <View className="bg-primary-100/20 rounded-full h-2 mb-6">
            <View
              className="bg-secondary h-2 rounded-full"
              style={ { width: `${( ( seriesNumber - 1 ) / totalSeries ) * 100}%` } }
            />
          </View>

          {/* Image */}
          {exercise?.image && (
            <View className="w-full h-[180px] justify-center items-center rounded-2xl bg-secondary overflow-hidden mb-5">
              <Image
                source={ getExerciseImage( exercise.image ) }
                style={ { width: 220, height: 220 } }
              />
            </View>
          )}

          {/* Nom */}
          <Text className="title text-center mb-5">
            {exercise?.name ?? "Exercice"}
          </Text>

          {/* Métriques */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 items-center">
              <Text className="label-text text-center mb-1">Objectif</Text>
              <View className="w-full py-2 rounded-md border border-secondary items-center">
                <Text className="title-3">{formatValue( target )}</Text>
              </View>
            </View>
            <View className="flex-1 items-center">
              <Text className="label-text text-center mb-1">Poids</Text>
              <View className="w-full py-2 rounded-md border border-secondary items-center">
                <Text className="title-3">{series.weight} kg</Text>
              </View>
            </View>
            <View className="flex-1 items-center">
              <Text className="label-text text-center mb-1">RPE</Text>
              <View className="w-full py-2 rounded-md border border-secondary items-center">
                <Text className="title-3">{series.rpe}/10</Text>
              </View>
            </View>
          </View>

          <View className="h-22">
            <Text className="title-2 text-center">Performance</Text>
            <WheelPicker
              data={ data }
              value={ selectedValue }
              onValueChanged={ ( { item: { value } } ) => setSelectedValue( value ) }
              enableScrollByTapOnItem
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer fixe */}
      <View className="px-5 py-4 bg-background border-t border-primary-100/10 gap-4">
        {/* Indicateurs de sets */}
        <View className="items-center gap-2">
          <Text className="label-text text-center">
            Set {currentSet} / {totalSets}
          </Text>
          <View className="flex-row gap-2">
            {Array.from( { length: totalSets } ).map( ( _, index ) => {
              const isDone = index < currentSet - 1;
              const isCurrent = index === currentSet - 1;
              return (
                <View
                  key={ index }
                  className={ `w-11 h-11 rounded-full items-center justify-center border-2 ${
                    isDone
                      ? "bg-secondary border-secondary"
                      : isCurrent
                        ? "border-secondary bg-secondary/10"
                        : "border-primary-100"
                  }` }
                >
                  <Text
                    className={ `text-base ${
                      isDone
                        ? "text-background font-bold"
                        : isCurrent
                          ? "text-secondary font-bold"
                          : "text-primary-100"
                    }` }
                  >
                    {index + 1}
                  </Text>
                </View>
              );
            } )}
          </View>
        </View>

        <CustomButton
          title={ currentSet === totalSets ? "Terminer la série" : "Set terminé" }
          onPress={ () => onSetComplete( selectedValue ) }
          variant="secondary"
        />
      </View>
    </View>
  );
}