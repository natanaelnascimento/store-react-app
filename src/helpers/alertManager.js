import M from 'materialize-css';

const showAlert = (message) => {
    M.toast({html: message});
}

const handleData = (data) => {
    if(data && data.message) {
        showAlert(data.message);
    }
}

const module = {showAlert, handleData};

export default module;