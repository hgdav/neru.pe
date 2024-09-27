import React from 'react';

function Calendario() {
    return (
        <div>
            <div className="bg-white shadow rounded-3xl p-4">
                <iframe
                    src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=America%2FLima&bgcolor=%23f8f8f7&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&src=bmVydWNsb3RoaW5nQGdtYWlsLmNvbQ&color=%23039BE5"
                    style={{ borderWidth: 0 }}
                    width="100%"
                    height="750"
                    title="Google Calendar"
                ></iframe>
            </div>
        </div>
    );
}

export default Calendario;
