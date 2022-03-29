import RequestManager from '../helpers/requestManager';

const create = async (order) => {
    return await RequestManager.call(`post`, `/v1/orders`, order);
}

const findById = async (id) => {
    return await RequestManager.call(`get`, `/v1/orders/` + id);
}

const findAll = async (quantity) => {
    return await RequestManager.call(`get`, `/v1/orders`, null, quantity);
}

const update = async (order) => {
    return await RequestManager.call(`put`, `/v1/orders/` + order.id, order);
}

const remove = async (id) => {
    return await RequestManager.call(`delete`, `/v1/orders/` + id);
}

const module = { create, findById, findAll, update, remove }

export default module;
