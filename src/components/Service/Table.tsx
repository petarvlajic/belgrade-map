const Table = () => {
  const data = [
    {
      name: 'Apple iMac 27"',
      category: 'PC',
      brand: 'Apple',
      description: '300',
      price: '$2999',
      id: 'apple-imac-27',
    },
    {
      name: 'Apple iMac 20"',
      category: 'PC',
      brand: 'Apple',
      description: '200',
      price: '$1499',
      id: 'apple-imac-20',
    },
    {
      name: 'Apple iPhone 14',
      category: 'Phone',
      brand: 'Apple',
      description: '1237',
      price: '$999',
      id: 'apple-iphone-14',
    },
    {
      name: 'Apple iPad Air',
      category: 'Tablet',
      brand: 'Apple',
      description: '4578',
      price: '$1199',
      id: 'apple-ipad-air',
    },
    {
      name: 'Xbox Series S',
      category: 'Gaming/Console',
      brand: 'Microsoft',
      description: '56',
      price: '$299',
      id: 'xbox-series-s',
    },
    {
      name: 'PlayStation 5',
      category: 'Gaming/Console',
      brand: 'Sony',
      description: '78',
      price: '$799',
      id: 'playstation-5',
    },
    {
      name: 'Xbox Series X',
      category: 'Gaming/Console',
      brand: 'Microsoft',
      description: '200',
      price: '$699',
      id: 'xbox-series-x',
    },
    {
      name: 'Apple Watch SE',
      category: 'Watch',
      brand: 'Apple',
      description: '657',
      price: '$399',
      id: 'apple-watch-se',
    },
  ];

  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-4 py-3">
            Product name
          </th>
          <th scope="col" className="px-4 py-3">
            Category
          </th>
          <th scope="col" className="px-4 py-3">
            Brand
          </th>
          <th scope="col" className="px-4 py-3">
            Description
          </th>
          <th scope="col" className="px-4 py-3">
            Price
          </th>
          <th scope="col" className="px-4 py-3">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((product, index) => (
          <tr key={index} className="border-b dark:border-gray-700">
            <th
              scope="row"
              className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {product.name}
            </th>
            <td className="px-4 py-3">{product.category}</td>
            <td className="px-4 py-3">{product.brand}</td>
            <td className="px-4 py-3">{product.description}</td>
            <td className="px-4 py-3">{product.price}</td>
            <td className="px-4 py-3 flex items-center justify-end">
              <button
                aria-label="Name"
                id={`${product.id}-dropdown-button`}
                data-dropdown-toggle={`${product.id}-dropdown`}
                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                type="button"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
              <div
                id={`${product.id}-dropdown`}
                className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby={`${product.id}-dropdown-button`}
                >
                  <li>
                    <a
                      href="#"
                      className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Show
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Edit
                    </a>
                  </li>
                </ul>
                <div className="py-1">
                  <a
                    href="#"
                    className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Delete
                  </a>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
