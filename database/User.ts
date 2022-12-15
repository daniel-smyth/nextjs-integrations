import { Contact } from '../models/Contact';
import { Integration } from '../models/Integration';
import { User } from '../models/User';

export default class UserDatabase {
  static user: User = {
    id: '12345',
    given_name: 'Jane',
    family_name: 'Doe',
    email: 'jane@blinq.me',
    contacts: [
      {
        id: '1234',
        given_name: 'Terry',
        family_name: 'Walker',
        email: 'terry@waffles.co',
        met_at_location: 'Melbourne, Australia',
        notes: 'Terry has a beard.'
      },
      {
        id: '4321',
        given_name: 'John',
        family_name: 'doe',
        email: 'john@pancakes.co',
        met_at_location: 'Melbourne, Australia',
        notes: 'John has a hat.'
      }
    ],
    integrations: []
  };

  public static get(): User {
    return this.user;
  }

  public static set(user: User): User {
    this.user = user;
    return user;
  }

  public static getIntegration(id: string) {
    return this.user.integrations.find((i) => i.name === id);
  }

  public static insertIntegration(integration: Integration) {
    const exists = this.user.integrations.find(
      (i) => i.name === integration.name
    );

    if (exists) {
      return undefined;
    }

    integration.connected = true; // eslint-disable-line no-param-reassign

    this.user.integrations.push(integration);

    return integration;
  }

  public static deleteIntegration(id: string) {
    const integration = this.user.integrations.find((i) => i.name === id);

    if (!integration) {
      return undefined;
    }

    const index = this.user.integrations.indexOf(integration);
    this.user.integrations.splice(index, 1);

    return true;
  }

  public static getContact(id: string) {
    return this.user.contacts.find((i) => i.email === id);
  }

  public static insertContact(contact: Contact) {
    const exists = this.user.contacts.find((i) => i.email === contact.email);

    if (exists) {
      return undefined;
    }

    this.user.contacts.push(contact);

    return contact;
  }

  public static editContact(id: string, contact: Contact) {
    const exists = this.user.contacts.find((i) => i.email === id);

    if (exists) {
      return undefined;
    }

    const index = this.user.contacts.indexOf(contact);
    this.user.contacts[index] = contact;

    return contact;
  }

  public static deleteContact(id: string) {
    const contact = this.user.contacts.find((i) => i.email === id);

    if (!contact) {
      return undefined;
    }

    const index = this.user.contacts.indexOf(contact);
    this.user.contacts.splice(index, 1);

    return true;
  }

  public static getAllContacts() {
    return this.user.contacts;
  }
}
