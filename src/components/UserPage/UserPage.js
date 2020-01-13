import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import Axios from 'axios';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/dark.css';
import moment from 'moment'

export default function UserPage(){

  // State setup
  const user = useSelector(state => state.user);
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(moment().add(1, 'hour').format());
  const [message, setMessage] = useState('');

  // Form submit
  const submitForm = event => {
    event.preventDefault();
    // if firing from the button onClicked,
    // this prevents a second fire that may
    // occur from the forms onsubmit sometimes
    event.stopPropagation();

    // Check if selected datetime is more than
    // 2 minutes in the future.
    if( moment(date).isBefore( moment().add(2, 'minutes'))){
      alert('Times must be at least 2 minutes in the future');
      return;
    }

    // if all fields are filled, send email, date,
    // and message to be mailed.
    if(email && date){
      Axios.post('/api/email', {email, date, message})
        .catch(error => {
          console.log(error)
      });
      setEmail('');
      setDate(moment().add(1, 'hour').format());
      setMessage('');
    } else {
      alert('Fill fields');
    }
  }

  return (
    <div>
      <h1 id="welcome">
        Welcome, { user.username }!
      </h1>
      <form onSubmit={submitForm}>
        <input
          type='text'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='email address'
        />
        <Flatpickr data-enable-time
          value={date}
          onChange={date => setDate(date)}
          options ={{ minDate: moment().add(2, 'minutes').format() }}
        />
        <br />
        <textarea
          rows='4'
          cols='32'
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder='Message here...'
        />
        <br />
        <button onClick={submitForm}>Schedule email</button>
      </form>
      <LogOutButton className="log-in" />
    </div>
  );
}