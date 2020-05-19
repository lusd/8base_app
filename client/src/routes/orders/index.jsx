import React from 'react';
import {Card, Heading} from "@8base/boost";

import { OrdersTable } from './OrdersTable';
import { OrderCreateDialog } from './OrderCreateDialog';
import { OrderDeleteDialog } from './OrderDeleteDialog';
import { OrderUpdateDialog } from './OrderUpdateDialog';


const Orders = () => (
  <Card padding="md" stretch>
    <Card.Header>
      <Heading type="h4" text="Orders" />
    </Card.Header>

    <OrderCreateDialog />
    <OrderDeleteDialog />
    <OrderUpdateDialog />

    <Card.Body padding="none" stretch scrollable>
      <OrdersTable />
    </Card.Body>
  </Card>
)

export { Orders };