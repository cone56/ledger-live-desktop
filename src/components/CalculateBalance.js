// @flow
/* eslint-disable react/no-unused-prop-types */

import { Component } from 'react'
import { connect } from 'react-redux'

import type { Account } from '@ledgerhq/live-common/lib/types'
import { getBalanceHistorySum } from '@ledgerhq/live-common/lib/helpers/account'
import CounterValues from 'helpers/countervalues'
import {
  exchangeSettingsForAccountSelector,
  counterValueCurrencySelector,
  counterValueExchangeSelector,
  intermediaryCurrency,
} from 'reducers/settings'
import type { State } from 'reducers'

type OwnProps = {
  accounts: Account[],
  daysCount: number,
  children: Props => *,
}

type Item = {
  date: Date,
  value: number,
  originalValue: number,
}

type Props = OwnProps & {
  balanceHistory: Item[],
  balanceStart: number,
  balanceEnd: number,
  isAvailable: boolean,
  hash: string,
}

const mapStateToProps = (state: State, props: OwnProps) => {
  const counterValueCurrency = counterValueCurrencySelector(state)
  const counterValueExchange = counterValueExchangeSelector(state)
  let isAvailable = true

  // create array of original values, used to reconciliate
  // with counter values after calculation
  const originalValues = []

  const balanceHistory = getBalanceHistorySum(
    props.accounts,
    props.daysCount,
    (account, value, date) => {
      // keep track of original value
      originalValues.push(value)
      const fromExchange = exchangeSettingsForAccountSelector(state, { account })

      const cv = CounterValues.calculateWithIntermediarySelector(state, {
        value,
        date,
        from: account.currency,
        fromExchange,
        intermediary: intermediaryCurrency,
        toExchange: counterValueExchange,
        to: counterValueCurrency,
      })
      if (!cv && cv !== 0) {
        isAvailable = false
        return 0
      }
      return cv
    },
  ).map((item, i) =>
    // reconciliate balance history with original values
    ({ ...item, originalValue: originalValues[i] || 0 }),
  )

  const balanceEnd = balanceHistory[balanceHistory.length - 1].value

  return {
    isAvailable,
    balanceHistory,
    balanceStart: balanceHistory[0].value,
    balanceEnd,
    hash: `${balanceHistory.length}_${balanceEnd}_${isAvailable.toString()}`,
  }
}

class CalculateBalance extends Component<Props> {
  shouldComponentUpdate(nextProps) {
    return nextProps.hash !== this.props.hash
  }
  render() {
    const { children } = this.props
    return children(this.props)
  }
}

export default connect(mapStateToProps)(CalculateBalance)
