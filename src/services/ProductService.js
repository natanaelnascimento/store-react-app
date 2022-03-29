import RequestManager from '../helpers/requestManager';

const create = async (product) => {
    return await RequestManager.call(`post`, `/v1/products`, product);
}

const findById = async (id) => {
    return await RequestManager.call(`get`, `/v1/products/` + id);
}

const findAll = async (name) => {
    name = name ? `?name=${name}` : ``;
    return await RequestManager.call(`get`, `/v1/products` + name);
}

const update = async (product) => {
    return await RequestManager.call(`put`, `/v1/products/` + product.id, product);
}

const remove = async (id) => {
    return await RequestManager.call(`delete`, `/v1/products/` + id);
}

const module = { create, findById, findAll, update, remove }

export default module;
