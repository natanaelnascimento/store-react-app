const DAYS = [
    {
        value: 7,
        name: 'Domingo'
    },
    {
        value: 1,
        name: 'Segunda-feira'
    },
    {
        value: 2,
        name: 'Terça-feira'
    },
    {
        value: 3,
        name: 'Quarta-feira'
    },
    {
        value: 4,
        name: 'Quinta-feira'
    },
    {
        value: 5,
        name: 'Sexta-feira'
    },
    {
        value: 6,
        name: 'Sábado'
    }
]

const getName = (value) => {
    let day = DAYS.find(d => d.value === value);
    return day ? day.name : null;
}

const module = {getName, DAYS};

export default module;