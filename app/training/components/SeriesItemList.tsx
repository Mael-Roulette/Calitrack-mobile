import { CreateSeriesParams } from '@/types/series';
import React from 'react';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SeriesItemEdit from './SeriesItemEdit';

interface SeriesItemListProps {
  seriesList: Omit<CreateSeriesParams, 'training' | 'order'>[];
  onSeriesListChange: ( newList: Omit<CreateSeriesParams, 'training' | 'order'>[] ) => void;
}

const SeriesItemList = ( { seriesList, onSeriesListChange }: SeriesItemListProps ) => {
  const handleDeleteSeries = ( exerciseId: string ) => {
    const updatedList = seriesList.filter( ( series ) => series.exercise !== exerciseId );
    onSeriesListChange( updatedList );
  };

  const renderItem = ( { item, drag, isActive }: RenderItemParams<Omit<CreateSeriesParams, 'training' | 'order'>> ) => {
    return (
      <ScaleDecorator activeScale={ 1.05 }>
        <SeriesItemEdit
          seriesData={ item }
          onDelete={ () => handleDeleteSeries( item.exercise ) }
          onDrag={ drag }
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