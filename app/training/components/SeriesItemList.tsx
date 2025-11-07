import React from 'react';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SeriesItemEdit from './SeriesItemEdit';
import { MixSeriesType } from './TrainingForm';

interface SeriesItemListProps {
  seriesList: MixSeriesType[];
  onSeriesListChange: ( newList: MixSeriesType[] ) => void;
  onEditSeries: ( index: number ) => void;
}

const SeriesItemList = ( { seriesList, onSeriesListChange, onEditSeries }: SeriesItemListProps ) => {
  const handleDeleteSeries = ( exerciseId: string ) => {
    const updatedList = seriesList.filter( ( series ) => series.exercise !== exerciseId );
    onSeriesListChange( updatedList );
  };

  const renderItem = ( { item, drag, isActive, getIndex }: RenderItemParams<MixSeriesType> ) => {
    const index = getIndex();
    return (
      <ScaleDecorator activeScale={ 1.05 }>
        <SeriesItemEdit
          seriesData={ item }
          onDelete={ () => handleDeleteSeries( typeof item.exercise === 'string' ? item.exercise : item.exercise.$id ) }
          onDrag={ drag }
          onEdit={ () => onEditSeries( index ?? 0 ) }
          isActive={ isActive }
        />
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView>
      <DraggableFlatList
        data={ seriesList }
        onDragEnd={ ( { data } ) => onSeriesListChange( data ) }
        keyExtractor={ ( item ) => typeof item.exercise === 'string' ? item.exercise : item.exercise.$id }
        renderItem={ renderItem }
        activationDistance={ 10 }
      />
    </GestureHandlerRootView>
  );
};

export default SeriesItemList;