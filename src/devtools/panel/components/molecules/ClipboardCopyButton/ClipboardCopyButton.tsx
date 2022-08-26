import { CopyIcon } from '@radix-ui/react-icons';
import { FC } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import s from './ClipboardCopyButton.module.scss';

export type ClipboardCopyButtonProps = {
  value: string;
};

const ClipboardCopyButton: FC<ClipboardCopyButtonProps> = ({ value }) => {
  const notify = () => toast.success('Copied to clipboard', { className: s.copyMessage });
  return (
    <div className={s.wrapper}>
      <CopyToClipboard text={value} onCopy={notify}>
        <CopyIcon />
      </CopyToClipboard>
    </div>
  );
};

export default ClipboardCopyButton;
