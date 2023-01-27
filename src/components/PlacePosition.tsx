//This code is an exported function that allows for placing a position 
//in a parimutuel market using the Parimutuel SDK, web3.js, and the window.xnft.solana 
//to connect the users wallets and sign transactions

import {
  ParimutuelWeb3,
  WalletSigner,
  PositionSideEnum,
  DEV_CONFIG,
} from "@hxronetwork/parimutuelsdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";



/**
 * PlacePosition is an async function that allows the user to place a position in a 
 * parimutuel market on the Hxro Network.
 * 
 * @param {string | undefined} selectedParimutuel - The public key of the parimutuel 
 * market that the user wants to place a position in.
 * 
 * @param {string} amount - The amount of money that the user wants to place in the 
 * market.
 * 
 * @param {PositionSideEnum} positionSide - The side of the market that the user wants
 * to place a position in. (PositionSideEnum.BULL or PositionSideEnum.BEAR)
 * 
 * @param {web3.Connection} Connection - Connection to the Solana blockchain via the users 
 * connection
 * 
 * @returns {Promise<void>}
 */

const PlacePosition = async (
  selectedParimutuel: string | undefined,
  amount: string,
  positionSide: PositionSideEnum,
  connection: Connection
) => {

  const config = DEV_CONFIG;
  const parimutuelWeb3 = new ParimutuelWeb3(config, connection);
  console.log(parimutuelWeb3)


  try {
    // Check if user have selected a parimutuel
    if (!selectedParimutuel) {
        return console.error('No Parimutuel Key');
    }

    const pariKey = new PublicKey(selectedParimutuel)

    const wallet = window.xnft.solana


    //DOES NOT WORK, HAVE TO FIX
    //
    // Place position on the parimutuel market
    const transactionId = await parimutuelWeb3.placePosition(
      wallet as Keypair,
      pariKey,
      parseFloat(amount) * (10 ** 9 / 1),
      positionSide,
      Date.now()
    );

    // Log if the position has been placed or not
    if (transactionId) {
      console.log("ENTERED MARKET");
    } else if (!transactionId){
    console.log('TXN DIDN\'T GO THROUGH')

}
    
  } catch (err) {
    console.error(err);
  }


}

export default PlacePosition;

