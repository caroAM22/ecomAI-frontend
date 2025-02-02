import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          E-commerce Dashboard
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Predicción de Demanda
            </Link>
          </li>
          <li>
            <Link to="/classification" className="hover:underline">
              Clasificación de Productos
            </Link>
          </li>
          <li>
            <Link to="/recommendation" className="hover:underline">
              Recomendaciones
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar