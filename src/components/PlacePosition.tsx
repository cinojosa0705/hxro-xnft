//This code is an exported function that allows for placing a position 
//in a parimutuel market using the Parimutuel SDK, web3.js, and the window.xnft.solana 
//to connect the users wallets and sign transactions

import {
  ParimutuelWeb3,
  WalletSigner,
  PositionSideEnum,
} from "@hxronetwork/parimutuelsdk";
import * as web3 from "@solana/web3.js";

/**
 * PlacePosition is an async function that allows the user to place a position in a 
 * parimutuel market on the Hxro Network.
 * 
 * @param {ParimutuelWeb3} pari - The ParimutuelWeb3 instance that will be used to 
 * interact with the Parimutuel Network.
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
 * @returns {Promise<void>}
 */

async function PlacePosition(
  pari: ParimutuelWeb3,
  selectedParimutuel: string | undefined,
  amount: string,
  positionSide: PositionSideEnum
) {

  try {

    // Check if user have selected a parimutuel
    if (!selectedParimutuel) {
        return console.error('No Parimutuel Key');
    }

    // Place position on the parimutuel market
    const transactionId = await pari.placePosition(
      window.xnft.solana as WalletSigner,
      new web3.PublicKey(selectedParimutuel),
      parseFloat(amount) * (10 ** 5 / 1),
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
