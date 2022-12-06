import { Contact } from './Contact';
import { Integration } from './Integration';

export interface User {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  contacts: Contact[];
  integrations: Integration[];
}
