import React, { FC } from 'react';
import s from './Label.module.scss';

export type LabelProps = {
  value: string;
};

const Label: FC<LabelProps> = ({ value }) => {
  return <div className={s.wrapper}>{value}</div>;
};

export default Label;
