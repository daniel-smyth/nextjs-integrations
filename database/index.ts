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
    integrations: [
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
        field_mappings: {
          first_name: 'first_name'
        },
        connected: false
      }
    ]
  };

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
    const integration = this.user.integrations.find((i) => i.name === id);

    return integration;
  }

  public static addIntegration(integration: Integration) {
    const exists = this.user.integrations.find(
      (i) => i.name === integration.name
    );

    if (exists) {
      return false;
    }

    this.user.integrations.push(integration);

    return integration;
  }

  public static editIntegration(id: string, integration: Integration) {
    const existingIntegration = this.user.integrations.find(
      (i) => i.name === id
    );

    if (!existingIntegration) {
      return undefined;
    }

    if (!existingIntegration.connected) {
      // Simulate connect
      integration.connected = true; // eslint-disable-line no-param-reassign
    } else {
      // Simulating disconnect
      integration.connected = false; // eslint-disable-line no-param-reassign

      Object.keys(integration.options).forEach((key) => {
        integration.options[key] = ''; // eslint-disable-line no-param-reassign
      });
    }

    const index = this.user.integrations.indexOf(existingIntegration);
    this.user.integrations[index] = integration;

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

  public static getAllIntegrations() {
    return this.user.integrations;
  }
}
