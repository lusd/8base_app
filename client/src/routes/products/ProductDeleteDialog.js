import React from 'react';
import { Form } from '@8base/forms';
import { Dialog, Button, ModalContext } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

const PRODUCT_DELETE_DIALOG_ID = 'PRODUCT_DELETE_DIALOG_ID';

class ProductDeleteDialog extends React.Component {
  static contextType = ModalContext;

  deleteOnSubmit = (id) => async () => {
    await this.props.productDelete({ variables: { id }});

    this.context.closeModal(PRODUCT_DELETE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(PRODUCT_DELETE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="Delete Product" onClose={ this.onClose } />
      <Dialog.Body scrollable>
        Are you really want to delete product?
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ this.onClose }>Cancel</Button>
        <Button color="danger" type="submit" disabled={ invalid } loading={ submitting }>Delete Product</Button>
      </Dialog.Footer>
    </form>
  );

  renderContent = ({ args }) => {
    return (
      <Form onSubmit={ this.deleteOnSubmit(args.id) }>
        { this.renderFormContent }
      </Form>
    );
  };

  render() {
    return (
      <Dialog id={ PRODUCT_DELETE_DIALOG_ID } size="sm">
        { this.renderContent }
      </Dialog>
    );
  }
}

ProductDeleteDialog = graphql(sharedGraphQL.PRODUCT_DELETE_MUTATION, {
  name: 'productDelete',
  options: {
    refetchQueries: ['ProductsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Product successfuly deleted'
    },
  },
})(ProductDeleteDialog);

ProductDeleteDialog.id = PRODUCT_DELETE_DIALOG_ID;

export { ProductDeleteDialog };
