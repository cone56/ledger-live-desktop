// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import QRCode from 'components/base/QRCode'
import Icon from 'components/base/Icon'
import CopyToClipboard from 'components/base/CopyToClipboard'
import Text from 'components/base/Text'
import Print from 'components/base/Print'

type Props = {
  amount?: string,
  address: string,
}

export const AddressBox = styled(Box).attrs({
  borderWidth: 1,
  borderColor: 'mouse',
  bg: 'cream',
  p: 2,
})`
  border-radius: 3px;
  cursor: text;
  text-align: center;
  user-select: text;
  word-break: break-all;
`

const Action = styled(Box).attrs({
  align: 'center',
  color: 'mouse',
  flex: 1,
  flow: 1,
  fontSize: 0,
})`
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    color: ${p => p.theme.colors.grey};
  }
`

const ReceiveBox = ({ amount, address }: Props) => (
  <Box flow={3}>
    <Box align="center">
      <QRCode size={150} data={`bitcoin:${address}${amount ? `?amount=${amount}` : ''}`} />
    </Box>
    <Box align="center" flow={2}>
      <Text fontSize={1}>{'Current address'}</Text>
      <AddressBox>{address}</AddressBox>
    </Box>
    <Box horizontal>
      <CopyToClipboard
        data={address}
        render={copy => (
          <Action onClick={copy}>
            <Icon name="clone" />
            <span>{'Copy'}</span>
          </Action>
        )}
      />
      <Print
        data={{ address, amount }}
        render={(print, isLoading) => (
          <Action onClick={print}>
            <Icon name="print" />
            <span>{isLoading ? '...' : 'Print'}</span>
          </Action>
        )}
      />
      <Action>
        <Icon name="share-square" />
        <span>{'Share'}</span>
      </Action>
    </Box>
  </Box>
)

ReceiveBox.defaultProps = {
  amount: undefined,
}

export default ReceiveBox