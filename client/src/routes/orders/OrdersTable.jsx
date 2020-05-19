import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Query } from 'react-apollo';
import * as R from 'ramda';
import {Table, Dropdown, Icon, Menu, withModal, Pagination} from '@8base/boost';

import * as sharedGraphQL from 'shared/graphql';
import { OrderCreateDialog } from './OrderCreateDialog';
import { OrderDeleteDialog } from './OrderDeleteDialog';
import { OrderUpdateDialog } from './OrderUpdateDialog';
import { getTotalOrderCost, getDateTime } from 'shared/components';

let OrdersTable = ({ openModal }) => {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  return (
    <Query query={sharedGraphQL.ORDERS_LIST_QUERY} variables={{first: pageSize, skip: page * pageSize - pageSize}}>
      {
        ({ data, loading }) => (
          <Table>
            <Table.Header columns="repeat(7, 1fr) 60px">
              <Table.HeaderCell>Client Full Name</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Order Items</Table.HeaderCell>
              <Table.HeaderCell>Total Price</Table.HeaderCell>
              <Table.HeaderCell>Delivery Date</Table.HeaderCell>
              <Table.HeaderCell>Comment</Table.HeaderCell>
              <Table.HeaderCell/>
            </Table.Header>
            <Table.Body
              loading={ loading }
              data={R.pathOr([], ['ordersList', 'items'], data)}
              action="Create Order"
              onActionClick={() => openModal(OrderCreateDialog.id)}
            >
              {
                (order) => (
                  <Table.BodyRow columns="repeat(7, 1fr) 60px" key={order.id}>
                    <Table.BodyCell>
                      {R.pathOr('', ['client', 'firstName'], order)} {R.pathOr('', ['client', 'lastName'], order)}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      {R.pathOr('', ['address'], order)}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      {R.pathOr('', ['status'], order)}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      <div>
                        {R.pathOr('', ['orderItems', 'items'], order).length}
                      </div>
                    </Table.BodyCell>
                    <Table.BodyCell>
                      { getTotalOrderCost(R.pathOr([], ['orderItems', 'items'], order)) }
                    </Table.BodyCell>
                    <Table.BodyCell>
                      { getDateTime(R.pathOr(null, ['deliveryDt'], order)) }
                    </Table.BodyCell>
                    <Table.BodyCell>
                      {R.pathOr('', ['comment'], order)}
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
                                <Link to={`orders/info/${order.id}`}> <Menu.Item>View Info</Menu.Item></Link>
                                <Menu.Item onClick={() => {
                                  openModal(OrderUpdateDialog.id, { initialValues: order });
                                  closeDropdown();
                                }}>Update</Menu.Item>
                                <Menu.Item onClick={() => {
                                  openModal(OrderDeleteDialog.id, {id: order.id});
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
                total={R.pathOr(0, ['ordersList', 'count'], data)}
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

OrdersTable = withModal(OrdersTable)

export { OrdersTable }