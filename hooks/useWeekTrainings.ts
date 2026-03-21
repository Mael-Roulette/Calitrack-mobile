import { getTrainingsByWeek } from "@/lib/training.appwrite";
import { Training } from "@/types";
import { useEffect, useState } from "react";

export default function useWeekTrainings ( weekId: string ) {
  const [ trainings, setTrainings ] = useState<Training[]>( [] );
  const [ isLoading, setIsLoading ] = useState( false );
  const [ error, setError ] = useState<string | null>( null );

  const fetchTrainings = async () => {
    setIsLoading( true );
    setError( null );
    try {
      const data = await getTrainingsByWeek( weekId );
      setTrainings( data as unknown as Training[] );
    } catch ( e ) {
      setError( e instanceof Error ? e.message : "Erreur inconnue" );
    } finally {
      setIsLoading( false );
    }
  };

  useEffect( () => {
    if ( weekId ) fetchTrainings();
  }, [ weekId ] );

  return { trainings, isLoading, error, refetch: fetchTrainings };
}