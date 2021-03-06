import { curryN, init, last } from 'ramda';

import { ObjectId } from 'mongodb';
import findById from './findById';
import dissolveFindParams from './internal/dissolveFindParams';

/**
 * Takes a {@link MongoClientLike}, a database name, a collection name, and an {@link ObjectId}, then
 * returns `Promise` which resolves the (Document)[https://docs.mongodb.com/manual/core/document/] with given id in specified `Collection`
 * in MongoDB.
 *
 * `id` must be {@link ObjectId}.
 *
 * It is a curried function so it can be partially recomposed.
 * Since [Ramda](https://ramdajs.com/) is used for currying, you can also use [R.__](https://ramdajs.com/docs/#__)
 * placeholder to allow partial application of any combination of arguments of this particular function.
 *
 * @func findBy
 * @since v0.1.0
 * @param {MongoClientLike} client {@link MongoClient} instance
 * @param {string} databaseName Database name to get the collection from.
 * @param {string} collectionName Collection name to get find results from.
 * @param {FindParams<ObjectId>} id Id of the document to be fetched.
 * @return {Promise<object>} Document with given id.
 * @see {@link findById}, {@link createClient}
 * @example
 *
 *      const client = createClient(...params);
 *      findByObjectId(client, 'databaseName', 'collectionName', new ObjectId(someId))
 *      .then(console.log);
 *
 *      // partial re-usability
 *      const findInSomeDbByObjectId = findByObjectId(someClient, 'someDb');
 *      findInSomeDbByObjectId('categories', someObjectId).then(console.log);
 *      findInSomeDbByObjectId('articles', someOtherObjectId).then(console.log);
 *
 */
const findByObjectId = curryN(
  findById.length,
  (...args) => {
    const [id, ...params] = dissolveFindParams(last(args));

    return findById(...init(args))([new ObjectId(id), ...params]);
  },
);

export default findByObjectId;
