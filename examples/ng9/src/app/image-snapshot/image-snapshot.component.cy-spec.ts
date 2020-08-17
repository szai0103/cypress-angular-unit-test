/// <reference types="cypress" />
import { mount, initEnv, getCypressTestBed } from 'cypress-angular-unit-test';
import { ImageSnapshotComponent } from './image-snapshot.component';

describe('ImageSnapshotComponent', () => {

  beforeEach(() => {
    initEnv(ImageSnapshotComponent);
  });

  it('should create', () => {
    mount(ImageSnapshotComponent);
    cy.matchImageSnapshot('init');
    cy.get('button').click().blur();
    cy.matchImageSnapshot('clicked');
  });
});