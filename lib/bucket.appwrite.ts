import { appwriteConfig, storage } from "@/lib/appwrite";
import { User } from "@/types";
import { ImagePickerAsset } from "expo-image-picker";
import { ID, Permission, Role } from "react-native-appwrite";

interface createFileProps {
  image: ImagePickerAsset,
  user: User
}

/**
 * Permet d'ajouter une image au bucket
 * @param - La fonction attend l'image au complet et l'utilisateur
 * @returns - La fonction retourne la response et l'url de visualisation de l'image
 */
export const createFile = async ( { image, user }: createFileProps ) => {
  try {
    const response = await storage.createFile( {
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: {
        name: image.fileName ?? `upload-${Date.now()}.jpg`,
        type: image.mimeType ?? "image/jpeg",
        size: image.fileSize ?? 0,
        uri: image.uri,
      },
      permissions: [
        Permission.read( Role.user( user.accountId ) ),
        Permission.read( Role.any() ),
        Permission.update( Role.user( user.accountId ) ),
        Permission.delete( Role.user( user.accountId ) ),
      ],
    } );

    const fileUrl = `${ appwriteConfig.endpoint }/storage/buckets/${ appwriteConfig.bucketId }/files/${ response.$id }/view?project=${ appwriteConfig.projectId }`;

    return { ...response, fileUrl };
  } catch ( error ) {
    console.log( error );
    throw error;
  }
};

/**
 * Permet de supprimer un fichier du bucket
 * @param fileId - ID du fichier à supprimer
 */
export const deleteFile = async ( fileId: string ) => {
  try {
    await storage.deleteFile( {
      bucketId: appwriteConfig.bucketId,
      fileId,
    } );
  } catch ( error ) {
    console.log( "Échec suppression ancien fichier:", error );
  }
};

/**
 * Permet de récupérer un fichier depuis son url
 * @param url - URL du fichier à récupérer
 */
export const getFileIdFromUrl = ( url: string ): string | null => {
  const match = url.match( /\/files\/([^/]+)\/(?:view|preview)/ );
  return match ? match[ 1 ] : null;
};