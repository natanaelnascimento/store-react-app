const ERRORS = [
    {
        error: 'bad_credentials',
        message: 'Usuário ou senha incorretos'
    },
    {
        error: 'not_authenticated',
        message: 'Necessário fazer login'
    },
    {
        error: 'not_found',
        message: 'Registro não encontrado'
    },
    {
        error: 'data_valitadion',
        message: 'Erro ao validar os dados informados'
    },
    {
        error: 'structure_valitadion',
        message: 'Erro na estrutura dos dados enviados'
    },
    {
        error: 'integrity_violation',
        message: 'O registro já existe ou está sendo utilizado'
    },
    {
        error: 'integrity_violation',
        message: 'O registro já existe ou está sendo utilizado'
    },
    {
        error: 'credit_limit_overflow',
        message: 'O valor do pedido ultrapassa o limite de crédito do cliente'
    },
    {
        error: 'installments_limit_overflow',
        message: 'O parcelamento do pedido ultrapassa o limite de parcelamento do cliente'
    },
    {
        error: 'outside_office_hours',
        message: 'O pedido não pode ser realizado fora dos horários estabelecidos'
    },
    {
        error: 'outside_working_days',
        message: 'O pedido não pode ser realizado fora dos dias estabelecidos'
    },
    {
        error: 'incorrect_password',
        message: 'A senha atual informada está incorreta'
    },
    {
        error: 'session_user_delete',
        message: 'Você nãao pode excluir seu próprio usuário'
    }
];

const GENERIC_ERROR = {
    error: 'generic',
    message: 'Erro ao realizar a operação'
}

const NETWORK_ERROR = {
    error: 'generic',
    message: 'Erro ao realizar conexão com o servidor'
}

const getErrorInfo = (response) => {
    let errorInfo = ERRORS.find(e => e.error === response.data.error);
    return errorInfo ? errorInfo : GENERIC_ERROR;
}

const module = { getErrorInfo, GENERIC_ERROR, NETWORK_ERROR };

export default module;