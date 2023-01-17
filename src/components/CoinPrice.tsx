import React, { useState, useEffect } from "react";


function roundToSecondDecimal(num: number): string {
  let roundedNum = Math.round(num * 100) / 100;
  let formattedNum = roundedNum.toFixed(2);
  if (roundedNum >= 1000) {
    formattedNum = roundedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return formattedNum;
}

function CoinPrice() {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("wss://tickingprice-dev.hxro.trade/ws");

    ws.onopen = () => {
      console.log("Websocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.from_sym === "BTC" && data.to_sym === "USD") {
        setPrice(data.price);
      }
    };

    ws.onclose = () => {
      console.log("Websocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return roundToSecondDecimal(price);
}

export default CoinPrice;
