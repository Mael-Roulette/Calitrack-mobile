import { CreateSeriesParams, SeriesParams } from "@/types/series";
import { ID } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";
import { getCurrentUser } from "./user.appwrite";

/**
 * Permet de créer une série dans un entrainement
 * @param seriesData Les données de la série
 * @returns un objet avec la série et le message
 * @throws {Error} - Si la série n'a pas été créée
 */
export const createSeries = async ( seriesData: CreateSeriesParams ) => {
  try {
    const currentUser = getCurrentUser();
    if ( !currentUser ) throw Error;

    const series = await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.seriesCollectionId,
      rowId: ID.unique(),
      data: seriesData,
    });

    const message = {
      title: "Nouvelle série créée",
      body: `Votre série a été créée avec succès.`,
    };

    return { series, message };
  } catch ( e ) {
    throw new Error( e as string );
  }
}

/**
 * Permet de mettre à jour une série
 * @param seriesData Donnée à mettre à jour
 * @returns la série mise à jour
 */
export const updateSeries = async ( seriesData: Partial<SeriesParams> ) => {
  try {
    const currentUser = getCurrentUser();
    if ( !currentUser ) throw Error;

    if ( seriesData.$id ) {
      const seriesId = seriesData.$id;

      const series = await tablesDB.updateRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.seriesCollectionId,
        rowId: seriesId,
        data: seriesData
      });

      return series;
    } else {
      throw Error( "L'id n'est pas défini" )
    }
  } catch ( e ) {
    throw new Error( e as string );
  }
}

/**
 * Permet de supprimer une série
 * @param id Id de la série à supprimer
 */
export const deleteSeries = async ( id: string ) => {
  try {
    await tablesDB.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.seriesCollectionId,
      rowId: id
    });
  } catch ( e ) {
    throw new Error( e as string );
  }
}

/**
 * Permet de récupérer une série via son id
 * @param id Id de la série à récupérer
 */
export const getSeriesById = async ( id: string ) => {
  try {
    await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.seriesCollectionId,
      rowId: id
    });
  } catch (e) {
    throw new Error( e as string );
  }
}