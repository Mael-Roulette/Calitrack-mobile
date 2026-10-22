import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import { Goal, Training } from "@/types";
import { ScrollView, View } from "react-native";
import SessionSummary from "./SessionSummary";

export default function SessionIntro ( { training, goals, onStart }: {
  training: Training;
  goals: Goal[];
  onStart: () => void;
} ) {
  return (
    <>
      <PageHeader title={ `Session : ${training.name}` } />
      <ScrollView
        className="flex-1"
        contentContainerStyle={ { flexGrow: 1 } }
        showsVerticalScrollIndicator={ false }
      >
        <SessionSummary training={ training } goals={ goals } />
      </ScrollView>
      <View className="px-5 py-3">
        <CustomButton onPress={ onStart } title="C'est parti !" />
      </View>
    </>
  );
}