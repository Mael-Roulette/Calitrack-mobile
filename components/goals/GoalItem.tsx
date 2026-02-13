import { deleteGoal, updateGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { Goal } from "@/types";
import { showAlert } from "@/utils/alert";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import DeleteGoalModal from "./DeleteGoalModal";
import UpdateGoalModal from "./UpdateGoalModal";

interface GoalItemProps {
  goal: Goal;
  canDelete: boolean;
}

export default function GoalItem ( { goal, canDelete = false } : GoalItemProps ) {
  const [ showDelete, setShowDelete ] = useState<boolean>( false );
  const [ modalVisible, setModalVisible ] = useState<boolean>( false );
  const [ newProgress, setNewProgress ] = useState<string>( "" );
  const [ isUpdating, setIsUpdating ] = useState<boolean>( false );

  const { updateGoalStore, deleteGoalStore, refreshGoals } = useGoalsStore();

  const currentProgress = goal.progressHistory[ goal.progressHistory.length - 1 ] || 0;

  const handleUpdateProgress = async () => {
    if ( isUpdating ) return;

    const parsedProgress = Number( newProgress );

    if ( isNaN( parsedProgress ) || parsedProgress <= 0 ) {
      showAlert.error( "Veuillez entrer une valeur valide." );
      return;
    }

    if ( parsedProgress > goal.total ) {
      showAlert.error( "La progression ne peut pas être supérieure à l'objectif." );
      return;
    }

    setIsUpdating( true );

    try {
      const updatedGoal = await updateGoal( {
        $id: goal.$id,
        progress: parsedProgress,
      } );

      updateGoalStore( goal.$id, updatedGoal );
      await refreshGoals();

      setModalVisible( false );
      setNewProgress( "" );

      showAlert.success( "Progression mise à jour avec succès !" );
    } catch ( error ) {
      console.error( error );
      showAlert.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour."
      );
    } finally {
      setIsUpdating( false );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal( goal.$id );
      deleteGoalStore( goal.$id );
      await refreshGoals();

      setShowDelete( false );
      showAlert.success( "Objectif supprimé avec succès." );
    } catch ( error ) {
      console.error( error );
      showAlert.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression."
      );
    }
  };

  const renderProgress = () => {
    if ( goal.state !== "in-progress" ) return null;

    return (
      <View className='mt-4'>
        <View className='flex-row justify-between mb-3'>
          <Text className="text">Progression</Text>
          <Text className="text">
            { currentProgress } / { goal.total }
          </Text>
        </View>
        <Progress.Bar
          progress={ currentProgress / goal.total }
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
        return <Text className="text">{ goal.state }</Text>;
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={ () => goal.state === "in-progress" && setModalVisible( true ) }
        activeOpacity={ goal.state === "in-progress" ? 0.7 : 1 }
      >
        <View
          className={ "w-full px-5 py-4 mb-4 border-[1px] rounded-xl border-secondary" }
        >
          <View className='flex-row justify-between items-start gap-4'>
            <View className="min-w-0 flex-row items-center gap-5">
              <Text className='font-sregular text-primary text-lg max-w-[160px]' numberOfLines={ 1 } ellipsizeMode="tail">
                { goal.exercise.name }
              </Text>
              <Text
                className={ "text-xs font-sregular px-3 py-2 rounded-full border-[1px] border-secondary text-secondary" }
              >
                { goal.state === "finish" ? "Validé" : goal.state === "in-progress" && "En cours" }
              </Text>
            </View>
            { goal.state === "in-progress" && canDelete && (
              <TouchableOpacity
                onPress={ () => setShowDelete( true ) }
                accessibilityLabel='Supprimer objectif'
                style={ { paddingLeft: 24 } }
              >
                <Feather name='trash-2' size={ 20 } color='#ef4444' />
              </TouchableOpacity>
            ) }
          </View>
          { renderContent() }
        </View>
      </TouchableOpacity>

      <UpdateGoalModal
        modalVisible={ modalVisible }
        setModalVisible={ setModalVisible }
        exercise={ goal.exercise }
        progress={ currentProgress }
        newProgress={ newProgress }
        setNewProgress={ setNewProgress }
        handleUpdateProgress={ handleUpdateProgress }
        isUpdating={ isUpdating }
      />

      <DeleteGoalModal
        showDelete={ showDelete }
        setShowDelete={ setShowDelete }
        handleDelete={ handleDelete }
      />
    </>
  );
}