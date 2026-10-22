export const validators = {
  username: ( name: string ): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 50;
  },

  email: ( email: string ): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test( email );
  },

  password: ( password: string ): { valid: boolean; error?: string } => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{10,}$/;

    if ( !passwordRegex.test( password ) ) {
      return { valid: false, error: "Le mot de passe doit contenir au moins 10 caractères dont une minuscule, une majuscule et un chiffre." };
    }

    return { valid: true };
  },

  exerciseName: ( name: string ): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 50;
  },
};