import { Contact } from '../models/Contact';
import { Integration } from '../models/Integration';
import { User } from '../models/User';

export default class Database {
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
        id: '1235',
        given_name: 'Terry',
        family_name: 'Walker',
        email: 'terry@waffles.co',
        met_at_location: 'Melbourne, Australia',
        notes: 'Terry has a beard.'
      }
    ],
    integrations: []
  };

  static integrations: Integration[] = [
    {
      name: 'Salesforce',
      options: {
        client_id: '',
        client_secret: ''
      },
      connected: false
    },
    {
      name: 'Zapier',
      options: {
        api_key: ''
      },
      connected: false
    },
    {
      name: 'HubSpot',
      options: {
        tenant_domain: '',
        client_id: '',
        client_secret: ''
      },
      field_mappings: {},
      connected: false
    }
  ];

  public static getUser(): User {
    return this.user;
  }

  public static setUser(user: User) {
    this.user = user;
    return user;
  }

  public static getContacts(): Contact[] {
    return this.user.contacts;
  }

  public static getIntegration(id: string) {
    return this.user.integrations.find((i) => i.name === id);
  }

  public static connectIntegration(integration: Integration) {
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

  public static disconnectIntegration(id: string) {
    const integration = this.user.integrations.find((i) => i.name === id);

    if (!integration) {
      return undefined;
    }

    const index = this.user.integrations.indexOf(integration);
    this.user.integrations.splice(index, 1);

    return true;
  }

  public static createIntegration(integration: Integration) {
    const exists = this.integrations.find((i) => i.name === integration.name);

    if (exists) {
      return false;
    }

    this.integrations.push(integration);

    return integration;
  }

  public static getAllIntegrations() {
    console.log(this.integrations);
    return this.integrations;
  }
}
