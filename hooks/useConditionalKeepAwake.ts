import * as KeepAwake from "expo-keep-awake";
import { useEffect } from "react";

export const useConditionalKeepAwake = ( enabled: boolean ) => {
  useEffect( () => {
    if ( !enabled ) return;

    KeepAwake.activateKeepAwakeAsync();

    return () => {
      KeepAwake.deactivateKeepAwake();
    };
  }, [ enabled ] );
};