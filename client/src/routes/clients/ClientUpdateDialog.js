import React from 'react';
import { Form, Field } from '@8base/forms';
import {Dialog, Grid, Button, InputField, DateInputField, ModalContext, SelectField} from '@8base/boost';
import {graphql, Query} from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';
import { ordersListOptions } from 'shared/components';

const CLIENT_UPDATE_DIALOG_ID = 'CLIENT_UPDATE_DIALOG_ID';

class ClientUpdateDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = (id) => async (data) => {

    debugger;

    await this.props.clientUpdate({ variables: { data: { ...data, id }}});

    this.context.closeModal(CLIENT_UPDATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(CLIENT_UPDATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, submitting, pristine, invalid }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="Update Client" onClose={ this.onClose } />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Field
              name="firstName"
              label="First Name"
              placeholder="Please provide first name"
              component={ InputField }
              stretch
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="lastName"
              label="Last Name"
              placeholder="Please provide last name"
              component={ InputField }
              stretch
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="email"
              label="Email"
              placeholder="Please provide E-mail"
              type="text"
              component={ InputField }
              stretch
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="phone"
              label="Phone Number"
              type="text"
              placeholder="Please provide phone number"
              component={ InputField }
              stretch
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="birthday"
              label="BirthDay"
              type="date"
              placeholder="Please provide your birth day"
              component={ DateInputField }
              stretch
            />
          </Grid.Box>
          <Grid.Box>
            <Query query={ sharedGraphQL.ORDERS_LIST_QUERY }>
              {
                ({data, loading}) => (
                  <Field
                    name="orders"
                    label="Orders"
                    placeholder="Select a order"
                    component={ SelectField }
                    loading={ loading }
                    options={loading ? [] : ordersListOptions(data.ordersList.items)}
                    stretch
                    clearable
                    multiple
                  />
                )
              }
            </Query>
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ this.onClose }>Cancel</Button>
        <Button color="primary" type="submit" disabled={ pristine || invalid } loading={ submitting }>Update Client</Button>
      </Dialog.Footer>
    </form>
  );

  renderForm = ({ args }) => (
    <Form
      type="UPDATE"
      tableSchemaName="Clients"
      onSubmit={ this.onSubmit(args.initialValues.id) }
      initialValues={args.initialValues}
      formatRelationToIds
    >
      {this.renderFormContent}
    </Form>
  )

  render() {
    return (
      <Dialog id={ CLIENT_UPDATE_DIALOG_ID } size="sm">
        { this.renderForm }
      </Dialog>
    );
  }
}

ClientUpdateDialog = graphql(sharedGraphQL.CLIENT_UPDATE_MUTATION, {
    name: 'clientUpdate',
    options: {
      refetchQueries: ['ClientsList'],
      context: {
        [TOAST_SUCCESS_MESSAGE]: 'Client successfuly updated'
      },
    },
})(ClientUpdateDialog);

ClientUpdateDialog.id = CLIENT_UPDATE_DIALOG_ID;

export { ClientUpdateDialog };
