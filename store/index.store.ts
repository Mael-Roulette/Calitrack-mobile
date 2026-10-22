import type { StateCreator } from "zustand";
import { create as actualCreate } from "zustand";

const storeResetFns = new Set<() => void>();

export const resetAllStores = () => {
  storeResetFns.forEach( ( resetFn ) => resetFn() );
};

export const createGlobal = ( <T>( stateCreator?: StateCreator<T> ) => {
  if ( stateCreator === undefined ) {
    return ( creator: StateCreator<T> ) => {
      const store = actualCreate<T>()( creator );
      storeResetFns.add( () => store.setState( store.getInitialState(), true ) );
      return store;
    };
  }

  const store = actualCreate<T>()( stateCreator );
  storeResetFns.add( () => store.setState( store.getInitialState(), true ) );
  return store;
} ) as typeof actualCreate;