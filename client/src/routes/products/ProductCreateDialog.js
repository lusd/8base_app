import React from 'react';
import { Form, Field } from '@8base/forms';
import {Dialog, Grid, Button, InputField, ModalContext, SelectField, TextAreaField} from '@8base/boost';
import { graphql, Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';
import { FileInputField, orderItemsOptions } from 'shared/components';

const PRODUCT_CREATE_DIALOG_ID = 'PRODUCT_CREATE_DIALOG_ID';

class ProductCreateDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = async (data) => {

    await this.props.productCreate({ variables: { data }});

    this.context.closeModal(PRODUCT_CREATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(PRODUCT_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, submitting }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="New Product" onClose={ this.onClose } />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Field
              name="name"
              label="Name"
              placeholder="Please provide product name"
              component={ InputField }
              stretch
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="description"
              label="Description"
              placeholder="Please provide description"
              component={ TextAreaField }
              stretch
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="price"
              label="Price"
              placeholder="Please provide price in $"
              type="number"
              component={ InputField }
              stretch
            />
          </Grid.Box>
          <Grid.Box>
            <Field name="picture" label="Product Image" component={ FileInputField } maxFiles={ 1 } />
          </Grid.Box>
          <Grid.Box>
            <Query query={ sharedGraphQL.ORDERS_ITEMS_LIST }>
              {
                ({data, loading}) => (
                  <Field
                    name="orderItems"
                    label="Order Items"
                    placeholder="Select an Order"
                    component={ SelectField }
                    loading={ loading }
                    options={loading ? [] : orderItemsOptions(data.orderItemsList.items)}
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
        <Button color="primary" type="submit" loading={ submitting }>Create Product</Button>
      </Dialog.Footer>
    </form>
  );

  render() {
    return (
      <Dialog id={ PRODUCT_CREATE_DIALOG_ID } size="sm">
        <Form type="CREATE" tableSchemaName="Products" onSubmit={ this.onSubmit }>
          { this.renderFormContent }
        </Form>
      </Dialog>
    );
  }
}

ProductCreateDialog = graphql(sharedGraphQL.PRODUCT_CREATE_MUTATION, {
  name: 'productCreate',
  options: {
    refetchQueries: ['ProductsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Product successfuly created'
    },
  },
})(ProductCreateDialog);

ProductCreateDialog.id = PRODUCT_CREATE_DIALOG_ID;

export { ProductCreateDialog };
