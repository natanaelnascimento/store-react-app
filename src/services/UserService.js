import RequestManager from '../helpers/requestManager';

const create = async (user) => {
    return await RequestManager.call(`post`, `/v1/users`, user);
}

const findById = async (id) => {
    return await RequestManager.call(`get`, `/v1/users/` + id);
}

const findAll = async (name) => {
    name = name ? `?name=${name}` : ``;
    return await RequestManager.call(`get`, `/v1/users` + name);
}

const update = async (user) => {
    return await RequestManager.call(`put`, `/v1/users/` + user.id, user);
}

const changePassword = async (data) => {
    return await RequestManager.call(`put`, `/v1/users/password`, data);
}

const remove = async (id) => {
    return await RequestManager.call(`delete`, `/v1/users/` + id);
}

const module = { create, findById, findAll, update, changePassword, remove }

export default module;
