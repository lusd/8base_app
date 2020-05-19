import React from 'react';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import { Card, Loader } from '@8base/boost';
import { Query, withApollo } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import moment from "moment";

let ClientInfo = (props) => {
  const clientId = R.pathOr(null, ['computedMatch', 'params', 'index'], props);

  if (!clientId) {
    return <>'Sorry, no data available, please <Link to="/clients">Go back</Link>.'</>;
  }

  const renderContent = ({ data, loading }) => {
    if (loading) {
      return <Loader stretch/>;
    }
    const { client } = data;
    const {
      firstName,
      lastName,
      email,
      phone,
      birthday,
      orders,
      createdAt,
      createdBy,
      updatedAt
    } = client;
    return (
      <Card stretch>
        <Card.Header>
          Client Info
        </Card.Header>
        <Card.Body scrollable="false" paddingOuter={'10px 0'}>
          <Card.Section>
            <b>Client Name: </b> {firstName} {lastName}
          </Card.Section>
          <Card.Section>
            <b>Client Phone: </b> {phone}
          </Card.Section>
          <Card.Section>
            <b>Client Email: </b> {email}
          </Card.Section>
          <Card.Section>
            <b>Client birthday: </b> {birthday}
          </Card.Section>
          <Card.Section>
            <b>Created at: </b> {moment(createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Card.Section>
          <Card.Section>
            <b>Created by: </b> {createdBy.firstName} {createdBy.lastName}
          </Card.Section>
          <Card.Section>
            <b>Updated: </b> {moment(updatedAt).fromNow()}
          </Card.Section>
          <Card.Section>
            <b>Client Orders:</b> {
              orders.items.length > 0
                ? orders.items.map(order => <Link to={`/orders/info/${order.id}`} key={order.id}><br/> {order.address}</Link>)
                : 'No orders'
            }
          </Card.Section>
        </Card.Body>
        <Card.Footer>
          <Link to="/clients">Go back</Link>
        </Card.Footer>
      </Card>
    )
  }
  return (
    <Query query={sharedGraphQL.ClIENT_INFO} fetchPolicy={'network-only'} variables={{id: clientId}}>
      {renderContent}
    </Query>
  )
}

ClientInfo = withApollo(ClientInfo);

export { ClientInfo };