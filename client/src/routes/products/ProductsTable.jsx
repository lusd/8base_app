import React, { useState } from 'react';
import * as R from 'ramda';
import {Table, Dropdown, Icon, Menu, withModal, Pagination} from '@8base/boost';
import { Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import { ProductCreateDialog } from './ProductCreateDialog';
import { ProductUpdateDialog } from "./ProductUpdateDialog";
import { getAvatar } from 'shared/components';

let ProductsTable = ({ openModal }) => {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  return (
    <Query query={sharedGraphQL.PRODUCT_LIST_QUERY} variables={{first: pageSize, skip: page * pageSize - pageSize}}>
      {
        ({ data, loading }) => (
          <Table>
            <Table.Header columns="repeat(5, 1fr) 60px">
              <Table.HeaderCell>Picture</Table.HeaderCell>
              <Table.HeaderCell>Product Name</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Order Items</Table.HeaderCell>
              <Table.HeaderCell/>
            </Table.Header>
            <Table.Body
              loading={loading}
              data={R.pathOr([], ['productsList', 'items'], data)}
              action="Create Product"
              onActionClick={() => openModal(ProductCreateDialog.id)}
            >
              {
                (product) => (
                  <Table.BodyRow columns="repeat(5, 1fr) 60px" key={product.id}>
                    <Table.BodyCell>
                      {getAvatar(R.pathOr(null, ['picture'], product))}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      {R.pathOr('', ['name'], product)}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      {R.pathOr('', ['description'], product)}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      {R.pathOr('', ['price'], product)} $
                    </Table.BodyCell>
                    <Table.BodyCell>
                      <div>
                        {R.pathOr('', ['orderItems', 'items'], product).map(item => (<span key={item.id}>{item.quantity}<br/></span>))}
                      </div>
                    </Table.BodyCell>
                    <Table.BodyCell>
                      <Dropdown defaultOpen={false}>
                        <Dropdown.Head>
                          <Icon name="More" color="LIGHT_GRAY2"/>
                        </Dropdown.Head>
                        <Dropdown.Body pin="right">
                          {
                            ({closeDropdown}) => (
                              <Menu>
                                <Menu.Item onClick={() => {
                                  openModal(ProductUpdateDialog.id, {initialValues: product});
                                  closeDropdown();
                                }}>Update</Menu.Item>
                                <Menu.Item onClick={() => {
                                  openModal(ProductDeleteDialog.id, {id: product.id});
                                  closeDropdown();
                                }}>Delete</Menu.Item>
                              </Menu>
                            )
                          }
                        </Dropdown.Body>
                      </Dropdown>
                    </Table.BodyCell>
                  </Table.BodyRow>
                )
              }
            </Table.Body>
            <Table.Footer>
              <Pagination
                page={page}
                pageSize={pageSize}
                total={R.pathOr(0, ['productsList', 'count'], data)}
                showSizeChanger={true}
                onChange={
                  (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                  }
                }
              />
            </Table.Footer>
          </Table>
        )
      }
    </Query>

  )
}

ProductsTable = withModal(ProductsTable)

export { ProductsTable }