/**
 * Main dashboard component for financial transaction processing
 * Handles real-time balance updates, transaction management, and user interface
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  DollarSign, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Send,
  Building2
} from 'lucide-react'
import { Person, Bank, Transaction, TransactionDto, ProcessingResponse, TransactionBuilderItem} from '../types';
import { formatCurrency, safeToNumber } from '../lib/utils'
import { api } from '../services/api'


export default function Home() {
  const [persons, setPersons] = useState<Person[]>([])
  const [bank, setBank] = useState<Bank | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedTransactions, setSelectedTransactions] = useState<TransactionBuilderItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingResult, setProcessingResult] = useState<ProcessingResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPolling, _setIsPolling] = useState(true)

  /**
   * Fetches the current bank balance from the backend
   */
  const fetchBankBalance = useCallback(async () => {
    try {
      const bankData = await api.fetchBank()
      setBank(bankData)
    } catch (error) {
      console.error('Failed to fetch bank balance:', error)
    }
  }, [])

  /**
   * Fetches the list of persons from the backend
   */
  const fetchPersons = useCallback(async () => {
    try {
      const personsData = await api.fetchPersons()
      setPersons(personsData)
    } catch (error) {
      console.error('Failed to fetch persons:', error)
      setError('Failed to load persons')
    }
  }, [])

  /**
   * Fetches recent transactions from the backend
   */
  const fetchTransactions = useCallback(async () => {
    try {
      const transactionsData = await api.fetchTransactions()
      setTransactions(transactionsData)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }, [])

  /**
   * Adds a person to the transaction builder
   */
  const addPersonToTransaction = (person: Person) => {
    const balance = safeToNumber(person.balance)
    if (balance <= 0) return

    const existingIndex = selectedTransactions.findIndex(tx => tx.personId === person.id)
    if (existingIndex >= 0) {
      const newAmount = Math.min(selectedTransactions[existingIndex].amount + 10, balance)
      updateTransactionAmount(existingIndex, newAmount)
      return
    }

    setSelectedTransactions(prev => [...prev, { 
      personId: person.id, 
      personName: person.name || 'Unknown',
      amount: Math.min(10, balance),
      maxBalance: balance
    }])
  }

  /**
   * Updates transaction amount for a specific person
   */
  const updateTransactionAmount = (index: number, amount: number) => {
    setSelectedTransactions(prev => prev.map((tx, i) => 
      i === index ? { ...tx, amount: Math.max(0, amount) } : tx
    ))
  }

  /**
   * Removes a transaction from the builder
   */
  const removeTransaction = (index: number) => {
    setSelectedTransactions(prev => prev.filter((_, i) => i !== index))
  }

  /**
   * Processes multiple transactions concurrently
   */
  const handleProcessTransactions = async () => {
    const validTransactions = selectedTransactions.filter(tx => tx.amount > 0 && tx.amount <= tx.maxBalance)
    
    if (validTransactions.length === 0) {
      setError('No valid transactions to process!')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const transactionDtos: TransactionDto[] = validTransactions.map(tx => ({
        personId: tx.personId,
        amount: tx.amount
      }))

      const result = await api.processTransactions(transactionDtos)
      setProcessingResult(result)
      
      await Promise.all([
        fetchBankBalance(),
        fetchTransactions(),
        fetchPersons()
      ])

      setSelectedTransactions([])
    } catch (error) {
      console.error('Transaction processing failed:', error)
      setError(error instanceof Error ? error.message : 'Network error occurred while processing transactions')
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Sets up real-time polling for balance updates
   */
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isPolling) {
      intervalId = setInterval(() => {
        fetchBankBalance()
      }, 2000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isPolling, fetchBankBalance])

  /**
   * Initial data loading
   */
  useEffect(() => {
    Promise.all([
      fetchPersons(),
      fetchBankBalance(),
      fetchTransactions()
    ])
  }, [fetchPersons, fetchBankBalance, fetchTransactions])

  /**
   * Gets status icon based on transaction status
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
    }
  }

  const bankBalance = bank ? safeToNumber(bank.balance) : 0
  const totalTransactionAmount = selectedTransactions.reduce((sum, tx) => sum + safeToNumber(tx.amount), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">Financial Transaction Dashboard</h1>
          <p className="text-slate-600">Process concurrent transactions and monitor bank balance in real-time</p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bank Balance Card */}
          <div className="bg-white shadow-lg rounded-lg border-0 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-slate-600">Bank Balance</h3>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">${formatCurrency(bankBalance)}</div>
            <p className="text-xs text-slate-500 mt-1">
              <span className={`inline-flex items-center ${isPolling ? 'text-green-500' : 'text-slate-500'}`}> 
                <span className={`w-2 h-2 rounded-full mr-1 ${isPolling ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                {isPolling ? 'Live updates' : 'Polling disabled'}
              </span>
            </p>
            {bank && (
              <p className="text-xs text-slate-400 mt-1">
                {bank.name} • Updated: {new Date(bank.updatedAt).toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Selected Transactions Card */}
          <div className="bg-white shadow-lg rounded-lg border-0 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-slate-600">Selected Transactions</h3>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{selectedTransactions.length}</div>
            <p className="text-xs text-slate-500 mt-1">Total: ${formatCurrency(totalTransactionAmount)}</p>
          </div>

          {/* Processing Time Card */}
          <div className="bg-white shadow-lg rounded-lg border-0 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-slate-600">Processing Time</h3>
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {processingResult?.summary.processingTime
                ? `${processingResult.summary.processingTime} ms`
                : '--'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Last batch processing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Person Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-lg border-0 p-6">
              <div className="mb-4">
                <h2 className="flex items-center space-x-2 text-lg font-semibold">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Available Persons</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Click to add persons to your transaction list
                </p>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {persons.map((person) => {
                  const balance = safeToNumber(person.balance)
                  const balanceColor = balance > 100 ? 'text-green-600' : 
                                      balance > 50 ? 'text-yellow-600' : 'text-red-600'
                  
                  return (
                    <div key={person.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{person.name}</span>
                        <span className={`font-bold ${balanceColor}`}>
                          ${formatCurrency(balance)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mb-2">
                        ID: {person.id} • Joined: {new Date(person.createdAt).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => addPersonToTransaction(person)}
                        disabled={balance <= 0}
                        className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors ${
                          balance <= 0 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {balance <= 0 ? 'No Balance' : 'Add Transaction'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Transaction Builder */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-lg border-0 p-6">
              <div className="mb-4">
                <h2 className="flex items-center space-x-2 text-lg font-semibold">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Transaction Builder</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Configure transaction amounts and process them
                </p>
              </div>
              <div className="space-y-4">
                {error && (
                  <div className="border border-red-200 bg-red-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-red-600 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {processingResult && (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-600 text-sm font-medium">Processing Complete!</span>
                    </div>
                    <div className="text-green-600 text-sm space-y-1">
                      <p>
                        {processingResult.summary.successful} successful, {processingResult.summary.failed} failed
                      </p>
                      <p>
                        Processing time: {processingResult.summary.processingTime} ms
                      </p>
                    </div>
                  </div>
                )}

                {selectedTransactions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p className="mb-2">No transactions selected</p>
                    <p className="text-sm">Select persons from the list to add transactions</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedTransactions.map((tx, index) => (
                      <div key={`${tx.personId}-${index}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium">{tx.personName}</span>
                          <span className="text-sm text-slate-500 block">
                            Max: ${formatCurrency(tx.maxBalance)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">$</span>
                          <input
                            type="number"
                            value={tx.amount}
                            onChange={(e) => updateTransactionAmount(index, parseFloat(e.target.value) || 0)}
                            min="0.01"
                            step="0.01"
                            max={tx.maxBalance}
                            className={`w-20 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 ${
                              tx.amount > tx.maxBalance 
                                ? 'border-red-300 focus:ring-red-500' 
                                : 'border-slate-300 focus:ring-blue-500'
                            }`}
                          />
                        </div>
                        <button
                          onClick={() => removeTransaction(index)}
                          className="text-red-500 hover:text-red-700 h-8 w-8 p-0 hover:bg-red-50 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTransactions.length > 0 && (
                  <>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          Total: ${formatCurrency(totalTransactionAmount)}
                        </span>
                        <button
                          onClick={handleProcessTransactions}
                          disabled={isProcessing || selectedTransactions.length === 0}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Process Transactions
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-lg border-0 p-6">
              <div className="mb-4">
                <h2 className="flex items-center space-x-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Recent Transactions</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">Live transaction status and history</p>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No transactions yet</p>
                ) : (
                  transactions.slice(0, 20).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className="text-sm font-medium">{transaction.person?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-slate-600">${formatCurrency(transaction.amount)}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'failed' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                        {transaction.errorMessage && (
                          <p className="text-xs text-red-500 mt-1">{transaction.errorMessage}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
