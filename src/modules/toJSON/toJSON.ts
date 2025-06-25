/* eslint-disable no-param-reassign */
import { Document, Schema, ToObjectOptions, SchemaType } from 'mongoose';

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj: any, path: any, index: number) => {
  if (index === path.length - 1) {
    // eslint-disable-next-line no-param-reassign
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSON = <T extends Document>(schema: Schema<T>): void => {
  // Type assertion to access options and paths safely
  const schemaWithOptions = schema as Schema<T> & {
    options: {
      toJSON?: ToObjectOptions;
      [key: string]: any;
    };
    paths: {
      [key: string]: SchemaType & {
        options?: {
          private?: boolean;
          [key: string]: any;
        };
      };
    };
  };
  let transform: ToObjectOptions['transform'];
  if (schemaWithOptions.options.toJSON && schemaWithOptions.options.toJSON.transform) {
    transform = schemaWithOptions.options.toJSON.transform;
  }

  // eslint-disable-next-line no-param-reassign
  schemaWithOptions.options.toJSON = Object.assign(schemaWithOptions.options.toJSON || {}, {
    transform(doc: any, ret: any, options: any) {
      Object.keys(schemaWithOptions.paths).forEach((path) => {
        const schemaPath = schemaWithOptions.paths[path];
        if (schemaPath?.options?.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      // eslint-disable-next-line no-param-reassign
      ret.id = ret._id.toString();
      // eslint-disable-next-line no-param-reassign
      delete ret._id;
      // eslint-disable-next-line no-param-reassign
      delete ret.__v;
      // eslint-disable-next-line no-param-reassign
      delete ret.createdAt;
      // eslint-disable-next-line no-param-reassign
      delete ret.updatedAt;
      if (transform && typeof transform === 'function') {
        return transform(doc, ret, options);
      }
    },
  });
};

export default toJSON;
