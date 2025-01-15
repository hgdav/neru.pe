import React from 'react';

function Inventario() {

    return (
        <div className="container mx-auto">

            <div className="flex flex-col items-center justify-center mt-10">
                <h1 className="text-4xl font-bold text-center">Inventario</h1>
                <p className="text-center text-sm text-muted-foreground">
                    Aquí irá el formulario para registrar los ingresos de inventario.
                </p>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                </div>
            </div>
        </div>
    );
}

export { Inventario };