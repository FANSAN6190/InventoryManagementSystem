import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { SERVER_URL } from '../../config'
function InventoryStatus() {
  const [inventoryStatus, setInventoryStatus] = useState([])
  useEffect(() => {
    const socket = io(SERVER_URL);
    socket.on("inventory update", (data) => {
      setInventoryStatus(data);
    });
    return () => socket.disconnect();
  }, [])
  console.log(inventoryStatus);
  return (
    <div>
      <h1>
        {inventoryStatus}
      </h1>
    </div>
    
  )
}

export default InventoryStatus