import CustomTimePicker from "@/components/ui/CustomTimePicker";
import { NumericField } from "@/components/ui/NumericField";
import { getExerciseImage } from "@/constants/exercises";
import { Exercise } from "@/types";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

export type SeriesForm = {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  targetValue: number;
  rpe: number;
  weight: number;
  restMinutes: number;
  restSeconds: number;
  order: number;
};

interface SeriesCardProps {
  series: SeriesForm;
  index: number;
  onUpdate: ( index: number, field: keyof SeriesForm, value: number ) => void;
  onDelete: ( index: number ) => void;
}

export default function SeriesCard ( {
  series,
  index,
  onUpdate,
  onDelete,
}: SeriesCardProps ) {
  const isHold = series.exercise.format === "hold";
  const imageSource = series.exercise.image
    ? getExerciseImage( series.exercise.image )
    : null;

  return (
    <View className="border border-secondary rounded-xl p-4 mb-3 bg-background">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-12 h-12 bg-secondary rounded-lg items-center justify-center overflow-hidden">
            {imageSource ? (
              <Image
                source={ imageSource }
                style={ { width: "100%", height: "100%" } }
                contentFit="contain"
              />
            ) : (
              <Feather name="activity" size={ 20 } color="#FFF9F7" />
            )}
          </View>

          <View className="flex-1">
            <Text
              className="font-sregular text-primary text-base"
              numberOfLines={ 1 }
            >
              {series.exercise.name}
            </Text>
            <Text className="label-text text-sm">
              {series.sets}x{" "}
              {isHold
                ? `${series.targetValue} seconde(s)`
                : `${series.targetValue} répétition(s)`}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={ () => onDelete( index ) }
          hitSlop={ { top: 10, bottom: 10, left: 10, right: 10 } }
          className="ml-2 p-1"
        >
          <Feather name="x" size={ 20 } color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-2 mb-3">
        <NumericField
          label="Séries"
          value={ series.sets }
          onChangeText={ ( v ) => onUpdate( index, "sets", Math.max( 1, parseInt( v ) || 1 ) ) }
        />
        <NumericField
          label={ isHold ? "Durée (s)" : "Répétitions" }
          value={ series.targetValue }
          onChangeText={ ( v ) => onUpdate( index, "targetValue", Math.max( 1, parseInt( v ) || 1 ) ) }
          suffix={ isHold ? "s" : undefined }
        />
      </View>

      <View className="flex-row gap-2">
        <NumericField
          label="RPE"
          value={ series.rpe }
          onChangeText={ ( v ) => {
            const num = parseInt( v ) || 0;
            onUpdate( index, "rpe", Math.min( 10, Math.max( 0, num ) ) );
          } }
        />

        <NumericField
          label="Poids"
          value={ series.weight }
          onChangeText={ ( v ) => onUpdate( index, "weight", parseInt( v ) || 0 ) }
          suffix="kg"
        />


        <CustomTimePicker
          label="Repos (minutes)"
          value={ series.restMinutes }
          onChange={ ( restMinutes ) => {

          } }
          showHours={ false }
          minutesInterval={ 5 }
          customStyles="border-secondary"
        />

        {/*<View className="flex-1 items-center gap-1">
          <Text className="label-text text-xs text-center">Repos</Text>
          <View className="border border-primary-100/40 rounded-lg flex-row items-center justify-center px-2 py-2 gap-1">
            <TextInput
              value={ String( series.restMinutes ) }
              onChangeText={ ( v ) =>
                onUpdate( index, "restMinutes", Math.max( 0, parseInt( v ) || 0 ) )
              }
              keyboardType="numeric"
              className="text text-center"
              style={ { width: 26 } }
              selectTextOnFocus
            />
            <Text className="text-primary-100 text-sm font-sregular">m</Text>
            <TextInput
              value={ String( series.restSeconds ) }
              onChangeText={ ( v ) => {
                const num = parseInt( v ) || 0;
                onUpdate( index, "restSeconds", Math.min( 59, Math.max( 0, num ) ) );
              } }
              keyboardType="numeric"
              className="text text-center"
              style={ { width: 26 } }
              selectTextOnFocus
            />
            <Text className="text-primary-100 text-sm font-sregular">s</Text>
          </View>
        </View>*/}
      </View>
    </View>
  );
}
