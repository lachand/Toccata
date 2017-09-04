export enum Fonction {
  Enseignant,
  Eleve
}

export interface User {
    _id: string;
    name: string;
    avatar: string;
    fonction: Fonction;
}
