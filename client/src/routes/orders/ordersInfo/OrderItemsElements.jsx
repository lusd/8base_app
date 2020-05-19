import React from 'react';
import * as R from 'ramda';
import { Card } from '@8base/boost';

import { getAvatar } from 'shared/components/GetAvatar';

export const OrderItemsElements = (props) => {
  const { orderItems = {} } = props;
  if (orderItems.items && orderItems.items.length === 0) return '';
  const { items } = orderItems;
  return items.map((item, index) => {
    const product = R.pathOr({}, ['product'], item);
    const picture = R.pathOr(null, ['picture'], product);
    const { name, price } = product;
    const quantity = R.pathOr(null, ['quantity'], item);
    return <Card.Section key={index}>
      {getAvatar(picture)} <br/>
      <span>Name: {name} </span><br/>
      <span>Price: {price}$</span><br/>
      <span>quantity: {quantity} piece(s)</span><br/>
    </Card.Section>
  })
}