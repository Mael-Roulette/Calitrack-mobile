import CustomTimePicker from "@/components/ui/CustomTimePicker";
import { getExerciseImage } from "@/constants/exercises";
import { Exercise } from "@/types";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import FieldInput from "./FieldInput";
import FieldWrapper from "./FieldWrapper";
import WeightInput from "./WeightInput";

export type SeriesForm = {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  targetValue: number;
  rpe: number;
  weight: number | null;
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
      {/* Header exercice */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-12 h-12 bg-secondary rounded-lg items-center justify-center overflow-hidden">
            { imageSource ? (
              <Image
                source={ imageSource }
                style={ { width: "100%", height: "100%" } }
                contentFit="contain"
              />
            ) : (
              <Feather name="activity" size={ 20 } color="#FFF9F7" />
            ) }
          </View>

          <View className="flex-1">
            <Text
              className="font-sregular text-primary text-base"
              numberOfLines={ 1 }
            >
              { series.exercise.name }
            </Text>
            <Text className="label-text text-sm">
              { series.sets }x{ " " }
              { isHold
                ? `${ series.targetValue } seconde(s)`
                : `${ series.targetValue } répétition(s)` }
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

      <View className="flex-row gap-2 mb-4">
        <FieldWrapper label="Séries">
          <FieldInput
            value={ series.sets }
            onChangeText={ ( v ) => onUpdate( index, "sets", Math.max( 1, parseInt( v ) || 1 ) ) }
          />
        </FieldWrapper>

        <FieldWrapper label={ isHold ? "Durée (s)" : "Répétitions" }>
          <FieldInput
            value={ series.targetValue }
            onChangeText={ ( v ) => onUpdate( index, "targetValue", Math.max( 1, parseInt( v ) || 1 ) ) }
            suffix={ isHold ? "s" : undefined }
          />
        </FieldWrapper>
      </View>
      <View className="flex-row gap-2">

        <FieldWrapper label="RPE">
          <FieldInput
            value={ series.rpe }
            onChangeText={ ( v ) => {
              const num = parseInt( v ) || 0;
              onUpdate( index, "rpe", Math.min( 10, Math.max( 0, num ) ) );
            } }
          />
        </FieldWrapper>

        <FieldWrapper label="Poids">
          <WeightInput
            value={ series.weight }
            onChange={ ( v ) => onUpdate( index, "weight", v as unknown as number ) }
          />
        </FieldWrapper>

        <FieldWrapper label="Repos">
          <View style={ { height: 44 } } className="w-full justify-center">
            <CustomTimePicker
              label=""
              value={ series.restMinutes * 60 + series.restSeconds }
              showHours={ false }
              showSeconds={ true }
              minutesInterval={ 1 }
              onChange={ ( totalSeconds ) => {
                onUpdate( index, "restMinutes", Math.floor( totalSeconds / 60 ) );
                onUpdate( index, "restSeconds", totalSeconds % 60 );
              } }
              customStyles="border-secondary py-0 h-full justify-center"
            />
          </View>
        </FieldWrapper>
      </View>
    </View>
  );
}
