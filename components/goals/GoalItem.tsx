import { useGoalActions } from "@/hooks/actions/useGoalActions";
import { Goal } from "@/types";
import { Feather } from "@expo/vector-icons";
import { memo, useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import DeleteGoalModal from "./DeleteGoalModal";
import UpdateGoalModal from "./UpdateGoalModal";

interface GoalItemProps {
  goal: Goal;
  canDelete?: boolean;
}

function GoalItem({ goal, canDelete = true }: GoalItemProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProgress, setNewProgress] = useState("");
  const { handleUpdate, handleDelete, isUpdating, isDeleting } = useGoalActions();

  // Calculer la progression actuelle
  const currentProgress = useMemo(
    () => goal.progressHistory[goal.progressHistory.length - 1] || 0,
    [goal.progressHistory]
  );

  // Calculer le pourcentage de progression
  const progressPercentage = useMemo(
    () => Math.min(currentProgress / goal.total, 1),
    [currentProgress, goal.total]
  );

  // État de l'objectif
  const isInProgress = goal.state === "in-progress";
  const isFinished = goal.state === "finished";

  // Gestion de la mise à jour
  const handleUpdateProgress = useCallback(async () => {
    const parsedProgress = Number(newProgress);
    const result = await handleUpdate({
      goalId: goal.$id,
      progress: parsedProgress
    });

    if (result.success) {
      setModalVisible(false);
      setNewProgress("");
    }
  }, [newProgress, handleUpdate]);

  // Gestion de la suppression
  const handleDeleteGoal = useCallback(async () => {
    const result = await handleDelete({
      goalId: goal.$id
    });

    if (result.success) {
      setShowDelete(false);
    }
  }, [handleDelete]);

  // Handlers des modals
  const handleOpenModal = () => {
    if (isInProgress) {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewProgress("");
  };

  const handleOpenDeleteModal = () => {
    setShowDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDelete(false);
  };

  // Rendu de la barre de progression
  const renderProgress = useMemo(() => {
    if (!isInProgress) return null;

    return (
      <View className="mt-4">
        <View className="flex-row justify-between mb-3">
          <Text className="text">Progression</Text>
          <Text className="text">
            {currentProgress} / {goal.total}
          </Text>
        </View>
        <Progress.Bar
          progress={progressPercentage}
          width={null}
          unfilledColor="#e0e0e0"
          borderWidth={0}
          color="rgba(252, 121, 66, 1)"
        />
      </View>
    );
  }, [isInProgress, currentProgress, goal.total, progressPercentage]);

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenModal}
        activeOpacity={isInProgress ? 0.7 : 1}
        disabled={!isInProgress}
      >
        <View className="w-full px-5 py-4 mb-4 border-[1px] rounded-xl border-secondary">
          <View className="flex-row justify-between items-start gap-4">
            <View className="min-w-0 flex-row items-center gap-5 flex-1">
              <Text
                className="font-sregular text-primary text-lg max-w-[160px]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {goal.exercise.name}
              </Text>
              <Text className="text-xs font-sregular px-3 py-2 rounded-full border-[1px] border-secondary text-secondary">
                {isFinished ? "Validé" : "En cours"}
              </Text>
            </View>

            { !canDelete || isInProgress && (
              <TouchableOpacity
                onPress={handleOpenDeleteModal}
                accessibilityLabel="Supprimer objectif"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                disabled={isDeleting}
              >
                <Feather
                  name="trash-2"
                  size={20}
                  color={isDeleting ? "#9ca3af" : "#ef4444"}
                />
              </TouchableOpacity>
            )}
          </View>

          {renderProgress}
        </View>
      </TouchableOpacity>

      <UpdateGoalModal
        modalVisible={modalVisible}
        setModalVisible={handleCloseModal}
        exercise={goal.exercise}
        progress={currentProgress}
        newProgress={newProgress}
        setNewProgress={setNewProgress}
        handleUpdateProgress={handleUpdateProgress}
        isUpdating={isUpdating}
      />

      <DeleteGoalModal
        showDelete={showDelete}
        setShowDelete={handleCloseDeleteModal}
        handleDelete={handleDeleteGoal}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default memo(GoalItem, (prevProps, nextProps) => {
  // Ne re-render que si l'objectif a changé
  return (
    prevProps.goal.$id === nextProps.goal.$id &&
    prevProps.goal.state === nextProps.goal.state &&
    prevProps.goal.progressHistory.length === nextProps.goal.progressHistory.length &&
    prevProps.goal.progressHistory[prevProps.goal.progressHistory.length - 1] ===
      nextProps.goal.progressHistory[nextProps.goal.progressHistory.length - 1]
  );
});