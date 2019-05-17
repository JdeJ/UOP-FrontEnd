import React from 'react';
import ReactLoading from 'react-loading';

const Spinner = ({ type, color }) => (
	<div className="nav-after">
    <ReactLoading type={type} color={color} height={'20%'} width={'20%'} />
    <p><cite>Las opiniones son como los culos, todos tenemos uno</cite> by Clint Eastwood.</p>
  </div>
);

export default Spinner;