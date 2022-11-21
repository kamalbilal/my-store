import { CartContext } from "../userContext";
import { useContext } from "react";

function Cart() {
  const { cartNumber, setCartNumber } = useContext(CartContext);
  console.log(cartNumber);
  return <div>
    <h1>My Shopping Cart ({cartNumber.count})</h1>
  </div>
}

export default Cart;
