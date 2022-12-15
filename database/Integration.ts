import { Integration } from '../models/Integration';

export default class IntegrationDatabase {
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
