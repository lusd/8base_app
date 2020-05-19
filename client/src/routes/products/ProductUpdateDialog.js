import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField, ModalContext, SelectField, TextAreaField } from '@8base/boost';
import { graphql, Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';
import { FileInputField, orderItemsOptions } from 'shared/components';

const PRODUCT_UPDATE_DIALOG_ID = 'PRODUCT_UPDATE_DIALOG_ID';

class ProductUpdateDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = (id) => async (data) => {

    await this.props.productUpdate({ variables: { data: { ...data, id }}});

    this.context.closeModal(PRODUCT_UPDATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(PRODUCT_UPDATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, submitting }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="Update Product" onClose={ this.onClose } />
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
        <Button color="primary" type="submit" loading={ submitting }>Update Product</Button>
      </Dialog.Footer>
    </form>
  );

  renderForm = ({ args }) => (
    <Form
      type="UPDATE"
      tableSchemaName="Products"
      onSubmit={ this.onSubmit(args.initialValues.id) }
      initialValues={args.initialValues}
      formatRelationToIds
    >
      {this.renderFormContent}
    </Form>
  )

  render() {
    return (
      <Dialog id={ PRODUCT_UPDATE_DIALOG_ID } size="sm">
        { this.renderForm }
      </Dialog>
    );
  }
}

ProductUpdateDialog = graphql(sharedGraphQL.PRODUCT_UPDATE_MUTATION, {
  name: 'productUpdate',
  options: {
    refetchQueries: ['ProductsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Product successfuly updated'
    },
  },
})(ProductUpdateDialog);

ProductUpdateDialog.id = PRODUCT_UPDATE_DIALOG_ID;

export { ProductUpdateDialog };
