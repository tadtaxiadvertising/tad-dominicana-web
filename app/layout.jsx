import './globals.css';

export const metadata = {
  title: 'TAD Dominicana - Tu Vehículo, Tu Valla Digital',
  description: 'Gana dinero extra mientras conduces. Instalamos tablets de 10 pulgadas para entretener a tus pasajeros y generar ingresos por publicidad.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body>{children}</body>
    </html>
  );
}
