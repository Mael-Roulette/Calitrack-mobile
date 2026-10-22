import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import { Performances } from "@/types/session";
import { ScrollView, View } from "react-native";
import SessionRecap from "./SessionRecap";
import { Training } from "@/types";

export default function SessionCompleted ( {
  training,
  duration,
  performances,
  onNoteChange,
  onEnd,
  isSaving,
}: {
  training: Training;
  duration: number;
  performances: Performances;
  onNoteChange: ( note: string ) => void;
  onEnd: () => void;
  isSaving: boolean;
} ) {
  return (
    <>
      <PageHeader title={ `Session : ${training.name}` } onBackPress={ onEnd } />
      <ScrollView
        className="flex-1"
        contentContainerStyle={ { flexGrow: 1 } }
        showsVerticalScrollIndicator={ false }
      >
        <SessionRecap
          training={ training }
          sessionDuration={ duration }
          handleSetSessionNote={ onNoteChange }
          performances={ performances }
        />
      </ScrollView>
      <View className="px-5 py-3">
        <CustomButton onPress={ onEnd } title="Terminer la séance" isLoading={ isSaving } />
      </View>
    </>
  );
}