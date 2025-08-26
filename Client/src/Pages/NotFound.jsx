const NotFound = () => {
  return (
    <>
      {/* We'll define the custom animation keyframes here for simplicity */}
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
          {/* Ghost SVG with floating animation */}
          <div
            className="absolute -top-16 -left-16 text-indigo-200"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm-1-12h2v4h-2zm0 6h2v2h-2z" />
              <path
                d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM11,8h2v6H11Zm0,8h2v2H11Z"
                opacity="0"
              ></path>{" "}
              {/* Simplified ghost shape */}
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z"></path>
              <circle cx="9.5" cy="12.5" r="1.5"></circle>
              <circle cx="14.5" cy="12.5" r="1.5"></circle>
              <path
                d="M12 16c-1.48 0-2.77.8-3.46 2.01A7.99 7.99 0 0 1 12 20a7.99 7.99 0 0 1 3.46-1.99C14.77 16.8 13.48 16 12 16z"
                opacity="0.2"
              ></path>
              <path d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"></path>
              <path
                d="M12,7a1,1,0,1,0,1,1A1,1,0,0,0,12,7Zm4,4a1,1,0,1,0,1,1A1,1,0,0,0,16,11Z"
                opacity="0"
              ></path>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM9 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>
            </svg>
          </div>

          {/* "404" text with floating animation */}
          <h1
            className="text-9xl font-bold text-indigo-600"
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
            bg-indigo-600
            rounded-lg
            shadow-md
            transition-all
            duration-300
            ease-in-out
            hover:bg-indigo-700
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
