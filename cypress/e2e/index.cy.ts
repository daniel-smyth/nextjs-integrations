import Database from '../../database';

describe('Integrations', () => {
  const user = Database.getUser();
  const integrations = Database.getAllIntegrations();

  // Get integration with mappings for full coverage
  const integration = integrations.find((i) => i.field_mappings);
  const integrationOptions = Object.keys(integration.options);
  const integrationFieldMaps = Object.keys(user.contacts[0]);

  it('displays all integrations and their options', () => {
    cy.visit('http://localhost:3000/');

    // Integration option inputs
    integrationOptions.forEach((o) => {
      cy.get(`[id="${integration.name}-${o}"]`).should('have.value', '');
    });

    // Integration field mappings inputs
    if (integration.field_mappings) {
      integrationFieldMaps.forEach((map) => {
        cy.get(`[id="${integration.name}-${map}"]`).should('have.value', '');
      });
    }
  });

  it('connects an integration and then disable its inputs', () => {
    // Populate integration options
    integrationOptions.forEach((o) => {
      cy.get(`[id="${integration.name}-${o}"]`).type(`${o}-testinput`);
    });

    // Populate integration field mappings
    if (integration.field_mappings) {
      integrationFieldMaps.forEach((map) => {
        cy.get(`[id="${integration.name}-${map}"]`).type(`${map}-testinput`);
      });
    }

    cy.get('button').contains(`Connect ${integration.name}`).click();

    // Inputs are disabled
    integrationOptions.forEach((o) => {
      cy.get(`[id="${integration.name}-${o}"]`).should('be.disabled');
    });
    integrationFieldMaps.forEach((map) => {
      cy.get(`[id="${integration.name}-${map}"]`).should('be.disabled');
    });
  });

  it('disconnects an integration option and clears its inputs', () => {
    cy.get('button').contains(`Disconnect ${integration.name}`).click();

    // Integration options should be empty after disconnect
    integrationOptions.forEach((o) => {
      cy.get(`[id="${integration.name}-${o}"]`).should('have.value', '');
    });

    // Field mappings should be empty after disconnect
    if (integration.field_mappings) {
      integrationFieldMaps.forEach((map) => {
        cy.get(`[id="${integration.name}-${map}"]`).should('have.value', '');
      });
    }
  });

  it('tries connect an integration with duplicate mappings', () => {
    // Populate integration options with duplicates
    integrationOptions.forEach((o) => {
      cy.get(`[id="${integration.name}-${o}"]`).type('testinput');
    });

    // Populate field mappings with duplicates
    if (integration.field_mappings) {
      integrationFieldMaps.forEach((map) => {
        cy.get(`[id="${integration.name}-${map}"]`).type('samevalue');
      });
    }

    cy.get('button').contains(`Connect ${integration.name}`).click();
    // Should not connnect - button should not say "Disconnect Integration"
    cy.get('button').contains(`Connect ${integration.name}`);
  });

  it('creates a new integration', () => {
    const name = 'MyNewIntegration';

    cy.get(`[id="new-integration-name"]`).type(name);

    cy.get(`button`).contains('Add Field').click();

    cy.get(`[id="integration-options-0"]`).type('api_key');

    cy.get(`[id="new-integration-mappings"]`).click();

    cy.get('button').contains(`Create Integration`).click();

    cy.visit('http://localhost:3000/');

    cy.contains(name);
  });
});
