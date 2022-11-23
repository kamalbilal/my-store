import { CartContext } from "../userContext";
import { useContext } from "react";
import CartItems from "../components/Cart/CartItems";
import styles from "../styles/cart.module.css"

function Cart() {
  const { cartNumber, setCartNumber } = useContext(CartContext);
  return <div className={styles.cart}>
       <div className={styles.leftContent}>
    <h1>My Shopping Cart ({cartNumber.count || 0})</h1>
    <CartItems cartData={{cartNumber, setCartNumber}} />
  </div>

  {/* checkout */}
  <div>checkout</div>
  </div>
}

export default Cart;
