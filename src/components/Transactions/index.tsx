import { useCallback, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent, TransactionApproval } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()
  // Store previous approvals in a state value that persists over time
  const [approvals, setTransactionApprovals] = useState({})

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
      setTransactionApprovals((previousApprovals) => {
        return { ...previousApprovals, [transactionId]: newValue }
      })
    },
    [fetchWithoutCache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          approved={approvals[transaction.id] ?? transaction.approved}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
