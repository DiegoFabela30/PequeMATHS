import { notFound } from 'next/navigation';
import { listCategories } from '@/app/lib/admin-categories';
import HeaderClient from '@/app/componentes/HeaderClient';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // Obtener todas las categorías y filtrar por slug
  const categories = await listCategories();
  const category = categories.find(cat => cat.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comic+Neue:wght@400;700&display=swap');

        .bubblegum-font { font-family: 'Bubblegum Sans', cursive; }
        body { font-family: 'Comic Neue', Arial, sans-serif; }
      `}</style>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comic+Neue:wght@400;700&display=swap');

        .bubblegum-font { font-family: 'Bubblegum Sans', cursive; }
        body { font-family: 'Comic Neue', Arial, sans-serif; }
      `}</style>

      <HeaderClient />

      <main className="min-h-screen bg-linear-to-br from-sky-100 via-purple-50 to-pink-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header de la categoría */}
          <div className="text-center mb-12">
            <div
              className="inline-block px-6 py-3 rounded-full text-white font-bold text-xl mb-4 bubblegum-font"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>

          {/* Juegos de la categoría */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8 bubblegum-font text-gray-800">
              🎮 Juegos de {category.name}
            </h2>

            {/* Placeholder para juegos - esto se implementará cuando se conecten categorías con juegos */}
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Próximamente</h3>
              <p className="text-gray-500">
                Los juegos de esta categoría estarán disponibles pronto.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-linear-to-r from-sky-400 to-blue-500 py-8 text-center text-white font-medium">
        <p className="text-sm">© 2025 Proyecto para clase - Programación Web 🎓</p>
      </footer>
    </>
  );
}

// Generar rutas estáticas para todas las categorías
export async function generateStaticParams() {
  const categories = await listCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}