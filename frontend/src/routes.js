import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NewPlace from './_places/pages/NewPlace';
import UpdatePlace from './_places/pages/UpdatePlace';
import UserPlaces from './_places/pages/UserPlaces';
import Auth from './_user/pages/Auth';
import Users from './_user/pages/Users';

export default (
  <Routes>
    <Route path='/' exact element={<Users />} />
    <Route path='/:userId/places' element={<UserPlaces />} exact />
    <Route path='/places/new' element={<NewPlace />} exact />
    <Route path='/places/:placeId' element={<UpdatePlace />} />
    <Route path="/auth" element={<Auth />} />
  </Routes>
);
