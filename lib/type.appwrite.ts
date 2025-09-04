import { Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";

/**
 * Permet de récupérer tous les types disponibles
 * @returns {Promise<Document[]>} - Liste des types disponibles
 * @throws {Error} - Si les types n'ont pas pu être récupérés
 */
export const getAllTypes = async () => {
  try {
    const types = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.typeCollectionId
    );

    return types.documents;
  } catch (e) {
    throw new Error(e as string);
  }
};

/**
 * Permet de récupérer un type par son ID
 * @param id - id du type à récupérer
 * @returns {Promise<Document>} - Type correspondant à l'id
 * @throws {Error} - Si le type n'a pas pu être récupéré
 */
export const getTypeById = async (id: string) => {
  try {
    const type = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.typeCollectionId,
      id
    );

    return type;
  } catch (e) {
    throw new Error(e as string);
  }
};

/**
 * Permet de récupérer l'ID d'un type par son nom
 * @param typeName - nom du type à récupérer
 *  * @returns {Promise<Document>} - Type correspondant au nom
 * @throws {Error} - Si le type n'a pas pu être récupéré
 */
export const getTypeIdByName = async (typeName: "push" | "pull") => {
  const typeDocs = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.typeCollectionId,
    [Query.equal("name", typeName)]
  );
  if (typeDocs.total === 0) throw new Error(`Type "${typeName}" introuvable`);
  return typeDocs.documents[0].$id;
};