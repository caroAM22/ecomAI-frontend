const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            {/* Créditos de desarrollo */}
            <div className="w-full md:w-1/2 text-sm">
              <p className="font-bold">Desarrollado por:</p>
              <ul className="list-disc list-inside">
                <li>
                  Carolina Álvarez Murillo:{" "}
                  <a
                    href="https://github.com/caroAM22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:text-indigo-100"
                  >
                    caroAM22
                  </a>
                </li>
                <li>
                  Alejandro Orozco Ochoa:{" "}
                  <a
                    href="https://github.com/brokie636"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:text-indigo-100"
                  >
                    brokie636
                  </a>
                </li>
                <li>
                  Juan José Zapata Cadavid:{" "}
                  <a
                    href="https://github.com/jzapataca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:text-indigo-100"
                  >
                    jzapataca
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Enlaces adicionales */}
            <div className="w-full md:w-1/2 text-sm">
              <p className="font-bold">Enlaces:</p>
              <ul className="list-disc list-inside">
                <li>
                  <a
                    href="https://www.notion.so/Aplicaciones-de-Redes-Neuronales-Artificiales-196da9d4b08880cf9c2debad99ae75cf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:text-indigo-100"
                  >
                    Reporte técnico
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtu.be/jYDtmZJIYuE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:text-indigo-100"
                  >
                    Tutorial de uso de la aplicación
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;