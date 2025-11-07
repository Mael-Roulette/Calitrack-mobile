import DraggableFlatList from 'react-native-draggable-flatlist'

const SeriesItemList = ( { seriesList } ) => {
  const handleDeleteSeries = ( index: number ) => {
    setSeriesList( ( prev ) => prev.filter( ( _, i ) => i !== index ) );
  };

  const renderItem = ( { series, drag, isActive }: any ) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={ drag }
          disabled={ isActive }
        >
          <SeriesItemEdit
            key={ series.exercise }
            seriesData={ series }
            onDelete={ () => handleDeleteSeries( series.exercicse ) }
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={ seriesList }
      onDragEnd={ ( { data } ) => setSeriesList( data ) }
      keyExtractor={ ( item ) => item.exercise }
      renderItem={ renderItem }
    />
  )
}

export default SeriesItemList;