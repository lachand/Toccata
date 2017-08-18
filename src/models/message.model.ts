import { User } from './user.model';

export interface Message {
    _id: string;
    author: User;
    text: string;
    date: string;
}
