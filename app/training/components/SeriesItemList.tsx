import { CreateSeriesParams } from '@/types/series';
import React from 'react';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SeriesItemEdit from './SeriesItemEdit';

interface SeriesItemListProps {
  seriesList: Omit<CreateSeriesParams, 'training' | 'order'>[];
  onSeriesListChange: ( newList: Omit<CreateSeriesParams, 'training' | 'order'>[] ) => void;
  onEditSeries: ( index: number ) => void; // Nouvelle prop
}

const SeriesItemList = ( { seriesList, onSeriesListChange, onEditSeries }: SeriesItemListProps ) => {
  const handleDeleteSeries = ( exerciseId: string ) => {
    const updatedList = seriesList.filter( ( series ) => series.exercise !== exerciseId );
    onSeriesListChange( updatedList );
  };

  const renderItem = ( { item, drag, isActive, getIndex }: RenderItemParams<Omit<CreateSeriesParams, 'training' | 'order'>> ) => {
    const index = getIndex();
    return (
      <ScaleDecorator activeScale={ 1.05 }>
        <SeriesItemEdit
          seriesData={ item }
          onDelete={ () => handleDeleteSeries( item.exercise ) }
          onDrag={ drag }
          onEdit={ () => onEditSeries( index ?? 0 ) }
          isActive={ isActive }
        />
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={ { flex: 1 } }>
      <DraggableFlatList
        data={ seriesList }
        onDragEnd={ ( { data } ) => onSeriesListChange( data ) }
        keyExtractor={ ( item ) => item.exercise }
        renderItem={ renderItem }
        activationDistance={ 10 }
      />
    </GestureHandlerRootView>
  );
};

export default SeriesItemList;