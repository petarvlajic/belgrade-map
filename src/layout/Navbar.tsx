const Navbar = () => {
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://www.almaquattro.rs/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://www.almaquattro.rs/wp-content/uploads/2020/01/AQ_logo_new20_01.png"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            ALMA QUATRO
          </span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
