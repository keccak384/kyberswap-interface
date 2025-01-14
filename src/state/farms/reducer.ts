import { createReducer } from '@reduxjs/toolkit'

import { Farm } from 'state/farms/types'
import { reportException } from 'utils/sentry'

import { setAttemptingTxn, setFarmsData, setLoading, setShowConfirm, setTxHash, setYieldPoolsError } from './actions'

export interface FarmsState {
  readonly data: { [key: string]: Farm[] }
  readonly loading: boolean
  readonly showConfirm: boolean
  readonly attemptingTxn: boolean
  readonly txHash: string
  readonly error: string
}

const initialState: FarmsState = {
  data: {},
  loading: false,
  showConfirm: false,
  attemptingTxn: false,
  txHash: '',
  error: '',
}

export default createReducer<FarmsState>(initialState, builder =>
  builder
    .addCase(setFarmsData, (state, { payload: data }) => {
      return {
        ...state,
        data,
      }
    })
    .addCase(setLoading, (state, { payload: loading }) => {
      return {
        ...state,
        loading,
      }
    })
    .addCase(setShowConfirm, (state, { payload: showConfirm }) => {
      state.showConfirm = showConfirm
    })
    .addCase(setAttemptingTxn, (state, { payload: attemptingTxn }) => {
      state.attemptingTxn = attemptingTxn
    })
    .addCase(setTxHash, (state, { payload: txHash }) => {
      state.txHash = txHash
    })
    .addCase(setYieldPoolsError, (state, { payload: error }) => {
      if (error) reportException(error)
      return {
        ...state,
        error: error ? error?.message : '',
      }
    }),
)
