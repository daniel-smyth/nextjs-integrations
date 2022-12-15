import { Integration } from '../models/Integration';

export default class IntegrationDatabase {
  static integrations: Integration[] = [
    {
      name: 'Salesforce',
      options: {
        client_id: {
          value: '',
          validators: ['[\\w\\d]+']
        },
        client_secret: {
          value: '',
          validators: ['']
        }
      },
      connected: false
    },
    {
      name: 'Zapier',
      options: {
        api_key: {
          value: '',
          validators: ['']
        }
      },
      connected: false
    },
    {
      name: 'HubSpot',
      options: {
        tenant_domain: {
          value: '',
          validators: ['']
        },
        client_id: {
          value: '',
          validators: ['']
        },
        client_secret: {
          value: '',
          validators: ['']
        }
      },
      field_mappings: {},
      connected: false
    }
  ];

  public static insert(integration: Integration) {
    const exists = this.integrations.find((i) => i.name === integration.name);

    if (exists) {
      return undefined;
    }

    this.integrations.push(integration);

    return integration;
  }

  public static getAll() {
    return this.integrations;
  }
}
