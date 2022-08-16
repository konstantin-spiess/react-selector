import React, { FC } from 'react';
import s from './Text.module.scss';

export type TextProps = {
  type: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  value: string;
};

const Text: FC<TextProps> = ({ type, value }) => {
  return <div className={s[type]}>{value}</div>;
};

export default Text;
