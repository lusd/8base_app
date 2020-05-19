import gql from 'graphql-tag';

export const CLIENTS_LIST_QUERY = gql`
  query ClientsList($first: Int, $skip: Int) {
    clientsList(first: $first, skip: $skip) {
      count
      items {
        id
        firstName
        lastName
        email
        phone
        birthday
        orders {
          items {
            id
            address
          }
        }
      }
    }
  }
`

export const ClIENT_INFO = gql`
  query ClientInfo ($id: ID) {
    client(id: $id) {
      firstName
      lastName
      phone
      email
      birthday
      createdAt
      createdBy {
        firstName
        lastName
      }
      updatedAt
      orders {
        items{
          id
          address
        }
      }
    }
  }
`

export const CLIENT_CREATE_MUTATION = gql`
  mutation ClientCreate ($data: ClientCreateInput!) {
    clientCreate(data: $data) {
      id
    }
  }
`

export const CLIENT_UPDATE_MUTATION = gql`
  mutation ClientUpdate ($data: ClientUpdateInput!){ 
    clientUpdate(data: $data) {
      id
    }
  }
`

export const CLIENT_DELETE_MUTATION = gql`
  mutation ClientDelete ($id: ID!) {
    clientDelete(data: { id: $id }) {
      success
    }
  }
`

export const ORDERS_ITEMS_LIST = gql`
  query OrdersItemsList {
    orderItemsList {
      count
      items {
        id
        quantity
        product {
          id
          name
          price
        }
      }
    }
  }
`;

export const ORDERS_LIST_QUERY = gql`
  query OrdersList($first: Int, $skip: Int) {
    ordersList(first: $first, skip: $skip) {
      count
      items {
        id
        client {
          id
          firstName
          lastName
        }
        address
        status
        deliveryDt
        comment
        orderItems {
          count
          items {
            id
            quantity
            product {
              id
              name
              price
              description
            }
          }
        }
      }
    }
  }
`;

export const ORDER_INFO = gql`
  query OrderInfo($id: ID!) {
    order(id: $id) {
      id
      address
      comment
      createdAt
      createdBy {
        firstName
        lastName
      }
      updatedAt
      deliveryDt
      client {
        id
        firstName
        lastName
      }
      status
      orderItems {
        count
        items {
          id
          quantity
          product {
            id
            name
            price
            picture {
              id
              filename
              downloadUrl
            }
          }
        }
      }
    }
  }
`

export const ORDER_CREATE_MUTATION = gql`
  mutation OrderCreate($data: OrderCreateInput!) {
    orderCreate(data: $data) {
      id
    }
  }
`;

export const ORDER_UPDATE_MUTATION = gql`
  mutation OrderUpdate ($data: OrderUpdateInput!){
    orderUpdate(data: $data) {
      id
    }
  }
`

export const ORDER_DELETE_MUTATION = gql`
  mutation OrderDelete($id: ID!) {
    orderDelete(data: { id: $id }) {
      success
    }
  }
`;

export const PRODUCT_LIST_QUERY = gql`
  query ProductsList($first: Int, $skip: Int) {
    productsList(first: $first, skip: $skip) {
      count
      items {
        id
        name
        description
        price
        picture {
          id
          downloadUrl
          filename
        }
        orderItems {
          items {
            id
            quantity
          }
        }
      }
    }
  }
`;


export const PRODUCT_CREATE_MUTATION = gql`
  mutation ProductCreate ($data: ProductCreateInput!) {
    productCreate (data: $data) {
      id
    }
  }
`

export const PRODUCT_UPDATE_MUTATION = gql`
  mutation ProductUpdate ($data: ProductUpdateInput!) {
    productUpdate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_DELETE_MUTATION = gql`
  mutation ProductDelete ($id: ID) {
    productDelete (data: {id: $id}) {
      success
    }
  }
`;
