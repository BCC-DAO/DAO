'use client'

import Image from 'next/image'
import styles from './page.module.css'

import { WagmiConfig, createConfig, mainnet } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { ProposeForm } from '/components/contractFunctions'

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http()
  }),
})

function Profile() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  if (isConnected)
    return (
      <div>
        Connected to {address}
        <button className={styles.button}  onClick={() => disconnect()}>Disconnect</button>
        <ProposeForm />
      </div>
    )
  return <button className={styles.button}  onClick={() => connect()}>Connect Wallet</button>
}

// Pass config to React Context Provider
export default function Home() {
  return (
    <WagmiConfig config={config}>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
          <code className={styles.code}>Get started by making your first proposal&nbsp;</code>
          </p>
          <div>
            <a
              href="https://uzh.ch/"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/uzh_logo_schwarz.svg"
                alt="UZH Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/BCC-logo-sw.png"
            alt="BCC Logo"
            width={425}
            height={400}
            priority
          />        
        </div>

        <Profile />

        <div className={styles.grid2}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className={styles.cardleft}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Vote <span>-&gt;</span>
            </h2>
            <p>Vote on proposals</p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className={styles.cardright}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              List proposals<span>-&gt;</span>
            </h2>
            <p>Explore BCC DAO</p>
          </a>
        </div>
      </main>
    </WagmiConfig>
  )
}