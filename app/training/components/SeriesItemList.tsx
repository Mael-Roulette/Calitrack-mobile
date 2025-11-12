import React from 'react';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import SeriesItemEdit from './SeriesItemEdit';
import { MixSeriesType } from './TrainingForm';

interface SeriesItemListProps {
  seriesList: MixSeriesType[];
  onSeriesListChange: ( newList: MixSeriesType[] ) => void;
  onEditSeries: ( index: number ) => void;
  scrollViewRef: React.RefObject<any>;
}

const SeriesItemList = ( { seriesList, onSeriesListChange, onEditSeries, scrollViewRef }: SeriesItemListProps ) => {
  const handleDeleteSeries = ( index: number ) => {
    const updatedList = seriesList.filter( ( _, i ) => i !== index );
    onSeriesListChange( updatedList );
  };

  const renderItem = ( { item, drag, isActive, getIndex }: RenderItemParams<MixSeriesType> ) => {
    const index = getIndex();
    return (
      <ScaleDecorator activeScale={ 1.05 }>
        <SeriesItemEdit
          seriesData={ item }
          onDelete={ () => handleDeleteSeries( index ?? 0 ) }
          onDrag={ drag }
          onEdit={ () => onEditSeries( index ?? 0 ) }
          isActive={ isActive }
        />
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={ seriesList }
      onDragEnd={ ( { data } ) => onSeriesListChange( data ) }
      keyExtractor={ ( item, index ) => {
        // Utiliser un identifiant stable plutôt que l'index
        const exerciseId = typeof item.exercise === 'string' ? item.exercise : item.exercise?.$id;
        return `series-${exerciseId}`;
      } }
      renderItem={ renderItem }
      activationDistance={ 10 }
      scrollEnabled={ false }
      simultaneousHandlers={ scrollViewRef }
      // IMPORTANT: Ces props empêchent le rechargement complet
      removeClippedSubviews={ false }
      windowSize={ 21 }
      maxToRenderPerBatch={ 10 }
      updateCellsBatchingPeriod={ 50 }
      initialNumToRender={ 10 }
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
    />
  );
};

export default SeriesItemList;