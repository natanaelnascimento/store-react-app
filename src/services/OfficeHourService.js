import RequestManager from '../helpers/requestManager';

const create = async (officeHour) => {
    return await RequestManager.call(`post`, `/v1/officeHours`, officeHour);
}

const findById = async (id) => {
    return await RequestManager.call(`get`, `/v1/officeHours/` + id);
}

const findByDayOfWeek = async (dayOfWeek) => {
    return await RequestManager.call(`get`, `/v1/officeHours/byDayOfWeek/` + dayOfWeek);
}

const findAll = async () => {
    return await RequestManager.call(`get`, `/v1/officeHours`);
}

const update = async (officeHour) => {
    return await RequestManager.call(`put`, `/v1/officeHours/` + officeHour.id, officeHour);
}

const remove = async (id) => {
    return await RequestManager.call(`delete`, `/v1/officeHours/` + id);
}

const module = { create, findById, findByDayOfWeek, findAll, update, remove }

export default module;
