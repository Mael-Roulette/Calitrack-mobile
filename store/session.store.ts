import { getUserSessions } from "@/lib/session.appwrite";
import { Session } from "@/types/session";
import { create } from "zustand";
import { useAuthStore } from ".";

interface SessionStoreProps {
  sessions: Session[];
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;
  setIsLoading: ( isLoading: boolean ) => void;
  setError: ( error: string | null ) => void;
  fetchUserSessions: () => Promise<void>;
  refreshSessions: () => Promise<void>;
  addSessionStore: ( session: Session ) => void;
  deleteSessionStore: ( sessionId: string ) => void;
  getSessionsByTraining: ( trainingId: string ) => Session[];
  getSessionById: ( sessionId: string ) => Session | undefined;
}

const useSessionsStore = create<SessionStoreProps>( ( set, get ) => ( {
  sessions: [],
  isLoading: false,
  hasFetched: false,
  error: null,

  setIsLoading: ( isLoading ) => set( { isLoading } ),
  setError: ( error ) => set( { error } ),

  fetchUserSessions: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    const { isLoading, hasFetched } = get();

    if ( !isAuthenticated ) {
      set( { error: "Utilisateur non authentifié" } );
      return;
    }

    if ( isLoading || hasFetched ) return;

    set( { isLoading: true, error: null } );

    try {
      const sessions = await getUserSessions();
      set( { sessions: sessions ?? [], hasFetched: true, error: null } );
    } catch ( error ) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération des sessions";
      console.error( "Erreur fetchUserSessions:", error );
      set( { sessions: [], hasFetched: false, error: errorMessage } );
    } finally {
      set( { isLoading: false } );
    }
  },

  // Force un nouveau fetch en réinitialisant hasFetched
  refreshSessions: async () => {
    set( { hasFetched: false } );
    await get().fetchUserSessions();
  },

  addSessionStore: ( session ) => {
    set( ( state ) => ( {
      sessions: [ session, ...state.sessions ],
    } ) );
  },

  deleteSessionStore: ( sessionId ) => {
    set( ( state ) => ( {
      sessions: state.sessions.filter( ( s ) => s.$id !== sessionId ),
    } ) );
  },

  getSessionsByTraining: ( trainingId ) => {
    return get().sessions.filter( ( s ) => {
      const id = typeof s.training === "string" ? s.training : s.training?.$id;
      return id === trainingId;
    } );
  },

  getSessionById: ( sessionId ) => {
    return get().sessions.find( ( s ) => s.$id === sessionId );
  },
} ) );

export default useSessionsStore;