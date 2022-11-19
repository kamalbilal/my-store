import { CartContext } from "../userContext";
import { useContext } from "react";

function Cart() {
  const { cartNumber, setCartNumber } = useContext(CartContext);
  console.log(cartNumber);
  return <div>Cart</div>;
}

export default Cart;
