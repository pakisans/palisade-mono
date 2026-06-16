import ScrollReveal from '@/components/ui/ScrollReveal';

function getEmbedUrl(url, platform) {
  if (!url) return null;
  if (platform === 'youtube' || /youtu/.test(url)) {
    const id = url.match(/(?:youtu\.be\/|v=)([\w-]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (platform === 'vimeo' || /vimeo/.test(url)) {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

export default function VideoBlock({ block }) {
  const embedUrl = getEmbedUrl(block?.url, block?.platform);

  return (
    <ScrollReveal>
      <section className="section-y-sm">
        <div className="container-site">
          <div className="mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-950 shadow-card">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={block?.caption || 'Video'}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : block?.url ? (
                <video
                  src={block.url}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}
            </div>
            {block?.caption && (
              <p className="text-center text-xs text-gray-400 mt-3">
                {block.caption}
              </p>
            )}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
