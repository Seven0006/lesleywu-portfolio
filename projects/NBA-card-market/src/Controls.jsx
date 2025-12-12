export default function Controls({
  user,
  cartCount,
  onShowMarket,
  onShowCart,
  onShowOrders,
  onShowSignIn,
  onShowAdminInventory,
  onShowAdminOrders,
  onLogout,
}) {
  const isLoggedIn = !!user;
  const isAdmin = !!user && user.role === 'admin';

  function handleClickTitle() {
    onShowMarket();
  }

  function handleClickSign() {
    if (isLoggedIn) {
      onLogout();
    } else {
      onShowSignIn();
    }
  }

  return (
    <header className="app-header">
      <div
        className="app-header__left"
        onClick={handleClickTitle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClickTitle();
          }
        }}
      >
        <img
          className="app-header__logo-icon"
          src="/logo.png"
          alt="NBA cards logo"
        />
        <span className="app-header__logo-text">NBA Cards Market</span>
      </div>

      <div className="app-header__right">
        {isLoggedIn && !isAdmin && (
          <>
            <button
              type="button"
              className="header-link-button"
              onClick={onShowOrders}
            >
              My Orders
            </button>

            <button
              type="button"
              className="header-icon-button"
              aria-label="View cart"
              onClick={onShowCart}
            >
              <img
                src="/shopping_cart.png"
                alt="Shopping cart"
                className="header-cart-icon"
              />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </>
        )}

        {isAdmin && (
          <>
            <button
              type="button"
              className="header-link-button"
              onClick={onShowAdminInventory}
            >
              Admin Inventory
            </button>
            <button
              type="button"
              className="header-link-button"
              onClick={onShowAdminOrders}
            >
              Admin Orders
            </button>
          </>
        )}

        <button
          type="button"
          className="header-link-button"
          onClick={handleClickSign}
        >
          {isLoggedIn ? 'Log out' : 'Sign-in'}
        </button>
      </div>
    </header>
  );
}