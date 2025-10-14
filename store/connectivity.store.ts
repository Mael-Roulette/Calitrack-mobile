import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';

type ConnectivityState = {
  // État de la connectivité
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;

  // État de synchronisation
  isSyncing: boolean;
  lastSyncAttempt: Date | null;
  lastSuccessfulSync: Date | null;
  syncError: string | null;

  // Actions
  setConnected: (connected: boolean) => void;
  setInternetReachable: (reachable: boolean | null) => void;
  setConnectionType: (type: string | null) => void;
  setSyncing: (syncing: boolean) => void;
  setSyncError: (error: string | null) => void;
  updateLastSyncAttempt: () => void;
  updateLastSuccessfulSync: () => void;

  // Méthodes utilitaires
  initialize: () => void;
  cleanup: () => void;
  canMakeNetworkRequest: () => boolean;
};

let unsubscribe: (() => void) | null = null;

const useConnectivityStore = create<ConnectivityState>((set, get) => ({
  // État initial
  isConnected: true, // Connecté par defaut
  isInternetReachable: null,
  connectionType: null,
  isSyncing: false,
  lastSyncAttempt: null,
  lastSuccessfulSync: null,
  syncError: null,

  // Setters
  setConnected: (connected) => set({ isConnected: connected }),
  setInternetReachable: (reachable) => set({ isInternetReachable: reachable }),
  setConnectionType: (type) => set({ connectionType: type }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  setSyncError: (error) => set({ syncError: error }),
  updateLastSyncAttempt: () => set({ lastSyncAttempt: new Date() }),
  updateLastSuccessfulSync: () => set({
    lastSuccessfulSync: new Date(),
    syncError: null
  }),

  // Initialiser l'écoute de la connectivité
  initialize: () => {
    // Récupérer l'état initial
    NetInfo.fetch().then(state => {
      set({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
      });
    });

    // S'abonner aux changements
    unsubscribe = NetInfo.addEventListener(state => {
      const previouslyConnected = get().isConnected;
      const nowConnected = state.isConnected ?? false;

      set({
        isConnected: nowConnected,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
      });

      // Si on vient de se reconnecter, on peut déclencher une sync
      // (Cette logique sera dans le sync.store.ts, on notifie juste ici)
      if (!previouslyConnected && nowConnected) {
        console.log('Connexion rétablie - synchronisation possible');
        // Vous pouvez émettre un événement ou appeler directement le sync store
      }

      // Si on vient de se déconnecter
      if (previouslyConnected && !nowConnected) {
        console.log('Connexion perdue - mode hors ligne activé');
      }
    });
  },

  // Nettoyer l'abonnement
  cleanup: () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  },

  // Vérifier si on peut faire des requêtes réseau
  canMakeNetworkRequest: () => {
    const state = get();
    return state.isConnected && state.isInternetReachable !== false;
  },
}));

export default useConnectivityStore;