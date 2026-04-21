import { notFound } from 'next/navigation';
import { listCategories } from '@/app/lib/admin-categories';
import CategoriaClient from './CategoriaClient';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  try {
    // Obtener todas las categorías y filtrar por slug
    const categories = await listCategories();
    const category = categories.find(cat => cat.slug === slug);

    if (!category) {
      notFound();
    }

    return <CategoriaClient category={category} />
  } catch (error) {
    // Si Firebase no está disponible (ej: durante el build en GitHub Actions),
    // redirigir a not found para evitar errores de build
    console.warn('Could not load category during build:', error);
    notFound();
  }
}

// Generar rutas estáticas para todas las categorías
export async function generateStaticParams() {
  try {
    const categories = await listCategories();
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    // Si Firebase no está disponible durante el build (ej: en GitHub Actions sin credenciales),
    // retornamos un array vacío. Las rutas se generarán bajo demanda (ISR/SSR)
    console.warn('Could not generate static params: Firebase credentials not available during build', error);
    return [];
  }
}