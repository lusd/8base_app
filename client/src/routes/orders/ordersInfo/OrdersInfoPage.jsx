import React from 'react';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import { Card, Loader } from '@8base/boost';
import { Query, withApollo } from 'react-apollo';
import moment from 'moment';

import * as sharedGraphQL from 'shared/graphql';
import { getDateTime, getTotalOrderCost } from 'shared/components';
import { OrderItemsElements } from './OrderItemsElements';

let OrderInfo = (props) => {
  const OrderId = R.pathOr(null, ['computedMatch', 'params', 'index'], props);

  if (!OrderId) {
    return <>'Sorry, no data available, please <Link to="/Orders">Go back</Link>.'</>;
  }

  const renderContent = ({ data, loading }) => {
    if (loading) {
      return <Loader stretch/>;
    }
    const { order } = data;
    if (!order) return <>'Sorry, no data available, please <Link to="/Orders">Go back</Link>.'</>;

    const {
      address,
      comment,
      createdAt,
      createdBy,
      updatedAt,
      deliveryDt,
      status,
      client,
      orderItems,
    } = order;
    
    return (
      <Card stretch>
        <Card.Header>
          Order Info
        </Card.Header>
        <Card.Body scrollable="false" paddingOuter={'10px 0'}>
          <Card.Section>
            Address: {address}
          </Card.Section>
          <Card.Section>
            Comment: {comment}
          </Card.Section>
          <Card.Section>
            <b>Status: </b> {status}
          </Card.Section>
          <Card.Section>
            <b>Client: </b> {client ? <Link to={`/clients/info/${client.id}`}>{client.firstName} {client.lastName}</Link> : ''}
          </Card.Section>
          <Card.Section>
            Delivery Date: {getDateTime(deliveryDt)}
          </Card.Section>
          <Card.Section>
            <b>Order items:</b> <OrderItemsElements orderItems={orderItems}/>
          </Card.Section>
          <Card.Section>
            Total Cost: {getTotalOrderCost(orderItems.items)}
          </Card.Section>
          <Card.Section>
            Created at: {getDateTime(createdAt)}
          </Card.Section>
          <Card.Section>
            <b>Created by: </b> {createdBy ? `${createdBy.firstName} ${createdBy.lastName}` : ''}
          </Card.Section>
          <Card.Section>
            <b>Updated: </b> {moment(updatedAt).fromNow()}
          </Card.Section>
        </Card.Body>
        <Card.Footer>
          <Link to="/Orders">Go back</Link>
        </Card.Footer>
      </Card>
    )
  }
  return (
    <Query query={sharedGraphQL.ORDER_INFO} fetchPolicy={'network-only'}  variables={{id: OrderId}}>
      {renderContent}
    </Query>
  )
}

OrderInfo = withApollo(OrderInfo);

export { OrderInfo };