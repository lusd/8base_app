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
  Label
} from '@8base/boost';
import arrayMutators from 'final-form-arrays';
import { graphql, Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';
import { clientsListOptions } from 'shared/components';
import {OrderItemCreateForm} from "./OrderItemCreateForm";

const ORDER_CREATE_DIALOG_ID = 'ORDER_CREATE_DIALOG_ID';

class OrderCreateDialog extends React.Component {
  static contextType = ModalContext;

  dataStorage = []; // Temporary storage for created "order items" at second inner Form element.

  innerFormButton = React.createRef(); // Reference for button to call click action and submit form.
  // (It is not the best way to submit form in long run, but I just needed working solution).

  onSubmit = async (data) => {
    this.innerFormButton.current.click(); // Calling click() action at button submit second Inner Form and fill dataStorage
    const dataWithOrderItems = { ...data, orderItems: this.dataStorage[0] };
    await this.props.orderCreate({ variables: { data: dataWithOrderItems }});
    this.dataStorage = []; //clearing temporary storage;
    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  onOrderItemCreate = async (data) => {
    this.dataStorage.push(data); // Filling data from Inner Form to temporary Storage
  };

  onClose = () => {
    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, submitting }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="New Order" onClose={ this.onClose } />
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
            <Label>Please create one or several order Items: </Label>
            <Form
              type="CREATE"
              tableSchemaName="Order Items"
              onSubmit={this.onOrderItemCreate}
              mutators={{
                ...arrayMutators
              }}
              component={OrderItemCreateForm}
            />
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
        <Button color="primary" type="submit" loading={ submitting }>Create Order</Button>
      </Dialog.Footer>
    </form>
  );

  render() {
    return (
      <Dialog id={ ORDER_CREATE_DIALOG_ID } size="sm">
        <Form
          type="CREATE"
          tableSchemaName="Orders"
          onSubmit={ this.onSubmit }
        >
          { this.renderFormContent }
        </Form>
      </Dialog>
    );
  }
}

OrderCreateDialog = graphql(sharedGraphQL.ORDER_CREATE_MUTATION, {
    name: 'orderCreate',
    options: {
      refetchQueries: ['OrdersList'],
      context: {
        [TOAST_SUCCESS_MESSAGE]: 'Order successfuly created'
      },
    },
})(OrderCreateDialog);

OrderCreateDialog.id = ORDER_CREATE_DIALOG_ID;

export { OrderCreateDialog };
