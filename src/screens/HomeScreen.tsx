// This imports the necessary modules for this component to function. 
// React is imported for the front-end components and state management, 
// web3 and sdk are imported for connecting to the Solana blockchain and 
// interacting with parimutuel smart contracts, and the other imports are for 
// different UI components.
//
import React, { useEffect, useState } from "react";
import * as sdk from "@hxronetwork/parimutuelsdk";
import { View, Text, Button } from "react-native";
import CoinPrice from "../components/CoinPrice";
import PlacePosition from "../components/PlacePosition";
import NumberInput from "../components/AmountInput";
import { useSolanaConnection } from "../hooks/xnft-hooks";
import { useDidLaunch } from "../hooks/xnft-hooks";


//This defines an interface for an object that will contain information about a 
//parimutuel market.
//
interface PariObj {
  longPool: number;
  shortPool: number;
  longOdds: string;
  shortOdds: string;
  pubkey: string;
  locksTime: any
}

export function HomeScreen() {

  // ------------- 👀 Fetching Parimutuel Markets 👀 -------------
  //
  //
  //This sets up state for the pariObj object defined in the interface.
  //
  const [pariObj, setPariObj] = useState<PariObj>();

  //This creates a new connection to Solana, a new instance of 
  // the ParimutuelWeb3 class with the connection and config, and fetches the 
  // market pubkeys for a specific market (BTCUSD) and filters them by duration 
  // (60 seconds).
  //
  const connection = useSolanaConnection()
  // If you want to use Mainnet, you can use my RPC :)
  // (shoutout to Chainstack for their great RPC Infra)
  //"https://nd-766-247-352.p2pify.com/7f6912c309394d5b9295888ebb57b076"


  const config = sdk.DEV_CONFIG;
  // For mainnet you can use sdk.MAINNET_CONFIG

  const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection);
  const market = sdk.MarketPairEnum.BTCUSD;
  const markets = sdk.getMarketPubkeys(config, market);
  const marketsByTime = markets.filter((market) => market.duration === 60 * 5);

  // Returns true if the `window.xnft` object is ready to be used.
  const didLaunch = useDidLaunch()
 

  //This useEffect function fetches the parimutuel markets using the getParimutuels 
  //method from the parimutuelWeb3 instance, and filters them by the current time window.
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const parimutuels = await parimutuelWeb3.getParimutuels(marketsByTime);
        const duration = marketsByTime[0].duration;

        const pari_markets = parimutuels.filter(
          (account) =>
            account.info.parimutuel.timeWindowStart.toNumber() > Date.now() &&
            account.info.parimutuel.timeWindowStart.toNumber() <
              Date.now() + duration * 1000
        );
        //This sets the values for longPool, shortPool, longOdds, shortOdds, and pubkey 
        // using data from the first market in the pari_markets array. The pools are divided 
        // by 1000000 to convert them from lamports to SOL and the odds are calculated using 
        // the calculateOdd method from the SDK.
        //
        const longPool =
          (pari_markets[0].info.parimutuel.activeLongPositions.toNumber() /
          1000000000);
        const shortPool =
          pari_markets[0].info.parimutuel.activeShortPositions.toNumber() /
          1000000000;
        const longOdds = sdk.calculateNetOdd(longPool, longPool + shortPool, 0.03);
        const shortOdds = sdk.calculateNetOdd(shortPool, longPool + shortPool, 0.03);
        const pubkey = pari_markets[0].pubkey.toString();
        const locksTime = pari_markets[0].info.parimutuel.timeWindowStart.toNumber()

        // This formats the locks countdown timer
          var formattedTime = "00:00:00";
          if (locksTime) {
            const currentTime = new Date().getTime();
            const timeDiff = locksTime - currentTime;
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
          }
          setCountDownTime(formattedTime);

        //The setPariObj function is called with the calculated values, and the fetchData function 
        //is called every second using a setInterval.
        //
        setPariObj({ longPool, shortPool, longOdds, shortOdds, pubkey, locksTime });

      } catch (err) {
        console.error(err);
      }
    };
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);



  // This sets up state for a variable amount that will be used for place postition
  const [amount, setAmount] = useState(0);

 // This sets up state for a live countdown timer
  const [countDownTime, setCountDownTime] = useState<string>("");


  return (

    //This is the JSX that is returned and rendered on the screen. It is a view with 
    //various nested views and text elements that display the data from the pariObj 
    //object and allow for user input (e.g. the amount variable).
    //
    <View
      style={{
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#161616",
        alignItems: "center",
        flex: 1
      }}
    >
      <Text style={{
        color: 'white',
        marginBottom: '0px',
        fontSize: '35px',
        fontWeight: 'bold'
      }}>
        BTC - USD
        </Text>
      <Text style={{
        color: '#BBBBBB',
        marginBottom: '20px',
        fontSize: '15px',
        fontWeight: 'bold'
      }}>
        5-min parimutuel market
        </Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "white",
          backgroundColor: "transparent",
          width: "340px",
          borderRadius: "10px"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={{ color: "white" }}>Index:</Text>
            <Text style={{ color: "white" }}>Long Pool:</Text>
            <Text style={{ color: "white" }}>Short Pool:</Text>
            <Text style={{ color: "white" }}>Long Odds:</Text>
            <Text style={{ color: "white" }}>Short Odds:</Text>
            <Text style={{ color: "white" }}>Starts In:</Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              ${CoinPrice()}
            </Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {pariObj? pariObj.longPool : '0'}
            </Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {pariObj? pariObj.shortPool : '0'}
            </Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {pariObj? pariObj.longOdds : '0'}
            </Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {pariObj? pariObj.shortOdds : '0'}
            </Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {countDownTime}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
        <View>
    </View>
     
          {pariObj && didLaunch && [
            <NumberInput onChange={setAmount} />,
            <View style={{ flexDirection: "row", marginTop: '15px', marginBottom: '15px'}}>
              <View style={{ marginRight: 2 }}>
                <Button
                  color="green"
                  title="Long"
                  onPress={() => {
                    PlacePosition(
                      pariObj?.pubkey,
                      amount.toString(),
                      sdk.PositionSideEnum.LONG,
                      connection
                    );
                    console.log(`Entered ${amount} USDC LONG position!`)
                  }}
                />
              </View>
              <View style={{ marginLeft: 2 }}>
                <Button
                  title="Short"
                  color="red"
                  onPress={() => {
                    PlacePosition(
                      pariObj?.pubkey,
                      amount.toString(),
                      sdk.PositionSideEnum.SHORT,
                      connection
                    );
                    console.log(`Entered ${amount} USDC SHORT position!`)
                  }}
                />
              </View>
            </View>,
          ]}
        </View>
      </View>
    </View>
  );
}


//Overall, this project serves as an example of how to interact with parimutuel markets from the Hxro Network
//on the Solana blockchain and display the data in a user-friendly way on top of the xNFT protocol.