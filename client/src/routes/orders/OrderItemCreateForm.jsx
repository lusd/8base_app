import React from 'react';
import { Button, InputField, SelectField } from '@8base/boost';
import { Field, FieldArray } from '@8base/forms';
import { Query } from "react-apollo";

import * as sharedGraphQL from 'shared/graphql';
import {productsOptions} from 'shared/components';

const OrderItemCreateForm = ({ handleSubmit, form: { mutators: { push } } }) => (
  <form
    onSubmit={ handleSubmit }
  >
    <Button type="button" size="sm" color="neutral" onClick={() => push('create', undefined)}>
      Add new order item
    </Button>
    <FieldArray name="create">
      {
        ({ fields }) => (
          <React.Fragment>
            {
              fields.map((name, index) => (
                <div
                  style={{
                    borderBottom: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'flex-end' ,
                    padding: '5px 0'
                  }}
                  key={name}
                >
                  <Query query={sharedGraphQL.PRODUCT_LIST_QUERY}>
                    {
                      ({data, loading}) => (
                        <Field
                          name={`${name}.product.connect.id`}
                          label="Product"
                          placeholder="Select Product"
                          options={loading ? [] : productsOptions(data.productsList.items)}
                          component={SelectField}
                          loading={loading}
                          clearable
                        />
                      )
                    }
                  </Query>
                  <Field
                    style={{width: '60px'}}
                    name={`${name}.quantity`}
                    label="Quantity"
                    component={InputField}
                    type="number"
                  />
                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => fields.remove(index)}
                    type="button"
                  >
                    X
                  </Button>
                </div>
              ))
            }
          </React.Fragment>
        )
      }
    </FieldArray>
    <button id="innerFormButton" style={{
      opacity: '0',
      visibility: 'hidden',
      position: 'absolute',
      zIndex: '-9999',
      left: '-9999'
    }} type="submit">
    </button>
  </form>
);

export { OrderItemCreateForm };