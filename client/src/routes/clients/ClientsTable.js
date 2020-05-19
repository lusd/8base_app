import React, { useState } from 'react';
import * as R from 'ramda';
import {Table, Dropdown, Icon, Menu, withModal, Pagination} from '@8base/boost';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import * as sharedGraphQL from 'shared/graphql';
import { ClientCreateDialog } from './ClientCreateDialog';
import { ClientDeleteDialog } from './ClientDeleteDialog';
import { ClientUpdateDialog } from './ClientUpdateDialog';


let ClientsTable = ({ openModal }) => {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  let skipAmount = page * pageSize - pageSize;

  return (
    <Query query={sharedGraphQL.CLIENTS_LIST_QUERY} variables={{first: pageSize, skip: skipAmount}}>
      {
        ({ data, loading }) => (
          <Table>
            <Table.Header columns="repeat(4, 1fr) 60px">
              <Table.HeaderCell>Client name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Birthday</Table.HeaderCell>
              <Table.HeaderCell/>
            </Table.Header>
            <Table.Body
              loading={ loading }
              data={R.pathOr([], ['clientsList', 'items'], data)}
              action="Create Client"
              onActionClick={() => openModal(ClientCreateDialog.id)}
            >
              {
                (client) => (
                  <Table.BodyRow columns="repeat(4, 1fr) 60px" key={client.id}>
                    <Table.BodyCell>
                      {R.pathOr('Untitled', ['firstName'], client)} {R.pathOr('Untitled', ['lastName'], client)}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      {R.pathOr('Untitled', ['email'], client)}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      {R.pathOr('Untitled', ['phone'], client)}
                    </Table.BodyCell>
                    <Table.BodyCell>
                      {R.pathOr('Untitled', ['birthday'], client)}
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
                                <Link to={`clients/info/${client.id}`}> <Menu.Item>View Info</Menu.Item></Link>
                                <Menu.Item onClick={() => {
                                  openModal(ClientUpdateDialog.id, {initialValues: client});
                                  closeDropdown();
                                }}>Update</Menu.Item>
                                <Menu.Item onClick={() => {
                                  openModal(ClientDeleteDialog.id, {id: client.id});
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
                total={R.pathOr(0, ['clientsList', 'count'], data)}
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

ClientsTable = withModal(ClientsTable)

export { ClientsTable };