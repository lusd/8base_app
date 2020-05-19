import React from 'react';
import {Card, Heading} from "@8base/boost";

import { ProductsTable } from './ProductsTable';
import { ProductDeleteDialog } from './ProductDeleteDialog';
import { ProductCreateDialog } from './ProductCreateDialog';
import { ProductUpdateDialog } from './ProductUpdateDialog';


const Products = () => (
  <Card padding="md" stretch>
    <Card.Header>
      <Heading type="h4" text="Products" />
    </Card.Header>

    <ProductCreateDialog />
    <ProductDeleteDialog />
    <ProductUpdateDialog />

    <Card.Body padding="none" stretch scrollable>
      <ProductsTable />
    </Card.Body>
  </Card>
)


export { Products };