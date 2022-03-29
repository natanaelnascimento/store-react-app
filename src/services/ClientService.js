import RequestManager from '../helpers/requestManager';

const create = async (client) => {
    return await RequestManager.call(`post`, `/v1/clients`, client);
}

const findById = async (id) => {
    return await RequestManager.call(`get`, `/v1/clients/` + id);
}

const findAll = async (name, quantity) => {
    name = name ? `?name=${name}` : ``;
    return await RequestManager.call(`get`, `/v1/clients` + name, null, quantity);
}

const update = async (client) => {
    return await RequestManager.call(`put`, `/v1/clients/` + client.id, client);
}

const remove = async (id) => {
    return await RequestManager.call(`delete`, `/v1/clients/` + id);
}

const module = { create, findById, findAll, update, remove }

export default module;
