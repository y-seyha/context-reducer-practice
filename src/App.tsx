import { useState, type FormEvent } from "react";
import { AuthProvider, useAuth } from "./context/authContext";
import { CartProvider, useCart } from "./context/cartContext";
import { useFetch } from "./hooks/useFetch";

type User = {
  id: number;
  name: string;
  email: string;
  username: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: 1, name: "Monochrome Mug", price: 18 },
  { id: 2, name: "Minimal Notebook", price: 24 },
  { id: 3, name: "Black Hoodie", price: 64 },
  { id: 4, name: "Desk Lamp", price: 42 },
];

const fallbackUsers: User[] = [
  { id: 1, name: "Ada Stone", email: "ada@example.com", username: "ada" },
  { id: 2, name: "Lin Patel", email: "lin@example.com", username: "lin" },
  { id: 3, name: "Mara Flynn", email: "mara@example.com", username: "mara" },
];

function NavBar() {
  const { user, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn(email);
    setEmail("");
  };

  return (
    <header className="nav-bar">
      <div className="brand-block">
        <span className="brand-mark">M</span>
        <span>Monochrome</span>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="welcome-copy">Hi, {user.email}</span>
            <button
              type="button"
              className="button button-secondary"
              onClick={signOut}
            >
              Sign out
            </button>
          </>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              aria-label="Email address"
            />
            <button type="submit" className="button">
              Sign in
            </button>
          </form>
        )}
      </div>
    </header>
  );
}

function UserDirectory() {
  const {
    data: users,
    loading,
    error,
  } = useFetch<User[]>("https://jsonplaceholder.typicode.com/users?_limit=5");
  const { signIn } = useAuth();

  const visibleUsers = users ?? fallbackUsers;

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Fetched users</h2>
      </div>

      {loading && <p className="status">Loading users...</p>}
      {error && <p className="status error">{error}</p>}

      <ul className="stack-list">
        {visibleUsers.map((user) => (
          <li key={user.id} className="list-row">
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => signIn(user.email)}
            >
              Sign in
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Catalog() {
  const { addItem } = useCart();

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Shop plain essentials</h2>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-meta">
              <span>{product.name}</span>
              <strong>${product.price}</strong>
            </div>
            <button
              type="button"
              className="button"
              onClick={() => addItem(product)}
            >
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function CheckoutSummary() {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <aside className="panel summary-panel">
      <div className="section-heading">
        <h2>Checkout</h2>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">Your cart is empty.</p>
      ) : (
        <>
          <ul className="checkout-list">
            {items.map((item) => (
              <li key={item.id} className="checkout-item">
                <div>
                  <strong>{item.name}</strong>
                  <span>${item.price} each</span>
                </div>

                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="summary-total">
            <span>Total</span>
            <strong>${total}</strong>
          </div>
        </>
      )}
    </aside>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-shell">
          <NavBar />

          <main className="main-layout">
            <div className="content-column">
              <UserDirectory />
              <Catalog />
            </div>

            <CheckoutSummary />
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
