import { notFound } from 'next/navigation';
import { listCategories, Category } from '@/app/lib/admin-categories';
import CategoriaClient from './CategoriaClient';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  let category: Category | null = null;

  try {
    // Obtener todas las categorías y filtrar por slug
    const categories = await listCategories();
    category = categories.find(cat => cat.slug === slug) || null;

    if (!category) {
      notFound();
    }
  } catch (error) {
    // Si Firebase no está disponible (ej: durante el build en GitHub Actions),
    // redirigir a not found para evitar errores de build
    console.warn('Could not load category during build:', error);
    notFound();
  }

  // Retornar el JSX fuera del try/catch
  return <CategoriaClient category={category!} />;
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