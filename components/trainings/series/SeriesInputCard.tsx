import CustomTimePicker from "@/components/ui/CustomTimePicker";
import { getExerciseImage } from "@/constants/exercises";
import { Exercise } from "@/types";
import { Feather } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import FieldInput from "./FieldInput";
import FieldWrapper from "./FieldWrapper";
import WeightInput from "./WeightInput";

export type SeriesForm = {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  targetValue: number;
  isMax: boolean;
  rpe: number;
  weight: number | null;
  restMinutes: number;
  restSeconds: number;
  order: number;
};

interface SeriesCardProps {
  series: SeriesForm;
  index: number;
  onUpdate: <K extends keyof SeriesForm>(
    index: number,
    field: K,
    value: SeriesForm[K]
  ) => void;
  onDelete: ( index: number ) => void;
}

export default function SeriesInputCard ( {
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

      <View className="flex-row flex-shrink-0 gap-2 mb-4">
        <FieldWrapper label="Séries">
          <FieldInput
            value={ series.sets }
            onChangeValue={ ( v ) => onUpdate( index, "sets", v ) }
          />
        </FieldWrapper>

        <View className="flex flex-col items-end gap-1.5">
          <FieldWrapper label={ isHold ? "Durée (s)" : "Répétitions" }>
            { series.isMax ? (
              <View
                className="relative border border-secondary bg-secondary-50 rounded-lg flex-row items-center justify-center w-full"
                style={ { height: 44 } }
              >
                <TextInput
                  className="text text-center flex-1"
                  value="Max"
                  editable={ false }
                />
              </View>
            ) : (
              <FieldInput
                value={ series.targetValue }
                onChangeValue={ ( v ) => onUpdate( index, "targetValue", v ) }
                suffix={ isHold ? "s" : undefined }
              />
            )}
          </FieldWrapper>
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={ () => onUpdate( index, "isMax", !series.isMax ) }
            activeOpacity={ 0.7 }
          >
            <Checkbox
              value={ series.isMax }
              onValueChange={ ( checked ) => onUpdate( index, "isMax", checked ) }
              color={ series.isMax ? "#FC7942" : undefined }
            />
            <Text className="text-lg">Max { isHold ? " hold" : " rep"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row gap-2 h-fit">

        <FieldWrapper label="RPE">
          <FieldInput
            value={ series.rpe }
            onChangeValue={ ( v ) => {
              const num = v;
              onUpdate( index, "rpe", Math.min( 10, Math.max( 0, num ) ) );
            } }
          />
        </FieldWrapper>

        <FieldWrapper label="Poids">
          <WeightInput
            value={ series.weight }
            onChange={ ( v ) => onUpdate( index, "weight", v ) }
          />
        </FieldWrapper>

        <FieldWrapper label="Repos">
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
          />
        </FieldWrapper>
      </View>
    </View>
  );
}
