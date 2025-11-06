import { SeriesParams } from "@/types/series"
import { create } from "zustand";

type SeriesState = {
  series: SeriesParams[];
  isLoadingSeries: boolean;

  setSeries: ( series: SeriesParams[] ) => void;
  setIsLoadingSeries: ( value: boolean ) => void;
  addSeriesStore: ( series: SeriesParams ) => void;
  updateSeriesStore: (
    seriesId: string,
    updatedSeries: Partial<SeriesParams>
  ) => void;
  deleteSeriesStore: ( seriesId: string ) => void;
};

const useSeriesStore = create<SeriesState>( ( set ) => ( {
  series: [],
  isLoadingSeries: false,

  setSeries: ( series ) => set( { series } ),
  setIsLoadingSeries: ( value ) => set( { isLoadingSeries: value } ),

  addSeriesStore: ( series ) => {
    set( ( state ) => ( { series: [ ...state.series, series ] } ) );
  },

  updateSeriesStore: ( seriesId, updatedSeries ) => {
    set( ( state ) => ( {
      series: state.series.map( ( series ) =>
        series.$id === seriesId
          ? { ...series, ...updatedSeries }
          : series
      ),
    } ) );
  },

  deleteSeriesStore: ( seriesId ) => {
    set( ( state ) => ( {
      series: state.series.filter( ( series ) => series.$id !== seriesId )
    } ) );
  },
} ) );

export default useSeriesStore;