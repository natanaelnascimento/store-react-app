import RequestManager from '../helpers/requestManager';

const create = async (discount) => {
    return await RequestManager.call(`post`, `/v1/discounts`, discount);
}

const findById = async (id) => {
    return await RequestManager.call(`get`, `/v1/discounts/` + id);
}

const findByInstallments = async (installments) => {
    return await RequestManager.call(`get`, `/v1/discounts/byInstallments/` + installments);
}

const findAll = async (name) => {
    name = name ? `?name=${name}` : ``;
    return await RequestManager.call(`get`, `/v1/discounts` + name);
}

const update = async (discount) => {
    return await RequestManager.call(`put`, `/v1/discounts/` + discount.id, discount);
}

const remove = async (id) => {
    return await RequestManager.call(`delete`, `/v1/discounts/` + id);
}

const module = { create, findById, findByInstallments, findAll, update, remove }

export default module;
