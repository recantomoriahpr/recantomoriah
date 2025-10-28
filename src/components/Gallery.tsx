import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePublicPage } from '@/hooks/usePublicPage';
import { normalizeGalleryRows } from '@/lib/galleryAdapter';
import type { GalleryItem } from '@/lib/galleryAdapter';

import heroMain from '@/assets/hero-main.jpg';
import ceremonySpace from '@/assets/ceremony-space.jpg';
import accommodations from '@/assets/accommodations.jpg';
import receptionHall from '@/assets/reception-hall.jpg';
import gardenArea from '@/assets/garden-area.jpg';
import outdoorKitchen from '@/assets/outdoor-kitchen.jpg';

interface GalleryAlbumData {
  id: string;
  title: string | null;
  slug: string | null;
  order: number;
}

interface GalleryImageData {
  id: string;
  album_id: string | null;
  url: string | null;
  alt: string | null;
  caption: string | null;
  order: number;
  video_url?: string | null;
  is_video?: boolean;
}

interface GalleryProps {
  albums?: GalleryAlbumData[];
  images?: GalleryImageData[];
}

const albumsMock = [
  {
    title: 'Área Externa',
    images: [
      { src: heroMain, alt: 'Vista geral da chácara', category: 'external' },
      { src: gardenArea, alt: 'Jardim e área de caminhada', category: 'external' },
      { src: outdoorKitchen, alt: 'Cozinha externa', category: 'external' }
    ]
  },
  {
    title: 'Cerimônias',
    images: [
      { src: ceremonySpace, alt: 'Espaço para cerimônias', category: 'ceremony' },
      { src: receptionHall, alt: 'Salão de festas', category: 'ceremony' }
    ]
  },
  {
    title: 'Acomodações',
    images: [
      { src: accommodations, alt: 'Quartos confortáveis', category: 'rooms' }
    ]
  }
];

const Gallery = ({ albums = [], images = [] }: GalleryProps) => {
  const [selectedAlbum, setSelectedAlbum] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // vídeos foram descontinuados: manter apenas comportamento de redirecionamento externo quando houver link

  // Usar dados da API ou fallback mockado
  const hasApiData = albums.length > 0;
  const displayAlbums = hasApiData 
    ? albums.map(album => {
        const albumImages = images.filter(img => img.album_id === album.id);
        const normalized = normalizeGalleryRows(albumImages);
        
        // Debug: Log dos itens normalizados
        normalized.forEach(item => {
          console.log('📸 [Gallery] Item normalizado:', {
            id: item.id,
            isVideo: item.isVideo,
            hasVideoUrl: item.hasVideoUrl,
            videoUrl: item.videoUrl,
            videoId: item.videoId,
          });
        });
        
        return {
          title: album.title || 'Álbum',
          images: normalized.map(item => ({
            src: item.url,
            alt: item.alt || item.caption || 'Imagem',
            category: album.slug || 'gallery',
            isVideo: item.isVideo,
            videoUrl: item.videoUrl,
            videoId: item.videoId,
            externalLink: item.externalLink,
          }))
        };
      })
    : albumsMock.map(album => ({
        ...album,
        images: album.images.map(img => ({ ...img, isVideo: false, videoUrl: null, videoId: null, externalLink: null }))
      }));

  const allImages = displayAlbums.flatMap(album => album.images);

  const openLightbox = (albumIndex: number, imageIndex: number) => {
    const globalIndex = displayAlbums.slice(0, albumIndex).reduce((acc, album) => acc + album.images.length, 0) + imageIndex;
    const selectedImg = allImages[globalIndex];
    
    // Se houver link externo, abrir em nova aba e não abrir lightbox
    if (selectedImg?.externalLink || selectedImg?.videoUrl) {
      const link = selectedImg.externalLink || selectedImg.videoUrl;
      window.open(link, '_blank', 'noopener,noreferrer');
      return;
    }

    setSelectedImage(globalIndex);
    setLightboxIndex(globalIndex);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Conheça Nossos Espaços
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore cada detalhe do Recanto Moriah através de nossa galeria completa
          </p>
        </div>

        {/* Album Tabs */}
        {displayAlbums.length > 0 && (
          <div className="flex justify-center mb-12">
            <div className="flex space-x-4 bg-card p-2 rounded-lg shadow-nature">
              {displayAlbums.map((album, index) => (
                <Button
                  key={index}
                  onClick={() => setSelectedAlbum(index)}
                  variant={selectedAlbum === index ? "default" : "ghost"}
                  className="px-6 py-3 transition-nature"
                >
                  {album.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAlbums[selectedAlbum]?.images.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-nature hover:shadow-nature-medium transition-nature"
              onClick={() => openLightbox(selectedAlbum, index)}
            >
              {image.isVideo && image.videoId ? (
                // Thumbnail do YouTube
                <div className="relative w-full h-64">
                  <img
                    src={`https://img.youtube.com/vi/${image.videoId}/maxresdefault.jpg`}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-nature duration-500"
                    onError={(e) => {
                      // Fallback para thumbnail de qualidade média
                      e.currentTarget.src = `https://img.youtube.com/vi/${image.videoId}/hqdefault.jpg`;
                    }}
                  />
                  {/* Ícone de Play */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
              ) : (
                // Imagem normal
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-nature duration-500"
                />
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-nature flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="font-semibold">{(image.externalLink || image.videoUrl) ? 'Clique para abrir' : 'Clique para expandir'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-6xl max-h-[90vh] w-full">
              {(() => {
                const currentItem = allImages[lightboxIndex];
                return (
                  <img
                    src={currentItem?.src}
                    alt={currentItem?.alt}
                    className="max-w-full max-h-full object-contain rounded-lg mx-auto"
                  />
                );
              })()}
              
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-nature"
              >
                <X size={24} />
              </button>

              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-nature"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-nature"
              >
                <ChevronRight size={24} />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                {lightboxIndex + 1} / {allImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;