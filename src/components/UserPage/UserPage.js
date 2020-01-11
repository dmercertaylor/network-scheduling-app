import React from 'react';
import { useSelector } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`
export default function UserPage(){
  const user = useSelector(state => state.user);

  return (
    <div>
      <h1 id="welcome">
        Welcome, { user.username }!
      </h1>
      <p>Your ID is: {user.id}</p>
      <LogOutButton className="log-in" />
    </div>
  );
}