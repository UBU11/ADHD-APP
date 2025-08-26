const NotFound = () => {
  // const ghostImage = "../assets/image/asignment.png"
  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
        `}
      </style>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
        <div className="relative">

          {/* <div
            className="absolute -top-16 -left-16"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >

            <img
              src={ghostImage || "../assets/image/asignment.png"}
              alt="X"
              className="w-24 h-24"
            />
          </div> */}

          <h1
            className="text-9xl font-bold text-red-800"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            404
          </h1>
        </div>

        <h2 className="mt-8 text-3xl font-semibold text-gray-800">
          Oops! Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <a
          href="/"
          className="
            mt-8
            px-6
            py-3
            font-semibold
            text-white
            bg-red-500
            rounded-lg
            shadow-md
            transition-all
            duration-300
            ease-in-out
            hover:bg-red-700
            hover:-translate-y-1
            hover:shadow-lg
            active:scale-95
            active:shadow-sm
          "
        >
          Go Back Home
        </a>
      </div>
    </>
  );
};

export default NotFound;
