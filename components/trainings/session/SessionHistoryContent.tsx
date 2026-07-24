import { Performance, Session } from "@/types";
import { formatSecondsDuration } from "@/utils/string";
import { Text, View } from "react-native";
import PerformanceHistory from "../performances/PerformanceHistory";

const SessionHistoryContent = ( { session }: { session: Session } ) => {
  // Regroupe les performances par exercice (via `order`) pour reconstituer les séries
  const grouped = session.performances.reduce<Record<number, Performance[]>>(
    ( acc, performance ) => {
      if ( !acc[ performance.order ] ) {
        acc[ performance.order ] = [];
      }
      acc[ performance.order ].push( performance );
      return acc;
    },
    {}
  );

  const orderedGroups = Object.entries( grouped )
    .sort( ( [ a ], [ b ] ) => Number( a ) - Number( b ) )
    .map( ( [ , performances ] ) =>
      [ ...performances ].sort( ( a, b ) => a.setNumber - b.setNumber )
    );

  return (
    <View>
      <View className="flex-row gap-1 items-center mb-4">
        <Text className="title-2">Durée : </Text>
        <Text className="text-lg-custom">
          {formatSecondsDuration( session.duration, true, false )}
        </Text>
      </View>

      { session.note && (
        <View className="mb-4">
          <Text className="text text-2xl font-calsans">
            Note personnelle :
          </Text>
          <Text className="text text-xl">{session.note}</Text>
        </View>
      )}

      <Text className="title">Mes performances</Text>
      <View className="mt-2 mb-5">
        {orderedGroups.map( ( performances ) => (
          <PerformanceHistory
            key={ performances[ 0 ].order }
            performances={ performances }
          />
        ) )}
      </View>
    </View>
  );
};

export default SessionHistoryContent;