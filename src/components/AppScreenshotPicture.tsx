type AppScreenshotPictureProps = {
  jpg: string;
  webp?: string;
  avif?: string;
  jpgSrcSet?: string;
  webpSrcSet?: string;
  avifSrcSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  fetchPriority?: "high" | "low" | "auto";
  ariaHidden?: boolean;
};

/** Responsive app screenshot with AVIF → WebP → JPG. Keep object-fit: contain to avoid cropping. */
export default function AppScreenshotPicture({
  jpg,
  webp,
  avif,
  jpgSrcSet,
  webpSrcSet,
  avifSrcSet,
  sizes = "(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px",
  alt,
  width,
  height,
  className = "",
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  ariaHidden,
}: AppScreenshotPictureProps) {
  return (
    <picture>
      {avif ? (
        <source
          type="image/avif"
          srcSet={avifSrcSet || avif}
          sizes={avifSrcSet ? sizes : undefined}
        />
      ) : null}
      {webp ? (
        <source
          type="image/webp"
          srcSet={webpSrcSet || webp}
          sizes={webpSrcSet ? sizes : undefined}
        />
      ) : null}
      <img
        src={jpg}
        srcSet={jpgSrcSet}
        sizes={jpgSrcSet ? sizes : undefined}
        alt={ariaHidden ? "" : alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        aria-hidden={ariaHidden ? true : undefined}
      />
    </picture>
  );
}
