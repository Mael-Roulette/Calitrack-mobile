import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import useWeekActions from "@/hooks/actions/useWeekActions";
import useWeeksStore from "@/store/week.store";
import { Week } from "@/types";
import { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface WeekEditModalProps {
  modalVisible: boolean;
  setModalVisible: ( value: boolean ) => void;
  week: Week;
}

export default function WeekEditModal ( {
  modalVisible,
  setModalVisible,
  week,
}: WeekEditModalProps ) {
  const [ weekName, setWeekName ] = useState( week.name );
  const [ selectedOrder, setSelectedOrder ] = useState( week.order as number );
  const { handleUpdate, isUpdating } = useWeekActions();
  const { weeks } = useWeeksStore();

  // Sync à l'ouverture
  useEffect( () => {
    if ( modalVisible ) {
      setWeekName( week.name );
      setSelectedOrder( week.order as number );
    }
  }, [ modalVisible, week ] );

  const handleClose = () => {
    if ( !isUpdating ) setModalVisible( false );
  };

  const handleSubmit = async () => {
    const result = await handleUpdate( {
      weekId: week.$id,
      name: weekName,
      newOrder: selectedOrder,
    } );

    if ( result?.success ) setModalVisible( false );
  };

  // Semaine qui sera swappée si l'ordre sélectionné est différent
  const conflictWeek = selectedOrder !== ( week.order as number )
    ? weeks.find( ( w ) => w.$id !== week.$id && ( w.order as number ) === selectedOrder )
    : null;

  return (
    <Modal
      animationType="fade"
      transparent={ true }
      visible={ modalVisible }
      statusBarTranslucent={ true }
      onRequestClose={ handleClose }
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-background w-[85%] p-6 rounded-xl gap-5">
          <Text className="title-2">Modifier la semaine</Text>

          {/* Nom */}
          <CustomInput
            label="Nom de la semaine"
            value={ weekName }
            placeholder="Ex: Semaine A"
            onChangeText={ setWeekName }
          />

          {/* Sélecteur d'ordre */}
          <View className="gap-2">
            <Text className="label-text">Position</Text>
            <View className="flex-row flex-wrap gap-2">
              { weeks
                .slice()
                .sort( ( a, b ) => ( a.order as number ) - ( b.order as number ) )
                .map( ( w ) => {
                  const order = w.order as number;
                  const isSelected = order === selectedOrder;

                  return (
                    <TouchableOpacity
                      key={ order }
                      onPress={ () => setSelectedOrder( order ) }
                      className={ `w-12 h-12 rounded-full items-center justify-center border-2 ${
                        isSelected
                          ? "bg-secondary border-secondary"
                          : "bg-background border-secondary/40"
                      }` }
                    >
                      <Text
                        className={ `font-bold text-base ${
                          isSelected ? "text-background" : "text-primary"
                        }` }
                      >
                        { order }
                      </Text>
                    </TouchableOpacity>
                  );
                } )
              }
            </View>

            {/* Aperçu du swap */}
            { conflictWeek && (
              <View className="mt-1 px-3 py-2 bg-secondary/10 rounded-md border border-secondary/30">
                <Text className="text-sm font-sregular text-primary-100">
                  <Text className="font-bold text-primary">{ conflictWeek.name }</Text>
                  { " " }passera en position{ " " }
                  <Text className="font-bold text-primary">{ week.order as number }</Text>
                </Text>
              </View>
            ) }
          </View>

          <View className="flex-col gap-3">
            <CustomButton
              title="Enregistrer"
              onPress={ handleSubmit }
              isLoading={ isUpdating }
              variant="secondary"
            />
            <CustomButton
              title="Annuler"
              onPress={ handleClose }
              variant="primary"
              isLoading={ isUpdating }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
