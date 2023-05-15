import { CopyToClipboard } from "react-copy-to-clipboard";
import { AiOutlineCopy } from "react-icons/ai";


export const NFTCard = ({ nft }) => {

    return (

        <div className="w-1/4 flex flex-col">
            <div className="rounded-md">

                {nft.media[0].gateway ? (
                    <img className="object-cover h-128 w-full rounded-t-lg" src={nft.media[0].gateway}></img>
                ) : (
                    <img className="object-cover h-128 w-full rounded-t-lg" src="/nomedia.png"></img>
                )}

            </div>
            <div className="flex flex-col y-gap px-2 py-3 bg-slate-100 rounded-b-lg h-110">
                <h2 className="flex text-xl justify-center text-gray-800">{nft.title}</h2>

                <div className="flex justify-around space-x-1">
                    <p className="text-gray-600">Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>

                    <div className="flex space-x-1">
                        <p className="text-gray-600">{`${nft.contract.address.substr(0, 6)}...${nft.contract.address.substr(nft.contract.address.length - 4)}`}</p>

                        <CopyToClipboard text={nft.contract.address}>
                            <button title="Copy Address"> <AiOutlineCopy /></button>
                        </CopyToClipboard>
                    </div>

                </div>
            </div>
            <div className="flex-grow mt-2">
                <p className="text-gray-600 text-sm mb-2">{nft.description?.substr(0, 150)}</p>
            </div>
            <div className="flex justify-center mb-1">
                {/* use target={"_blank"} for opening the link on a new page/tab */}
                <a target={"_blank"} href={`https://https://sepolia.etherscan.io/token/${nft.contract.address}`} className="py-2 px-4 bg-green-700 w-3/5 text-center rounded-lg text-white cursor-pointer hover:bg-green-600">View on Etherscan</a>
            </div>
        </div >
    )
}
