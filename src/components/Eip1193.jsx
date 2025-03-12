

import { useState, useEffect } from "react"
import { Link, UserPlus, Send, LogOut, ChevronRight } from "lucide-react"

const Eip1193 = () => {
  const [provider, setProvider] = useState(null)
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState("")
  const [chainId, setChainId] = useState("")

  useEffect(() => {
    if (window.ethereum) {
      setProvider(window.ethereum)
    }
  }, [])

  useEffect(() => {
    if (provider) {
      provider.on("accountsChanged", changeAccount)
      provider.on("chainChanged", changeChainId)

      return () => {
        provider.removeListener("accountsChanged", changeAccount)
        provider.removeListener("chainChanged", changeChainId)
      }
    }
  }, [provider])

  const connect = async () => {
    if (!provider) return

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setConnected(true)

        const chainId = await provider.request({ method: "eth_chainId" })
        setChainId(chainId)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeAccount = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0])
      setConnected(true)
    } else {
      setConnected(false)
      setAccount("")
    }
  }

  const changeChainId = (chainId) => {
    setChainId(chainId)
  }

  const sendEtherToAnotherAccount = async () => {
    if (!provider || !connected) return

    try {
      await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: "0x2E15bB8aDF3438F66A6F786679B0bBBBF02A75d5",
            value: "0x38d7ea4c68000", 
          },
        ],
      })
    } catch (error) {
      console.error("Transaction error:", error)
    }
  }

  const disconnect = () => {
    if (!provider) return
    provider.removeListener("accountsChanged", changeAccount)
    provider.removeListener("chainChanged", changeChainId)
    setConnected(false)
    setAccount("")
    console.log("Disconnected. Please disconnect manually from MetaMask.")
  }

  const switchChain = async (targetChainId) => {
    if (!provider || !connected) return

    try {
      if (chainId === targetChainId) {
        console.log(`Already on the target chain: ${targetChainId}`)
        return
      }

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      })

      console.log(`Switched to ${targetChainId}`)
    } catch (error) {
      if (error.code === 4902) {
        console.log(`${targetChainId} not found, adding it now...`)
        await AddChainId(targetChainId)
      } else {
        console.error("Error switching network:", error)
      }
    }
  }

  const AddChainId = async (targetChainId) => {
    if (!provider || !connected) return

    try {
      const params = getChainParams(targetChainId)
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [params],
      })

      console.log(`${targetChainId} added successfully. Now switching...`)
      await switchChain(targetChainId)
    } catch (error) {
      console.error("Error adding chain:", error)
    }
  }

  const getChainParams = (chainId) => {
    if (chainId === "0x138de") {
      return {
        chainId: "0x138de",
        chainName: "Berachain",
        rpcUrls: ["https://rpc.berachain.com"],
        nativeCurrency: {
          name: "Berachain",
          symbol: "BERA",
          decimals: 18,
        },
        blockExplorerUrls: ["https://berascan.com"],
      }
    }
    if (chainId === "0x1") {
      return {
        chainId: "0x1",
        chainName: "Ethereum Mainnet",
        rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://etherscan.io"],
      }
    }
    if (chainId === "0x89") {
      return {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        rpcUrls: ["https://rpc-mainnet.maticvigil.com"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com"],
      }
    }
    throw new Error("Unknown chainId")
  }

  const getChainName = (chainId) => {
    if (chainId === "0x138de") return "Berachain"
    if (chainId === "0x1") return "Ethereum"
    if (chainId === "0x89") return "Polygon"
    return "Unknown Chain"
  }

  const truncateAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {!connected ? (
          <button
            onClick={connect}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-gray-50">
            <span className="text-sm font-medium">{truncateAddress(account)}</span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{getChainName(chainId)}</span>
          </div>
        )}

        <button
          onClick={() => AddChainId("0x138de")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition"
          disabled={!connected}
        >
          <Link className="h-4 w-4" />
          Add Berachain
        </button>
      </div>

      {connected && (
        <>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={sendEtherToAnotherAccount}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition"
            >
              <Send className="h-4 w-4" />
              Transfer
            </button>

            <button
              onClick={disconnect}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium mb-3 text-gray-700">Switch Network</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => switchChain("0x138de")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full ${chainId === "0x138de" ? "bg-blue-500 text-white" : "border border-gray-200 hover:bg-gray-50"} transition`}
              >
                <ChevronRight className="h-4 w-4" />
                Berachain
              </button>

              <button
                onClick={() => switchChain("0x1")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full ${chainId === "0x1" ? "bg-blue-500 text-white" : "border border-gray-200 hover:bg-gray-50"} transition`}
              >
                <ChevronRight className="h-4 w-4" />
                Ethereum
              </button>

              <button
                onClick={() => switchChain("0x89")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full ${chainId === "0x89" ? "bg-blue-500 text-white" : "border border-gray-200 hover:bg-gray-50"} transition`}
              >
                <ChevronRight className="h-4 w-4" />
                Polygon
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Eip1193
