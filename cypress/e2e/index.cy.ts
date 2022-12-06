import Database from '../../database';

beforeEach(() => {
  cy.fixture('user.json').then((userFixture) => {
    cy.request('POST', '/api/user', userFixture);
  });
});

describe('Integrations', () => {
  it("displays user's integration and its options", () => {
    const user = Database.getUser();

    cy.visit('http://localhost:3000/');

    user.integrations.forEach((integration) => {
      cy.contains(integration.name);

      Object.keys(integration.options).forEach((option: string) => {
        cy.get(`[id="${integration.name + option}"]`).should('have.value', '');
      });
    });
  });

  it('connects an integration option and disables inputs', () => {
    const user = Database.getUser();

    const integration = user.integrations[0];

    Object.keys(integration.options).forEach((option: string) => {
      cy.get(`[id="${integration.name + option}"]`).type('testinput');
    });

    cy.get('button[type="submit"]').eq(0).click();

    // Inputs are disabled
    Object.keys(integration.options).forEach((option: string) => {
      cy.get(`[id="${integration.name + option}"]`).should('be.disabled');
    });

    cy.get('button[type="submit"]').eq(0).contains('Disconnect Intergration');
  });

  it('disconnects an integration option and clears inputs', () => {
    const connectedIntergration = {
      name: 'Salesforce',
      options: {
        client_id: 'testintegration',
        client_secret: 'testintegration'
      },
      connected: false
    };

    cy.request(
      'PUT',
      `/api/integrations/${connectedIntergration.name}`,
      JSON.stringify(connectedIntergration)
    );

    cy.get('button[type="submit"]').eq(0).click();

    //   user.integrations.forEach((integration) => {
    //     cy.contains(integration.name);

    //     Object.keys(integration.options).forEach((option: string) => {
    //       cy.get(`[id="${integration.name + option}"]`).should('have.value', '');
    //     });
    //   });
  });
});
