import React from 'react';
import { Card, Heading } from '@8base/boost';

import { ClientsTable } from './ClientsTable';
import { ClientCreateDialog } from './ClientCreateDialog';
import { ClientDeleteDialog } from './ClientDeleteDialog';
import { ClientUpdateDialog } from './ClientUpdateDialog';

const Clients = () => (
  <Card padding="md" stretch>
    <Card.Header>
      <Heading type="h4" text="Clients" />
    </Card.Header>

    <ClientCreateDialog />
    <ClientDeleteDialog />
    <ClientUpdateDialog />

    <Card.Body padding="none" stretch scrollable>
      <ClientsTable />
    </Card.Body>
  </Card>
)

export { Clients };