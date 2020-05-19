import React from 'react';
import { Form, Field } from '@8base/forms';
import {
  Dialog,
  Grid,
  Button,
  InputField,
  DateInputField,
  ModalContext,
  SelectField,
  TextAreaField,
} from '@8base/boost';
import { graphql, Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';
import { orderItemsOptions, clientsListOptions } from 'shared/components';

const ORDER_UPDATE_DIALOG_ID = 'ORDER_UPDATE_DIALOG_ID';

class OrderUpdateDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = (id) => async (data) => {
    debugger;
    await this.props.orderUpdate({ variables: { data: { ...data, id } } });
    this.context.closeModal(ORDER_UPDATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(ORDER_UPDATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, submitting, pristine, invalid }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="Update Order" onClose={ this.onClose } />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Query query={sharedGraphQL.CLIENTS_LIST_QUERY}>
              {
                ({ data, loading }) => (
                  <Field
                    name="client"
                    label="Client"
                    placeholder="Select Client"
                    component={ SelectField }
                    stretch
                    loading={ loading }
                    options={ loading ? [] : clientsListOptions(data.clientsList.items)}
                    clearable
                  />
                )
              }
            </Query>
          </Grid.Box>
          <Grid.Box>
            <Field
              name="address"
              label="Address"
              placeholder="Please provide address"
              component={ InputField }
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="deliveryDt"
              label="Delivery Date and Time"
              type="date"
              placeholder="Please provide Delivery Date and Time"
              component={ DateInputField }
              withTime
              clearable
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="comment"
              label="Comment"
              placeholder="Please provide comment"
              type="text"
              component={ TextAreaField }
            />
          </Grid.Box>
          <Grid.Box>
            <Query query={sharedGraphQL.ORDERS_ITEMS_LIST}>
              {
                ({ data, loading}) => (
                  <Field
                    name="orderItems"
                    label="Order Items"
                    placeholder="Please select order items"
                    component={ SelectField }
                    loading={ loading }
                    options={ loading ? [] : orderItemsOptions(data.orderItemsList.items)}
                    multiple
                    stretch={true}
                    clearable
                  />
                )
              }
            </Query>
          </Grid.Box>
          <Grid.Box>
            <Field
              name="status"
              label="Status"
              placeholder="Select a status"
              component={ SelectField }
              options={ [
                { label: 'Opened', value: 'Opened' },
                { label: 'Paid', value: 'Paid' },
                { label: 'ReadyToDelivery', value: 'ReadyToDelivery' },
                { label: 'Delivering', value: 'Delivering' },
                { label: 'Closed', value: 'Closed' },
                { label: 'Canceled', value: 'Canceled' },
              ] }
            />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ this.onClose }>Cancel</Button>
        <Button color="primary" type="submit" disabled={ pristine || invalid } loading={ submitting }>Update Order</Button>
      </Dialog.Footer>
    </form>
  );

  renderForm = ({ args }) => (
    <Form
      type="UPDATE"
      tableSchemaName="Orders"
      onSubmit={ this.onSubmit(args.initialValues.id) }
      initialValues={args.initialValues}
      formatRelationToIds
    >
      {this.renderFormContent}
    </Form>
  )

  render() {
    return (
      <Dialog id={ ORDER_UPDATE_DIALOG_ID } size="sm">
        {this.renderForm}
      </Dialog>
    );
  }
}

OrderUpdateDialog = graphql(sharedGraphQL.ORDER_UPDATE_MUTATION, {
  name: 'orderUpdate',
  options: {
    refetchQueries: ['OrdersList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Order successfuly updated'
    },
  },
})(OrderUpdateDialog);

OrderUpdateDialog.id = ORDER_UPDATE_DIALOG_ID;

export { OrderUpdateDialog };
