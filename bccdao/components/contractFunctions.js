import * as React from 'react'
import styles from '/app/page.module.css'

import {  usePrepareContractWrite, 
          useContractWrite, 
          useWaitForTransaction
        } from 'wagmi'
import { useDebounce } from './useDebounce'
import { encodeFunctionData } from 'viem'

const BCCGovernorAddress = "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2" // BCCDAO contract address
const ERC20addressToRecordDecision = "0x420000" // ERC20 contract address

// todo: https://wagmi.sh/examples/contract-write-dynamic#step-6-add-the-usecontractwrite-hook

export function ProposeForm() {
    let [ proposalDescription, setProposalDescription] = React.useState('')
    let [ grantAmount, setGrantAmount] = React.useState('')
    let [ tokenAddress, setTokenAddress] = React.useState('')
    const values = 0
    const debouncedProposalDescription = useDebounce(proposalDescription, 500)

    function handleEncode() {
      const transferCalldata = encodeFunctionData('transfer', [tokenAddress, grantAmount]);
      console.log(transferCalldata);
    }

    const { config,
            error: prepareError,
            isError: isPrepareError,
          } = usePrepareContractWrite({
        address: BCCGovernorAddress,
        abi: [
          {
            name: 'propose',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [ {internalType: 'string', name: 'description', type: 'string' },
                      {internalType: 'address', name: 'tokenAddress', type: 'string' },
                      {internalType: 'uint256', name: 'values', type: 'integer' },
                      {internalType: 'bytes', name: 'transferCalldata', type: 'bytes'}],
            outputs: [],
          },
        ],
        functionName: 'propose',
        args: [debouncedProposalDescription],
        enabled: Boolean(debouncedProposalDescription),
      })
    const { data, error, isError, write} = useContractWrite(config)
 
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    })

    return (
      <div className={styles.container}>
        <form className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          write?.()
        }}
        >
          <label htmlFor="proposalDescription" className={styles.label}>
            Describe proposal
          </label>
          <input 
              id="proposalDescription"
              className={styles.card}
              onChange={(e) => setProposalDescription=(e.target.value)}
              placeholder="Proposal: Selections are held yearly"
              defaultValue={proposalDescription}
          />
          <label htmlFor="tokenAddress" className={styles.label}>
            target address
          </label>
          <input 
              id="tokenAddress"
              className={styles.card}
              onChange={(e) => setTokenAddress=(e.target.value)}
              placeholder="0x420000"
              defaultValue={tokenAddress}
          />
          <label htmlFor="grantAmount" className={styles.label}>
            Amount
          </label>
          <input 
              id="grantAmount"
              className={styles.card}
              onChange={(e) => setGrantAmount=(e.target.value)}
              placeholder="100000000000000000000"
              defaultValue={grantAmount}
          />
          <button className={styles.button} disabled={!write || isLoading} onClick={handleEncode}>
            {isLoading ? 'Proposing...' : 'Propose'}
          </button>
          {isSuccess && (
            <div>
              Successfully proposed!
              <div>
                <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
              </div>
            </div>
          )}
          {(isPrepareError || isError) && (
            <div>Error: {(prepareError || error)?.message}</div>
          )}
        </form>
      </div>
    ) 
  }
