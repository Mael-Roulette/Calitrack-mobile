export const validators = {
  email: ( email: string ): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test( email );
  },

  password: ( password: string ): { valid: boolean; error?: string } => {
    if ( password.length < 8 ) {
      return { valid: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
    }
    return { valid: true };
  },

  exerciseName: ( name: string ): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 50;
  },
};