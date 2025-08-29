const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Calendar</h1>


      <div className="bg-white p-6 rounded-lg shadow-md">

        <div className="flex justify-between items-center mb-4">
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            &lt;
          </button>
          <h2 className="text-2xl font-semibold">August 2025</h2>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            &gt;
          </button>
        </div>

        {/* Days of the Week */}
        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-600">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>


        <div className="grid grid-cols-7 gap-2 mt-2">

          {[...Array(31)].map((_, i) => (
            <div
              key={i}
              className="h-24 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
            >
              <span className="font-bold">{i + 1}</span>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
