// FIXME: Error on Search when Wallet and Collection address are filled but "Fetch for Collection" is unchecked
// FIXME: Look for a valid condition to catch fetchNFTs first run (to use in fromNFT value for Pagination bar)

// TODO: Search per account "From" value is not not...
// TODO: On Collection search: Check behavior when nextToken is not present -> then there are no more NFTs to fetch.
// TODO: Use "unknown" value for "Entries" on Collection pagination bar
// TODO: Implenment Prev button for fetchNFTs search-> Keep previous startToken for pagination PREV (should be an array storing all previous nextToken)
// TODO: Prev button: "Showing" & "To" increases instead of decreasing
// TODO: Detect and display mp4 NFTs


// import Head from 'next/head'
// import Image from 'next/image'
import { useState } from 'react'
import { NFTCard } from '/components/nftCard'


const Home = () => {

  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [NFTsInfo, setNFTsInfo] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [fromNFT, setFromNFT] = useState(1);
  const [toNFT, setToNFT] = useState(0);
  const [totNFT, setTotNFT] = useState(0);
  const [prevToken, setPrevToken] = useState("");

  // ========= To Show/Hide Pagination bar =======
  const [show, setShow] = useState(false);
  // =============================================

  const fetchNFTs = async (pagekey) => {
    let nfts;

    const api_key = process.env.NEXT_PUBLIC_API_KEY;
    // const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${api_key}/getNFTs/`;
    // const baseURL = `https://polygon-mainnet.g.alchemyapi.io/nft/v2/${api_key}/getNFTs/`;
    const baseURL = `https://eth-sepolia.g.alchemy.com/nft/v2/${api_key}/getNFTs/`;
    // const baseURL = `https://polygon-mumbai.g.alchemy.com/nft/v2/${api_key}/getNFTs/`;


    if (!collection.length) {
      var requestOptions = {
        method: 'GET',
      };

      if (pagekey) {
        const fetchURL = `${baseURL}?owner=${wallet}&pageKey=${pagekey}`;
        nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      } else {
        const fetchURL = `${baseURL}?owner=${wallet}`;
        nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      }

    } else {
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      setNFTs(nfts.ownedNfts)
      setNFTsInfo(nfts)

      // FIXME: Look for another condition to determine 1st search. This one is not working...
      if (pagekey != "") { setFromNFT(fromNFT += nfts.ownedNfts.length) }
      setToNFT(toNFT += nfts.ownedNfts.length)

    }
  }

  const fetchNFTsForCollection = async (startToken = "") => {

    // REVIEW: Should use an array of previous nextToken
    setPrevToken(startToken)

    if (collection.length) {

      var requestOptions = {
        method: 'GET',
      };

      const api_key = process.env.NEXT_PUBLIC_API_KEY;
      // const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${api_key}/getNFTsForCollection/`;
      // const baseURL = `https://polygon-mainnet.g.alchemyapi.io/nft/v2/${api_key}/getNFTsForCollection/`;
      const baseURL = `https://eth-sepolia.g.alchemy.com/nft/v2/${api_key}/getNFTsForCollection/`;
      // const baseURL = `https://polygon-mumbai.g.alchemy.com/nft/v2/${api_key}/getNFTsForCollection/`;

      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${startToken}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

      if (nfts) {
        setNFTs(nfts.nfts)
        setNFTsInfo(nfts)

        if (startToken != "") { setFromNFT(fromNFT += nfts.nfts.length) }
        setToNFT(toNFT += nfts.nfts.length)

      }
    }
  }


  // ===== fetchNFTsForCollection Pagination Control =====
  // const fetchNFTsForCollectionPages = async () => {
  //   let startToken = "";
  //   let hasNextPage = true;
  //   let totalNftsFound = 0;
  //   while (hasNextPage) {
  //     const { nfts, nextToken } = fetchNFTsForCollection(startToken);
  //     if (!nextToken) {
  //       // When nextToken is not present, then there are no more NFTs to fetch.
  //       hasNextPage = false;
  //     }
  //     startToken = nextToken;
  //     // totalNftsFound += nfts.length;
  //   }
  // }
  // ===== fetchNFTsForCollection Pagination Control =====


  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3 bg-gradient-to-r from-amber-400 via-yellow-200 to-teal-400">

      <div className="flex flex-col w-full justify-center items-center gap-y-2">

        <h1 className="antialiased hover:subpixel-antialiased font-medium leading-tight text-6xl mt-2 mb-5 text-green-700">Sepolia NFTs Browser (GdG)</h1>

        <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type={("text")} placeholder="Add your Wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setCollectionAddress(e.target.value) }} value={collection} type={("text")} placeholder="Add the Collection address"></input>
        <label className="text-gray-600 py-2" ><input onChange={(e) => { setFetchForCollection(e.target.checked) }} type={("checkbox")} className="mr-2"></input>Fetch for Collection</label>
        <button className="disabled:bg-slate-50 text-white bg-green-700 px-4 py-2 mt-3 rounded-lg w-1/6 hover:bg-green-800" onClick={
          () => {

            if (fetchForCollection) {
              // Show/Hide Pagination Bar
              setShow(prev => !prev);
              fetchNFTsForCollection();

            } else {
              fetchNFTs();
              // Show/Hide Pagination Bar
              setShow(prev => !prev)
            }
          }

        }>Let's Search!</button>
      </div>

      {/* ================= Pagination Bar Start ============== */}
      {show &&

        <div className="flex flex-col items-center">

          <span className="text-sm text-gray-700 dark:text-gray-500">
            Showing <span className="font-semibold text-gray-900">{fromNFT} </span>
            to <span className="font-semibold text-gray-900">{toNFT} </span>
            of <span className="font-semibold text-gray-900">{NFTsInfo.totalCount} </span>
            Entries</span>

          <div className="inline-flex mt-2 xs:mt-0">

            <button className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-green-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-green-900 dark:hover:text-white"

              onClick={
                () => {
                  if (fetchForCollection) {
                    fetchNFTsForCollection(prevToken);
                  } else {
                    fetchNFTs(NFTsInfo.pageKey);
                  }
                }
              }
            >
              <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
              Prev
            </button>
            <button className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-green-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-green-900 dark:hover:text-white"
              onClick={
                () => {
                  if (fetchForCollection) {
                    fetchNFTsForCollection(NFTsInfo.nextToken);

                  } else {
                    fetchNFTs(NFTsInfo.pageKey);
                  }
                }
              }>
              Next
              <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
          </div>
        </div>

      }
      {/* ================= Pagination Bar End ============== */}


      {/* ======================== Render NFT Cards =============== */}
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {NFTs.length > 0 && NFTs.map(nft => { return (<NFTCard nft={nft}></NFTCard>) })}
      </div>
    </div>
  )
}

export default Home
