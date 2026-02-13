import { Goal } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";

interface GoalItemProps {
  goal: Goal;
  canDelete: boolean;
}

export default function GoalItem ( { goal, canDelete = false } : GoalItemProps ) {
  const [ showDelete, setShowDelete ] = useState<boolean>( false );

  const renderProgress = () => {
    if ( goal.state !== "in-progress" ) return null;

    return (
      <View className='mt-4'>
        <View className='flex-row justify-between mb-3'>
          <Text>Progression</Text>
          <Text>
            { goal.progressHistory[ goal.progressHistory.length ] } / { goal.total }
          </Text>
        </View>
        <Progress.Bar
          progress={ goal.progressHistory[ goal.progressHistory.length ] / goal.total }
          width={ null }
          unfilledColor='#e0e0e0'
          borderWidth={ 0 }
          color={ "rgba(252, 121, 66, 1)" }
        />
      </View>
    );
  };

  const renderContent = () => {
    switch ( goal.state ) {
      case "in-progress":
        return renderProgress();
      case "finish":
        return null;
      default:
        return <Text>{ goal.state }</Text>;
    }
  };


  return (
    <TouchableOpacity
      onPress={ () => goal.state === "in-progress"  }
      activeOpacity={ goal.state === "in-progress" ? 0.7 : 1 }
    >
      <View
        className={ "w-full px-5 py-4 mb-4 border-[1px] rounded-xl border-secondary" }
      >
        <View className='flex-row justify-between items-start gap-4'>
          <View className="min-w-0 flex-row items-center gap-5">
            <Text className='font-sregular text-primary text-lg max-w-[160px]' numberOfLines={ 1 } ellipsizeMode="tail">{ goal.exercise.name }</Text>
            <Text
              className={ "text-xs font-sregular px-3 py-2 rounded-full border-[1px] border-secondary text-secondary" }
            >
              { goal.state === "finish" ? "Validé" : goal.state === "in-progress" && "En cours" }
            </Text>
          </View>
          { goal.state === "in-progress" && canDelete && (
            <TouchableOpacity
              onPress={ () => setShowDelete( !showDelete ) }
              accessibilityLabel='Voir les options'
              style={ { paddingLeft: 24 } }
            >
              <Feather name='trash-2' size={ 20 } color='#ef4444' />
            </TouchableOpacity>
          ) }
        </View>
        { renderContent() }
      </View>
    </TouchableOpacity>
  );
}