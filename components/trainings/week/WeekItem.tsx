import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ActionsMenu, { ActionMenuItem } from "../../ui/ActionsMenu";
import CustomButton from "../../ui/CustomButton";
import { Week } from "@/types";
import { router } from "expo-router";

interface WeekItemProps {
  week: Week;
}

export default function WeekItem ( { week }: WeekItemProps ) {
  const [ showMenu, setShowMenu ] = useState<boolean>( false );

  const items: ActionMenuItem[] = [
    {
      icon: "copy",
      text: "Dupliquer",
      onPress: () => {}
    },
    {
      icon: "trash-2",
      text: "Supprimer",
      onPress: () => {},
      color: "#ef4444",
      textColor: "#ef4444",
    },
  ];

  return (
    <View className="relative">
      <View className="rounded-md border border-secondary px-5 py-4 flex-col gap-4">
        <View className="flex-row items-center justify-between gap-4">
          <Text className="text text-xl">{ week.name }</Text>
          <TouchableOpacity
            className="bg-background border border-secondary rounded-full p-2"
            onPress={ () => setShowMenu( true ) }
          >
            <Entypo name="dots-three-vertical" size={ 20 } className="text-primary" />
          </TouchableOpacity>
        </View>
        <CustomButton
          title="Voir la semaine"
          variant="secondary"
          textStyles="text-lg"
          onPress={ () => router.push( `/week/${week.$id}/page` ) }
        />
      </View>
      <ActionsMenu
        visible={ showMenu }
        onClose={ () => setShowMenu( false ) }
        items={ items }
      />
    </View>
  );
}
