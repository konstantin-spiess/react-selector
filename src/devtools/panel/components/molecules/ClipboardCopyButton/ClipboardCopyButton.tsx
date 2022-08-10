import { CopyIcon } from '@radix-ui/react-icons';
import { FC } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';

export type ClipboardCopyButtonProps = {
  value: string;
};

const ClipboardCopyButton: FC<ClipboardCopyButtonProps> = ({ value }) => {
  return (
    <CopyToClipboard text={value}>
      <CopyIcon />
    </CopyToClipboard>
  );
};

export default ClipboardCopyButton;
