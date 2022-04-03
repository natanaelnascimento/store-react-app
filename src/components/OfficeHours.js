import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import OfficeHourService from '../services/OfficeHourService';
import { trackPromise } from 'react-promise-tracker';
import alertManager from '../helpers/alertManager';
import DayOfWeekUtil from '../helpers/dayOfWeekUtil';
import M from 'materialize-css';

export default function OfficeHours() {
  const [items, setItems] = useState([]);
  const [viewType, setViewType] = useState([]);
  const [current, setCurrent] = useState([]);
  const [id, setId] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState([]);
  const [endTime, setEndTime] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [dayOfWeekClass, setDayOfWeekClass] = useState([]);
  const [endTimeClass, setEndTimeClass] = useState([]);
  const [startTimeClass, setStartTimeClass] = useState([]);

  useEffect(() => {
    let elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  });

  useEffect(() => {
    let options = {twelveHour: false, i18n: {cancel: 'Cancelar', clear: 'Limpar', done: 'Ok'}};
    let start = document.querySelectorAll('#startTime');
    M.Timepicker.init(start, {...options});
    let end = document.querySelectorAll('#endTime');
    M.Timepicker.init(end, {...options});
  });

  useEffect(() => {
    setViewType('list');
    const fecth = async () => {
      let data = await trackPromise(OfficeHourService.findAll());
      alertManager.handleData(data);
      setItems(data);
    }
    fecth();
  }, []);

  const handleIdChange = (props) => {
    setId(props.target.value);
  }

  const handleDayOfWeekChange = (props) => {
    setDayOfWeek(props.target.value);
  }

  const getStartTimeValue = () => {
    return document.querySelector('#startTime').value;
  }

  const getEndTimeValue = () => {
    return document.querySelector('#endTime').value;
  }

  const handleSearchButtonClick = async () => {
    let data = id.length > 0
      ? await trackPromise(OfficeHourService.findById(id))
      : dayOfWeek.length > 0
      ? await trackPromise(OfficeHourService.findByDayOfWeek(dayOfWeek))
      : await trackPromise(OfficeHourService.findAll());
    alertManager.handleData(data);
    if(id.length > 0 && !data.error)
      data = {totalElements: 1, content: [data]}
    setItems(data);
  }

  const handleCreationButtonClick = () => {
    setId('');
    setDayOfWeek('7');
    setEndTime('');
    setStartTime('');
    setCurrent(null);
    setViewType('creation');
  }

  const handleCancelButtonClick = () => {
    setId('');
    setDayOfWeek('');
    setEndTime('');
    setStartTime('');
    setDayOfWeekClass('');
    setEndTimeClass('');
    setStartTimeClass('');
    setCurrent(null);
    setViewType('list');
  }

  const handleCreationConffirmButtonClick = async () => {
    let startTime = getStartTimeValue();
    let endTime = getEndTimeValue();
    setEndTimeClass(endTime.length === 0 ? 'invalid' : 'valid');
    setStartTimeClass(startTime.length === 0 ? 'invalid' : 'valid');
    setDayOfWeekClass(dayOfWeek.length === 0 ? 'invalid' : 'valid');
    if(startTime.length === 0 || endTime.length === 0 || dayOfWeek.length === 0) {
      setStartTime(startTime);
      setEndTime(endTime);
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }
    let officeHour = {dayOfWeek, startTime, endTime};
    let data = await trackPromise(OfficeHourService.create(officeHour));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Expediente cadastrado com sucesso!');
   
    data = await trackPromise(OfficeHourService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleUpdateButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(OfficeHourService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setId(data.id);
    setDayOfWeek(data.dayOfWeek);
    setEndTime(data.endTime.substring(0, data.endTime.lastIndexOf(':')));
    setStartTime(data.startTime.substring(0, data.startTime.lastIndexOf(':')));
    setCurrent(data);
    setViewType('update');
  }

  const handleUpdateConffirmButtonClick = async () => {
    let startTime = getStartTimeValue();
    let endTime = getEndTimeValue();
    setEndTimeClass(endTime.length === 0 ? 'invalid' : 'valid');
    setStartTimeClass(startTime.length === 0 ? 'invalid' : 'valid');
    setDayOfWeekClass(dayOfWeek.length === 0 ? 'invalid' : 'valid');
    if(startTime.length === 0 || endTime.length === 0 || dayOfWeek.length === 0) {
      setStartTime(startTime);
      setEndTime(endTime);
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }
    let officeHour = {dayOfWeek, startTime, endTime, id : current.id};
    let data = await trackPromise(OfficeHourService.update(officeHour));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Expediente alterado com sucesso!');
   
    data = await trackPromise(OfficeHourService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDeleteButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(OfficeHourService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setId(data.id);
    setDayOfWeek(data.dayOfWeek);
    setEndTime(data.endTime.substring(0, data.endTime.lastIndexOf(':')));
    setStartTime(data.startTime.substring(0, data.startTime.lastIndexOf(':')));
    setCurrent(data);
    setViewType('delete');
  }

  const handleDeleteConffirmButtonClick = async () => {
    let data = await trackPromise(OfficeHourService.remove(current.id));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Expediente excluído com sucesso!');
   
    data = await trackPromise(OfficeHourService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDetailButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(OfficeHourService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setId(data.id);
    setDayOfWeek(data.dayOfWeek);
    setEndTime(data.endTime.substring(0, data.endTime.lastIndexOf(':')));
    setStartTime(data.startTime.substring(0, data.startTime.lastIndexOf(':')));
    setCurrent(data);
    setViewType('detail');
  }

  let title = viewType === 'update'
    ? `Alterar Expediente #${current && current.id}`
    : viewType === 'delete'
    ? `Excluir Expediente #${current && current.id}`
    : viewType === 'detail'
    ? `Detalhar Expediente #${current && current.id}`
    : viewType === 'creation'
    ? 'Cadastrar Expediente'
    : 'Expediente';

  return (
    <Navigation title={title}>
        {viewType === 'list' &&
          <div className='section'>
            <input style={STYLES.input} className='col s12 m12 l1 xl2' placeholder='Buscar por ID' id='id' type='text' value={id} onChange={handleIdChange} />
            <div className='input-field col s12 m12 l5 xl6' style={{...STYLES.input, ...STYLES.daySelect}}>
              <select multiple={false} id='dayOfWeek' value={dayOfWeek} onChange={handleDayOfWeekChange} >
                <option key='allDays'>Todos os dias</option>
                {DayOfWeekUtil.DAYS.map(day => (
                  <option key={'day-' + day.value} value={day.value}>{day.name}</option>
                ))}
              </select>
            </div>
            <button style={STYLES.input} onClick={handleSearchButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">search</i>Buscar</button>
            <button style={STYLES.input} onClick={handleCreationButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">add</i>Cadastrar</button>
          </div>
        }
        <div className='section'>
         {items && items.totalElements > 0 && viewType === 'list' &&
            <table className='striped highlight'>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Dia</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th/>
                </tr>
              </thead>
              <tbody>
              {items && items.totalElements > 0 &&
                items.content.map((officeHour) => (
                  <tr key={officeHour.id}>
                    <td>{officeHour.id}</td>
                    <td>{DayOfWeekUtil.getName(officeHour.dayOfWeek)}</td>
                    <td>{officeHour.startTime.substring(0, officeHour.startTime.lastIndexOf(':'))}</td>
                    <td>{officeHour.endTime.substring(0, officeHour.endTime.lastIndexOf(':'))}</td>
                    <td>
                      <a href='#!' id={'aofficeHour-' + officeHour.id} onClick={handleDeleteButtonClick} className='secondary-content'><i id={'iofficeHour-' + officeHour.id} style={STYLES.action} className='material-icons'>delete</i></a>
                      <a href='#!' id={'aofficeHour-' + officeHour.id} onClick={handleUpdateButtonClick} className='secondary-content'><i id={'iofficeHour-' + officeHour.id} style={STYLES.action} className='material-icons'>edit</i></a>
                      <a href='#!' id={'aofficeHour-' + officeHour.id} onClick={handleDetailButtonClick} className='secondary-content'><i id={'iofficeHour-' + officeHour.id} style={STYLES.action} className='material-icons'>description</i></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          {viewType !== 'list' &&
            <>
              <div>
                <div className='input-field col s12 m12 l10 xl11'>
                  <select multiple={false} id='dayOfWeek' value={dayOfWeek} className={dayOfWeekClass} style={{...STYLES.input, ...STYLES.daySelect}} onChange={handleDayOfWeekChange} disabled={['detail', 'delete'].includes(viewType)} >
                    {DayOfWeekUtil.DAYS.map(day => (
                      <option key={'day-' + day.value} value={day.value}>{day.name}</option>
                    ))}
                  </select>
                  <label className='active' htmlFor="dayOfWeek">Dia</label>
                </div>
                <div className='input-field col s12 m12 l5 xl5'>
                  <input style={STYLES.input} className={startTimeClass + ' timepicker'} placeholder='Início' id='startTime' type='text' defaultValue={startTime} disabled={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="startTime">Início</label>
                </div>
                <div className='input-field col s12 m12 l5 xl6'>
                  <input style={STYLES.input} className={endTimeClass + ' timepicker'} placeholder='Fim' id='endTime' type='text' defaultValue={endTime} disabled={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="endTime">Fim</label>
                </div>
              </div>
              <div>
                <button style={STYLES.input} onClick={handleCancelButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">arrow_back</i>{viewType === 'detail' ? 'Voltar' : 'Cancelar'}</button>
                {viewType === 'creation' &&
                  <button style={STYLES.input} onClick={handleCreationConffirmButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">add</i>Cadastrar</button>
                }
                {viewType === 'update' &&
                  <button style={STYLES.input} onClick={handleUpdateConffirmButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">check</i>Alterar</button>
                }
                {viewType === 'delete' &&
                  <button style={STYLES.input} onClick={handleDeleteConffirmButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">delete</i>Excluir</button>
                }
              </div>
            </>
          }
        </div>
    </Navigation>
  );
}

const STYLES = {
  action: {
    marginLeft: '0.5rem'
  },
  icon: {
    fontSize: '15rem',
    color: '#aebfbe'
  },
  input: {
    maginLeft: '0.5rem',
    marginRight: '0.5rem'
  },
  daySelect: {
    marginTop: '0'
  }
}
