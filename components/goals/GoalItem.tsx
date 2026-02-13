import { deleteGoal, updateGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { Goal } from "@/types";
import { showAlert } from "@/utils/alert";
import { Feather } from "@expo/vector-icons";
import { memo, useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import DeleteGoalModal from "./DeleteGoalModal";
import UpdateGoalModal from "./UpdateGoalModal";

interface GoalItemProps {
  goal: Goal;
}

function GoalItem ( { goal }: GoalItemProps ) {
  const [ showDelete, setShowDelete ] = useState<boolean>( false );
  const [ modalVisible, setModalVisible ] = useState<boolean>( false );
  const [ newProgress, setNewProgress ] = useState<string>( "" );
  const [ isUpdating, setIsUpdating ] = useState<boolean>( false );
  const [ isDeleting, setIsDeleting ] = useState<boolean>( false );

  const { updateGoalStore, deleteGoalStore } = useGoalsStore();

  // Calculer la progression actuelle avec useMemo
  const currentProgress = useMemo(
    () => goal.progressHistory[ goal.progressHistory.length - 1 ] || 0,
    [ goal.progressHistory ]
  );

  // Calculer le pourcentage de progression
  const progressPercentage = useMemo(
    () => Math.min( currentProgress / goal.total, 1 ),
    [ currentProgress, goal.total ]
  );

  // État de l'objectif
  const isInProgress = goal.state === "in-progress";
  const isFinished = goal.state === "finish";

  const handleUpdateProgress = useCallback( async () => {
    if ( isUpdating ) return;

    const parsedProgress = Number( newProgress );

    // Validation
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

      // Mise à jour optimiste du store
      updateGoalStore( goal.$id, updatedGoal );

      setModalVisible( false );
      setNewProgress( "" );
    } catch ( error ) {
      console.error( "Erreur mise à jour objectif:", error );
      showAlert.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour."
      );
    } finally {
      setIsUpdating( false );
    }
  }, [ newProgress, goal.$id, goal.total, updateGoalStore ] );

  const handleDelete = useCallback( async () => {
    if ( isDeleting ) return;

    setIsDeleting( true );

    try {
      await deleteGoal( goal.$id );

      // Suppression optimiste du store
      deleteGoalStore( goal.$id );
      setShowDelete( false );
    } catch ( error ) {
      console.error( "Erreur suppression objectif:", error );
      showAlert.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression."
      );
    } finally {
      setIsDeleting( false );
    }
  }, [ goal.$id, deleteGoalStore, isDeleting ] );

  const handleOpenModal = useCallback( () => {
    if ( isInProgress ) {
      setModalVisible( true );
    }
  }, [ isInProgress ] );

  const handleCloseModal = useCallback( () => {
    setModalVisible( false );
    setNewProgress( "" );
  }, [] );

  const handleOpenDeleteModal = useCallback( () => {
    setShowDelete( true );
  }, [] );

  const handleCloseDeleteModal = useCallback( () => {
    setShowDelete( false );
  }, [] );

  const renderProgress = useMemo( () => {
    if ( !isInProgress ) return null;

    return (
      <View className='mt-4'>
        <View className='flex-row justify-between mb-3'>
          <Text className="text">Progression</Text>
          <Text className="text">
            { currentProgress } / { goal.total }
          </Text>
        </View>
        <Progress.Bar
          progress={ progressPercentage }
          width={ null }
          unfilledColor='#e0e0e0'
          borderWidth={ 0 }
          color="rgba(252, 121, 66, 1)"
        />
      </View>
    );
  }, [ isInProgress, currentProgress, goal.total, progressPercentage ] );

  return (
    <>
      <TouchableOpacity
        onPress={ handleOpenModal }
        activeOpacity={ isInProgress ? 0.7 : 1 }
        disabled={ !isInProgress }
      >
        <View className="w-full px-5 py-4 mb-4 border-[1px] rounded-xl border-secondary">
          <View className='flex-row justify-between items-start gap-4'>
            <View className="min-w-0 flex-row items-center gap-5 flex-1">
              <Text
                className='font-sregular text-primary text-lg max-w-[160px]'
                numberOfLines={ 1 }
                ellipsizeMode="tail"
              >
                { goal.exercise.name }
              </Text>
              <Text
                className="text-xs font-sregular px-3 py-2 rounded-full border-[1px] border-secondary text-secondary"
              >
                { isFinished ? "Validé" : "En cours" }
              </Text>
            </View>

            { isInProgress && (
              <TouchableOpacity
                onPress={ handleOpenDeleteModal }
                accessibilityLabel='Supprimer objectif'
                hitSlop={ { top: 10, bottom: 10, left: 10, right: 10 } }
                disabled={ isDeleting }
              >
                <Feather
                  name='trash-2'
                  size={ 20 }
                  color={ isDeleting ? "#9ca3af" : "#ef4444" }
                />
              </TouchableOpacity>
            ) }
          </View>

          { renderProgress }
        </View>
      </TouchableOpacity>

      <UpdateGoalModal
        modalVisible={ modalVisible }
        setModalVisible={ handleCloseModal }
        exercise={ goal.exercise }
        progress={ currentProgress }
        newProgress={ newProgress }
        setNewProgress={ setNewProgress }
        handleUpdateProgress={ handleUpdateProgress }
        isUpdating={ isUpdating }
      />

      <DeleteGoalModal
        showDelete={ showDelete }
        setShowDelete={ handleCloseDeleteModal }
        handleDelete={ handleDelete }
        isDeleting={ isDeleting }
      />
    </>
  );
}

// Mémoriser le composant pour éviter les re-renders inutiles
export default memo( GoalItem, ( prevProps, nextProps ) => {
  // Ne re-render que si l'objectif a changé
  return (
    prevProps.goal.$id === nextProps.goal.$id &&
    prevProps.goal.state === nextProps.goal.state &&
    prevProps.goal.progressHistory.length === nextProps.goal.progressHistory.length &&
    prevProps.goal.progressHistory[ prevProps.goal.progressHistory.length - 1 ] ===
    nextProps.goal.progressHistory[ nextProps.goal.progressHistory.length - 1 ]
  );
} );